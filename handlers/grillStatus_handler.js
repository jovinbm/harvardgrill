var basic = require('../functions/basic.js');
var ioJs = require('../functions/io.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var statsDB = require('../db/stats_db.js');
var componentDB = require('../db/component_db.js');

var receivedLogger = function (module) {
    var rL = require('../functions/basic.js').receivedLogger;
    rL('grillStatus_handler', module);
};

var successLogger = function (module, text) {
    var sL = require('../functions/basic.js').successLogger;
    return sL('grillStatus_handler', module, text);
};

var errorLogger = function (module, text, err) {
    var eL = require('../functions/basic.js').errorLogger;
    return eL('grillStatus_handler', module, text, err);
};

module.exports = {

    openGrill: function (req, res, theUser) {
        var module = 'openGrill';
        receivedLogger(module);

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    type: 'warning',
                    msg: "A problem has occurred while trying to open grill. Please try again. If the problem persists, please reload this page",
                    reason: errorLogger(module, 'Could not open grill', err),
                    disable: false,
                    redirect: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Failed! Could not open grill', err));
            }
        }

        function success(newGrillStatus) {
            res.status(200).send({
                newGrillStatus: newGrillStatus,
                code: 200,
                notify: true,
                type: 'success',
                msg: 'The grill is now open'
            });
            ioJs.emitToAll('adminChanges', 'changes');
            consoleLogger(successLogger(module));
        }

        statsDB.openGrill(theUser.grillName, theUser, error, error, success);
    },

    closeGrill: function (req, res, theUser) {
        var module = 'closeGrill';
        receivedLogger(module);

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    type: 'warning',
                    msg: "A problem has occurred while trying to close grill. Please try again. If the problem persists, please reload this page",
                    reason: errorLogger(module, 'Could not close grill', err),
                    disable: false,
                    redirect: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Failed! Could not close grill', err));
            }
        }

        function success(newGrillStatus) {
            res.status(200).send({
                newGrillStatus: newGrillStatus,
                code: 200,
                notify: true,
                type: 'success',
                msg: 'The grill is now closed'
            });
            ioJs.emitToAll('adminChanges', 'changes');
            consoleLogger(successLogger(module));
        }

        statsDB.closeGrill(theUser.grillName, theUser, error, error, success);
    },

    getCurrentGrillStatus: function (req, res, theUser) {
        var module = 'getCurrentGrillStatus';
        receivedLogger(module);

        function error(status, err) {
            if (status == -1) {
                res.status(500).send({
                    type: 'error',
                    msg: 'A problem has occurred. Please reload page',
                    reason: errorLogger(module, 'Could not retrieve currentGrillStatus', err),
                    disable: true,
                    redirect: true,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Failed! Could not retrieve currentGrillStatus', err));
            } else if (status == 0) {
                consoleLogger("**grillStatus_handler: clientStartUp: Could not find currentGrillStatus, proceeding to create first instance");
            }
        }

        function success(currentGrillStatus) {
            res.status(200).send({
                currentGrillStatus: currentGrillStatus
            });
            consoleLogger(successLogger(module));
        }

        statsDB.getCurrentGrillStatus(theUser.grillName, theUser, error, error, success)

    },


    updateAvailableComponents: function (req, res, theUser, allComponents) {
        var module = 'updateAvailableComponents';
        receivedLogger(module);

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    type: 'warning',
                    msg: 'Update failed, please try again. If problem persists please reload this page',
                    reason: errorLogger(module, 'Could not update available components', err),
                    disable: false,
                    redirect: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Failed! Could not update available components', err));
            }
        }

        function success() {
            res.status(200).send({
                code: 200,
                notify: true,
                type: 'success',
                msg: "Update successful"
            });
            ioJs.emitToAll('adminChanges', 'changes');
            consoleLogger(successLogger(module));
        }

        componentDB.updateAvailableComponents(theUser.grillName, theUser, allComponents, error, error, success)

    }


};