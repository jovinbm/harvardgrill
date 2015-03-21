var email = require("emailjs");
var mailServer = email.server.connect({
    user: "jovinbeda@gmail.com",
    password: "uxccpufouacqxrzm",
    host: "smtp.gmail.com",
    ssl: true
});
var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var basic_handlers = require('../handlers/basic_handlers.js');
var userDB = require('../db/user_db.js');


module.exports = {
    sendEmail: function (req, res) {
        res.redirect('login.html');
        var message = {
            text: "Name: " + req.body.name + ", Email: " + req.body.email + ", Message: " + req.body.message,
            from: req.body.email,
            to: "jovinbeda@gmail.com",
            subject: "HARVARD-GRILL WEBSITE"
        };
        mailServer.send(message, function (err) {
            consoleLogger(err || "EMAIL: Message sent to jovinbeda@gmail.com");
        });
    },


    getSocketRoom: function (req, res) {
        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({msg: "ERROR: getMyRoomGET: Could not retrieve user:"});
                consoleLogger("ERROR: getMyRoomGET: Could not retrieve user: " + err);
            }
        }

        function success(theUser) {
            if (theUser.customLoggedInStatus == 1) {
                res.status(200).send({
                    socketRoom: theUser.socketRoom,
                    customUsername: theUser.customUsername,
                    uniqueCuid: theUser.uniqueCuid
                });
            }

            consoleLogger("getMyRoomGET success");
            //TODO -- redirect to custom login
        }

        userDB.findUser(req.user.openId, error, error, success);
    },


    adminStartUp: function (req, res) {
        consoleLogger('ADMIN_STARTUP event received');
        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({msg: 'adminStartUpAPI: Could not retrieve admin user', err: err});
                consoleLogger("ERROR: adminStartUpAPI: Could not retrieve admin user: " + err);
            }
        }

        function success(theUser) {
            if (theUser.customLoggedInStatus == 1) {
                basic_handlers.adminStartUp(req, res, theUser);
            }
            //TODO -- redirect to custom login
        }

        userDB.findUser(req.user.openId, error, error, success);
    },


    reconnect: function (req, res) {
        consoleLogger('RECONNECT event received');
        var page = req.body.page;

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({msg: 'reconnectPOST: Could not retrieve user', err: err});
                consoleLogger("ERROR: reconnectPOST: Could not retrieve user: " + err);
            }
        }

        function success(theUser) {
            if (theUser.customLoggedInStatus == 1) {
                basic_handlers.reconnect(req, res, theUser, page);
            }
            //TODO -- redirect to custom login
        }

        userDB.findUser(req.user.openId, error, error, success);
    }
};