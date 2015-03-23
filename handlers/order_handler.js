var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var statsDB = require('../db/stats_db.js');
var componentDB = require('../db/component_db.js');
var orderDB = require('../db/order_db.js');

module.exports = {

    newClientOrder: function (req, res, theUser, currentGrillStatus, theOrder) {
        basic.consoleLogger('order_handler: newClientOrder event received');

        function errorSavingOrder(status, err) {
            if (status == -1 || status == 0) {
                consoleLogger("order_handler: newClientOrder: Error executing db operations: err = " + err);
                res.status(500).send({
                    msg: 'Error occurred while sending order. Please try again',
                    err: err
                });
            }
        }

        function orderSaved(theSavedOrder) {
            res.status(200).send({
                savedOrder: theSavedOrder,
                msg: 'Your order is on queue. Please check your order card for an updated status'
            });
            consoleLogger("newClientOrder: Success");

        }

        orderDB.saveNewOrder(theOrder, theUser, currentGrillStatus, errorSavingOrder, errorSavingOrder, orderSaved);
    },


    getMyRecentOrders: function (req, res, theUser, currentGrillStatus) {
        basic.consoleLogger('order_handler: getMyRecentOrders event received');

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    msg: 'A fatal error has occurred. Please reload the page',
                    err: err
                });
            }
            consoleLogger("order_handler: getMyRecentOrders: Error executing db operations: err = " + err);
        }

        function success(myRecentOrders) {
            res.status(200).send({
                myRecentOrders: myRecentOrders
            });
            consoleLogger("getMyRecentOrders: Success");

        }

        orderDB.getMyRecentOrders(theUser, currentGrillStatus, 10, -1, error, error, success);
    }

};