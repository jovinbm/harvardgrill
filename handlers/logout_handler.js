var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var userDB = require('../db/user_db.js');

module.exports = {


    logoutHarvardLogin: function (req, res) {
        consoleLogger('LOGOUT HARVARD LOGIN event handler called');
        //delete the harvard cs50 ID session
        req.logout();
        //send a success so that the user will be logged out and redirected to login
        res.status(200).send({msg: 'LogoutHarvardLogin success'});
        consoleLogger('logoutHarvardLogin: Success');
    },


    logoutCustomOrder: function (req, res, theUser) {
        consoleLogger('LOGOUT CUSTOM ORDER event handler called');
        //the logout_api toggles the customLoggedInStatus -- respond with a success, client will redirect
        res.status(200).send({msg: 'LogoutCustomOrder success'});
        consoleLogger('logoutCustomOrder: Success');
    },


    logoutHarvardOrder: function (req, res, theUser) {
        consoleLogger('LOGOUT HARVARD ORDER event handler called');
        //delete the harvard cs50 ID session
        req.logout();
        //send a success so that the user will be logged out and redirected to login
        res.status(200).send({msg: 'LogoutHarvardOrder success'});
        consoleLogger('logoutHarvardOrder: Success');
    },


    adminLogout: function (req, res, theUser) {
        consoleLogger('ADMIN LOGOUT event handler called');
        //log the admin user out
        req.logout();

        //delete the admin
        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({msg: 'ERROR: logout_handler: adminLogout:Could not delete', err: err});
                basic.consoleLogger("ERROR: logout_handler: adminLogout: Could not delete: err = " + err);
            }
        }

        function success() {
            //the logout_api toggles the customLoggedInStatus -- respond with a success, client will redirect
            res.status(200).send({msg: 'LogoutCustomOrder success'});
            consoleLogger('adminLogout: Success');
        }

        userDB.deleteUser(theUser, error, error, success)
    }


};