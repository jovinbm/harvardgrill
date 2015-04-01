var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var userDB = require('../db/user_db.js');

var receivedLogger = function (module) {
    var rL = require('../functions/basic.js').receivedLogger;
    rL('logout_handler', module);
};

var successLogger = function (module, text) {
    var sL = require('../functions/basic.js').successLogger;
    return sL('logout_handler', module, text);
};

var errorLogger = function (module, text, err) {
    var eL = require('../functions/basic.js').errorLogger;
    return eL('logout_handler', module, text, err);
};

module.exports = {


    logoutHarvardLogin: function (req, res) {
        var module = 'logoutHarvardLogin';
        receivedLogger(module);

        //delete the harvard cs50 ID session
        req.logout();

        //send a success so that the user will be logged out and redirected to login
        res.status(200).send({
            msg: 'LogoutHarvardLogin success'
        });
        consoleLogger(successLogger(module));
    },


    logoutClientSession: function (req, res, theUser) {
        var module = 'logoutClientSession';
        receivedLogger(module);

        //the logout_api toggles the customLoggedInStatus -- respond with a success, client will redirect
        res.status(200).send({
            code: 200,
            notify: false,
            redirect: true,
            redirectPage: "/clientLogin.html"
        });
        consoleLogger(successLogger(module));
    },


    logoutClientFull: function (req, res, theUser) {
        var module = 'logoutClientFull';
        receivedLogger(module);

        //delete the harvard cs50 ID session
        req.logout();

        //send a success so that the user will be logged out and redirected to login
        res.status(200).send({
            code: 200,
            notify: false,
            redirect: true,
            redirectPage: "/login.html"
        });
        consoleLogger(successLogger(module));
    },


    adminLogout: function (req, res, theUser) {
        var module = 'adminLogout';
        receivedLogger(module);

        //log the admin user out
        req.logout();

        //delete the admin
        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    type: 'error',
                    msg: 'Error when trying to log you out. Please reload page',
                    reason: errorLogger(module, 'Could not logout admin', err),
                    disable: true,
                    redirect: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Failed! Could not logout admin', err));
            }
        }

        function success() {
            //the logout_api toggles the customLoggedInStatus -- respond with a success, client will redirect
            res.status(200).send({
                code: 200,
                notify: false,
                redirect: true,
                redirectPage: "/adminLogin.html"
            });
            consoleLogger(successLogger(module));
        }

        userDB.deleteUser(theUser, error, error, success)
    }


};