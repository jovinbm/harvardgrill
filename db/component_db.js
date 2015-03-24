var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var Component = require("../database/order_components/component_model.js");

module.exports = {

    addComponent: function (componentObject, error_neg_1, error_0, success) {
        var newComponent = new Component(componentObject);
        newComponent.save(function (err, theSavedComponent) {
            if (err) {
                error_neg_1(-1, err);
            } else {
                success(theSavedComponent);
            }
        });
    },


    saveEditedComponent: function (componentIndex, name, error_neg_1, error_0, success) {
        Component.findOne({componentIndex: componentIndex}).exec(
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
            }
        )
    },


    deleteComponent: function (componentIndex, error_neg_1, error_0, success) {
        Component.
            find({componentIndex: componentIndex})
            .remove()
            .exec(function (err) {
                if (err) {
                    error_neg_1(-1, err);
                } else {
                    success();
                }
            })
    },

    getAllComponents: function (componentGroup, sort, error_neg_1, error_0, success) {
        Component
            .find({componentGroup: componentGroup})
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
    },


    getAllComponentsIndexNames: function (sort, error_neg_1, error_0, success) {
        Component
            .find({}, {componentIndex: 1, name: 1})
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
    },

    getAvailableComponents: function (componentGroup, sort, error_neg_1, error_0, success) {
        Component
            .find({componentGroup: componentGroup, available: 'yes'})
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
    },

    updateAvailableComponents: function (allComponents, error_neg_1, error_0, success) {
        var errors = 0;
        allComponents.forEach(function (component) {
            Component.findOne({componentIndex: component.componentIndex}).exec(
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
    },


    updateTotalOrderdAndLastOrderTime: function (componentIndex, error_neg_1, error_0, success) {
        Component.update({componentIndex: componentIndex}, {
                $inc: {totalOrdered: 1},
                $set: {lastOrderTime: Date.now}
            }, function (err) {
                if (err) {
                    error_neg_1(-1, err);
                } else {
                    success();
                }
            }
        )
    },


    updateComponentRates: function (componentIndex, amount, error_neg_1, error_0, success) {
        //the amount is the total stars awarded out of five
        Component.update({componentIndex: componentIndex}, {
                $inc: {
                    totalRates: 1,
                    rateSum: amount
                }
            }, function (err) {
                if (err) {
                    error_neg_1(-1, err);
                } else {
                    success();
                }
            }
        )
    }

};