var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var componentDB = require('../db/component_db.js');
var cuid = require('cuid');

module.exports = {

    addComponent: function (req, res, theUser, currentGrillStatus, theComponent) {
        basic.consoleLogger('component_handler: ADD_COMPONENT event received');

        function error(status, err) {
            if (status == -1 || status == 0) {
                basic.consoleLogger("component_handler: ADD_COMPONENT: Error executing db operations: err = " + err);
                res.status(500).send({
                    msg: 'component: ADD_COMPONENT: Error executing db operations',
                    err: err
                });
            }
        }

        function success(theSavedComponent) {
            res.status(200).send({
                savedComponent: theSavedComponent
            });
            consoleLogger("component_handler: ADD_COMPONENT success");
        }

        var newComponent = {
            name: theComponent.name,
            componentGroup: theComponent.componentGroup,
            componentUniqueId: cuid()
        };

        //if the component is a weekly special, then put available by default to no
        if (theComponent.componentGroup == 'ws') {
            newComponent.available = 'no';
        }

        componentDB.addComponent(newComponent, error, error, success);
    },


    saveEditedComponent: function (req, res, theUser, currentGrillStatus, theComponent) {
        basic.consoleLogger('component_handler: SAVE_EDITED_COMPONENT event received');

        function error(status, err) {
            if (status == -1 || status == 0) {
                basic.consoleLogger("component_handler: SAVE_EDITED_COMPONENT: Error executing db operations: err = " + err);
                res.status(500).send({
                    msg: 'component: SAVE_EDITED_COMPONENT: Error executing db operations',
                    err: err
                });
            }
        }

        function success() {
            res.status(200).send({
                msg: "Component successfully edited"
            });
            consoleLogger("component_handler: SAVE_EDITED_COMPONENT success");
        }

        componentDB.saveEditedComponent(theComponent.componentIndex, theComponent.name, error, error, success);
    },


    deleteComponent: function (req, res, theUser, currentGrillStatus, componentIndex) {
        basic.consoleLogger('component_handler: DELETE_COMPONENT event received');

        function error(status, err) {
            if (status == -1 || status == 0) {
                basic.consoleLogger("component_handler: DELETE_COMPONENT: Error executing db operations: err = " + err);
                res.status(500).send({
                    msg: 'component: DELETE_COMPONENT: Error executing db operations',
                    err: err
                });
            }
        }

        function success() {
            res.status(200).send({
                msg: 'Delete SuccessFull'
            });
            consoleLogger("component_handler: DELETE_COMPONENT success");
        }

        componentDB.deleteComponent(componentIndex, error, error, success);
    },


    getAllOrderComponents: function (req, res, theUser) {
        basic.consoleLogger('component_handler: getAllOrderComponents event received');

        function error(status, err) {
            basic.consoleLogger("component_handler: getAllOrderComponents: Error executing db operations: err = " + err);
            res.status(500).send({
                msg: 'component: getAllOrderComponents: Error executing db operations',
                err: err
            })
        }

        function success(allOrderComponents) {
            res.status(200).send({
                allComponents: allOrderComponents
            });
            consoleLogger("component_handler: getAllOrderComponents success");
        }

        //calls success with all the components of specified group or empty when not found
        componentDB.getAllComponents("oc", -1, error, error, success);
    },


    getAllOmelets: function (req, res, theUser) {
        basic.consoleLogger('component_handler: getAllOmelets event received');

        function error(status, err) {
            basic.consoleLogger("component_handler: getAllOmelets: Error executing db operations: err = " + err);
            res.status(500).send({
                msg: 'component: getAllOmelets: Error executing db operations',
                err: err
            })
        }

        function success(allOmelets) {
            res.status(200).send({
                allComponents: allOmelets
            });
            consoleLogger("component_handler: getAllOmelets success");
        }

        //calls success with all the components of specified group or empty when not found
        componentDB.getAllComponents("oo", -1, error, error, success);
    },


    getAllWeeklySpecials: function (req, res, theUser) {
        basic.consoleLogger('component_handler: getAllWeeklySpecials event received');

        function error(status, err) {
            basic.consoleLogger("component_handler: getAllWeeklySpecials: Error executing db operations: err = " + err);
            res.status(500).send({
                msg: 'component:getAllWeeklySpecials: Error executing db operations',
                err: err
            })
        }

        function success(allWeeklySpecials) {
            res.status(200).send({
                allComponents: allWeeklySpecials
            });
            consoleLogger("component_handler: getAllWeeklySpecials success");
        }

        //calls success with all the components of specified group or empty when not found
        componentDB.getAllComponents("ws", -1, error, error, success);
    },


    getAllExtras: function (req, res, theUser) {
        basic.consoleLogger('component_handler: getAllExtras event received');

        function error(status, err) {
            basic.consoleLogger("component_handler: getAllExtras: Error executing db operations: err = " + err);
            res.status(500).send({
                msg: 'component: getAllExtras: Error executing db operations',
                err: err
            })
        }

        function success(allExtras) {
            res.status(200).send({
                allComponents: allExtras
            });
            consoleLogger("component_handler: getAllExtras success");
        }

        //calls success with all the components of specified group or empty when not found
        componentDB.getAllComponents("oe", -1, error, error, success);
    }

};