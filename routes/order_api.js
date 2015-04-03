var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;

var receivedLogger = function (module) {
    var rL = require('../functions/basic.js').receivedLogger;
    rL('order_api', module);
};

var successLogger = function (module, text) {
    var sL = require('../functions/basic.js').successLogger;
    return sL('order_api', module, text);
};
var errorLogger = function (module, text, err) {
    var eL = require('../functions/basic.js').errorLogger;
    return eL('order_api', module, text, err);
};

var userDB = require('../db/user_db.js');
var statsDB = require('../db/stats_db.js');
var order_handler = require('../handlers/order_handler.js');

function getTheUser(req) {
    return req.customData.theUser;
}
function getTheCurrentGrillStatus(req) {
    return req.customData.currentGrillStatus;
}

module.exports = {

    newClientOrder: function (req, res) {
        var module = 'newClientOrder';
        receivedLogger(module);
        var theOrder = req.body.theOrderArray;
        order_handler.newClientOrder(req, res, theOrder);
    },

    getAdminClientOrders: function (req, res) {
        var module = 'getAdminClientOrders';
        receivedLogger(module);
        var amount = req.body.amount;
        var currentOrdersToBeSkipped = req.body.currentOrdersToBeSkipped;
        var skipOrders = true;

        //check to see that the currentOrdersToBeSkipped is not equal to empty []
        //this is set by a function in the client if the value is not provided
        //if so, then set skip orders to false
        if (currentOrdersToBeSkipped == []) {
            skipOrders = false;
        }
        order_handler.getAdminClientOrders(req, res, amount, skipOrders, currentOrdersToBeSkipped);
    },

    getMyRecentOrders: function (req, res) {
        var module = 'getMyRecentOrders';
        receivedLogger(module);
        order_handler.getMyRecentOrders(req, res);
    },


    markOrderAsDone: function (req, res) {
        var module = 'markOrderAsDone';
        receivedLogger(module);
        var orderUniqueCuid = req.body.orderUniqueCuid;
        var processedOrderComponents = req.body.processedOrderComponents;
        order_handler.markOrderAsDone(req, res, orderUniqueCuid, processedOrderComponents);
    },


    markOrderAsDeclined: function (req, res) {
        var module = 'markOrderAsDeclined';
        receivedLogger(module);
        var orderUniqueCuid = req.body.orderUniqueCuid;
        order_handler.markOrderAsDeclined(req, res, orderUniqueCuid);
    }
};