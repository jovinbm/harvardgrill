var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var Stats = require("../database/stats/stats_model.js");
var Component = require("../database/order_components/component_model.js");
var cuid = require('cuid');
var qUpdates = require("./side_updates_db.js");

module.exports = {

    //gets grill status
    getCurrentGrillStatus: function (grillName, theUser, error_neg_1, error_0, success) {
        //update user's last activity
        qUpdates.userUpdateUserLastActivity(theUser.openId, error_neg_1, error_0, success2);

        function success2() {
            Stats.findOne({grillName: grillName}).exec(
                function (err, currentGrillStatus) {
                    if (err) {
                        error_neg_1(-1, err);
                    } else if (currentGrillStatus == null || currentGrillStatus == undefined) {
                        //this must still be an error since we made sure that there is a document with the given grillName
                        error_neg_1(-1, err);
                    } else {

                        //only send these details to admin
                        if (theUser.isAdmin == 'yes') {
                            //get grill-status numbers
                            qUpdates.statsGetCurrentGrillStatusNumbers(grillName, currentGrillStatus.timeUniqueCuid, error_neg_1, error_0, successFinal);

                            function successFinal(currentGrillStatusNumbers) {
                                currentGrillStatus["totalOrders"] = currentGrillStatusNumbers.totalOrders;
                                currentGrillStatus["totalProcessedOrders"] = currentGrillStatusNumbers.totalProcessedOrders;
                                currentGrillStatus["totalDeclinedOrders"] = currentGrillStatusNumbers.totalDeclinedOrders;

                                success(currentGrillStatus);
                            }
                        } else {
                            success(currentGrillStatus);
                        }
                    }
                })

        }
    },

    createGrill: function (newGrillName, theUser, error_neg_1, error_0, success) {
        //update user's last activity
        qUpdates.userUpdateUserLastActivity(theUser.openId, error_neg_1, error_0, success2);

        function success2() {
            var newGrill = new Stats({
                grillName: newGrillName
            });

            newGrill.save(function (err, savedGrill) {
                if (err) {
                    error_neg_1(-1, err);
                } else {
                    success(savedGrill);
                }
            })
        }
    },

    deleteGrill: function (grillName, theUser, error_neg_1, error_0, success) {
        //update user's last activity
        qUpdates.userUpdateUserLastActivity(theUser.openId, error_neg_1, error_0, success2);
        function success2() {
            Stats.
                find({grillName: grillName})
                .remove()
                .exec(function (err) {
                    if (err) {
                        error_neg_1(-1, err);
                    } else {
                        //don't delete the component indexes since they carry important info such as index names, calories etc
                        success();
                    }
                })
        }
    },

    checkIfGrillExists: function (grillName, theUser, error_neg_1, error_0, success) {
        //update user's last activity
        qUpdates.userUpdateUserLastActivity(theUser.openId, error_neg_1, error_0, success2);

        function success2() {
            Stats.findOne({grillName: grillName}).exec(
                function (err, theGrill) {
                    if (err) {
                        error_neg_1(-1, err);
                    } else if (theGrill == null || theGrill == undefined) {
                        //means the grill does not exist
                        success(1);
                    } else {
                        //means the grill exists
                        success(-1);
                    }
                })

        }
    },


    //gets grill status
    openGrill: function (grillName, theUser, error_neg_1, error_0, success) {
        //update user's last activity
        qUpdates.userUpdateUserLastActivity(theUser.openId, error_neg_1, error_0, success2);

        function success2() {
            Stats.findOne({grillName: grillName}).exec(
                function (err, currentGrillStatus) {
                    if (err) {
                        error_neg_1(-1, err);
                    } else if (currentGrillStatus == null || currentGrillStatus == undefined) {
                        //means the 'stats' document is not available, create it
                        error_0(0, err);
                    } else {
                        //update the document
                        currentGrillStatus.grillStatus = "open";
                        currentGrillStatus.timeUniqueCuid = cuid();
                        currentGrillStatus.save(function (err, savedCurrentGrillStatus) {
                            if (err) {
                                error_neg_1(-1, err);
                            } else {
                                success(savedCurrentGrillStatus);
                            }
                        });
                    }
                })
        }
    },


    //gets grill status
    closeGrill: function (grillName, theUser, error_neg_1, error_0, success) {
        //update user's last activity
        qUpdates.userUpdateUserLastActivity(theUser.openId, error_neg_1, error_0, success2);

        function success2() {
            Stats.findOne({grillName: grillName}).exec(
                function (err, currentGrillStatus) {
                    if (err) {
                        error_neg_1(-1, err);
                    } else if (currentGrillStatus == null || currentGrillStatus == undefined) {
                        //means the 'stats' document is not available, create it
                        error_0(0, err);
                    } else {
                        //update the document
                        currentGrillStatus.grillStatus = "closed";
                        currentGrillStatus.save(function (err, savedCurrentGrillStatus) {
                            if (err) {
                                error_neg_1(-1, err);
                            } else {
                                success(savedCurrentGrillStatus);
                            }
                        });
                    }
                })
        }
    }

};