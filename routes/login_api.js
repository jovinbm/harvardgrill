var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var cuid = require('cuid');
var Stats = require("../database/stats/stats_model.js");
var userDB = require('../db/user_db.js');

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

function getTemporarySocketRoom(req, res) {
    var module = 'getTemporarySocketRoom';
    receivedLogger(module);
    var temporarySocketRoom = cuid();

    res.status(200).send({
        temporarySocketRoom: temporarySocketRoom
    });
    consoleLogger(successLogger(module));

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

function updateUserDetails(req, res, data) {
    var module = "updateUserDetails";
    //check that nobody is using that username
    userDB.findUserWithUsername(data.username, errorFindingUsername, resolveUsernameAvailability, resolveUsernameAvailability);

    function errorFindingUsername(status, err) {
        res.status(401).send({
            code: 401,
            notify: false,
            type: 'warning',
            registrationBanner: true,
            bannerClass: 'alert alert-dismissible alert-warning',
            msg: 'Failed to log you in. Please try again',
            reason: errorLogger(module, 'Could not retrieve user', err),
            disable: false,
            redirect: false,
            redirectPage: '/error/500.html'
        });
        consoleLogger(errorLogger(module, 'Could not retrieve user', err));
    }

    function resolveUsernameAvailability(status) {
        //1 means username is already in use, -1 means the new user can use the username
        if (status == -1) {
            //means username is not available
            res.status(401).send({
                code: 401,
                notify: false,
                type: 'warning',
                registrationBanner: true,
                bannerClass: 'alert alert-dismissible alert-warning',
                msg: 'The username you entered is already in use. Please choose a different one',
                reason: errorLogger(module, 'username entered is already in use'),
                disable: false,
                redirect: false,
                redirectPage: '/error/500.html'
            });
            consoleLogger(errorLogger(module, 'username entered is already in use'));
        } else {
            //means username is available
            //update displayName
            userDB.updateDisplayName(req.user.openId, data.displayName, error, error, success1);

            function success1() {
                userDB.updateUsername(req.user.openId, data.username, error, error, success2);

                function success2() {
                    userDB.updateEmail(req.user.openId, data.email, error, error, success3);

                    function success3() {
                        function success4() {
                            res.status(200).send({
                                code: 200,
                                redirect: true,
                                redirectPage: '/clientLogin.html'
                            });
                        }

                        if (data.updatePassword) {
                            userDB.updatePassword(req.user.openId, data.password1, error, error, success4);
                        } else {
                            success4();
                        }
                    }
                }

            }
        }
    }

    function error(status, err) {
        if (status == -1 || status == 0) {
            res.status(500).send({
                code: 500,
                notify: true,
                type: 'error',
                registrationBanner: true,
                bannerClass: 'alert alert-dismissible alert-warning',
                msg: 'An error occurred. Please try again or reload this page',
                reason: errorLogger(module, 'Could not retrieve allGrillStatuses', err),
                disable: true,
                redirect: false,
                redirectPage: '/error/500.html'
            });
            consoleLogger(errorLogger(module, 'Could not retrieve allGrillStatuses', err));
        }
    }
}


module.exports = {

    getTemporarySocketRoom: function (req, res) {
        getTemporarySocketRoom(req, res);

    },


    getAllGrillStatuses: function (req, res) {
        var module = "getAllGrillStatuses";

        function errorAllGrillStatus(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: 'An error occurred. Please reload this page',
                    reason: errorLogger(module, 'Could not retrieve allGrillStatuses', err),
                    disable: true,
                    redirect: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Could not retrieve allGrillStatuses', err));
            }
        }

        function success(allGrillStatuses) {
            res.status(200).send({
                allGrillStatuses: allGrillStatuses
            });
            consoleLogger(successLogger(module));
        }

        getAllGrillStatuses(errorAllGrillStatus, errorAllGrillStatus, success)
    },

    updateUserDetails: function (req, res) {
        updateUserDetails(req, res, req.body);
    },

    clientLoginStartUp: function (req, res) {
        var module = 'clientLoginStartUp';
        receivedLogger(module);

        function errorAllGrillStatus(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: 'An error occurred. Please reload this page',
                    reason: errorLogger(module, 'Could not retrieve allGrillStatuses', err),
                    disable: true,
                    redirect: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Could not retrieve allGrillStatuses', err));
            }
        }

        function success(allGrillStatuses) {
            res.status(200).send({
                allGrillStatuses: allGrillStatuses
            });
            consoleLogger(successLogger(module));
        }

        getAllGrillStatuses(errorAllGrillStatus, errorAllGrillStatus, success);
    },

    adminLoginStartUp: function (req, res) {
        var module = 'adminLoginStartUp';
        receivedLogger(module);

        function errorAllGrillStatus(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: 'An error occurred. Please reload this page',
                    reason: errorLogger(module, 'Could not retrieve allGrillStatuses', err),
                    disable: true,
                    redirect: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Could not retrieve allGrillStatuses', err));
            }
        }

        function success(allGrillStatuses) {
            res.status(200).send({
                allGrillStatuses: allGrillStatuses
            });
            consoleLogger(successLogger(module));
        }

        getAllGrillStatuses(errorAllGrillStatus, errorAllGrillStatus, success);
    }
};