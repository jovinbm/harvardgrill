var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var cuid = require('cuid');
var Stats = require("../database/stats/stats_model.js");

var receivedLogger = function (module) {
    var rL = require('../functions/basic.js').receivedLogger;
    rL('login_api', module);
};

var successLogger = function (module, text) {
    var sL = require('../functions/basic.js').successLogger;
    return sL('login_api', module, text);
};
var errorLogger = function (module, text, err) {
    var eL = require('../functions/basic.js').errorLogger;
    return eL('login_api', module, text, err);
};

function getTemporarySocketRoom(req, res) {
    var module = 'getTemporarySocketRoom';
    receivedLogger(module);
    var temporarySocketRoom = cuid();

    consoleLogger(temporarySocketRoom);
    res.status(200).send({
        temporarySocketRoom: temporarySocketRoom
    });
    consoleLogger(successLogger(module));

}

function getAllGrillStatuses(error_neg_1, error_0, success) {

    //count the number available
    Stats
        .count()
        .exec(function (err, total) {
            if (err) {
                error_neg_1(-1, err);
            } else {
                if (total == 0) {

                    //there is no grill added, send empty result
                    var allGrillStatuses = [];
                    success(allGrillStatuses);
                } else {
                    //find and return the required
                    Stats.find({}).exec(
                        function (err, allGrillStatuses) {
                            if (err) {
                                error_neg_1(-1, err);
                            } else if (allGrillStatuses == null || allGrillStatuses == undefined) {

                                //this must still be an error since we made sure that there is a document with the given grillName
                                error_neg_1(-1, err);
                            } else {
                                success(allGrillStatuses);
                            }
                        })
                }
            }
        })
}


module.exports = {

    getTemporarySocketRoom: function (req, res) {
        getTemporarySocketRoom(req, res);

    },


    adminLoginStartUp: function (req, res) {
        var module = 'adminStartUp';
        receivedLogger(module);

        function errorAllGrillStatus(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: 'An error occurred. Please reload this page',
                    reason: errorLogger(module, 'Could not retrieve allGrillStatuses', err),
                    disable: true,
                    redirect: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Could not retrieve allGrillStatuses', err));
            }
        }

        function success(allGrillStatuses) {
            res.status(200).send({
                allGrillStatuses: allGrillStatuses
            });
            consoleLogger(successLogger(module));
        }

        getAllGrillStatuses(errorAllGrillStatus, errorAllGrillStatus, success);
    },

    getAllGrillStatuses: function (req, res) {
        function errorAllGrillStatus(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: 'An error occurred. Please reload this page',
                    reason: errorLogger(module, 'Could not retrieve allGrillStatuses', err),
                    disable: true,
                    redirect: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Could not retrieve allGrillStatuses', err));
            }
        }

        function success(allGrillStatuses) {
            res.status(200).send({
                allGrillStatuses: allGrillStatuses
            });
            consoleLogger(successLogger(module));
        }

        getAllGrillStatuses(errorAllGrillStatus, errorAllGrillStatus, success)
    }
};