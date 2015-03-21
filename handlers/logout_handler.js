var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;

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
    },


    logoutHarvardOrder: function (req, res, theUser) {
        consoleLogger('LOGOUT HARVARD ORDER event handler called');
        //delete the harvard cs50 ID session
        req.logout();
        //send a success so that the user will be logged out and redirected to login
        res.status(200).send({msg: 'LogoutHarvardOrder success'});
        consoleLogger('logoutHarvardOrder: Success');
    }


};