var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var userDB = require('../db/user_db.js');

function getTheUser(req) {
    return req.customData.theUser;
}
function getTheCurrentGrillStatus(req) {
    return req.customData.currentGrillStatus;
}

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
        //send a success so that the user will be logged out and redirected to login by angular responseHandler
        res.status(200).send({
            msg: 'LogoutHarvardLogin success'
        });
        consoleLogger(successLogger(module));
    },


    logoutClientSession: function (req, res) {
        var module = 'logoutClientSession';
        receivedLogger(module);
        //the logout_api toggles the customLoggedInStatus -- respond with a success, angular client will redirect
        res.status(200).send({
            code: 200,
            notify: false,
            redirect: true,
            redirectPage: "/clientLogin.html"
        });
        consoleLogger(successLogger(module));
    },


    logoutClientFull: function (req, res) {
        var module = 'logoutClientFull';
        receivedLogger(module);
        //delete the harvard cs50 ID session
        req.logout();
        //send a success so that the user will be logged out and redirected to login by clientAngular
        res.status(200).send({
            code: 200,
            notify: false,
            redirect: true,
            redirectPage: "/login.html"
        });
        consoleLogger(successLogger(module));
    },


    adminLogout: function (req, res) {
        var module = 'adminLogout';
        receivedLogger(module);
        var theUser = getTheUser(req);
        userDB.deleteUser(theUser, error, error, success);

        function success() {
            //the logout_api toggles the customLoggedInStatus -- respond with a success, client will redirect
            req.logout();
            res.status(200).send({
                code: 200,
                notify: false,
                redirect: true,
                redirectPage: "/adminLogin.html"
            });
            consoleLogger(successLogger(module));
        }

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: 'Error when trying to log you out. Please try again',
                    reason: errorLogger(module, 'Could not logout admin', err),
                    disable: true,
                    redirect: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Failed! Could not logout admin', err));
            }
        }
    }


};