var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var User = require("../database/users/user_model.js");


module.exports = {

    //finds a specific Harvard User
    findUser: function (openId, error_neg_1, error_0, success) {
        User.findOne({openId: openId}).exec(
            function (err, theUser) {
                if (err) {
                    error_neg_1(-1, err);
                } else if (theUser == null || theUser == undefined) {
                    error_0(0, err);
                } else {
                    success(theUser);
                }
            }
        );
    },


    saveUser: function (theUserObject, error_neg_1, error_0, success) {
        theUserObject.save(function (err, theSavedUser) {
            if (err) {
                error_neg_1(-1, err);
            } else {
                success(theSavedUser);
            }
        });
    },


    deleteUser: function (theUser, error_neg_1, error_0, success) {
        User.
            find({uniqueCuid: theUser.uniqueCuid})
            .remove()
            .exec(function (err) {
                if (err) {
                    error_neg_1(-1, err);
                } else {
                    success();
                }
            })
    },

    updateCuCls: function (openId, customUsername, customLoggedInStatus, error_neg_1, error_0, success) {
        User.update({openId: openId}, {
                $set: {
                    customUsername: customUsername,
                    customLoggedInStatus: customLoggedInStatus
                }
            }, function (err) {
                if (err) {
                    error_neg_1(-1, err);
                } else {
                    success();
                }
            }
        )
    },


    toggleCls: function (openId, newCustomLoggedInStatus, error_neg_1, error_0, success) {
        User.update({openId: openId}, {$set: {customLoggedInStatus: newCustomLoggedInStatus}}).exec(function (err) {
            if (err) {
                error_neg_1(-1, err);
            } else {
                success();
            }
        });
    }


};