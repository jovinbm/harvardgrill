var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var User = require("../database/users/user_model.js");
var bcrypt = require('bcrypt');
var receivedLogger = function (module) {
    var rL = require('../functions/basic.js').receivedLogger;
    rL('user_db.js', module);
};

var successLogger = function (module, text) {
    var sL = require('../functions/basic.js').successLogger;
    return sL('user_db.js', module, text);
};

var errorLogger = function (module, text, err) {
    var eL = require('../functions/basic.js').errorLogger;
    return eL('user_db.js', module, text, err);
};


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


    findUserWithUsername: function (username, error_neg_1, error_0, success) {
        User.findOne({username: username}).exec(
            function (err, theUser) {
                if (err) {
                    error_neg_1(-1, err);
                } else if (theUser == null || theUser == undefined) {
                    success(1, theUser);
                } else {
                    success(-1, theUser);
                }
            }
        );
    },


    checkUserPassword: function (openId, password, error_neg_1, errorPasswordBcrypt, success) {
        User.findOne({openId: openId}).exec(
            function (err, theUser) {
                if (err) {
                    error_neg_1(-1, err);
                } else if (theUser == null || theUser == undefined) {
                    error_neg_1(0, err);
                } else {
                    bcrypt.compare(password, theUser.password, function (err, res) {
                        consoleLogger(res);
                        if (err) {
                            consoleLogger(errorLogger(module, 'error comparing passwords', err));
                            errorPasswordBcrypt(err);
                        } else if (res) {
                            //means the password checks with hash
                            success(1);
                        } else {
                            //passwords don't check
                            success(-1);
                        }
                    });
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

    updateCuCls: function (openId, username, customLoggedInStatus, error_neg_1, error_0, success) {
        User
            .update({
                openId: openId
            }, {
                $set: {
                    username: username,
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

    updateGrillName: function (openId, grillName, error_neg_1, error_0, success) {
        User
            .update({
                openId: openId
            }, {
                $set: {
                    grillName: grillName
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

    updateFullName: function (openId, fullName, error_neg_1, error_0, success) {
        User
            .update({
                openId: openId
            }, {
                $set: {
                    fullName: fullName
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

    updateUsername: function (openId, username, error_neg_1, error_0, success) {
        User
            .update({
                openId: openId
            }, {
                $set: {
                    username: username
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

    updateEmail: function (openId, email, error_neg_1, error_0, success) {
        User
            .update({
                openId: openId
            }, {
                $set: {
                    email: email
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


    updatePassword: function (openId, passwordHash, error_neg_1, error_0, success) {
        User
            .update({
                openId: openId
            }, {
                $set: {
                    password: passwordHash
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
        User
            .update({
                openId: openId
            }, {
                $set: {
                    customLoggedInStatus: newCustomLoggedInStatus
                }
            }
        ).exec(function (err) {
                if (err) {
                    error_neg_1(-1, err);
                } else {
                    success();
                }
            });
    }

};