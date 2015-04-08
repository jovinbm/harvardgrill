var userDB = require('../db/user_db.js');
var statsDB = require('../db/stats_db.js');

var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;

var receivedLogger = function (module) {
    var rL = require('./basic.js').receivedLogger;
    rL('middleware.js', module);
};

var successLogger = function (module, text) {
    var sL = require('./basic.js').successLogger;
    return sL('middleware.js', module, text);
};

var errorLogger = function (module, text, err) {
    var eL = require('./basic.js').errorLogger;
    return eL('middleware.js', module, text, err);
};

function getTheUser(req) {
    return req.customData.theUser;
}
function getTheCurrentGrillStatus(req) {
    return req.customData.currentGrillStatus;
}

module.exports = {

    //authenticates requests
    ensureAuthenticated: function (req, res, next) {
        var module = "ensureAuthenticated";

        if (req.isAuthenticated()) {
            consoleLogger(successLogger(module));
            next();
        } else {
            consoleLogger(errorLogger(module, 'user authentication failed'));
            res.redirect('index.html');
        }
    },

    ensureAuthenticatedAngular: function (req, res, next) {
        var module = "ensureAuthenticatedAngular";
        if (req.isAuthenticated()) {
            consoleLogger(successLogger(module));
            next();
        } else {
            consoleLogger(errorLogger(module, 'user authentication failed'));
            res.status(401).send({
                code: 401,
                notify: true,
                type: 'error',
                banner: true,
                bannerClass: 'alert alert-dismissible alert-warning',
                msg: 'You are not logged in. Please reload page',
                disable: true,
                redirect: true,
                redirectPage: '/index.html'
            });
        }
    },

    addUserData: function (req, res, next) {
        var module = "addUserData";
        userDB.findUser(req.user.openId, error, error, success);

        function success(userData) {
            if (req.customData) {
                req.customData.theUser = userData;
            } else {
                req.customData = {};
                req.customData.theUser = userData;
            }
            consoleLogger(successLogger(module));
            next();
        }

        function error(status, err) {
            consoleLogger(errorLogger(module, 'error retrieving user data', err));
            res.status(500).send({
                code: 500,
                notify: true,
                type: 'error',
                msg: 'An error occurred while retrieving your personalized info. Please reload the page'
            });
        }
    },

    addUserGrillStatus: function (req, res, next) {
        var module = "addUserGrillStatus";
        //skip if the grillName is 'profile' because the user will be heading to see their profile

        if (req.customData.theUser.grillName == 'default') {
            //put empty grillStatus
            req.customData.currentGrillStatus = [];
            consoleLogger(successLogger(module));
            next();
        } else {
            statsDB.getCurrentGrillStatus(req.customData.theUser.grillName, req.customData.theUser, error, error, success);

            function success(currentGrillStatus) {
                req.customData.currentGrillStatus = currentGrillStatus;
                consoleLogger(successLogger(module));
                next();
            }

            function error(status, err) {
                //means the grill the user is looking for is not found. This is a big error
                //redirect the user to clientLogin

                //logout user
                userDB.updateCuCls(req.customData.theUser.openId, req.customData.theUser.username, 0, errorLogout, errorLogout, success1);
                function success1() {
                    userDB.updateGrillName(req.customData.theUser.openId, 'default', errorLogout, errorLogout, success2);
                }

                function errorLogout() {
                    req.logout();
                    consoleLogger(errorLogger(module, 'error logout user', err));
                    res.status(500).send({
                        code: 500,
                        notify: true,
                        type: 'warning',
                        msg: 'We could not find the grill you were currently in. Please reload this page',
                        disable: true,
                        redirect: true,
                        redirectPage: '/index.html'
                    });
                }

                function success2() {
                    req.logout();
                    consoleLogger(errorLogger(module, 'GrillStatus Not found', err));
                    res.status(500).send({
                        code: 500,
                        notify: true,
                        type: 'warning',
                        banner: true,
                        bannerClass: 'alert alert-dismissible alert-warning',
                        msg: 'This grill is not available. Redirecting you to login',
                        disable: true,
                        redirect: true,
                        redirectPage: '/index.html'
                    });
                }
            }
        }
    },

    checkCustomLoggedInStatusAngular: function (req, res, next) {
        var module = "checkCustomLoggedInStatusAngular";

        if (req.customData.theUser.customLoggedInStatus == 1) {
            consoleLogger(successLogger(module));
            next();
        } else {
            consoleLogger(errorLogger(module, 'User not logged in'));
            res.status(401).send({
                code: 401,
                banner: true,
                bannerClass: 'alert alert-dismissible alert-warning',
                msg: 'You are not logged in. Refresh the page to do so',
                disable: true
            });
        }
    },

    checkCustomLoggedInStatus: function (req, res, next) {
        var module = "checkCustomLoggedInStatus";

        if (req.customData.theUser.customLoggedInStatus == 1) {
            consoleLogger(successLogger(module));
            next();
        } else {
            res.redirect("index.html");
        }
    },

    checkUserIsAdmin: function (req, res, next) {
        var module = "checkUserIsAdmin";

        if (req.customData.theUser.isAdmin == 'yes') {
            consoleLogger(successLogger(module));
            next();
        } else {
            consoleLogger(errorLogger(module, 'User is not admin'));
            res.status(401).send({
                code: 401,
                banner: true,
                bannerClass: 'alert alert-dismissible alert-warning',
                msg: 'Authorization required. Please reload page to log in'
            });
        }
    },

    checkGrillIsOpen: function (req, res, next) {
        var module = "checkGrillIsOpen";

        if (req.customData.currentGrillStatus.grillStatus == 'open') {
            consoleLogger(successLogger(module));
            next();
        } else {
            consoleLogger(errorLogger(module, 'Grill is closed'));
            res.status(401).send({
                code: 401,
                notify: true,
                type: 'warning',
                msg: 'The grill is currently closed'
            });
        }
    },

    checkGrillIsClosed: function (req, res, next) {
        var module = "checkGrillIsClosed";

        if (req.customData.currentGrillStatus.grillStatus == 'closed') {
            consoleLogger(successLogger(module));
            next();
        } else {
            consoleLogger(errorLogger(module, 'Grill is still open'));
            res.status(401).send({
                code: 401,
                notify: true,
                type: 'warning',
                msg: 'The grill is currently still open'
            });
        }
    }
};