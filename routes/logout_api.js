var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;

var receivedLogger = function (module) {
    var rL = require('../functions/basic.js').receivedLogger;
    rL('logout_api', module);
};

var successLogger = function (module, text) {
    var sL = require('../functions/basic.js').successLogger;
    return sL('logout_api', module, text);
};

var errorLogger = function (module, text, err) {
    var eL = require('../functions/basic.js').errorLogger;
    return eL('logout_api', module, text, err);
};

var logout_handler = require('../handlers/logout_handler.js');
var userDB = require('../db/user_db.js');


function getTheUser(req) {
    return req.customData.theUser;
}
function getTheCurrentGrillStatus(req) {
    return req.customData.currentGrillStatus;
}

module.exports = {
    logoutHarvardLogin: function (req, res) {
        var module = 'logoutHarvardLogin';
        receivedLogger(module);

        logout_handler.logoutHarvardLogin(req, res);
    },


    logoutClientSession: function (req, res) {
        var module = 'logoutClientSession';
        receivedLogger(module);
        userDB.toggleCls(req.user.openId, 0, errorToggle, errorToggle, toggled);

        //toggle the user's customLoggedInStatus
        function toggled() {
            logout_handler.logoutClientSession(req, res);
        }

        function errorToggle(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: "A problem has occurred. Please reload the page",
                    reason: errorLogger(module, 'Could not toggle customLoggedIn status', err),
                    disable: true,
                    redirect: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Could not toggle customLoggedIn status', err));
            }
        }
    },


    logoutClientFull: function (req, res) {
        var module = 'logoutClientFull';
        receivedLogger(module);
        userDB.toggleCls(req.user.openId, 0, errorToggle, errorToggle, toggled);

        function toggled() {
            logout_handler.logoutClientFull(req, res);
        }

        function errorToggle(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: "A problem has occurred. Please try again",
                    reason: errorLogger(module, 'Could not toggle customLoggedIn status', err),
                    disable: true,
                    redirect: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Could not toggle customLoggedIn status', err));
            }
        }
    },

    logoutAdminSession: function (req, res) {
        var module = 'logoutAdminSession';
        receivedLogger(module);
        userDB.toggleCls(req.user.openId, 0, errorToggle, errorToggle, toggled);

        //toggle the user's customLoggedInStatus
        function toggled() {
            logout_handler.logoutAdminSession(req, res);
        }

        function errorToggle(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: "A problem has occurred. Please reload the page",
                    reason: errorLogger(module, 'Could not toggle customLoggedIn status', err),
                    disable: true,
                    redirect: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Could not toggle customLoggedIn status', err));
            }
        }
    },


    logoutAdminFull: function (req, res) {
        var module = 'logoutAdminFull';
        receivedLogger(module);
        userDB.toggleCls(req.user.openId, 0, errorToggle, errorToggle, toggled);

        function toggled() {
            logout_handler.logoutAdminFull(req, res);
        }

        function errorToggle(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: "A problem has occurred. Please try again",
                    reason: errorLogger(module, 'Could not toggle customLoggedIn status', err),
                    disable: true,
                    redirect: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Could not toggle customLoggedIn status', err));
            }
        }
    }
};