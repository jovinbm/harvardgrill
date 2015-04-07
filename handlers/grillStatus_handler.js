var basic = require('../functions/basic.js');
var ioJs = require('../functions/io.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var statsDB = require('../db/stats_db.js');
var componentDB = require('../db/component_db.js');

var receivedLogger = function (module) {
    var rL = require('../functions/basic.js').receivedLogger;
    rL('grillStatus_handler', module);
};

var successLogger = function (module, text) {
    var sL = require('../functions/basic.js').successLogger;
    return sL('grillStatus_handler', module, text);
};

var errorLogger = function (module, text, err) {
    var eL = require('../functions/basic.js').errorLogger;
    return eL('grillStatus_handler', module, text, err);
};

function getTheUser(req) {
    return req.customData.theUser;
}
function getTheCurrentGrillStatus(req) {
    return req.customData.currentGrillStatus;
}

module.exports = {

    openGrill: function (req, res) {
        var module = 'openGrill';
        receivedLogger(module);
        var theUser = req.customData.theUser;
        statsDB.openGrill(theUser.grillName, theUser, error, error, success);

        function success(newGrillStatus) {
            consoleLogger(successLogger(module));
            res.status(200).send({
                newGrillStatus: newGrillStatus,
                code: 200,
                notify: true,
                type: 'success',
                msg: 'The grill is now open'
            });
            ioJs.emitToAll('adminChanges', 'changes');
        }

        function error(status, err) {
            if (status == -1 || status == 0) {
                consoleLogger(errorLogger(module, 'Failed! Could not open grill', err));
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'warning',
                    msg: "A problem has occurred while trying to open grill. Please try again. If the problem persists, please reload this page"
                });
            }
        }
    },

    closeGrill: function (req, res) {
        var module = 'closeGrill';
        receivedLogger(module);
        var theUser = req.customData.theUser;
        statsDB.closeGrill(theUser.grillName, theUser, error, error, success);

        function success(newGrillStatus) {
            consoleLogger(successLogger(module));
            res.status(200).send({
                newGrillStatus: newGrillStatus,
                code: 200,
                notify: true,
                type: 'success',
                msg: 'The grill is now closed'
            });
            ioJs.emitToAll('adminChanges', 'changes');
        }

        function error(status, err) {
            consoleLogger(errorLogger(module, 'Failed! Could not close grill', err));
            if (status == -1 || status == 0) {
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'warning',
                    msg: "A problem has occurred while trying to close grill. Please try again. If the problem persists, please reload this page"
                });
            }
        }
    },

    createGrill: function (req, res, newGrillName) {
        var module = 'createGrill';
        receivedLogger(module);
        var theUser = req.customData.theUser;
        statsDB.checkIfGrillExists(newGrillName, theUser, error, error, successExists);

        function successExists(status) {
            if (status == 1) {
                //means name is available for use
                statsDB.createGrill(newGrillName, theUser, errorCreate, errorCreate, successCreate);
                function successCreate() {
                    consoleLogger(successLogger(module));
                    res.status(200).send({
                        code: 200,
                        notify: true,
                        type: 'success',
                        msg: "Grill created successfully"
                    })
                }

                function errorCreate(status, err) {
                    consoleLogger(errorLogger(module, 'Error creating grill', err));
                    res.status(500).send({
                        code: 500,
                        notify: true,
                        type: 'warning',
                        msg: "An error occurred while creating the new grill. Please try again"
                    });
                }

            } else {
                //means a status is -1, the grillName is in use
                consoleLogger(errorLogger(module, 'Failed! Grill with similar name exists'));
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'warning',
                    msg: "A grill with a similar name exists. Use a different name"
                });
            }
        }

        function error(status, err) {
            consoleLogger(errorLogger(module, 'Error creating grill', err));
            res.status(500).send({
                code: 500,
                notify: true,
                type: 'warning',
                msg: "An error occurred while creating the new grill. Please try again"
            });
        }
    },

    deleteGrill: function (req, res, grillName) {
        var module = 'deleteGrill';
        receivedLogger(module);
        var theUser = req.customData.theUser;
        statsDB.checkIfGrillExists(grillName, theUser, error, error, successExists);

        function successExists(status) {
            if (status == -1) {
                //means the grill is available
                statsDB.deleteGrill(grillName, theUser, errorDelete, errorDelete, successDelete);
                function successDelete() {
                    consoleLogger(successLogger(module));
                    res.status(200).send({
                        code: 200,
                        notify: true,
                        type: 'success',
                        msg: "Grill successfully removed"
                    });
                }

                function errorDelete(status, err) {
                    consoleLogger(errorLogger(module, 'Error deleting grill', err));
                    res.status(500).send({
                        code: 500,
                        notify: true,
                        type: 'warning',
                        msg: "An error occurred while deleting. Please try again"
                    });
                }
            } else {
                //means the grillName is not on record
                consoleLogger(errorLogger(module, 'Failed! did not find required grill'));
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'warning',
                    msg: "We could not find the grill. Please try again or refresh this page"
                });
            }
        }

        function error(status, err) {
            consoleLogger(errorLogger(module, 'Error deleting grill', err));
            res.status(500).send({
                code: 500,
                notify: true,
                type: 'warning',
                msg: "An error occurred while deleting. Please try again"
            });
        }
    },

    getCurrentGrillStatus: function (req, res) {
        var module = 'getCurrentGrillStatus';
        receivedLogger(module);
        consoleLogger(successLogger(module));
        res.status(200).send({
            currentGrillStatus: req.customData.currentGrillStatus
        });
    },


    updateAvailableComponents: function (req, res, allComponents) {
        var module = 'updateAvailableComponents';
        receivedLogger(module);
        var theUser = req.customData.theUser;
        componentDB.updateAvailableComponents(theUser.grillName, theUser, allComponents, error, error, success);

        function success() {
            consoleLogger(successLogger(module));
            res.status(200).send({
                code: 200,
                notify: true,
                type: 'success',
                msg: "Update successful"
            });
            ioJs.emitToAll('adminChanges', 'changes');
        }

        function error(status, err) {
            if (status == -1 || status == 0) {
                consoleLogger(errorLogger(module, 'Failed! Could not update available components', err));
                res.status(500).send({
                    code: 500,
                    notify: true,
                    type: 'warning',
                    msg: 'Update failed, please try again. If problem persists please reload this page'
                });
            }
        }
    }


};