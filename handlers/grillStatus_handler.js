var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var statsDB = require('../db/stats_db.js');
var componentDB = require('../db/component_db.js');

module.exports = {

    openGrill: function (req, res, theUser) {
        consoleLogger('grillStatus_handler: OPEN_GRILL event received');

        function error(status, err) {
            if (status == -1 || status == 0) {
                consoleLogger("grillStatus_handler: OPEN_GRILL: Error executing db operations: err = " + err);
                res.status(500).send({
                    msg: 'grillStatus_handler: OPEN_GRILL: Error executing db operations',
                    err: err
                });
            }
        }

        function success(newGrillStatus) {
            res.status(200).send({
                newGrillStatus: newGrillStatus
            });
            consoleLogger("grillStatus_handler: OPEN_GRILL success");
        }

        statsDB.openGrill("stats", error, error, success);
    },

    closeGrill: function (req, res, theUser) {
        consoleLogger('grillStatus_handler: CLOSE_GRILL event received');

        function error(status, err) {
            if (status == -1 || status == 0) {
                consoleLogger("grillStatus_handler: CLOSE_GRILL: Error executing db operations: err = " + err);
                res.status(500).send({
                    msg: 'grillStatus_handler: CLOSE_GRILL: Error executing db operations',
                    err: err
                });
            }
        }

        function success(newGrillStatus) {
            res.status(200).send({
                newGrillStatus: newGrillStatus
            });
            consoleLogger("grillStatus_handler: CLOSE_GRILL success");
        }

        statsDB.closeGrill("stats", error, error, success);
    },

    getCurrentGrillStatus: function (req, res, theUser) {
        consoleLogger('grillStatus_handler: GET_CURRENT_GRILL_STATUS  called');

        function error(status, err) {
            if (status == -1) {
                consoleLogger("getCurrentGrillStatus handler: getCurrentGrillStatus: Error while retrieving grill info: err = " + err);
                res.status(500).send({
                    msg: 'getCurrentGrillStatus handler: getCurrentGrillStatus: Error while retrieving grill info',
                    err: err
                });
                consoleLogger('getCurrentGrillStatus: failed!');
            } else if (status == 0) {
                consoleLogger("getCurrentGrillStatus: getCurrentGrillStatus: Could not find data, proceeding to create first instance");
            }
        }

        function success(currentGrillStatus) {
            consoleLogger("getCurrentGrillStatus: getCurrentGrillStatus: Success");
            res.status(200).send({
                currentGrillStatus: currentGrillStatus
            });
        }

        statsDB.getCurrentGrillStatus("stats", error, error, success)

    },

    updateAvailableComponents: function (req, res, theUser, allComponents) {
        consoleLogger('grillStatus_handler: updateAvailableComponent  called');

        function error(status, err) {
            if (status == -1 || status == 0) {
                consoleLogger("grillStatus_handler: updateAvailableComponents: Error executing db operations: err = " + err);
                res.status(500).send({
                    msg: 'grillStatus_handler: updateAvailableComponents: Error executing db operations',
                    err: err
                });
            }
        }

        function success() {
            consoleLogger("updateAvailableComponents: Success");
            res.status(200).send({
                msg: "updateAvailableComponents success"
            });
        }

        componentDB.updateAvailableComponents(allComponents, error, error, success)

    }


};