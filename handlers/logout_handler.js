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
        consoleLogger(successLogger(module));
        //send a success so that the user will be logged out and redirected to login by angular responseHandler
        res.status(200).send({
            msg: 'LogoutHarvardLogin success'
        });
    },


    logoutClientSession: function (req, res) {
        var module = 'logoutClientSession';
        receivedLogger(module);
        var theUser = getTheUser(req);
        //change the user's grill to default
        userDB.updateGrillName(theUser.openId, 'default', error, error, success);

        function success() {
            consoleLogger(successLogger(module));
            //the logout_api toggles the customLoggedInStatus -- respond with a success, angular client will redirect
            res.status(200).send({
                code: 200,
                notify: false,
                redirect: true,
                redirectPage: "/clientLogin.html"
            });
        }

        function error(status, err) {
            consoleLogger(errorLogger(module, err, err));
            res.status(500).send({
                code: 500,
                notify: true,
                type: 'error',
                msg: 'An error occurred while trying to log you out. Please try again'
            });
        }
    },


    logoutClientFull: function (req, res) {
        var module = 'logoutClientFull';
        receivedLogger(module);
        var theUser = getTheUser(req);
        //change the user's grill to default
        userDB.updateGrillName(theUser.openId, 'default', error, error, success);

        function success() {
            //delete the harvard cs50 ID session
            req.logout();
            consoleLogger(successLogger(module));
            //send a success so that the user will be logged out and redirected to login by clientAngular
            res.status(200).send({
                code: 200,
                notify: false,
                redirect: true,
                redirectPage: "/index.html"
            });
        }

        function error(status, err) {
            consoleLogger(errorLogger(module, err, err));
            res.status(500).send({
                code: 500,
                notify: true,
                type: 'error',
                msg: 'An error occurred while trying to log you out. Please try again'
            });
        }
    },

    logoutAdminSession: function (req, res) {
        var module = 'logoutAdminSession';
        receivedLogger(module);
        var theUser = getTheUser(req);

        //change the user's grill to default
        userDB.updateGrillName(theUser.openId, 'default', error, error, success);
        function success() {
            consoleLogger(successLogger(module));
            //the logout_api toggles the customLoggedInStatus -- respond with a success, client will redirect
            res.status(200).send({
                code: 200,
                notify: false,
                redirect: true,
                redirectPage: "/adminLogin.html"
            });
        }

        function error(status, err) {
            consoleLogger(errorLogger(module, err, err));
            res.status(500).send({
                code: 500,
                notify: true,
                type: 'error',
                msg: 'An error occurred while trying to log you out. Please try again'
            });
        }
    },


    logoutAdminFull: function (req, res) {
        var module = 'logoutAdminFull';
        receivedLogger(module);
        var theUser = getTheUser(req);

        //change the user's grill to default
        userDB.updateGrillName(theUser.openId, 'default', error, error, success);

        function success() {
            req.logout();
            consoleLogger(successLogger(module));
            res.status(200).send({
                code: 200,
                notify: false,
                redirect: true,
                redirectPage: "/index.html"
            });
        }

        function error(status, err) {
            consoleLogger(errorLogger(module, err, err));
            res.status(500).send({
                code: 500,
                notify: true,
                type: 'error',
                msg: 'An error occurred while trying to log you out. Please try again'
            });
        }
    }


};