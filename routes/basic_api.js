var email = require("emailjs");
var mailServer = email.server.connect({
    user: "jovinbeda@gmail.com",
    password: "uxccpufouacqxrzm",
    host: "smtp.gmail.com",
    ssl: true
});
var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;

var receivedLogger = function (module) {
    var rL = require('../functions/basic.js').receivedLogger;
    rL('basic_api', module);
};

var successLogger = function (module, text) {
    var sL = require('../functions/basic.js').successLogger;
    return sL('basic_api', module, text);
};
var errorLogger = function (module, text, err) {
    var eL = require('../functions/basic.js').errorLogger;
    return eL('basic_api', module, text, err);
};

var basic_handler = require('../handlers/basic_handler.js');
var userDB = require('../db/user_db.js');


module.exports = {
    sendEmail: function (req, res) {
        var module = 'sendEmail';
        receivedLogger(module);
        res.redirect('login.html');
        var message = {
            text: "Name: " + req.body.name + ", Email: " + req.body.email + ", Message: " + req.body.message,
            from: req.body.email,
            to: "jovinbeda@gmail.com",
            subject: "HARVARD-GRILL WEBSITE"
        };
        mailServer.send(message, function (err) {
            consoleLogger(err || successLogger(module, 'Message sent to jovinbeda@gmail.com'));
        });
    },


    getSocketRoom: function (req, res) {
        var module = 'getSocketRoom';
        receivedLogger(module);

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    type: 'error',
                    msg: 'Error when trying to start the app. Please reload page',
                    reason: errorLogger(module, 'Could not retrieve user', err),
                    disable: true,
                    redirectToError: true,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Could not retrieve user', err));
            }
        }

        function success(theUser) {
            if (theUser.customLoggedInStatus == 1) {
                res.status(200).send({
                    socketRoom: theUser.socketRoom,
                    customUsername: theUser.customUsername,
                    uniqueCuid: theUser.uniqueCuid
                });
                consoleLogger(successLogger(module));

            } else {
                res.redirect('login.html');
            }
        }

        userDB.findUser(req.user.openId, error, error, success);
    },


    adminStartUp: function (req, res) {
        var module = 'adminStartUp';
        receivedLogger(module);

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    type: 'error',
                    msg: 'Error when trying to start the app. Please reload page',
                    reason: errorLogger(module, 'Could not retrieve user', err),
                    disable: true,
                    redirectToError: true,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Could not retrieve user', err));
            }
        }

        function success(theUser) {
            if (theUser.customLoggedInStatus == 1) {
                basic_handler.adminStartUp(req, res, theUser);
            } else {
                res.redirect('login.html');
            }
        }

        userDB.findUser(req.user.openId, error, error, success);
    },

    clientStartUp: function (req, res) {
        var module = 'clientStartUp';
        receivedLogger(module);

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({
                    type: 'error',
                    msg: 'Error when trying to start the app. Please reload page',
                    reason: errorLogger(module, 'Could not retrieve user', err),
                    disable: true,
                    redirectToError: true,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Could not retrieve user', err));
            }
        }

        function success(theUser) {
            if (theUser.customLoggedInStatus == 1) {
                basic_handler.clientStartUp(req, res, theUser);
            } else {
                res.redirect('login.html');
            }
        }

        userDB.findUser(req.user.openId, error, error, success);
    }
};