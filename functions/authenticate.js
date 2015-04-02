var userDB = require('../db/user_db.js');

var receivedLogger = function (module) {
    var rL = require('./basic.js').receivedLogger;
    rL('authenticate.js', module);
};

var successLogger = function (module, text) {
    var sL = require('./basic.js').successLogger;
    return sL('authenticate.js', module, text);
};

var errorLogger = function (module, text, err) {
    var eL = require('./basic.js').errorLogger;
    return eL('authenticate.js', module, text, err);
};

module.exports = {

    //authenticates requests
    ensureAuthenticated: function (req, res, next) {
        var module = "ensureAuthenticated";
        if (req.isAuthenticated()) {
            next()
        } else {
            res.redirect('login.html');
        }
    },

    ensureAuthenticatedAngular: function (req, res, next) {
        var module = "ensureAuthenticated";
        if (req.isAuthenticated()) {
            next()
        } else {
            res.status(401).send({
                code: 401,
                notify: true,
                type: 'error',
                banner: true,
                bannerClass: 'alert alert-dismissible alert-warning',
                msg: 'You are not logged in. Please reload page',
                reason: errorLogger(module, 'req.isAuthenticated: user not logged in'),
                disable: true,
                redirect: true,
                redirectPage: '/login.html'
            });
        }
    },

    checkIfFullyRegistered: function (req, res, next) {
        var module = "checkIfFullyRegistered";
        userDB.findUser(req.user.openId, error, error, success);

        function error(status, err) {
            res.status(401).send({
                code: 401,
                notify: true,
                type: 'error',
                banner: true,
                bannerClass: 'alert alert-dismissible alert-warning',
                msg: 'A problem occurred while retrieving your details. Please reload this page',
                reason: errorLogger(module, 'error finding user'),
                disable: true,
                redirect: false,
                redirectPage: '/login.html',
                loginErrorType: 'server'
            });
        }

        function success(theUser) {
            if (theUser.username && theUser.displayName && theUser.email) {
                res.status(200).send({
                    msg: "Fully registered"
                })
            } else {
                var upatePassword = false;
                if (theUser.password == "" || theUser.password == undefined || theUser.password == null) {
                    upatePassword = true;
                }
                res.status(401).send({
                    code: 401,
                    notify: true,
                    type: 'error',
                    banner: true,
                    bannerClass: 'alert alert-dismissible alert-warning',
                    msg: 'You are not fully registered. Please reload the page',
                    reason: errorLogger(module, 'req.isAuthenticated: user not logged in'),
                    disable: true,
                    redirect: true,
                    redirectPage: '/login.html',
                    loginErrorType: 'user',
                    updatePassword: upatePassword,
                    availableDetails: {
                        displayName: theUser.displayName,
                        username: theUser.username,
                        email: theUser.email,
                    }
                });
            }
        }
    }
};