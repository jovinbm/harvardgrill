var basic = require('../functions/basic.js');
var ioJs = require('../functions/io.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var orderDB = require('../db/order_db.js');

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

    newClientOrder: function (req, res, theUser, currentGrillStatus, theOrder) {
        var module = 'newClientOrder';
        receivedLogger(module);

        function errorSavingOrder(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    type: 'warning',
                    msg: "Your order could not be sent. Please try again. If this problem persists, please reload this page",
                    reason: errorLogger(module, 'Could not save new order', err),
                    disable: false,
                    redirectToError: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Failed! Could not save new order', err));
            }
        }

        function orderSaved(theSavedOrder) {
            res.status(200).send({
                savedOrder: theSavedOrder
            });
            ioJs.emitToOne('adminSocketRoom', 'newOrders', 'update now!');
            consoleLogger(successLogger(module));

        }

        orderDB.saveNewOrder(theOrder, theUser, currentGrillStatus, errorSavingOrder, errorSavingOrder, orderSaved);
    },


    getAdminClientOrders: function (req, res, theUser, currentGrillStatus, amount, skipOrders, currentOrdersToBeSkipped) {
        var module = 'getAdminClientOrders';
        receivedLogger(module);

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    type: 'error',
                    msg: 'A problem has occurred. Please reload page',
                    reason: errorLogger(module, 'Could not retrieve client orders', err),
                    disable: false,
                    redirectToError: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Failed! Could not retrieve client orders', err));
            }
        }

        function success(orders) {
            res.status(200).send({
                orders: orders
            });
            consoleLogger(successLogger(module));
        }

        //sort here is 1 to bring the oldest orders first
        orderDB.getAdminClientOrders(theUser, currentGrillStatus, amount, 1, skipOrders, currentOrdersToBeSkipped, error, error, success);

    },


    getMyRecentOrders: function (req, res, theUser, currentGrillStatus) {
        var module = 'getMyRecentOrders';
        receivedLogger(module);

        function error(status, err) {
            if (status == -1) {
                res.status(500).send({
                    type: 'error',
                    msg: "A problem has occurred. Please reload the page",
                    reason: errorLogger(module, 'Could not get recent orders', err),
                    disable: true,
                    redirectToError: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Failed! Could not get recent orders', err));
            }
        }

        function success(myRecentOrders) {
            res.status(200).send({
                myRecentOrders: myRecentOrders
            });
            consoleLogger(successLogger(module));

        }

        orderDB.getMyRecentOrders(theUser, currentGrillStatus, 10, -1, error, error, success);
    },


    markOrderAsDone: function (req, res, theUser, currentGrillStatus, orderUniqueCuid, processedOrderComponents) {
        var module = 'markOrderAsDone';
        receivedLogger(module);

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    type: 'warning',
                    msg: "Could not mark order as done. Please try again. If problem persists, please reload this page",
                    reason: errorLogger(module, 'Could not mark order as done', err),
                    disable: false,
                    redirectToError: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Failed! Could not get recent orders', err));
            }
        }

        function success(theUpdatedOrder) {
            res.status(200).send({
                msg: 'markOrderAsDone success'
            });
            ioJs.emitToOne(theUpdatedOrder.clientSocketRoom, 'orderStatusChange', {
                status: theUpdatedOrder.status
            });
            consoleLogger(successLogger(module));

        }

        orderDB.markOrderAsDone(orderUniqueCuid, processedOrderComponents, error, error, success);
    },


    markOrderAsDeclined: function (req, res, theUser, currentGrillStatus, orderUniqueCuid) {
        var module = 'markOrderAsDeclined';
        receivedLogger(module);

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    type: 'warning',
                    msg: "Could not mark order as declined. Please try again. If problem persists, please reload this page",
                    reason: errorLogger(module, 'Could not mark order as declined', err),
                    disable: false,
                    redirectToError: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Failed! Could not mark order as declined', err));
            }
        }

        function success(theUpdatedOrder) {
            res.status(200).send({
                msg: 'markOrderAsDeclined success'
            });
            ioJs.emitToOne(theUpdatedOrder.clientSocketRoom, 'orderStatusChange', {
                status: theUpdatedOrder.status
            });
            consoleLogger(successLogger(module));

        }

        consoleLogger(orderUniqueCuid);

        orderDB.markOrderAsDeclined(orderUniqueCuid, error, error, success);
    }

};