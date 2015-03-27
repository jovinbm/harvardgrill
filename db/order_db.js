var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var Order = require("../database/orders/order_model.js");
var cuid = require('cuid');

module.exports = {

    saveNewOrder: function (theOrder, theUser, currentGrillStatus, error_neg_1, error_0, success) {
        var newCuid = cuid();

        var newOrder = new Order({
            orderUniqueCuid: newCuid,
            timeUniqueCuid: currentGrillStatus.timeUniqueCuid,
            //orderIndex taken care of by autoIncrement plugin
            clientName: theUser.customUsername,
            clientDisplayName: theUser.displayName,
            clientUniqueCuid: theUser.uniqueCuid,
            clientSocketRoom: theUser.socketRoom,
            //orderTime: default is date.now
            //readyTime: updated when ready
            //declineTime: updated when declined
            //status: default is processing
            orderComponents: theOrder
            //processedComponents: Default is [], updated when processed
        });

        newOrder.save(function (err, theSavedOrder) {
            if (err) {
                error_neg_1(-1, err);
            } else {
                success(theSavedOrder);
            }
        });
    },


    getMyRecentOrders: function (theUser, currentGrillStatus, amount, sort, error_neg_1, error_0, success) {
        Order
            .find({clientUniqueCuid: theUser.uniqueCuid, timeUniqueCuid: currentGrillStatus.timeUniqueCuid})
            .sort({orderIndex: sort})
            .limit(amount)
            .exec(function (err, orders) {
                if (err) {
                    error_neg_1(-1, err);
                } else if (orders == null || orders == undefined || orders.length == 0) {
                    orders = [];
                    success(orders);
                } else {
                    success(orders);
                }
            });
    },

    getAdminClientOrders: function (theUser, currentGrillStatus, amount, sort, skipOrders, currentOrdersToBeSkipped, error_neg_1, error_0, success) {
        if (skipOrders == false) {
            Order
                .find({timeUniqueCuid: currentGrillStatus.timeUniqueCuid, status: 'processing'})
                .sort({orderTime: sort})
                .limit(amount)
                .exec(function (err, orders) {
                    if (err) {
                        error_neg_1(-1, err);
                    } else if (orders == null || orders == undefined || orders.length == 0) {
                        orders = [];
                        success(orders);
                    } else {
                        success(orders);
                    }
                });
        } else {
            Order
                .find({
                    timeUniqueCuid: currentGrillStatus.timeUniqueCuid,
                    status: 'processing',
                    orderIndex: {$nin: currentOrdersToBeSkipped}
                })
                .sort({orderTime: sort})
                .limit(amount)
                .exec(function (err, orders) {
                    if (err) {
                        error_neg_1(-1, err);
                    } else if (orders == null || orders == undefined || orders.length == 0) {
                        orders = [];
                        success(orders);
                    } else {
                        success(orders);
                    }
                });
        }
    },

    markOrderAsDone: function (orderUniqueCuid, processedOrderComponents, error_neg_1, error_0, success) {
        Order
            .find({orderUniqueCuid: orderUniqueCuid})
            .limit(1)
            .exec(function (err, order) {
                if (err) {
                    error_neg_1(-1, err);
                } else if (order == null || order == undefined || order.length == 0) {
                    error_neg_1(0, err);
                } else {
                    //this gets an array with one order object in it
                    //we want the order[0]
                    order = order[0];
                    order.processedOrderComponents = processedOrderComponents;
                    order.readyTime = new Date();
                    order.status = 'done';

                    order.save(function (err, theUpdateOrder) {
                        if (err) {
                            error_neg_1(-1, err);
                        } else {
                            success(theUpdateOrder);
                        }
                    });
                }
            });
    },


    markOrderAsDeclined: function (orderUniqueCuid, error_neg_1, error_0, success) {
        Order
            .find({orderUniqueCuid: orderUniqueCuid})
            .limit(1)
            .exec(function (err, order) {
                if (err) {
                    error_neg_1(-1, err);
                } else if (order == null || order == undefined || order.length == 0) {
                    error_neg_1(0, err);
                } else {
                    //this gets an array with one order object in it
                    //we want the order[0]
                    order = order[0];
                    order.processedOrderComponents = [];
                    order.declineTime = new Date();
                    order.status = 'declined';

                    order.save(function (err, theUpdatedOrder) {
                        if (err) {
                            error_neg_1(-1, err);
                        } else {
                            success(theUpdatedOrder);
                        }
                    });
                }
            });
    }

};