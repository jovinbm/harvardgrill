/**
 * Created by jovinbm on 1/12/15.
 */
var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var logout_handler = require('../handlers/logout_handler.js');
var userDB = require('../db/user_db.js');


module.exports = {
    logoutHarvardLogin: function (req, res) {
        basic.consoleLogger('LOGOUT HARVARD LOGIN event received');
        logout_handler.logoutHarvardLogin(req, res);
    },


    logoutCustomOrder: function (req, res) {
        basic.consoleLogger('LOGOUT CUSTOM ORDER event received');
        /*no need to complete the ajax request -- user will be redirected to login which has it's
         own js file*/
        //retrieve the user
        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({msg: 'ERROR: logoutCustomOrderPOST: Could not retrieve user', err: err});
                basic.consoleLogger("ERROR: logoutCustomOrderPOST: Could not retrieve user: " + err);
            }
        }

        function success(theUser) {
            //toggle the user's customLoggedInStatus
            function toggled() {
                logout_handler.logoutCustomOrder(req, res, theUser);
            }

            userDB.toggleCls(req.user.openId, 0, error, error, toggled);
        }

        userDB.findUser(req.user.openId, error, error, success);
    },


    logoutHarvardOrder: function (req, res) {
        basic.consoleLogger('LOGOUT HARVARD ORDER event received');
        /*no need to complete the ajax request -- user will be redirected to login which has it's
         own js file*/
        //retrieve the user
        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({msg: 'ERROR: logoutHarvardOrderPOST: Could not retrieve user', err: err});
                basic.consoleLogger("ERROR: logoutHarvardOrderPOST: Could not retrieve user: " + err);
            }
        }

        function success(theUser) {
            //toggle the user's customLoggedInStatus
            function toggled() {
                logout_handler.logoutHarvardOrder(req, res, theUser);
            }

            //userDB.toggleCls(req.user.openId, 0, error, error, toggled);
            toggled();
        }

        userDB.findUser(req.user.openId, error, error, success);
    }
};