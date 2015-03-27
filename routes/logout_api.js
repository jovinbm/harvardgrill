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


module.exports = {
    logoutHarvardLogin: function (req, res) {
        var module = 'logoutHarvardLogin';
        receivedLogger(module);

        logout_handler.logoutHarvardLogin(req, res);
    },


    logoutCustomOrder: function (req, res) {
        var module = 'logoutCustomOrder';
        receivedLogger(module);

        /*no need to complete the ajax request -- user will be redirected to login which has it's
         own js file*/
        //retrieve the user
        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    type: 'error',
                    msg: "A problem has occurred. Please reload the page",
                    reason: errorLogger(module, 'Could not retrieve user', err),
                    disable: true,
                    redirectToError: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Could not retrieve user', err));
            }
        }

        function success(theUser) {

            function errorToggle(status, err) {
                if (status == -1 || status == 0) {
                    res.status(500).send({
                        type: 'error',
                        msg: "A problem has occurred. Please reload the page",
                        reason: errorLogger(module, 'Could not toggle customLoggedIn status', err),
                        disable: true,
                        redirectToError: false,
                        redirectPage: '/error/500.html'
                    });
                    consoleLogger(errorLogger(module, 'Could not toggle customLoggedIn status', err));
                }
            }

            //toggle the user's customLoggedInStatus
            function toggled() {
                logout_handler.logoutCustomOrder(req, res, theUser);
            }

            userDB.toggleCls(req.user.openId, 0, errorToggle, errorToggle, toggled);
        }

        userDB.findUser(req.user.openId, error, error, success);
    },


    logoutHarvardOrder: function (req, res) {
        var module = 'logoutHarvardOrder';
        receivedLogger(module);

        /*no need to complete the ajax request -- user will be redirected to login which has it's
         own js file*/
        //retrieve the user
        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    type: 'error',
                    msg: "A problem has occurred. Please reload the page",
                    reason: errorLogger(module, 'Could not retrieve user', err),
                    disable: true,
                    redirectToError: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Could not retrieve user', err));
            }
        }

        function success(theUser) {
            //toggle the user's customLoggedInStatus

            function errorToggle(status, err) {
                if (status == -1 || status == 0) {
                    res.status(500).send({
                        type: 'error',
                        msg: "A problem has occurred. Please reload the page",
                        reason: errorLogger(module, 'Could not toggle customLoggedIn status', err),
                        disable: true,
                        redirectToError: false,
                        redirectPage: '/error/500.html'
                    });
                    consoleLogger(errorLogger(module, 'Could not toggle customLoggedIn status', err));
                }
            }

            function toggled() {
                logout_handler.logoutHarvardOrder(req, res, theUser);
            }

            userDB.toggleCls(req.user.openId, 0, errorToggle, errorToggle, toggled);
        }

        userDB.findUser(req.user.openId, error, error, success);
    },


    adminLogout: function (req, res) {
        var module = 'adminLogout';
        receivedLogger(module);

        /*no need to complete the ajax request -- user will be redirected to login which has it's
         own js file*/
        //retrieve the user
        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    type: 'error',
                    msg: "A problem has occurred. Please reload the page",
                    reason: errorLogger(module, 'Could not retrieve user', err),
                    disable: true,
                    redirectToError: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Could not retrieve user', err));
            }
        }

        function success(theUser) {
            //toggle the user's customLoggedInStatus
            function toggled() {
                logout_handler.adminLogout(req, res, theUser);
            }

            toggled();
        }

        userDB.findUser(req.user.openId, error, error, success);
    }
};