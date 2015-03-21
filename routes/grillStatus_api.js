var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var grillStatus_handler = require('../handlers/grillStatus_handler.js');
var userDB = require('../db/user_db.js');


module.exports = {

    openGrill: function (req, res) {
        consoleLogger('grillStatus_api: OPEN_GRILL event received');

        function error(status, err) {
            if (status == -1 || status == 0) {
                consoleLogger("grillStatus_api: OPEN_GRILL: Could not retrieve user: err = " + err);
                res.status(500).send({
                    msg: 'grillStatus_api: OPEN_GRILL: Could not retrieve user',
                    err: err
                });
            }
        }

        function success(theUser) {
            if (theUser.customLoggedInStatus == 1) {
                grillStatus_handler.openGrill(req, res, theUser);
            }
            //TODO -- redirect to custom login
        }

        userDB.findUser(req.user.openId, error, error, success);
    },


    closeGrill: function (req, res) {
        consoleLogger('grillStatus_api: CLOSE_GRILL event received');

        function error(status, err) {
            if (status == -1 || status == 0) {
                consoleLogger("grillStatus_api: CLOSE_GRILL: Could not retrieve user: err = " + err);
                res.status(500).send({
                    msg: 'grillStatus_api: CLOSE_GRILL: Could not retrieve user',
                    err: err
                });
            }
        }

        function success(theUser) {
            if (theUser.customLoggedInStatus == 1) {
                grillStatus_handler.closeGrill(req, res, theUser);
            }
            //TODO -- redirect to custom login
        }

        userDB.findUser(req.user.openId, error, error, success);
    },

    getCurrentGrillStatus: function (req, res) {
        consoleLogger('GET_CURRENT_GRILL_STATUS event received');
        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({msg: 'getCurrentGrillStatusAPI: Could not retrieve admin user', err: err});
                consoleLogger("ERROR: getCurrentGrillStatusAPI: Could not retrieve admin user: " + err);
            }
        }

        function success(theUser) {
            if (theUser.customLoggedInStatus == 1) {
                grillStatus_handler.getCurrentGrillStatus(req, res, theUser);
            }
            //TODO -- redirect to custom login
        }

        userDB.findUser(req.user.openId, error, error, success);
    },

    updateAvailableComponents: function (req, res) {

        var allComponents = req.body.allComponents;

        consoleLogger('grillstatus_api: updateAvailableComponents event received');
        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({msg: 'updateAvailableComponentsAPI: Could not retrieve admin user', err: err});
                consoleLogger("ERROR: updateAvailableComponentsAPI: Could not retrieve admin user: " + err);
            }
        }

        function success(theUser) {
            if (theUser.customLoggedInStatus == 1) {
                grillStatus_handler.updateAvailableComponents(req, res, theUser, allComponents);
            }
            //TODO -- redirect to custom login
        }

        userDB.findUser(req.user.openId, error, error, success);
    }


};