var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var statsDB = require('../db/stats_db.js');

module.exports = {

    adminStartUp: function (req, res, theUser) {
        consoleLogger('startUp: ADMIN_STARTUP handler called');

        function adminStartUpError(status, err) {
            if (status == -1) {
                consoleLogger("adminStartUp handler: adminStartup: Error while retrieving startup info: err = " + err);
                res.status(500).send({
                    msg: 'adminStartUp handler: adminStartup: Error while retrieving startup info',
                    err: err
                });
                consoleLogger('adminStartUp: failed!');
            } else if (status == 0) {
                consoleLogger("adminStartUp handler: adminStartup: Could not find data, proceeding to create first instance");
            }
        }

        function success(currentGrillStatus) {
            consoleLogger("adminStartUp handler: adminStartup: Success");
            res.status(200).send({
                currentGrillStatus: currentGrillStatus
            });
        }

        statsDB.getCurrentGrillStatus("stats", adminStartUpError, adminStartUpError, success)

    },

    clientStartUp: function (req, res, theUser) {
        consoleLogger('basic_handlers: CLIENT_STARTUP handler called');

        function clientStartUpError(status, err) {
            if (status == -1) {
                consoleLogger("clientStartUp handler: clientStartUp: Error while retrieving startup info: err = " + err);
                res.status(500).send({
                    msg: 'clientStartUp handler: clientStartUp: Error while retrieving startup info',
                    err: err
                });
                consoleLogger('clientStartUp: failed!');
            } else if (status == 0) {
                consoleLogger("clientStartUp handler: clientStartUp: Could not find data, proceeding to create first instance");
            }
        }

        function success(currentGrillStatus) {
            consoleLogger("adminStartUp handler: adminStartup: Success");
            res.status(200).send({
                currentGrillStatus: currentGrillStatus
            });
        }

        statsDB.getCurrentGrillStatus("stats", clientStartUpError, clientStartUpError, success);

    }


};