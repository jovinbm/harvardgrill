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
            res.redirect('login.html');
            consoleLogger(errorLogger(module, 'user authentication failed'));
        }
    },

    ensureAuthenticatedAngular: function (req, res, next) {
        var module = "ensureAuthenticatedAngular";
        if (req.isAuthenticated()) {
            consoleLogger(successLogger(module));
            next();
        } else {
            res.status(401).send({
                code: 401,
                notify: true,
                type: 'error',
                banner: true,
                bannerClass: 'alert alert-dismissible alert-warning',
                msg: 'You are not logged in. Please reload page',
                reason: errorLogger(module, 'user not logged in'),
                disable: true,
                redirect: true,
                redirectPage: '/login.html'
            });
            consoleLogger(errorLogger(module, 'user authentication failed'));
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
            res.status(500).send({
                code: 500,
                notify: true,
                type: 'error',
                msg: 'An error occurred while retrieving your personalized info. Please reload the page',
                reason: errorLogger(module, 'error retrieving user data', err)
            });
            consoleLogger(errorLogger(module, 'error retrieving user data', err));
        }
    },

    addUserGrillStatus: function (req, res, next) {
        var module = "addUserGrillStatus";
        statsDB.getCurrentGrillStatus(req.customData.theUser.grillName, req.customData.theUser, error, error, success);

        function success(currentGrillStatus) {
            req.customData.currentGrillStatus = currentGrillStatus;
            consoleLogger(successLogger(module));
            next();
        }

        function error(status, err) {
            res.status(500).send({
                code: 500,
                notify: true,
                type: 'error',
                msg: 'An error occurred while retrieving grill info. Please reload the page',
                reason: errorLogger(module, 'error grill status')
            });
            consoleLogger(errorLogger(module, 'error grillStatus', err));
        }
    },

    checkCustomLoggedInStatusAngular: function (req, res, next) {
        var module = "checkCustomLoggedInStatusAngular";

        if (req.customData.theUser.customLoggedInStatus == 1) {
            consoleLogger(successLogger(module));
            next();
        } else {
            res.status(401).send({
                code: 401,
                banner: true,
                bannerClass: 'alert alert-dismissible alert-warning',
                msg: 'You are not logged in. Refresh the page to do so',
                reason: errorLogger(module, 'User not logged in'),
                disable: true
            });
            consoleLogger(errorLogger(module, 'User not logged in'));
        }
    },

    checkCustomLoggedInStatus: function (req, res, next) {
        var module = "checkCustomLoggedInStatus";

        if (req.customData.theUser.customLoggedInStatus == 1) {
            consoleLogger(successLogger(module));
            next();
        } else {
            res.redirect("login.html");
        }
    },

    checkUserIsAdmin: function (req, res, next) {
        var module = "checkUserIsAdmin";

        if (req.customData.theUser.isAdmin == 'yes') {
            consoleLogger(successLogger(module));
            next();
        } else {
            res.status(401).send({
                code: 401,
                banner: true,
                bannerClass: 'alert alert-dismissible alert-warning',
                msg: 'Authorization required. Please reload page to log in',
                reason: errorLogger(module, 'User is not admin'),
            });
            consoleLogger(errorLogger(module, 'User is not admin'));
        }
    },

    checkGrillIsOpen: function (req, res, next) {
        var module = "checkGrillIsOpen";

        if (req.customData.currentGrillStatus.grillStatus == 'open') {
            consoleLogger(successLogger(module));
            next();
        } else {
            res.status(401).send({
                code: 401,
                notify: true,
                type: 'warning',
                msg: 'The grill is currently closed',
                reason: errorLogger(module, 'Grill is closed'),
            });
            consoleLogger(errorLogger(module, 'Grill is closed'));
        }
    },

    checkGrillIsClosed: function (req, res, next) {
        var module = "checkGrillIsClosed";

        if (req.customData.currentGrillStatus.grillStatus == 'closed') {
            consoleLogger(successLogger(module));
            next();
        } else {
            res.status(401).send({
                code: 401,
                notify: true,
                type: 'warning',
                msg: 'The grill is currently still open',
                reason: errorLogger(module, 'Grill is still open'),
            });
            consoleLogger(errorLogger(module, 'Grill is still open'));
        }
    }
};