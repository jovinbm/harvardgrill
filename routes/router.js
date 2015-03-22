var path = require('path');
var basic = require('../functions/basic.js');
var userDB = require('../db/user_db.js');

var adminOrOrder = "client.html";
//var adminOrOrder = "admin.html";

module.exports = {
    loginHtml: function (req, res) {
        if (req.user) {
            res.redirect("login1.html");
        } else {
            res.render('login');
        }
    },


    login_1_Html: function (req, res) {
        function error(status, err) {
            if (status == -1 || status == 0) {
                basic.consoleLogger("ERROR: exports.login_1_Html: getting customLoggedInStatus: " + err);
                res.redirect("login.html");
            }
        }

        function success(theUser) {
            //if logged in in both harvard and custom login take them to order directly
            if (req.user && theUser.customLoggedInStatus == 1) {
                res.redirect(adminOrOrder);
            }
            else if (req.user) {
                res.render('login1', {displayName: 'Hello, ' + theUser.displayName});
            } else {
                res.redirect("login.html");
            }
        }

        userDB.findUser(req.user.openId, error, error, success);
    },


    infoLogin: function (req, res) {
        //if user got here without doing a harvard login, redirect them back to harvard login
        if (!req.user) {
            res.redirect("login.html");
        }

        //get the customLoggedInStatus
        function error(status, err) {
            if (status == -1 || status == 0) {
                basic.consoleLogger("ERROR: exports.login_1_Html: " + err);
                res.redirect("login.html");
            }
        }

        function success(theUser) {
            function successUpdate() {
                res.redirect(adminOrOrder);
            }

            //if logged in in both harvard and custom login take them to order directly
            if (req.user && theUser.customLoggedInStatus == 1) {
                res.redirect(adminOrOrder);
            } else {
                userDB.updateCuCls(req.user.openId, req.body.customUsername, 1, error, error, successUpdate)
            }
        }

        userDB.findUser(req.user.openId, error, error, success);
    },


    client_Html: function (req, res) {
        //get the customUsername
        function error(status, err) {
            if (status == -1 || status == 0) {
                basic.consoleLogger("ERROR: exports.client_Html: " + err);
                res.redirect("login.html");
            }
        }

        function success(theUser) {
            if (req.user && theUser.customLoggedInStatus == 1) {
                res.sendFile(path.join(__dirname, '../views/client', 'client.html'));
            } else if (req.user) {
                res.redirect("login1.html");
            } else {
                res.redirect("login.html");
            }
        }

        userDB.findUser(req.user.openId, error, error, success);
    },

    admin_Html: function (req, res) {
        //get the customUsername
        function error(status, err) {
            if (status == -1 || status == 0) {
                basic.consoleLogger("ERROR: exports.adminHtml: " + err);
                res.redirect("login.html");
            }
        }

        function success(theUser) {
            if (req.user && theUser.customLoggedInStatus == 1) {
                res.sendFile(path.join(__dirname, '../views/admin', 'admin.html'));
            } else if (req.user) {
                res.redirect("login1.html");
            } else {
                res.redirect("login.html");
            }
        }

        userDB.findUser(req.user.openId, error, error, success);
    }
};