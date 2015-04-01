var basic = require('../functions/basic.js');
var ioJs = require('../functions/io.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var componentDB = require('../db/component_db.js');
var cuid = require('cuid');

var receivedLogger = function (module) {
    var rL = require('../functions/basic.js').receivedLogger;
    rL('component_handler', module);
};

var successLogger = function (module, text) {
    var sL = require('../functions/basic.js').successLogger;
    return sL('component_handler', module, text);
};

var errorLogger = function (module, text, err) {
    var eL = require('../functions/basic.js').errorLogger;
    return eL('component_handler', module, text, err);
};

module.exports = {

    addComponent: function (req, res, theUser, currentGrillStatus, theComponent) {
        var module = 'addComponent';
        receivedLogger(module);

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'warning',
                    msg: 'Failed to add, please try again. If problem persists, please reload this page',
                    reason: errorLogger(module, 'Could not add component', err),
                    disable: false,
                    redirect: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Failed! Could not add component', err));
            }
        }

        function success(theSavedComponent) {
            res.status(200).send({
                savedComponent: theSavedComponent,
                code: 200,
                notify: true,
                type: 'success',
                msg: 'Saved'
            });
            ioJs.emitToAll('adminChanges', 'changes');
            consoleLogger(successLogger(module));
        }

        var newComponent = {
            name: theComponent.name,
            grillName: theUser.grillName,
            componentGroup: theComponent.componentGroup,
            componentUniqueId: cuid()
        };

        //if the component is a weekly special, then put available by default to no
        if (theComponent.componentGroup == 'ws') {
            newComponent.available = 'no';
        }

        componentDB.addComponent(theUser.grillName, theUser, newComponent, error, error, success);
    },


    saveEditedComponent: function (req, res, theUser, currentGrillStatus, theComponent) {
        var module = 'saveEditedComponent';
        receivedLogger(module);

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'warning',
                    msg: 'Failed to save, please try again. If problem persists, please reload this page',
                    reason: errorLogger(module, 'Could not save component', err),
                    disable: false,
                    redirect: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Failed! Could not save component', err));
            }
        }

        function success() {
            res.status(200).send({
                code: 200,
                notify: true,
                type: 'success',
                msg: 'Saved'
            });
            ioJs.emitToAll('adminChanges', 'changes');
            consoleLogger(successLogger(module));
        }

        componentDB.saveEditedComponent(theUser.grillName, theUser, theComponent.componentIndex, theComponent.name, error, error, success);
    },


    deleteComponent: function (req, res, theUser, currentGrillStatus, componentIndex) {
        var module = 'deleteComponent';
        receivedLogger(module);

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'warning',
                    msg: 'Failed to delete, please try again. If problem persists, please reload this page',
                    reason: errorLogger(module, 'Could not delete component', err),
                    disable: false,
                    redirect: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Failed! Could not delete component', err));
            }
        }

        function success() {
            res.status(200).send({
                code: 200,
                notify: true,
                type: 'success',
                msg: 'Successfully removed'
            });
            ioJs.emitToAll('adminChanges', 'changes');
            consoleLogger(successLogger(module));
        }

        componentDB.deleteComponent(theUser.grillName, theUser, componentIndex, error, error, success);
    },


    getAllOrderComponents: function (req, res, theUser) {
        var module = 'getAllOrderComponents';
        receivedLogger(module);

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: "A problem has occurred. Please reload the page:",
                    reason: errorLogger(module, 'Could not retrieve components', err),
                    disable: true,
                    redirect: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Failed! Could not retrieve components', err));
            }
        }

        function success(allOrderComponents) {
            res.status(200).send({
                allComponents: allOrderComponents
            });
            consoleLogger(successLogger(module));
        }

        //calls success with all the components of specified group or empty when not found
        componentDB.getAllComponents(theUser.grillName, theUser, "oc", -1, error, error, success);
    },


    getAllOmelets: function (req, res, theUser) {
        var module = 'getAllOmelets';
        receivedLogger(module);

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: "A problem has occurred. Please reload the page:",
                    reason: errorLogger(module, 'Could not retrieve components', err),
                    disable: true,
                    redirect: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Failed! Could not retrieve components', err));
            }
        }

        function success(allOmelets) {
            res.status(200).send({
                allComponents: allOmelets
            });
            consoleLogger(successLogger(module));
        }

        //calls success with all the components of specified group or empty when not found
        componentDB.getAllComponents(theUser.grillName, theUser, "oo", -1, error, error, success);
    },


    getAllWeeklySpecials: function (req, res, theUser) {
        var module = 'getAllWeeklySpecials';
        receivedLogger(module);

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: "A problem has occurred. Please reload the page:",
                    reason: errorLogger(module, 'Could not retrieve components', err),
                    disable: true,
                    redirect: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Failed! Could not retrieve components', err));
            }
        }

        function success(allWeeklySpecials) {
            res.status(200).send({
                allComponents: allWeeklySpecials
            });
            consoleLogger(successLogger(module));
        }

        //calls success with all the components of specified group or empty when not found
        componentDB.getAllComponents(theUser.grillName, theUser, "ws", -1, error, error, success);
    },


    getAllExtras: function (req, res, theUser) {
        var module = 'getAllExtras';
        receivedLogger(module);

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: "A problem has occurred. Please reload the page:",
                    reason: errorLogger(module, 'Could not retrieve components', err),
                    disable: true,
                    redirect: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Failed! Could not retrieve components', err));
            }
        }

        function success(allExtras) {
            res.status(200).send({
                allComponents: allExtras
            });
            consoleLogger(successLogger(module));
        }

        //calls success with all the components of specified group or empty when not found
        componentDB.getAllComponents(theUser.grillName, theUser, "oe", -1, error, error, success);
    },


    getAvailableOrderComponents: function (req, res, theUser) {
        var module = 'getAvailableOrderComponents';
        receivedLogger(module);

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: "A problem has occurred. Please reload the page:",
                    reason: errorLogger(module, 'Could not retrieve components', err),
                    disable: true,
                    redirect: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Failed! Could not retrieve components', err));
            }
        }

        function success(availableOrderComponents) {
            res.status(200).send({
                availableComponents: availableOrderComponents
            });
            consoleLogger(successLogger(module));
        }

        //calls success with all the components of specified group or empty when not found
        componentDB.getAvailableComponents(theUser.grillName, theUser, "oc", -1, error, error, success);
    },


    getAvailableOmelets: function (req, res, theUser) {
        var module = 'getAvailableOmelets';
        receivedLogger(module);

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: "A problem has occurred. Please reload the page:",
                    reason: errorLogger(module, 'Could not retrieve components', err),
                    disable: true,
                    redirect: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Failed! Could not retrieve components', err));
            }
        }

        function success(availableOmelets) {
            res.status(200).send({
                availableComponents: availableOmelets
            });
            consoleLogger(successLogger(module));
        }

        //calls success with all the components of specified group or empty when not found
        componentDB.getAvailableComponents(theUser.grillName, theUser, "oo", -1, error, error, success);
    },


    getAvailableWeeklySpecials: function (req, res, theUser) {
        var module = 'getAvailableWeeklySpecials';
        receivedLogger(module);

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: "A problem has occurred. Please reload the page:",
                    reason: errorLogger(module, 'Could not retrieve components', err),
                    disable: true,
                    redirect: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Failed! Could not retrieve components', err));
            }
        }

        function success(availableWeeklySpecials) {
            res.status(200).send({
                availableComponents: availableWeeklySpecials
            });
            consoleLogger(successLogger(module));
        }

        //calls success with all the components of specified group or empty when not found
        componentDB.getAvailableComponents(theUser.grillName, theUser, "ws", -1, error, error, success);
    },


    getAvailableExtras: function (req, res, theUser) {
        var module = 'getAvailableExtras';
        receivedLogger(module);

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: "A problem has occurred. Please reload the page:",
                    reason: errorLogger(module, 'Could not retrieve components', err),
                    disable: true,
                    redirect: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Failed! Could not retrieve components', err));
            }
        }

        function success(availableExtras) {
            res.status(200).send({
                availableComponents: availableExtras
            });
            consoleLogger(successLogger(module));
        }

        //calls success with all the components of specified group or empty when not found
        componentDB.getAvailableComponents(theUser.grillName, theUser, "oe", -1, error, error, success);
    }

};