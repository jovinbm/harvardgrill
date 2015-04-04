var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;

var receivedLogger = function (module) {
    var rL = require('../functions/basic.js').receivedLogger;
    rL('basic_api', module);
};

var successLogger = function (module, text) {
    var sL = require('../functions/basic.js').successLogger;
    return sL('basic_api', module, text);
};
var errorLogger = function (module, text, err) {
    var eL = require('../functions/basic.js').errorLogger;
    return eL('basic_api', module, text, err);
};

var basic_handler = require('../handlers/basic_handler.js');
var userDB = require('../db/user_db.js');

function getTheUser(req) {
    return req.customData.theUser;
}
function getTheCurrentGrillStatus(req) {
    return req.customData.currentGrillStatus;
}

module.exports = {

    getSocketRoom: function (req, res) {
        var module = 'getSocketRoom';
        receivedLogger(module);
        var theUser = req.customData.theUser;
        res.status(200).send({
            socketRoom: theUser.socketRoom,
            grillName: theUser.grillName,
            username: theUser.username,
            uniqueCuid: theUser.uniqueCuid
        });
        consoleLogger(successLogger(module));
    },


    adminStartUp: function (req, res) {
        var module = 'adminStartUp';
        receivedLogger(module);
        basic_handler.adminStartUp(req, res);

    },

    clientStartUp: function (req, res) {
        var module = 'clientStartUp';
        receivedLogger(module);
        basic_handler.clientStartUp(req, res);
    }
};