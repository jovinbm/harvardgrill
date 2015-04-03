var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var cuid = require('cuid');
var Stats = require("../database/stats/stats_model.js");
var userDB = require('../db/user_db.js');
var passport = require('passport');
var OpenIDStrategy = require('passport-openid').Strategy;
var LocalStrategy = require('passport-local').Strategy;

var receivedLogger = function (module) {
    var rL = require('../functions/basic.js').receivedLogger;
    rL('login_api', module);
};
var successLogger = function (module, text) {
    var sL = require('../functions/basic.js').successLogger;
    return sL('login_api', module, text);
};
var errorLogger = function (module, text, err) {
    var eL = require('../functions/basic.js').errorLogger;
    return eL('login_api', module, text, err);
};
function getTheUser(req) {
    return req.customData.theUser;
}
function getTheCurrentGrillStatus(req) {
    return req.customData.currentGrillStatus;
}

function getAllGrillStatuses(error_neg_1, error_0, success) {

    //count the number available
    Stats
        .count()
        .exec(function (err, total) {
            if (err) {
                error_neg_1(-1, err);
            } else {
                if (total == 0) {

                    //there is no grill added, send empty result
                    var allGrillStatuses = [];
                    success(allGrillStatuses);
                } else {
                    //find and return the required
                    Stats.find({}).exec(
                        function (err, allGrillStatuses) {
                            if (err) {
                                error_neg_1(-1, err);
                            } else if (allGrillStatuses == null || allGrillStatuses == undefined) {

                                //this must still be an error since we made sure that there is a document with the given grillName
                                error_neg_1(-1, err);
                            } else {
                                success(allGrillStatuses);
                            }
                        })
                }
            }
        })
}

