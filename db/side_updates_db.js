var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var User = require("../database/users/user_model.js");
var Stats = require("../database/stats/stats_model.js");
var Component = require("../database/order_components/component_model.js");
var Order = require("../database/orders/order_model.js");
var cuid = require('cuid');

var receivedLogger = function (module) {
    var rL = require('../functions/basic.js').receivedLogger;
    rL('side_updates_db', module);
};

var successLogger = function (module, text) {
    var sL = require('../functions/basic.js').successLogger;
    return sL('side_updates_db', module, text);
};

var errorLogger = function (module, text, err) {
    var eL = require('../functions/basic.js').errorLogger;
    return eL('side_updates_db', module, text, err);
};


function statsGetCurrentGrillStatusNumbers(grillName, timeUniqueCuid, error_neg_1, error_0, success) {
    var totalOrders = 0;
    var totalProcessedOrders = 0;
    var totalDeclinedOrders = 0;

    //count the number available
    //the getCurrentGrillStatus in stats_db will have created the named grill if it was not available

    //get the total orders first
    Order
        .count({
            grillName: grillName,
            timeUniqueCuid: timeUniqueCuid
        })
        .exec(function (err, total) {
            if (err) {
                error_neg_1(-1, err);
            } else {
                totalOrders = total;
                success2();
            }
        });

    function success2() {
        //get the total processed orders
        Order
            .count({
                grillName: grillName,
                timeUniqueCuid: timeUniqueCuid,
                status: 'done'
            })
            .exec(function (err, total) {
                if (err) {
                    error_neg_1(-1, err);
                } else {
                    totalProcessedOrders = total;
                    success3();
                }
            });
    }

    function success3() {
        //get the total declined orders
        Order
            .count({
                grillName: grillName,
                timeUniqueCuid: timeUniqueCuid,
                status: 'declined'
            })
            .exec(function (err, total) {
                if (err) {
                    error_neg_1(-1, err);
                } else {
                    totalDeclinedOrders = total;
                    success4();
                }
            });
    }

    function success4() {
        //set everything up and return
        var temp = {};
        temp.totalOrders = totalOrders;
        temp.totalProcessedOrders = totalProcessedOrders;
        temp.totalDeclinedOrders = totalDeclinedOrders;

        success(temp);
    }
}


function userUpdateUserLastActivity(openId, error_neg_1, error_0, success) {
    User.update({openId: openId}, {
            $currentDate: {
                lastActivity: true
            }
        }, function (err) {
            if (err) {
                error_neg_1(-1, err);
            } else {
                if (success) {
                    success();
                }
            }
        }
    )
}

function userUpdateUserTotalUnattendedOrders(openId, error_neg_1, error_0, success) {
    User.update({openId: openId}, {
            $inc: {totalUnattendedOrders: -1}
        }, function (err) {
            if (err) {
                error_neg_1(-1, err);
            } else {
                if (success) {
                    success();
                }
            }
        }
    )
}


function componentUpdateComponentTotalOrdersAndLastOrderTime(grillName, componentIndex, error_neg_1, error_0, success) {
    Component.update({
            grillName: grillName,
            componentIndex: componentIndex
        }, {
            $inc: {
                totalOrders: 1
            },
            $currentDate: {
                lastOrderTime: true
            }
        }, function (err) {
            if (err) {
                error_neg_1(-1, err);
            } else {
                if (success) {
                    success();
                }
            }
        }
    )
}

function componentUpdateComponentRates(grillName, componentIndex, amount, error_neg_1, error_0, success) {
    //the amount is the total stars awarded out of five
    Component.update({
            grillName: grillName,
            componentIndex: componentIndex
        }, {
            $inc: {
                totalRates: 1,
                rateSum: amount
            }
        }, function (err) {
            if (err) {
                error_neg_1(-1, err);
            } else {
                if (success) {
                    success();
                }
            }
        }
    )
}

module.exports = {

    statsGetCurrentGrillStatusNumbers: function (grillName, timeUniqueCuid, error_neg_1, error_0, success) {
        statsGetCurrentGrillStatusNumbers(grillName, timeUniqueCuid, error_neg_1, error_0, success);
    },

    userUpdateUserLastActivity: function (openId, error_neg_1, error_0, success) {
        userUpdateUserLastActivity(openId, error_neg_1, error_0, success);
    },

    userUpdateUserTotalUnattendedOrders: function (openId, error_neg_1, error_0, success) {
        userUpdateUserTotalUnattendedOrders(openId, error_neg_1, error_0, success);
    },

    componentUpdateComponentTotalOrdersAndLastOrderTime: function (grillName, componentIndex, error_neg_1, error_0, success) {
        componentUpdateComponentTotalOrdersAndLastOrderTime(grillName, componentIndex, error_neg_1, error_0, success);
    },

    componentUpdateComponentRates: function (grillName, componentIndex, amount, error_neg_1, error_0, success) {
        componentUpdateComponentRates(grillName, componentIndex, amount, error_neg_1, error_0, success);
    }

};