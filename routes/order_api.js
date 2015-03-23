var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var userDB = require('../db/user_db.js');
var statsDB = require('../db/stats_db.js');
var order_handler = require('../handlers/order_handler.js');


module.exports = {

    newClientOrder: function (req, res) {

        var theOrder = req.body.theOrderArray;

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    msg: "ERROR: newClientOrderAPI: Could not retrieve user:"
                });
                consoleLogger("ERROR: newClientOrderAPI: Could not retrieve user: " + err);
            }
        }

        function success(theUser) {

            if (theUser.customLoggedInStatus == 1) {

                //get the current Grill Status

                function error(status, err) {
                    res.status(500).send({
                        msg: 'A fatal error has occurred. Please reload the page',
                        err: err
                    });
                    consoleLogger("order_api: getCurrentGrillStatus in newClientOrder: failed! Error while retrieving stats info: err = " + err);
                }

                function statsSuccess(currentGrillStatus) {
                    if (currentGrillStatus.grillStatus == "open") {
                        order_handler.newClientOrder(req, res, theUser, currentGrillStatus, theOrder);
                    } else {
                        res.status(500).send({
                            msg: 'Sorry, the grill is closed'
                        });
                        consoleLogger("order_api: getCurrentGrillStatus in newClientOrder: FAILED! CLOSED");
                    }
                }

                statsDB.getCurrentGrillStatus("stats", error, error, statsSuccess);
            }
            //TODO -- redirect to custom login
        }

        userDB.findUser(req.user.openId, error, error, success);
    },

    getMyRecentOrders: function (req, res) {

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    msg: "A fatal error has occurred. Please reload the page"
                });
                consoleLogger("ERROR: getMyRecentOrdersAPI: Could not retrieve user: " + err);
            }
        }

        function success(theUser) {

            if (theUser.customLoggedInStatus == 1) {

                //get the current Grill Status

                function error(status, err) {
                    res.status(500).send({
                        msg: 'A fatal error has occurred. Please reload the page',
                        err: err
                    });
                    consoleLogger("order_api: getCurrentGrillStatus in getMyRecentOrders: failed! Error while retrieving stats info: err = " + err);
                }

                function statsSuccess(currentGrillStatus) {
                    order_handler.getMyRecentOrders(req, res, theUser, currentGrillStatus);

                }

                statsDB.getCurrentGrillStatus("stats", error, error, statsSuccess);
            }
            //TODO -- redirect to custom login
        }

        userDB.findUser(req.user.openId, error, error, success);
    }
};