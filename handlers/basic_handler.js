var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var statsDB = require('../db/stats_db.js');

var receivedLogger = function (module) {
    var rL = require('../functions/basic.js').receivedLogger;
    rL('basic_handler', module);
};

var successLogger = function (module, text) {
    var sL = require('../functions/basic.js').successLogger;
    return sL('basic_handler', module, text);
};

var errorLogger = function (module, text, err) {
    var eL = require('../functions/basic.js').errorLogger;
    return eL('basic_handler', module, text, err);
};

module.exports = {

    adminStartUp: function (req, res, theUser) {
        var module = 'adminStartup';
        receivedLogger(module);


        function errorLastActivity(status, err) {
            res.status(500).send({
                type: 'error',
                msg: 'Error when trying to start the app. Please reload page',
                reason: errorLogger(module, 'Could not updateUserLastActivity', err),
                disable: true,
                redirectToError: false,
                redirectPage: '/error/500.html'
            });
            consoleLogger(errorLogger(module, 'Failed! Could not updateUserLastActivity', err));
        }

        function errorGrillStatus(status, err) {
            if (status == -1) {
                res.status(500).send({
                    type: 'error',
                    msg: 'Error when trying to start the app. Please reload page',
                    reason: errorLogger(module, 'Could not retrieve startup info', err),
                    disable: true,
                    redirectToError: true,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Failed! Could not retrieve startup info', err));
            } else if (status == 0) {
                consoleLogger("**basic_handler: adminStartUp: Could not find currentGrillStatus, proceeding to create first instance");
            }
        }

        function success(currentGrillStatus) {
            res.status(200).send({
                currentGrillStatus: currentGrillStatus
            });
            consoleLogger(successLogger(module));
        }

        statsDB.getCurrentGrillStatus(theUser.grillName, theUser, errorGrillStatus, errorGrillStatus, success)

    },

    clientStartUp: function (req, res, theUser) {
        var module = 'clientStartup';
        receivedLogger(module);

        function errorGrillStatus(status, err) {
            if (status == -1) {
                res.status(500).send({
                    type: 'error',
                    msg: 'Error when trying to start the app. Please reload page',
                    reason: errorLogger(module, 'Could not retrieve startup info', err),
                    disable: true,
                    redirectToError: true,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Failed! Could not retrieve startup info', err));
            } else if (status == 0) {
                consoleLogger("**basic_handler: clientStartUp: Could not find currentGrillStatus, proceeding to create first instance");
            }
        }

        function success(currentGrillStatus) {
            res.status(200).send({
                currentGrillStatus: currentGrillStatus
            });
            consoleLogger(successLogger(module));
        }

        statsDB.getCurrentGrillStatus(theUser.grillName, theUser, errorGrillStatus, errorGrillStatus, success);

    }


};