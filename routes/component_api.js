var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;

var receivedLogger = function (module) {
    var rL = require('../functions/basic.js').receivedLogger;
    rL('component_api', module);
};

var successLogger = function (module, text) {
    var sL = require('../functions/basic.js').successLogger;
    return sL('component_api', module, text);
};
var errorLogger = function (module, text, err) {
    var eL = require('../functions/basic.js').errorLogger;
    return eL('component_api', module, text, err);
};

var userDB = require('../db/user_db.js');
var statsDB = require('../db/stats_db.js');
var component_handler = require('../handlers/component_handler.js');

function getTheUser(req) {
    return req.customData.theUser;
}
function getTheCurrentGrillStatus(req) {
    return req.customData.currentGrillStatus;
}

module.exports = {

    addComponent: function (req, res) {
        var module = 'addComponent';
        receivedLogger(module);
        var theComponent = req.body.theComponentObject;
        component_handler.addComponent(req, res, theComponent);
    },


    saveEditedComponent: function (req, res) {
        var module = 'saveEditedComponent';
        receivedLogger(module);
        var theComponent = req.body;
        component_handler.saveEditedComponent(req, res, theComponent);
    },


    deleteComponent: function (req, res) {
        var module = 'deleteComponent';
        receivedLogger(module);
        var componentIndex = req.body.componentIndex;
        component_handler.deleteComponent(req, res, componentIndex);
    },


    getAllComponents: function (req, res) {
        var module = 'getAllComponents';
        receivedLogger(module);
        var componentGroup = req.body.componentGroup;
        component_handler.getAllComponents(req, res, componentGroup);
    },


    getAvailableComponents: function (req, res) {
        var module = 'getAvailableComponents';
        receivedLogger(module);
        var componentGroup = req.body.componentGroup;
        component_handler.getAvailableComponents(req, res, componentGroup);
    }

};