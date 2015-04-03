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

function getTheUser(req) {
    return req.customData.theUser;
}
function getTheCurrentGrillStatus(req) {
    return req.customData.currentGrillStatus;
}

module.exports = {

    openGrill: function (req, res) {
        var module = 'openGrill';
        receivedLogger(module);
        var theUser = req.customData.theUser;
        statsDB.openGrill(theUser.grillName, theUser, error, error, success);

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

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'warning',
                    msg: "A problem has occurred while trying to open grill. Please try again. If the problem persists, please reload this page",
                    reason: errorLogger(module, 'Could not open grill', err)
                });
                consoleLogger(errorLogger(module, 'Failed! Could not open grill', err));
            }
        }
    },

    closeGrill: function (req, res) {
        var module = 'closeGrill';
        receivedLogger(module);
        var theUser = req.customData.theUser;
        statsDB.closeGrill(theUser.grillName, theUser, error, error, success);

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

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'warning',
                    msg: "A problem has occurred while trying to close grill. Please try again. If the problem persists, please reload this page",
                    reason: errorLogger(module, 'Could not close grill', err)
                });
                consoleLogger(errorLogger(module, 'Failed! Could not close grill', err));
            }
        }
    },

    getCurrentGrillStatus: function (req, res) {
        var module = 'getCurrentGrillStatus';
        receivedLogger(module);
        res.status(200).send({
            currentGrillStatus: req.customData.currentGrillStatus
        });
        consoleLogger(successLogger(module));

    },


    updateAvailableComponents: function (req, res, allComponents) {
        var module = 'updateAvailableComponents';
        receivedLogger(module);
        var theUser = req.customData.theUser;
        componentDB.updateAvailableComponents(theUser.grillName, theUser, allComponents, error, error, success);

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

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'warning',
                    msg: 'Update failed, please try again. If problem persists please reload this page',
                    reason: errorLogger(module, 'Could not update available components', err)
                });
                consoleLogger(errorLogger(module, 'Failed! Could not update available components', err));
            }
        }
    }


};