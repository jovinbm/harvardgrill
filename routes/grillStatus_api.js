var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;

var receivedLogger = function (module) {
    var rL = require('../functions/basic.js').receivedLogger;
    rL('grillStatus_api', module);
};

var successLogger = function (module, text) {
    var sL = require('../functions/basic.js').successLogger;
    return sL('grillStatus_api', module, text);
};
var errorLogger = function (module, text, err) {
    var eL = require('../functions/basic.js').errorLogger;
    return eL('grillStatus_api', module, text, err);
};

var grillStatus_handler = require('../handlers/grillStatus_handler.js');
var userDB = require('../db/user_db.js');
var statsDB = require('../db/stats_db.js');
var componentDB = require('../db/component_db.js');


module.exports = {

    openGrill: function (req, res) {
        var module = 'openGrill';
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
                grillStatus_handler.openGrill(req, res, theUser);
            } else {
                res.redirect('login.html')
            }
        }

        userDB.findUser(req.user.openId, error, error, success);
    },


    closeGrill: function (req, res) {
        var module = 'closeGrill';
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
                grillStatus_handler.closeGrill(req, res, theUser);
            } else {
                res.redirect('login.html');
            }
        }

        userDB.findUser(req.user.openId, error, error, success);
    },

    getCurrentGrillStatus: function (req, res) {
        var module = 'getCurrentGrillStatus';
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
                grillStatus_handler.getCurrentGrillStatus(req, res, theUser);
            } else {
                res.redirect('login.html');
            }
        }

        userDB.findUser(req.user.openId, error, error, success);
    },


    getAllComponentsIndexNames: function (req, res) {
        var module = 'getAllComponentsIndexNames';
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

                function errorIndexes(status, err) {
                    if (status == -1 || status == 0) {
                        res.status(500).send({
                            type: 'error',
                            msg: "A problem has occurred. Please reload the page",
                            reason: errorLogger(module, 'Could not retrieve componentIndexesSuccess', err),
                            disable: true,
                            redirectToError: false,
                            redirectPage: '/error/500.html'
                        });
                        consoleLogger(errorLogger(module, 'Could not retrieve componentIndexesSuccess', err));
                    }
                }

                function componentIndexesSuccess(allComponentsIndexNames) {
                    res.status(200).send({
                        allComponentsIndexNames: allComponentsIndexNames
                    })
                }

                componentDB.getAllComponentsIndexNames(-1, errorIndexes, errorIndexes, componentIndexesSuccess)
            } else {
                res.redirect('login.html');
            }
        }

        userDB.findUser(req.user.openId, error, error, success);
    },

    updateAvailableComponents: function (req, res) {
        var module = 'updateAvailableComponents';
        receivedLogger(module);
        var allComponents = req.body.allComponents;

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
                grillStatus_handler.updateAvailableComponents(req, res, theUser, allComponents);
            } else {
                res.redirect('login.html');
            }
        }

        userDB.findUser(req.user.openId, error, error, success);
    }


};