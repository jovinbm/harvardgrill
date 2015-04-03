var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var statsDB = require('../db/stats_db.js');

function getTheUser(req) {
    return req.customData.theUser;
}
function getTheCurrentGrillStatus(req) {
    return req.customData.currentGrillStatus;
}

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

    adminStartUp: function (req, res) {
        var module = 'adminStartup';
        receivedLogger(module);
        res.status(200).send({
            currentGrillStatus: req.customData.currentGrillStatus
        });
        consoleLogger(successLogger(module));
    },

    clientStartUp: function (req, res) {
        var module = 'clientStartup';
        receivedLogger(module);
        res.status(200).send({
            currentGrillStatus: req.customData.currentGrillStatus
        });
        consoleLogger(successLogger(module));
    }
};