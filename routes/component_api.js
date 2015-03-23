var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var userDB = require('../db/user_db.js');
var statsDB = require('../db/stats_db.js');
var component_handler = require('../handlers/component_handler.js');


module.exports = {

    addComponent: function (req, res) {

        var theComponent = req.body;

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    msg: "ERROR: addOrderComponentAPI: Could not retrieve user:"
                });
                consoleLogger("ERROR: addOrderComponentAPI: Could not retrieve user: " + err);
            }
        }

        function success(theUser) {

            if (theUser.customLoggedInStatus == 1) {
                //get the current Grill Status

                function error(status, err) {
                    res.status(500).send({
                        msg: 'getCurrentGrillStatus in addComponent: Error while retrieving stats info',
                        err: err
                    });
                    consoleLogger("getCurrentGrillStatus in addComponent: failed! Error while retrieving stats info: err = " + err);
                }

                function statsSuccess(currentGrillStatus) {
                    if (currentGrillStatus.grillStatus == "closed") {
                        component_handler.addComponent(req, res, theUser, currentGrillStatus, theComponent);
                    } else {
                        res.status(500).send({
                            msg: 'getCurrentGrillStatus in addComponentAPI: GRILL NOT CLOSED'
                        });
                        consoleLogger("getCurrentGrillStatus in addComponentAPI: FAILED! GRILL NOT CLOSED");
                    }
                }

                statsDB.getCurrentGrillStatus("stats", error, error, statsSuccess);
            }
            //TODO -- redirect to custom login
        }

        userDB.findUser(req.user.openId, error, error, success);
    },


    saveEditedComponent: function (req, res) {

        var theComponent = req.body;

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    msg: "ERROR: saveEditedComponentAPI: Could not retrieve user:"
                });
                consoleLogger("ERROR: saveEditedComponentAPI: Could not retrieve user: " + err);
            }
        }

        function success(theUser) {

            if (theUser.customLoggedInStatus == 1) {
                //get the current Grill Status

                function error(status, err) {
                    res.status(500).send({
                        msg: 'getCurrentGrillStatus in saveEditedComponent: Error while retrieving stats info',
                        err: err
                    });
                    consoleLogger("getCurrentGrillStatus in saveEditedComponent: failed! Error while retrieving stats info: err = " + err);
                }

                function statsSuccess(currentGrillStatus) {
                    if (currentGrillStatus.grillStatus == "closed") {
                        component_handler.saveEditedComponent(req, res, theUser, currentGrillStatus, theComponent);
                    } else {
                        res.status(500).send({
                            msg: 'getCurrentGrillStatus in addComponentAPI: GRILL NOT CLOSED'
                        });
                        consoleLogger("getCurrentGrillStatus in addComponentAPI: FAILED! GRILL NOT CLOSED");
                    }
                }

                statsDB.getCurrentGrillStatus("stats", error, error, statsSuccess);
            }
            //TODO -- redirect to custom login
        }

        userDB.findUser(req.user.openId, error, error, success);
    },


    deleteComponent: function (req, res) {

        var componentIndex = req.body.componentIndex;

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    msg: "ERROR: deleteComponentAPI: Could not retrieve user:"
                });
                consoleLogger("ERROR: deleteComponentAPI: Could not retrieve user: " + err);
            }
        }

        function success(theUser) {

            if (theUser.customLoggedInStatus == 1) {
                //get the current Grill Status

                function error(status, err) {
                    res.status(500).send({
                        msg: 'getCurrentGrillStatus in deleteComponent: Error while retrieving stats info',
                        err: err
                    });
                    consoleLogger("getCurrentGrillStatus in deleteComponent: failed! Error while retrieving stats info: err = " + err);
                }

                function statsSuccess(currentGrillStatus) {
                    if (currentGrillStatus.grillStatus == "closed") {
                        component_handler.deleteComponent(req, res, theUser, currentGrillStatus, componentIndex);
                    } else {
                        res.status(500).send({
                            msg: 'getCurrentGrillStatus in deleteComponentAPI: GRILL NOT CLOSED'
                        });
                        consoleLogger("getCurrentGrillStatus in deleteComponentAPI: FAILED! GRILL NOT CLOSED");
                    }
                }

                statsDB.getCurrentGrillStatus("stats", error, error, statsSuccess);
            }
            //TODO -- redirect to custom login
        }

        userDB.findUser(req.user.openId, error, error, success);
    },

    getAllOrderComponents: function (req, res) {
        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    msg: "ERROR: getAllOrderComponentsAPI: Could not retrieve user:"
                });
                consoleLogger("ERROR: getAllOrderComponentsAPI: Could not retrieve user: " + err);
            }
        }

        function success(theUser) {

            if (theUser.customLoggedInStatus == 1) {
                component_handler.getAllOrderComponents(req, res, theUser);
            }
            //TODO -- redirect to custom login
        }

        userDB.findUser(req.user.openId, error, error, success);
    },

    getAllOmelets: function (req, res) {
        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    msg: "ERROR: getAllOmeletsAPI: Could not retrieve user:"
                });
                consoleLogger("ERROR: getAllOmeletsAPI: Could not retrieve user: " + err);
            }
        }

        function success(theUser) {

            if (theUser.customLoggedInStatus == 1) {
                component_handler.getAllOmelets(req, res, theUser);
            }
            //TODO -- redirect to custom login
        }

        userDB.findUser(req.user.openId, error, error, success);
    },


    getAllWeeklySpecials: function (req, res) {
        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    msg: "ERROR: getAllWeeklySpecials: Could not retrieve user:"
                });
                consoleLogger("ERROR: getAllWeeklySpecials: Could not retrieve user: " + err);
            }
        }

        function success(theUser) {

            if (theUser.customLoggedInStatus == 1) {
                component_handler.getAllWeeklySpecials(req, res, theUser);
            }
            //TODO -- redirect to custom login
        }

        userDB.findUser(req.user.openId, error, error, success);
    },


    getAllExtras: function (req, res) {
        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    msg: "ERROR: getAllExtras: Could not retrieve user:"
                });
                consoleLogger("ERROR: getAllExtras: Could not retrieve user: " + err);
            }
        }

        function success(theUser) {

            if (theUser.customLoggedInStatus == 1) {
                component_handler.getAllExtras(req, res, theUser);
            }
            //TODO -- redirect to custom login
        }

        userDB.findUser(req.user.openId, error, error, success);
    },


    getAvailableOrderComponents: function (req, res) {
        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    msg: "ERROR: getAvailableOrderComponentsAPI: Could not retrieve user:"
                });
                consoleLogger("ERROR: getAvailableOrderComponentsAPI: Could not retrieve user: " + err);
            }
        }

        function success(theUser) {

            if (theUser.customLoggedInStatus == 1) {
                component_handler.getAvailableOrderComponents(req, res, theUser);
            }
            //TODO -- redirect to custom login
        }

        userDB.findUser(req.user.openId, error, error, success);
    },

    getAvailableOmelets: function (req, res) {
        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    msg: "ERROR: getAvailableOmeletsAPI: Could not retrieve user:"
                });
                consoleLogger("ERROR: getAvailableOmeletsAPI: Could not retrieve user: " + err);
            }
        }

        function success(theUser) {

            if (theUser.customLoggedInStatus == 1) {
                component_handler.getAvailableOmelets(req, res, theUser);
            }
            //TODO -- redirect to custom login
        }

        userDB.findUser(req.user.openId, error, error, success);
    },


    getAvailableWeeklySpecials: function (req, res) {
        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    msg: "ERROR: getAvailableWeeklySpecials: Could not retrieve user:"
                });
                consoleLogger("ERROR: getAvailableWeeklySpecials: Could not retrieve user: " + err);
            }
        }

        function success(theUser) {

            if (theUser.customLoggedInStatus == 1) {
                component_handler.getAvailableWeeklySpecials(req, res, theUser);
            }
            //TODO -- redirect to custom login
        }

        userDB.findUser(req.user.openId, error, error, success);
    },


    getAvailableExtras: function (req, res) {
        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    msg: "ERROR: getAvailableExtras: Could not retrieve user:"
                });
                consoleLogger("ERROR: getAvailableExtras: Could not retrieve user: " + err);
            }
        }

        function success(theUser) {

            if (theUser.customLoggedInStatus == 1) {
                component_handler.getAvailableExtras(req, res, theUser);
            }
            //TODO -- redirect to custom login
        }

        userDB.findUser(req.user.openId, error, error, success);
    }
    
    
};