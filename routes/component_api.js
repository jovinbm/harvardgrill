var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;

var receivedLogger = function (module) {
    var rL = require('../functions/basic.js').receivedLogger;
    rL('component_api', module);
};

var successLogger = function (module, text) {
    var sL = require('../functions/basic.js').successLogger;
    return sL('component_api', module, text);
};
var errorLogger = function (module, text, err) {
    var eL = require('../functions/basic.js').errorLogger;
    return eL('component_api', module, text, err);
};

var userDB = require('../db/user_db.js');
var statsDB = require('../db/stats_db.js');
var component_handler = require('../handlers/component_handler.js');


module.exports = {

    addComponent: function (req, res) {

        var module = 'addComponent';
        receivedLogger(module);
        var theComponent = req.body.theComponentObject;

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: "A problem has occurred. Please reload the page",
                    reason: errorLogger(module, 'Could not retrieve user', err),
                    disable: true,
                    redirect: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Could not retrieve user', err));
            }
        }

        function success(theUser) {

            if (theUser.customLoggedInStatus == 1 && theUser.isAdmin == 'yes') {

                function errorGrillStatus(status, err) {
                    res.status(500).send({
                        code: 500,
                        notify: true,
                        type: 'error',
                        msg: "A problem has occurred. Please reload the page",
                        reason: errorLogger(module, 'Error while retrieving stats info', err),
                        disable: true,
                        redirect: false,
                        redirectPage: '/error/500.html'
                    });
                    consoleLogger(errorLogger(module, 'Error while retrieving stats info', err));
                }

                function statsSuccess(currentGrillStatus) {
                    if (currentGrillStatus.grillStatus == "closed") {
                        component_handler.addComponent(req, res, theUser, currentGrillStatus, theComponent);
                    } else {
                        res.status(500).send({
                            code: 500,
                            notify: true,
                            type: 'error',
                            msg: "The grill is currently still open. Close the grill to perform this action",
                            reason: errorLogger(module, 'Grill is not closed'),
                            disable: false,
                            redirect: false,
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


    saveEditedComponent: function (req, res) {

        var module = 'saveEditedComponent';
        receivedLogger(module);
        var theComponent = req.body;

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: "A problem has occurred. Please reload the page",
                    reason: errorLogger(module, 'Could not retrieve user', err),
                    disable: true,
                    redirect: false,
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
                        code: 500,
                        notify: true,
                        type: 'error',
                        msg: "A problem has occurred. Please reload the page",
                        reason: errorLogger(module, 'Error while retrieving stats info', err),
                        disable: true,
                        redirect: false,
                        redirectPage: '/error/500.html'
                    });
                    consoleLogger(errorLogger(module, 'Error while retrieving stats info', err));
                }

                function statsSuccess(currentGrillStatus) {
                    if (currentGrillStatus.grillStatus == "closed") {
                        component_handler.saveEditedComponent(req, res, theUser, currentGrillStatus, theComponent);
                    } else {
                        res.status(500).send({
                            code: 500,
                            notify: true,
                            type: 'error',
                            msg: "The grill is currently still open. Close the grill to perform this action",
                            reason: errorLogger(module, 'Grill is not closed'),
                            disable: false,
                            redirect: false,
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


    deleteComponent: function (req, res) {

        var module = 'deleteComponent';
        receivedLogger(module);
        var componentIndex = req.body.componentIndex;

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: "A problem has occurred. Please reload the page",
                    reason: errorLogger(module, 'Could not retrieve user', err),
                    disable: true,
                    redirect: false,
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
                        code: 500,
                        notify: true,
                        type: 'error',
                        msg: "A problem has occurred. Please reload the page",
                        reason: errorLogger(module, 'Error while retrieving stats info', err),
                        disable: true,
                        redirect: false,
                        redirectPage: '/error/500.html'
                    });
                    consoleLogger(errorLogger(module, 'Error while retrieving stats info', err));
                }

                function statsSuccess(currentGrillStatus) {
                    if (currentGrillStatus.grillStatus == "closed") {
                        component_handler.deleteComponent(req, res, theUser, currentGrillStatus, componentIndex);
                    } else {
                        res.status(500).send({
                            code: 500,
                            notify: true,
                            type: 'error',
                            msg: "The grill is currently still open. Close the grill to perform this action",
                            reason: errorLogger(module, 'Grill is not closed'),
                            disable: false,
                            redirect: false,
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

    getAllOrderComponents: function (req, res) {
        var module = 'getAllOrderComponents';
        receivedLogger(module);

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: "A problem has occurred. Please reload the page",
                    reason: errorLogger(module, 'Could not retrieve user', err),
                    disable: true,
                    redirect: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Could not retrieve user', err));
            }
        }

        function success(theUser) {

            if (theUser.customLoggedInStatus == 1) {
                component_handler.getAllOrderComponents(req, res, theUser);
            } else {
                res.redirect('login.html');
            }
        }

        userDB.findUser(req.user.openId, error, error, success);
    },

    getAllOmelets: function (req, res) {
        var module = 'getAllOmelets';
        receivedLogger(module);

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: "A problem has occurred. Please reload the page",
                    reason: errorLogger(module, 'Could not retrieve user', err),
                    disable: true,
                    redirect: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Could not retrieve user', err));
            }
        }

        function success(theUser) {

            if (theUser.customLoggedInStatus == 1) {
                component_handler.getAllOmelets(req, res, theUser);
            } else {
                res.redirect('login.html');
            }
        }

        userDB.findUser(req.user.openId, error, error, success);
    },


    getAllWeeklySpecials: function (req, res) {
        var module = 'getAllWeeklySpecials';
        receivedLogger(module);

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: "A problem has occurred. Please reload the page",
                    reason: errorLogger(module, 'Could not retrieve user', err),
                    disable: true,
                    redirect: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Could not retrieve user', err));
            }
        }

        function success(theUser) {

            if (theUser.customLoggedInStatus == 1) {
                component_handler.getAllWeeklySpecials(req, res, theUser);
            } else {
                res.redirect('login.html');
            }
        }

        userDB.findUser(req.user.openId, error, error, success);
    },


    getAllExtras: function (req, res) {
        var module = 'getAllExtras';
        receivedLogger(module);

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: "A problem has occurred. Please reload the page",
                    reason: errorLogger(module, 'Could not retrieve user', err),
                    disable: true,
                    redirect: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Could not retrieve user', err));
            }
        }

        function success(theUser) {

            if (theUser.customLoggedInStatus == 1) {
                component_handler.getAllExtras(req, res, theUser);
            } else {
                res.redirect('login.html');
            }
        }

        userDB.findUser(req.user.openId, error, error, success);
    },


    getAvailableOrderComponents: function (req, res) {
        var module = 'getAvailableOrderComponents';
        receivedLogger(module);

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: "A problem has occurred. Please reload the page",
                    reason: errorLogger(module, 'Could not retrieve user', err),
                    disable: true,
                    redirect: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Could not retrieve user', err));
            }
        }

        function success(theUser) {

            if (theUser.customLoggedInStatus == 1) {
                component_handler.getAvailableOrderComponents(req, res, theUser);
            } else {
                res.redirect('login.html')
            }
        }

        userDB.findUser(req.user.openId, error, error, success);
    },

    getAvailableOmelets: function (req, res) {
        var module = 'getAvailableOmelets';
        receivedLogger(module);

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: "A problem has occurred. Please reload the page",
                    reason: errorLogger(module, 'Could not retrieve user', err),
                    disable: true,
                    redirect: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Could not retrieve user', err));
            }
        }

        function success(theUser) {

            if (theUser.customLoggedInStatus == 1) {
                component_handler.getAvailableOmelets(req, res, theUser);
            } else {
                res.redirect('login.html')
            }
        }

        userDB.findUser(req.user.openId, error, error, success);
    },


    getAvailableWeeklySpecials: function (req, res) {
        var module = 'getAvailableWeeklySpecials';
        receivedLogger(module);

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: "A problem has occurred. Please reload the page",
                    reason: errorLogger(module, 'Could not retrieve user', err),
                    disable: true,
                    redirect: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Could not retrieve user', err));
            }
        }

        function success(theUser) {

            if (theUser.customLoggedInStatus == 1) {
                component_handler.getAvailableWeeklySpecials(req, res, theUser);
            } else {
                res.redirect('login.html');
            }
        }

        userDB.findUser(req.user.openId, error, error, success);
    },


    getAvailableExtras: function (req, res) {
        var module = 'getAvailableExtras';
        receivedLogger(module);

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: "A problem has occurred. Please reload the page:",
                    reason: errorLogger(module, 'Could not retrieve user', err),
                    disable: true,
                    redirect: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Could not retrieve user', err));
            }
        }

        function success(theUser) {

            if (theUser.customLoggedInStatus == 1) {
                component_handler.getAvailableExtras(req, res, theUser);
            } else {
                res.redirect('login.html');
            }
        }

        userDB.findUser(req.user.openId, error, error, success);
    }

};