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

function getTheUser(req) {
    return req.customData.theUser;
}
function getTheCurrentGrillStatus(req) {
    return req.customData.currentGrillStatus;
}


module.exports = {

    addComponent: function (req, res, theComponent) {
        var module = 'addComponent';
        receivedLogger(module);
        var theUser = getTheUser(req);

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

        function success(theSavedComponent) {
            consoleLogger(successLogger(module));
            res.status(200).send({
                savedComponent: theSavedComponent,
                code: 200,
                notify: true,
                type: 'success',
                msg: 'Saved'
            });
            ioJs.emitToAll('adminChanges', 'changes');
        }

        function error(status, err) {
            if (status == -1 || status == 0) {
                consoleLogger(errorLogger(module, 'Failed! Could not add component', err));
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'warning',
                    msg: 'Failed to add, please try again. If problem persists, please reload this page'
                });
            }
        }
    },


    saveEditedComponent: function (req, res, theComponent) {
        var module = 'saveEditedComponent';
        receivedLogger(module);
        var theUser = getTheUser(req);
        componentDB.saveEditedComponent(theUser.grillName, theUser, theComponent.componentIndex, theComponent.name, error, error, success);

        function success() {
            consoleLogger(successLogger(module));
            res.status(200).send({
                code: 200,
                notify: true,
                type: 'success',
                msg: 'Saved'
            });
            ioJs.emitToAll('adminChanges', 'changes');
        }

        function error(status, err) {
            if (status == -1 || status == 0) {
                consoleLogger(errorLogger(module, 'Failed! Could not save component', err));
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'warning',
                    msg: 'Failed to save, please try again. If problem persists, please reload this page'
                });
            }
        }
    },


    deleteComponent: function (req, res, componentIndex) {
        var module = 'deleteComponent';
        var theUser = getTheUser(req);
        receivedLogger(module);
        componentDB.deleteComponent(theUser.grillName, theUser, componentIndex, error, error, success);

        function success() {
            consoleLogger(successLogger(module));
            res.status(200).send({
                code: 200,
                notify: true,
                type: 'success',
                msg: 'Successfully removed'
            });
            ioJs.emitToAll('adminChanges', 'changes');
        }

        function error(status, err) {
            if (status == -1 || status == 0) {
                consoleLogger(errorLogger(module, 'Failed! Could not delete component', err));
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'warning',
                    msg: 'Failed to delete, please try again. If problem persists, please reload this page'
                });
            }
        }
    },

    getAllComponents: function (req, res, componentGroup) {
        var module = 'getAllComponents';
        receivedLogger(module);
        var theUser = getTheUser(req);

        //calls success with all the components of specified group or empty when not found
        switch (componentGroup) {
            case 'oc':
                componentDB.getAllComponents(theUser.grillName, theUser, "oc", -1, error, error, success);
                break;
            case 'oo':
                componentDB.getAllComponents(theUser.grillName, theUser, "oo", -1, error, error, success);
                break;
            case 'ws':
                componentDB.getAllComponents(theUser.grillName, theUser, "ws", -1, error, error, success);
                break;
            case 'oe':
                componentDB.getAllComponents(theUser.grillName, theUser, "oe", -1, error, error, success);
                break;
            default:
                error(-1, "Component group is either undefined or not recognized")

        }

        function success(allComponents) {
            consoleLogger(successLogger(module));
            res.status(200).send({
                allComponents: allComponents
            });
        }

        function error(status, err) {
            if (status == -1 || status == 0) {
                consoleLogger(errorLogger(module, 'Failed! Could not retrieve components', err));
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: "A problem has occurred. Please reload the page:",
                    disable: true,
                    redirect: false,
                    redirectPage: '/error/500.html'
                });
            }
        }
    },


    getAvailableComponents: function (req, res, componentGroup) {
        var module = 'getAvailableComponents';
        receivedLogger(module);
        var theUser = getTheUser(req);

        //calls success with all the components of specified group or empty when not found
        switch (componentGroup) {
            case 'oc':
                componentDB.getAvailableComponents(theUser.grillName, theUser, "oc", -1, error, error, success);
                break;
            case 'oo':
                componentDB.getAvailableComponents(theUser.grillName, theUser, "oo", -1, error, error, success);
                break;
            case 'ws':
                componentDB.getAvailableComponents(theUser.grillName, theUser, "ws", -1, error, error, success);
                break;
            case 'oe':
                componentDB.getAvailableComponents(theUser.grillName, theUser, "oe", -1, error, error, success);
                break;
            default:
                error(-1, "Component group is either undefined or not recognized")

        }

        function success(availableComponents) {
            consoleLogger(successLogger(module));
            res.status(200).send({
                availableComponents: availableComponents
            });
        }

        function error(status, err) {
            if (status == -1 || status == 0) {
                consoleLogger(errorLogger(module, 'Failed! Could not retrieve components', err));
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'error',
                    msg: "A problem has occurred. Please reload the page:",
                    disable: true,
                    redirect: false,
                    redirectPage: '/error/500.html'
                });
            }
        }
    }

};