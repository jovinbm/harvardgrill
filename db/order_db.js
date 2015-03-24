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
            clientEmail: theUser.email,
            clientUniqueCuid: theUser.uniqueCuid,
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
            .sort({componentIndex: sort})
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

    getAdminClientOrders: function (theUser, currentGrillStatus, amount, sort, error_neg_1, error_0, success) {
        Order
            .find({timeUniqueCuid: currentGrillStatus.timeUniqueCuid})
            .sort({componentIndex: sort})
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

};