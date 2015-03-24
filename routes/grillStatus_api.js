var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var grillStatus_handler = require('../handlers/grillStatus_handler.js');
var userDB = require('../db/user_db.js');
var statsDB = require('../db/stats_db.js');
var componentDB = require('../db/component_db.js');


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


    getAllComponentsIndexNames: function (req, res) {
        consoleLogger('getAllComponentsIndexNames event received');
        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    msg: 'getAllComponentsIndexNamesAPI: Could not retrieve admin user OR error getting index names',
                    err: err
                });
                consoleLogger("ERROR: getAllComponentsIndexNamesAPI: Could not retrieve admin user OR error getting index names: " + err);
            }
        }

        function success(theUser) {
            if (theUser.customLoggedInStatus == 1) {

                function componentIndexesSuccess(allComponentsIndexNames) {
                    res.status(200).send({
                        allComponentsIndexNames: allComponentsIndexNames
                    })
                }

                componentDB.getAllComponentsIndexNames(-1, error, error, componentIndexesSuccess)
            }
            //TODO -- redirect to custom login
        }

        userDB.findUser(req.user.openId, error, error, success);
    },


    getAdminClientOrders: function (req, res) {

        var amount = req.body.amount;

        consoleLogger('grillStatus_api: getAdminClientOrders: event received');
        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    msg: 'grillStatus_api: getAdminClientOrders: Could not retrieve admin user OR currentGrillStatus',
                    err: err
                });
                consoleLogger("ERROR: grillStatus_api: getAdminClientOrders: Could not retrieve admin user OR currentGrillStatus: " + err);
            }
        }

        function success(theUser) {
            function statsSuccess(currentGrillStatus) {
                if (theUser.customLoggedInStatus == 1) {
                    grillStatus_handler.getAdminClientOrders(req, res, theUser, currentGrillStatus, amount);
                }
                //TODO -- redirect to custom login
            }

            statsDB.getCurrentGrillStatus("stats", error, error, statsSuccess);
        }

        userDB.findUser(req.user.openId, error, error, success);
    },

    updateAvailableComponents: function (req, res) {

        var allComponents = req.body.allComponents;

        consoleLogger('grillStatus_api: updateAvailableComponents event received');
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