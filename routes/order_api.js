var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;

var receivedLogger = function (module) {
    var rL = require('../functions/basic.js').receivedLogger;
    rL('order_api', module);
};

var successLogger = function (module, text) {
    var sL = require('../functions/basic.js').successLogger;
    return sL('order_api', module, text);
};
var errorLogger = function (module, text, err) {
    var eL = require('../functions/basic.js').errorLogger;
    return eL('order_api', module, text, err);
};

var userDB = require('../db/user_db.js');
var statsDB = require('../db/stats_db.js');
var order_handler = require('../handlers/order_handler.js');


module.exports = {

    newClientOrder: function (req, res) {
        var module = 'newClientOrder';
        receivedLogger(module);
        var theOrder = req.body.theOrderArray;

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    type: 'error',
                    msg: "A problem has occurred. Please reload the page",
                    reason: errorLogger(module, 'Could not retrieve user', err),
                    disable: true,
                    redirectToError: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Could not retrieve user', err));
            }
        }

        function success(theUser) {

            if (theUser.customLoggedInStatus == 1) {

                //get the current Grill Status

                function errorGrillStatus(status, err) {
                    res.status(500).send({
                        type: 'error',
                        msg: "A problem has occurred. Please reload the page",
                        reason: errorLogger(module, 'Error while retrieving stats info', err),
                        disable: true,
                        redirectToError: false,
                        redirectPage: '/error/500.html'
                    });
                    consoleLogger(errorLogger(module, 'Error while retrieving stats info', err));
                }

                function statsSuccess(currentGrillStatus) {
                    if (currentGrillStatus.grillStatus == "open") {
                        order_handler.newClientOrder(req, res, theUser, currentGrillStatus, theOrder);
                    } else {
                        res.status(500).send({
                            type: 'error',
                            msg: "The grill is currently still open. Close the grill to perform this action",
                            reason: errorLogger(module, 'Grill is not closed'),
                            disable: false,
                            redirectToError: false,
                            redirectPage: '/error/500.html'
                        });
                        consoleLogger(errorLogger(module, 'Grill is not closed'));
                    }
                }

                statsDB.getCurrentGrillStatus(theUser.grillName, theUser, errorGrillStatus, errorGrillStatus, statsSuccess);
            } else {
                res.redirect('login.html');
            }
        }

        userDB.findUser(req.user.openId, error, error, success);
    },

    getAdminClientOrders: function (req, res) {
        var module = 'getAdminClientOrders';
        receivedLogger(module);
        var amount = req.body.amount;
        var currentOrdersToBeSkipped = req.body.currentOrdersToBeSkipped;
        var skipOrders = true;

        //check to see that the currentOrdersToBeSkipped is not equal to empty []
        //this is set by a function in the client if the value is not provided
        //if so, then set skip orders to false
        if (currentOrdersToBeSkipped == []) {
            skipOrders = false;
        }


        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    type: 'error',
                    msg: "A problem has occurred. Please reload the page",
                    reason: errorLogger(module, 'Could not retrieve user', err),
                    disable: true,
                    redirectToError: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Could not retrieve user', err));
            }
        }

        function success(theUser) {
            function errorGrillStatus(status, err) {
                res.status(500).send({
                    type: 'error',
                    msg: "A problem has occurred. Please reload the page",
                    reason: errorLogger(module, 'Error while retrieving stats info', err),
                    disable: true,
                    redirectToError: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Error while retrieving stats info', err));
            }

            function statsSuccess(currentGrillStatus) {
                if (theUser.customLoggedInStatus == 1) {
                    order_handler.getAdminClientOrders(req, res, theUser, currentGrillStatus, amount, skipOrders, currentOrdersToBeSkipped);
                } else {
                    res.redirect('login.html');
                }
            }

            statsDB.getCurrentGrillStatus(theUser.grillName, theUser, errorGrillStatus, errorGrillStatus, statsSuccess);
        }

        userDB.findUser(req.user.openId, error, error, success);
    },

    getMyRecentOrders: function (req, res) {
        var module = 'getMyRecentOrders';
        receivedLogger(module);

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    type: 'error',
                    msg: "A problem has occurred. Please reload the page",
                    reason: errorLogger(module, 'Could not retrieve user', err),
                    disable: true,
                    redirectToError: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Could not retrieve user', err));
            }
        }

        function success(theUser) {

            if (theUser.customLoggedInStatus == 1) {

                //get the current Grill Status

                function errorGrillStatus(status, err) {
                    res.status(500).send({
                        type: 'error',
                        msg: "A problem has occurred. Please reload the page",
                        reason: errorLogger(module, 'Error while retrieving stats info', err),
                        disable: true,
                        redirectToError: false,
                        redirectPage: '/error/500.html'
                    });
                    consoleLogger(errorLogger(module, 'Error while retrieving stats info', err));
                }

                function statsSuccess(currentGrillStatus) {
                    order_handler.getMyRecentOrders(req, res, theUser, currentGrillStatus);
                }

                statsDB.getCurrentGrillStatus(theUser.grillName, theUser, errorGrillStatus, errorGrillStatus, statsSuccess);
            } else {
                res.redirect('login.html');
            }
        }

        userDB.findUser(req.user.openId, error, error, success);
    },


    markOrderAsDone: function (req, res) {
        var module = 'markOrderAsDone';
        receivedLogger(module);
        var orderUniqueCuid = req.body.orderUniqueCuid;
        var processedOrderComponents = req.body.processedOrderComponents;

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    type: 'error',
                    msg: "A problem has occurred. Please reload the page",
                    reason: errorLogger(module, 'Could not retrieve user', err),
                    disable: true,
                    redirectToError: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Could not retrieve user', err));
            }
        }

        function success(theUser) {

            if (theUser.customLoggedInStatus == 1 && theUser.isAdmin == 'yes') {

                //get the current Grill Status

                function errorGrillStatus(status, err) {
                    res.status(500).send({
                        type: 'error',
                        msg: "A problem has occurred. Please reload the page",
                        reason: errorLogger(module, 'Error while retrieving stats info', err),
                        disable: true,
                        redirectToError: false,
                        redirectPage: '/error/500.html'
                    });
                    consoleLogger(errorLogger(module, 'Error while retrieving stats info', err));
                }

                function statsSuccess(currentGrillStatus) {
                    order_handler.markOrderAsDone(req, res, theUser, currentGrillStatus, orderUniqueCuid, processedOrderComponents);
                }

                statsDB.getCurrentGrillStatus(theUser.grillName, theUser, errorGrillStatus, errorGrillStatus, statsSuccess);
            } else {
                res.redirect('login.html');
            }
        }

        userDB.findUser(req.user.openId, error, error, success);
    },


    markOrderAsDeclined: function (req, res) {
        var module = 'markOrderAsDeclined';
        receivedLogger(module);

        var orderUniqueCuid = req.body.orderUniqueCuid;

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    type: 'error',
                    msg: "A problem has occurred. Please reload the page",
                    reason: errorLogger(module, 'Could not retrieve user', err),
                    disable: true,
                    redirectToError: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Could not retrieve user', err));
            }
        }

        function success(theUser) {

            if (theUser.customLoggedInStatus == 1 && theUser.isAdmin == 'yes') {

                //get the current Grill Status

                function errorGrillStatus(status, err) {
                    res.status(500).send({
                        type: 'error',
                        msg: "A problem has occurred. Please reload the page",
                        reason: errorLogger(module, 'Error while retrieving stats info', err),
                        disable: true,
                        redirectToError: false,
                        redirectPage: '/error/500.html'
                    });
                    consoleLogger(errorLogger(module, 'Error while retrieving stats info', err));
                }

                function statsSuccess(currentGrillStatus) {
                    order_handler.markOrderAsDeclined(req, res, theUser, currentGrillStatus, orderUniqueCuid);
                }

                statsDB.getCurrentGrillStatus(theUser.grillName, theUser, errorGrillStatus, errorGrillStatus, statsSuccess);
            } else {
                res.redirect('login.html');
            }
        }

        userDB.findUser(req.user.openId, error, error, success);
    }
};