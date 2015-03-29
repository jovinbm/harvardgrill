var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var Component = require("../database/order_components/component_model.js");
var qUpdates = require("./side_updates_db.js");

module.exports = {

    getAllComponentsIndexNames: function (grillName, theUser, sort, error_neg_1, error_0, success) {
        //update user's last activity
        qUpdates.userUpdateUserLastActivity(theUser.openId, error_neg_1, error_0, success2);

        function success2() {
            Component
                .find({grillName: grillName}, {componentIndex: 1, name: 1})
                .sort({componentIndex: sort})
                .exec(function (err, ComponentsIndexNames) {
                    if (err) {
                        error_neg_1(-1, err);
                    } else if (ComponentsIndexNames == null || ComponentsIndexNames == undefined || ComponentsIndexNames.length == 0) {
                        ComponentsIndexNames = [];
                        success(ComponentsIndexNames);
                    } else {
                        success(ComponentsIndexNames);
                    }
                });
        }
    },


    addComponent: function (grillName, theUser, componentObject, error_neg_1, error_0, success) {
        //update user's last activity
        qUpdates.userUpdateUserLastActivity(theUser.openId, error_neg_1, error_0, success2);

        function success2() {
            var newComponent = new Component(componentObject);
            newComponent.save(function (err, theSavedComponent) {
                if (err) {
                    error_neg_1(-1, err);
                } else {
                    success(theSavedComponent);
                }
            });
        }
    },


    saveEditedComponent: function (grillName, theUser, componentIndex, name, error_neg_1, error_0, success) {
        //update user's last activity
        qUpdates.userUpdateUserLastActivity(theUser.openId, error_neg_1, error_0, success2);

        function success2() {
            Component.findOne({
                grillName: grillName,
                componentIndex: componentIndex
            }).exec(
                function (err, component) {
                    if (err) {
                        error_neg_1(-1, err);
                    } else if (component == null || component == undefined) {
                        //means the 'stats' document is not available, create it
                        error_0(0, err);
                    } else {
                        //update the document
                        component.name = name;
                        component.save(function (err) {
                            if (err) {
                                error_neg_1(-1, err);
                            } else {
                                success();
                            }
                        });
                    }
                })
        }
    },


    deleteComponent: function (grillName, theUser, componentIndex, error_neg_1, error_0, success) {
        //update user's last activity
        qUpdates.userUpdateUserLastActivity(theUser.openId, error_neg_1, error_0, success2);

        function success2() {
            Component.
                find({
                    grillName: grillName,
                    componentIndex: componentIndex
                })
                .remove()
                .exec(function (err) {
                    if (err) {
                        error_neg_1(-1, err);
                    } else {
                        success();
                    }
                })
        }
    },

    getAllComponents: function (grillName, theUser, componentGroup, sort, error_neg_1, error_0, success) {
        //update user's last activity
        qUpdates.userUpdateUserLastActivity(theUser.openId, error_neg_1, error_0, success2);

        function success2() {
            Component
                .find({
                    grillName: grillName,
                    componentGroup: componentGroup
                })
                .sort({componentIndex: sort})
                .exec(function (err, components) {
                    if (err) {
                        error_neg_1(-1, err);
                    } else if (components == null || components == undefined || components.length == 0) {
                        components = [];
                        success(components);
                    } else {
                        success(components);
                    }
                });
        }
    },

    getAvailableComponents: function (grillName, theUser, componentGroup, sort, error_neg_1, error_0, success) {
        //update user's last activity
        qUpdates.userUpdateUserLastActivity(theUser.openId, error_neg_1, error_0, success2);

        function success2() {
            Component
                .find({
                    grillName: grillName,
                    componentGroup: componentGroup,
                    available: 'yes'
                })
                .sort({componentIndex: sort})
                .exec(function (err, components) {
                    if (err) {
                        error_neg_1(-1, err);
                    } else if (components == null || components == undefined || components.length == 0) {
                        components = [];
                        success(components);
                    } else {
                        success(components);
                    }
                });
        }
    },

    updateAvailableComponents: function (grillName, theUser, allComponents, error_neg_1, error_0, success) {
        //update user's last activity
        qUpdates.userUpdateUserLastActivity(theUser.openId, error_neg_1, error_0, success2);

        function success2() {
            var errors = 0;
            allComponents.forEach(function (component) {
                Component.findOne({
                    grillName: grillName,
                    componentIndex: component.componentIndex
                }).exec(
                    function (err, retrievedComponent) {
                        if (err) {
                            error_neg_1(-1, err);
                            errors++
                        } else if (retrievedComponent == null || retrievedComponent == undefined) {
                            //means the 'stats' document is not available, create it
                            error_0(0, err);
                            errors++;
                        } else {
                            //update the document
                            retrievedComponent.available = component.available;
                            retrievedComponent.save(function (err) {
                                if (err) {
                                    error_neg_1(-1, err);
                                    errors++;
                                }
                            });
                        }
                    }
                )
            });

            if (errors > 0) {
                error_neg_1(-1, "Errors happened while updating components")
            } else {
                success();
            }
        }
    }

};