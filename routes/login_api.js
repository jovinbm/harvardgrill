var basic = require('../functions/basic.js');
var forms = require('../functions/forms.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var cuid = require('cuid');
var Stats = require("../database/stats/stats_model.js");
var userDB = require('../db/user_db.js');
var passport = require('passport');
var OpenIDStrategy = require('passport-openid').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var emailModule = require('../functions/email.js');

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
                consoleLogger(errorLogger(module, 'Could not retrieve allGrillStatuses', err));
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: 'An error occurred. Please reload this page',
                    disable: true
                });
            }
        }
    },

    checkIfFullyRegistered: function (req, res) {
        var module = "checkIfFullyRegistered";
        var theUser = getTheUser(req);

        if (theUser.username && theUser.firstName && theUser.lastName && theUser.email) {
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
            consoleLogger(successLogger(module));
            res.status(401).send({
                code: 401,
                loginErrorType: 'user',
                updatePassword: updatePassword,
                availableDetails: {
                    displayName: theUser.firstName,
                    username: theUser.username,
                    email: theUser.email
                }
            });
        }
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


    localUserLogin: function (req, res, next) {
        var module = 'app.post /localUserLogin';
        receivedLogger(module);
        passport.authenticate('local', function (err, user, info) {

            if (err) {
                return res.status(500).send({
                    code: 500,
                    banner: true,
                    bannerClass: 'alert alert-dismissible alert-warning',
                    msg: info || err
                });
            }
            if (!user) {
                return res.status(401).send({
                    code: 401,
                    banner: true,
                    bannerClass: 'alert alert-dismissible alert-warning',
                    msg: info || err
                });
            }
            req.logIn(user, function (err) {
                if (err) {
                    errorLogger('req.login', err, err);

                    return res.status(500).send({
                        code: 500,
                        banner: true,
                        bannerClass: 'alert alert-dismissible alert-warning',
                        msg: "A problem occurred when trying to log you in. Please try again"
                    });
                } else {
                    successLogger(module);
                    var redirectPage = '/clientLogin.html';
                    if (user.isAdmin == 'yes') {
                        redirectPage = 'adminLogin.html'
                    }
                    return res.status(200).send({
                        code: 200,
                        msg: "You have successfully logged in",
                        redirect: true,
                        redirectPage: redirectPage
                    });
                }
            });
        })(req, res, next);
    },

    updateUserDetails: function (req, res) {
        var module = "updateUserDetails";
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var username = req.body.username;
        var email = req.body.email;
        var password = req.body.password1;
        var theUser = getTheUser(req);

        //this function validates the form and calls formValidated on success
        forms.validateRegistrationForm(req, res, firstName, lastName, username, email, password, req.body.password2, formValidated);

        function formValidated() {
            //check that nobody is using that username
            userDB.findUserWithUsername(username, errorFindingUsername, errorFindingUsername, resolveUsernameAvailability);

            //here, the application tries to find the username given. If it exists, then the function return (-1,theUser),
            // theUser being theUser with the wanted username. This means that the username is already taken this the user should be notified
            //NB.HERE I also check if the retrieved user's uniqueCuid is the same as the one of the user requesting a change of username
            //if it is, then this means it's the same user, he just did not change his/her username

            function errorFindingUsername(status, err) {
                consoleLogger(errorLogger(module, 'Could not retrieve user', err));
                res.status(401).send({
                    code: 401,
                    registrationBanner: true,
                    bannerClass: 'alert alert-dismissible alert-warning',
                    msg: 'Failed to log you in. Please try again'
                });
            }

            function resolveUsernameAvailability(status, retrievedUser) {
                //1 means username is already in use, -1 means the new user can use the username
                if (status == -1) {
                    if (retrievedUser.uniqueCuid == theUser.uniqueCuid) {
                        //means it's the same user, so just continue and update the username
                        continueUpdating();
                    } else {
                        consoleLogger(errorLogger(module, 'username entered is already in use'));
                        //means it's a different user wanting a username that's already in use. notify the user
                        res.status(401).send({
                            code: 401,
                            registrationBanner: true,
                            bannerClass: 'alert alert-dismissible alert-warning',
                            msg: 'The username you entered is already in use. Please choose a different one'
                        });
                    }
                } else {
                    //means username is available
                    continueUpdating();
                }

                function continueUpdating() {
                    //update update the user

                    //check if there is no displayName
                    if (!theUser.displayName) {
                        theUser.displayName = firstName + " " + lastName;
                    }
                    //check if there is no email
                    if (!theUser.realEmail) {
                        theUser.realEmail = email
                    }
                    theUser.firstName = firstName;
                    theUser.lastName = lastName;
                    theUser.username = username;
                    theUser.email = email;

                    userDB.saveUser(theUser, error, error, successSave);

                    function successSave() {
                        //check if the user requires a password update

                        if (req.body.updatePassword) {

                            bcrypt.hash(password, 10, function (err, hash) {
                                if (err) {
                                    consoleLogger(errorLogger(module, 'error hashing password', err));
                                    res.status(401).send({
                                        code: 401,
                                        registrationBanner: true,
                                        bannerClass: 'alert alert-dismissible alert-warning',
                                        msg: 'We could not log you in. Please check your details and try again'
                                    });
                                } else {
                                    continueWithPasswordHash(hash);
                                }
                            });

                            function continueWithPasswordHash(passwordHash) {
                                userDB.updatePassword(req.user.openId, passwordHash, errorUpdatingPassword, errorUpdatingPassword, success4);
                                function errorUpdatingPassword() {
                                    consoleLogger(errorLogger(module, 'error updating password', err));
                                    res.status(401).send({
                                        code: 401,
                                        registrationBanner: true,
                                        bannerClass: 'alert alert-dismissible alert-warning',
                                        msg: 'We could not log you in. Please check your details and try again'
                                    });
                                }
                            }
                        } else {
                            success4();
                        }

                        function success4() {
                            res.status(200).send({
                                code: 200,
                                redirect: true,
                                redirectPage: '/clientLogin.html'
                            });

                            //send a welcome email
                            emailModule.sendWelcomeEmail(theUser);
                        }
                    }

                    function error() {
                        res.status(401).send({
                            code: 401,
                            registrationBanner: true,
                            bannerClass: 'alert alert-dismissible alert-warning',
                            msg: 'We could not log you in. Please check your details and try again'
                        });
                    }
                }
            }
        }
    },

    clientInfoLogin: function (req, res) {
        var module = 'clientInfoLogin';
        receivedLogger(module);

        var password = req.body.password;
        var grillName = req.body.grillName;
        var theUser = getTheUser(req);

        userDB.checkUserPassword(theUser.openId, password, errorPassword, errorPasswordBcrypt, successPassword);

        function errorPassword(status, err) {
            consoleLogger(errorLogger(module, 'error finding password', err));
            res.status(401).send({
                code: 401,
                banner: true,
                bannerClass: 'alert alert-dismissible alert-warning',
                msg: 'Failed to log you in. Please try again'
            });
        }

        function errorPasswordBcrypt(err) {
            //means bcrypt ran into an error when comparing passwords
            consoleLogger(errorLogger(module, 'error comparing passwords', err));
            res.status(401).send({
                code: 401,
                banner: true,
                bannerClass: 'alert alert-dismissible alert-warning',
                msg: 'Failed to log you in. Please try again'
            });
        }

        function successPassword(status) {
            if (status == -1) {
                consoleLogger(errorLogger(module, 'Password does not check'));
                //means passwords don't match
                res.status(401).send({
                    code: 401,
                    banner: true,
                    bannerClass: 'alert alert-dismissible alert-warning',
                    msg: 'The password you entered is incorrect. Please try again'
                });
            } else {
                //means passwords check
                //update the user with the current info
                theUser.customLoggedInStatus = 1;
                theUser.grillName = grillName;
                userDB.saveUser(theUser, errorSaveUser, errorSaveUser, successSaveUser);

                function successSaveUser() {
                    var redirectPage = '';
                    if (theUser.isAdmin == 'yes') {
                        //setting redirect page if the user chose 'profile' as grill or not
                        redirectPage = '/admin.html';
                        if (grillName == 'profile') {
                            redirectPage = '/adminProfile.html'
                        }
                        res.status(200).send({
                            code: 200,
                            redirect: true,
                            redirectPage: redirectPage
                        });
                    } else if (theUser.isAdmin == 'no') {
                        //setting redirect page if the user chose 'profile' as grill or not
                        redirectPage = '/client.html';
                        if (grillName == 'profile') {
                            redirectPage = '/clientProfile.html'
                        }
                        res.status(200).send({
                            code: 200,
                            redirect: true,
                            redirectPage: redirectPage
                        });
                    }
                }

                function errorSaveUser(status, err) {
                    consoleLogger(errorLogger(module, 'error saving updated user', err));
                    res.status(401).send({
                        code: 401,
                        banner: true,
                        bannerClass: 'alert alert-dismissible alert-warning',
                        msg: 'Failed to log you in. Please try again'
                    });
                }
            }
        }
    },


    adminInfoLogin: function (req, res, next) {
        var module = 'adminInfoLogin';
        var password = req.body.password;
        var grillName = req.body.grillName;
        var theUser = getTheUser(req);

        userDB.checkUserPassword(theUser.openId, password, errorPassword, errorPasswordBcrypt, successPassword);

        function errorPassword(status, err) {
            consoleLogger(errorLogger(module, 'error finding password', err));
            res.status(401).send({
                code: 401,
                banner: true,
                bannerClass: 'alert alert-dismissible alert-warning',
                msg: 'Failed to log you in. Please try again'
            });
        }

        function errorPasswordBcrypt(err) {
            //means bcrypt ran into an error when comparing passwords
            consoleLogger(errorLogger(module, 'error comparing passwords', err));
            res.status(401).send({
                code: 401,
                banner: true,
                bannerClass: 'alert alert-dismissible alert-warning',
                msg: 'Failed to log you in. Please try again'
            });
        }

        function successPassword(status) {
            if (status == -1) {
                consoleLogger("YESS");
                //means passwords don't match
                res.status(401).send({
                    code: 401,
                    banner: true,
                    bannerClass: 'alert alert-dismissible alert-warning',
                    msg: 'The password you entered is incorrect. Please try again'
                });
                consoleLogger(errorLogger(module, 'Password does not check'));
            } else {
                //means passwords check
                //update the user with the current info
                theUser.customLoggedInStatus = 1;
                theUser.grillName = grillName;
                userDB.saveUser(theUser, errorSaveUser, errorSaveUser, successSaveUser);

                function successSaveUser() {
                    var redirectPage = '';
                    if (theUser.isAdmin == 'yes') {
                        //setting redirect page if the user chose 'profile' as grill or not
                        redirectPage = '/admin.html';
                        if (grillName == 'profile') {
                            redirectPage = '/adminProfile.html'
                        }
                        res.status(200).send({
                            code: 200,
                            redirect: true,
                            redirectPage: redirectPage
                        });
                    } else if (theUser.isAdmin == 'no') {
                        //setting redirect page if the user chose 'profile' as grill or not
                        redirectPage = '/client.html';
                        if (grillName == 'profile') {
                            redirectPage = '/clientProfile.html'
                        }
                        res.status(200).send({
                            code: 200,
                            redirect: true,
                            redirectPage: redirectPage
                        });
                    }
                }

                function errorSaveUser(status, err) {
                    res.status(401).send({
                        code: 401,
                        banner: true,
                        bannerClass: 'alert alert-dismissible alert-warning',
                        msg: 'Failed to log you in. Please try again'
                    });
                    consoleLogger(errorLogger(module, 'error saving updated user', err));
                }
            }
        }

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
                consoleLogger(errorLogger(module, 'Could not retrieve allGrillStatuses', err));
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: 'An error occurred. Please reload this page',
                    disable: true
                });
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
                consoleLogger(errorLogger(module, 'Could not retrieve allGrillStatuses', err));
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: 'An error occurred. Please reload this page',
                    disable: true
                });
            }
        }
    }
};