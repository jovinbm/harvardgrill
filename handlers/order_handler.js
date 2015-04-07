var basic = require('../functions/basic.js');
var ioJs = require('../functions/io.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var orderDB = require('../db/order_db.js');

function getTheUser(req) {
    return req.customData.theUser;
}
function getTheCurrentGrillStatus(req) {
    return req.customData.currentGrillStatus;
}

var receivedLogger = function (module) {
    var rL = require('../functions/basic.js').receivedLogger;
    rL('order_handler', module);
};

var successLogger = function (module, text) {
    var sL = require('../functions/basic.js').successLogger;
    return sL('order_handler', module, text);
};

var errorLogger = function (module, text, err) {
    var eL = require('../functions/basic.js').errorLogger;
    return eL('order_handler', module, text, err);
};

module.exports = {

    newClientOrder: function (req, res, theOrder) {
        var module = 'newClientOrder';
        receivedLogger(module);
        var theUser = getTheUser(req);
        var currentGrillStatus = getTheCurrentGrillStatus(req);
        orderDB.saveNewOrder(theUser.grillName, theOrder, theUser, currentGrillStatus, errorSavingOrder, errorSavingOrder, orderSaved);

        function orderSaved(theSavedOrder) {
            consoleLogger(successLogger(module));
            res.status(200).send({
                savedOrder: theSavedOrder,
                code: 200,
                notify: true,
                type: 'success',
                msg: 'Your order has been placed'
            });
            ioJs.emitToOne('adminSocketRoom', 'newOrders', 'update now!');
        }

        function errorSavingOrder(status, err) {
            if (status == -1 || status == 0) {
                consoleLogger(errorLogger(module, 'Failed! Could not save new order', err));
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'warning',
                    msg: "Your order could not be sent. Please try again. If this problem persists, please reload this page"
                });
            }
        }
    },


    getAdminClientOrders: function (req, res, amount, skipOrders, currentOrdersToBeSkipped) {
        var module = 'getAdminClientOrders';
        receivedLogger(module);
        var theUser = getTheUser(req);
        var currentGrillStatus = getTheCurrentGrillStatus(req);

        //sort here is 1 to bring the oldest orders first
        orderDB.getAdminClientOrders(theUser.grillName, theUser, currentGrillStatus, amount, 1, skipOrders, currentOrdersToBeSkipped, error, error, success);

        function success(orders) {
            consoleLogger(successLogger(module));
            res.status(200).send({
                orders: orders
            });
        }

        function error(status, err) {
            if (status == -1 || status == 0) {
                consoleLogger(errorLogger(module, 'Failed! Could not retrieve client orders', err));
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: 'A problem has occurred. Please reload page'
                });
            }
        }
    },


    getMyRecentOrders: function (req, res) {
        var module = 'getMyRecentOrders';
        receivedLogger(module);
        var theUser = getTheUser(req);
        var currentGrillStatus = getTheCurrentGrillStatus(req);

        orderDB.getMyRecentOrders(theUser.grillName, theUser, currentGrillStatus, 10, -1, error, error, success);

        function success(myRecentOrders) {
            consoleLogger(successLogger(module));
            res.status(200).send({
                myRecentOrders: myRecentOrders
            });
        }

        function error(status, err) {
            if (status == -1) {
                consoleLogger(errorLogger(module, 'Failed! Could not get recent orders', err));
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: "A problem has occurred. Please reload the page",
                    disable: true
                });
            }
        }
    },


    markOrderAsDone: function (req, res, orderUniqueCuid, processedOrderComponents) {
        var module = 'markOrderAsDone';
        receivedLogger(module);
        var theUser = getTheUser(req);
        orderDB.markOrderAsDone(theUser.grillName, theUser, orderUniqueCuid, processedOrderComponents, error, error, success);

        function success(theUpdatedOrder) {
            consoleLogger(successLogger(module));
            res.status(200).send({
                code: 200,
                notify: true,
                type: 'success',
                msg: 'Order done'
            });
            ioJs.emitToOne(theUpdatedOrder.clientSocketRoom, 'orderStatusChange', {
                status: theUpdatedOrder.status
            });
        }

        function error(status, err) {
            if (status == -1 || status == 0) {
                consoleLogger(errorLogger(module, 'Failed! Could not get recent orders', err));
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'warning',
                    msg: "Could not mark order as done. Please try again. If problem persists, please reload this page"
                });
            }
        }
    },


    markOrderAsDeclined: function (req, res, orderUniqueCuid) {
        var module = 'markOrderAsDeclined';
        receivedLogger(module);
        var theUser = getTheUser(req);
        orderDB.markOrderAsDeclined(theUser.grillName, theUser, orderUniqueCuid, error, error, success);

        function success(theUpdatedOrder) {
            consoleLogger(successLogger(module));
            res.status(200).send({
                code: 200,
                notify: true,
                type: 'success',
                msg: 'Order declined'
            });
            ioJs.emitToOne(theUpdatedOrder.clientSocketRoom, 'orderStatusChange', {
                status: theUpdatedOrder.status
            });

        }

        function error(status, err) {
            if (status == -1 || status == 0) {
                consoleLogger(errorLogger(module, 'Failed! Could not mark order as declined', err));
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'warning',
                    msg: "Could not mark order as declined. Please try again. If problem persists, please reload this page"
                });
            }
        }
    }

};