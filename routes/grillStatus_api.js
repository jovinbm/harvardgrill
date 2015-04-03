var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;

var receivedLogger = function (module) {
    var rL = require('../functions/basic.js').receivedLogger;
    rL('grillStatus_api', module);
};

var successLogger = function (module, text) {
    var sL = require('../functions/basic.js').successLogger;
    return sL('grillStatus_api', module, text);
};
var errorLogger = function (module, text, err) {
    var eL = require('../functions/basic.js').errorLogger;
    return eL('grillStatus_api', module, text, err);
};

var grillStatus_handler = require('../handlers/grillStatus_handler.js');
var userDB = require('../db/user_db.js');
var statsDB = require('../db/stats_db.js');
var componentDB = require('../db/component_db.js');

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
        grillStatus_handler.openGrill(req, res);
    },


    closeGrill: function (req, res) {
        var module = 'closeGrill';
        receivedLogger(module);
        grillStatus_handler.closeGrill(req, res);
    },

    getCurrentGrillStatus: function (req, res) {
        var module = 'getCurrentGrillStatus';
        receivedLogger(module);
        grillStatus_handler.getCurrentGrillStatus(req, res)
    },


    getAllComponentsIndexNames: function (req, res) {
        var module = 'getAllComponentsIndexNames';
        receivedLogger(module);
        var theUser = req.customData.theUser;
        componentDB.getAllComponentsIndexNames(theUser.grillName, theUser, -1, errorIndexes, errorIndexes, componentIndexesSuccess);

        function componentIndexesSuccess(allComponentsIndexNames) {
            res.status(200).send({
                allComponentsIndexNames: allComponentsIndexNames
            })
        }

        function errorIndexes(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: "A problem has occurred. Please reload the page",
                    reason: errorLogger(module, 'Could not retrieve componentIndexesSuccess', err),
                    disable: true,
                    redirect: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Could not retrieve componentIndexesSuccess', err));
            }
        }
    },

    updateAvailableComponents: function (req, res) {
        var module = 'updateAvailableComponents';
        receivedLogger(module);
        var allComponents = req.body.allComponents;
        grillStatus_handler.updateAvailableComponents(req, res, allComponents);
    }


};