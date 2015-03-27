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


    logoutCustomOrder: function (req, res, theUser) {
        var module = 'logoutCustomOrder';
        receivedLogger(module);

        //the logout_api toggles the customLoggedInStatus -- respond with a success, client will redirect
        res.status(200).send({
            msg: 'LogoutCustomOrder success'
        });
        consoleLogger(successLogger(module));
    },


    logoutHarvardOrder: function (req, res, theUser) {
        var module = 'logoutHarvardOrder';
        receivedLogger(module);

        //delete the harvard cs50 ID session
        req.logout();

        //send a success so that the user will be logged out and redirected to login
        res.status(200).send({
            msg: 'LogoutHarvardOrder success'
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
                    redirectToError: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Failed! Could not logout admin', err));
            }
        }

        function success() {
            //the logout_api toggles the customLoggedInStatus -- respond with a success, client will redirect
            res.status(200).send({
                msg: 'LogoutCustomOrder success'
            });
            consoleLogger(successLogger(module));
        }

        userDB.deleteUser(theUser, error, error, success)
    }


};