module.exports = {

    getTemporarySocketRoom: function (req, res) {
        var module = 'getTemporarySocketRoom';
        receivedLogger(module);
        var temporarySocketRoom = cuid();

        res.status(200).send({
            temporarySocketRoom: temporarySocketRoom
        });
        consoleLogger(successLogger(module));

    },

    getAllGrillStatuses: function (req, res) {
        var module = "getAllGrillStatuses";
        getAllGrillStatuses(errorAllGrillStatus, errorAllGrillStatus, success);

        function success(allGrillStatuses) {
            res.status(200).send({
                allGrillStatuses: allGrillStatuses
            });
            consoleLogger(successLogger(module));
        }

        function errorAllGrillStatus(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: 'An error occurred. Please reload this page',
                    reason: errorLogger(module, 'Could not retrieve allGrillStatuses', err),
                    disable: true
                });
                consoleLogger(errorLogger(module, 'Could not retrieve allGrillStatuses', err));
            }
        }
    },

    checkIfFullyRegistered: function (req, res) {
        var module = "checkIfFullyRegistered";
        var theUser = getTheUser(req);

        if (theUser.username && theUser.displayName && theUser.email) {
            res.status(200).send({
                msg: "Fully registered"
            });
            consoleLogger(successLogger(module));
        } else {
            var updatePassword = false;
            if (theUser.password == "" || theUser.password == undefined || theUser.password == null) {
                //this will instruct the clientLogin angular to initiate a registration
                updatePassword = true;
            }
            res.status(401).send({
                code: 401,
                reason: errorLogger(module, 'req.isAuthenticated: user not logged in'),
                loginErrorType: 'user',
                updatePassword: updatePassword,
                availableDetails: {
                    displayName: theUser.displayName,
                    username: theUser.username,
                    email: theUser.email
                }
            });
            consoleLogger(successLogger(module));
        }
    },

    clientInfoLogin: function (req, res) {
        var module = 'clientInfoLogin';
        receivedLogger(module);

        var password = req.body.password;
        var grillName = req.body.grillName;
        var theUser = getTheUser(req);

        userDB.checkUserPassword(theUser.openId, password, errorPassword, errorPassword, successPassword);

        function errorPassword(status, err) {
            res.status(401).send({
                code: 401,
                banner: true,
                bannerClass: 'alert alert-dismissible alert-warning',
                msg: 'Failed to log you in. Please try again',
                reason: errorLogger(module, 'error finding password', err)
            });
            consoleLogger(errorLogger(module, 'error finding password', err));
        }

        function successPassword(status) {
            if (status == -1) {
                //means passwords don't match
                res.status(401).send({
                    code: 401,
                    banner: true,
                    bannerClass: 'alert alert-dismissible alert-warning',
                    msg: 'The password you entered is incorrect. Please try again',
                    reason: errorLogger(module, 'Password does not check')
                });
                consoleLogger(errorLogger(module, 'Password does not check'));
            } else {
                //means passwords check
                //update the user with the current info
                theUser.customLoggedInStatus = 1;
                theUser.grillName = grillName;
                userDB.saveUser(theUser, errorSaveUser, errorSaveUser, successSaveUser);

                function successSaveUser() {
                    if (theUser.isAdmin == 'yes') {
                        res.redirect('admin.html');
                        res.status(200).send({
                            code: 200,
                            redirect: true,
                            redirectPage: '/admin.html'
                        });
                        consoleLogger(errorLogger(module, 'Could not update username'));
                    } else if (theUser.isAdmin == 'no') {
                        res.status(200).send({
                            code: 200,
                            redirect: true,
                            redirectPage: '/client.html'
                        });
                    }
                }

                function errorSaveUser(status, err) {
                    res.status(401).send({
                        code: 401,
                        banner: true,
                        bannerClass: 'alert alert-dismissible alert-warning',
                        msg: 'Failed to log you in. Please try again',
                        reason: errorLogger(module, 'error saving updated user', err)
                    });
                    consoleLogger(errorLogger(module, 'error saving updated user', err));
                }
            }
        }
    },

    updateUserDetails: function (req, res) {
        var module = "updateUserDetails";
        var displayName = req.body.displayName;
        var username = req.body.username;
        var email = req.body.email;
        var password = req.body.password1;

        //check that nobody is using that username
        userDB.findUserWithUsername(username, errorFindingUsername, resolveUsernameAvailability, resolveUsernameAvailability);

        function errorFindingUsername(status, err) {
            res.status(401).send({
                code: 401,
                registrationBanner: true,
                bannerClass: 'alert alert-dismissible alert-warning',
                msg: 'Failed to log you in. Please try again',
                reason: errorLogger(module, 'Could not retrieve user', err)
            });
            consoleLogger(errorLogger(module, 'Could not retrieve user', err));
        }

        function resolveUsernameAvailability(status) {
            //1 means username is already in use, -1 means the new user can use the username
            if (status == -1) {
                //means username is not available
                res.status(401).send({
                    code: 401,
                    registrationBanner: true,
                    bannerClass: 'alert alert-dismissible alert-warning',
                    msg: 'The username you entered is already in use. Please choose a different one',
                    reason: errorLogger(module, 'username entered is already in use')
                });
                consoleLogger(errorLogger(module, 'username entered is already in use'));
            } else {
                //means username is available
                //update update the user
                var theUser = getTheUser(req);
                theUser.displayName = displayName;
                theUser.username = username;
                theUser.email = email;

                userDB.saveUser(theUser, error, error, successSave);

                function successSave() {
                    //check if the user requires a password update

                    if (req.body.updatePassword) {
                        userDB.updatePassword(req.user.openId, password, error, error, success4);
                    } else {
                        success4();
                    }

                    function success4() {
                        res.status(200).send({
                            code: 200,
                            redirect: true,
                            redirectPage: '/clientLogin.html'
                        });
                    }
                }

                function error() {
                    res.status(401).send({
                        code: 401,
                        registrationBanner: true,
                        bannerClass: 'alert alert-dismissible alert-warning',
                        msg: 'We could not log you in. Please check your details and try again',
                        reason: errorLogger(module, 'username entered is already in use')
                    });
                }
            }
        }
    },

    adminUserLogin: function (req, res, next) {
        var grillName = req.body.grillName;

        passport.authenticate('local', function (err, user, info) {
            var module = 'app.post /adminUserLogin';

            if (err) {
                return res.status(500).send({
                    code: 500,
                    banner: true,
                    bannerClass: 'alert alert-dismissible alert-warning',
                    msg: info || err,
                    reason: errorLogger(module, info || err, err)
                });
            }
            if (!user) {
                return res.status(401).send({
                    code: 401,
                    banner: true,
                    bannerClass: 'alert alert-dismissible alert-warning',
                    msg: info || err,
                    reason: errorLogger(module, info || err, err)
                });
            }
            req.logIn(user, function (err) {
                if (err) {
                    errorLogger('req.login', err, err);

                    return res.status(500).send({
                        code: 500,
                        banner: true,
                        bannerClass: 'alert alert-dismissible alert-warning',
                        msg: "A problem occurred when trying to log you in. Please try again",
                        reason: errorLogger(module, 'Failed! req.login()', err)
                    });
                } else {
                    //add the grillName to the user
                    userDB.updateGrillName(user.openId, grillName, errorUpdateGrillName, errorUpdateGrillName, success);

                    function errorUpdateGrillName(status, err) {
                        errorLogger('updateGrillName', err, err);
                        //log the user out
                        req.logout();

                        return res.status(500).send({
                            code: 500,
                            banner: true,
                            bannerClass: 'alert alert-dismissible alert-warning',
                            msg: "A problem occurred when trying to log you in. Please try again",
                            reason: errorLogger(module, 'Failed! userDB.updateGrillName')
                        });
                    }

                    function success() {
                        return res.status(200).send({
                            code: 200,
                            notify: false,
                            type: 'success',
                            msg: "You have successfully logged in",
                            reason: successLogger(module, 'adminLoginSuccess'),
                            disable: false,
                            redirect: true,
                            redirectPage: '/clientLogin.html'
                        });
                    }
                }
            });
        })(req, res, next);
    },

    clientHarvardLogin: function (req, res, next) {
        passport.authenticate('openid', function (err, user, info) {
            var module = 'app.post /harvardId';

            if (err) {
                errorLogger(module, err, err);
                return res.render('login', {
                    errorCode: 1,
                    errorMessage: "Authentication failed. Please try again"
                })
            }
            if (!user) {
                errorLogger(module, "Authentication failed. Please try again", err);
                return res.render('login', {
                    errorCode: 1,
                    errorMessage: "Authentication failed. Please try again"
                })
            }
            req.logIn(user, function (err) {
                if (err) {
                    errorLogger(module, err, err);
                    return res.render('login', {
                        errorCode: 1,
                        errorMessage: "Authentication failed. Please try again"
                    })
                }
                return res.redirect('clientLogin.html');
            });
        })(req, res, next);
    },

    clientLoginStartUp: function (req, res) {
        var module = 'clientLoginStartUp';
        receivedLogger(module);
        getAllGrillStatuses(errorAllGrillStatus, errorAllGrillStatus, success);

        function success(allGrillStatuses) {
            res.status(200).send({
                allGrillStatuses: allGrillStatuses
            });
            consoleLogger(successLogger(module));
        }

        function errorAllGrillStatus(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: 'An error occurred. Please reload this page',
                    reason: errorLogger(module, 'Could not retrieve allGrillStatuses', err),
                    disable: true
                });
                consoleLogger(errorLogger(module, 'Could not retrieve allGrillStatuses', err));
            }
        }
    },

    adminLoginStartUp: function (req, res) {
        var module = 'adminLoginStartUp';
        receivedLogger(module);
        getAllGrillStatuses(errorAllGrillStatus, errorAllGrillStatus, success);

        function success(allGrillStatuses) {
            res.status(200).send({
                allGrillStatuses: allGrillStatuses
            });
            consoleLogger(successLogger(module));
        }

        function errorAllGrillStatus(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: 'An error occurred. Please reload this page',
                    reason: errorLogger(module, 'Could not retrieve allGrillStatuses', err),
                    disable: true
                });
                consoleLogger(errorLogger(module, 'Could not retrieve allGrillStatuses', err));
            }
        }
    }
};