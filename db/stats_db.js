var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var Stats = require("../database/stats/stats_model.js");

module.exports = {

    //gets grill status
    getCurrentGrillStatus: function (name, error_neg_1, error_0, success) {
        Stats.findOne({name: name}).exec(
            function (err, currentGrillStatus) {
                if (err) {
                    error_neg_1(-1, err);
                } else if (currentGrillStatus == null || currentGrillStatus == undefined) {

                    //means the 'stats' document is not available, create it
                    error_0(0, err);

                    var newStats = new Stats({
                        name: name
                    });
                    newStats.save(function (err, newCurrentGrillStatus) {
                        if (err) {
                            error_neg_1(-1, err);
                        } else {
                            success(newCurrentGrillStatus);
                        }
                    });
                } else {
                    success(currentGrillStatus);
                }
            }
        )
    },


    //gets grill status
    openGrill: function (name, error_neg_1, error_0, success) {
        Stats.findOne({name: name}).exec(
            function (err, currentGrillStatus) {
                if (err) {
                    error_neg_1(-1, err);
                } else if (currentGrillStatus == null || currentGrillStatus == undefined) {
                    //means the 'stats' document is not available, create it
                    error_0(0, err);
                } else {
                    //update the document
                    currentGrillStatus.grillStatus = "open";
                    currentGrillStatus.save(function (err, savedCurrentGrillStatus) {
                        if (err) {
                            error_neg_1(-1, err);
                        } else {
                            success(savedCurrentGrillStatus);
                        }
                    });
                }
            }
        )
    },


    //gets grill status
    closeGrill: function (name, error_neg_1, error_0, success) {
        Stats.findOne({name: name}).exec(
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
            }
        )
    }

};