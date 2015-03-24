var path = require('path');
var basic = require('../functions/basic.js');
var userDB = require('../db/user_db.js');


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
            if (req.user && theUser.customLoggedInStatus == 1 && theUser.isAdmin == 'yes') {
                res.redirect('admin.html');
            } else if (req.user && theUser.customLoggedInStatus == 1 && theUser.isAdmin == 'no') {
                res.redirect('client.html');
            }

            //only clients will reach this stage
            else if (req.user) {
                res.render('login1', {displayName: theUser.displayName});
            } else {
                res.redirect("login.html");
            }
        }

        userDB.findUser(req.user.openId, error, error, success);
    },


    infoLogin: function (req, res) {
        function error(status, err) {
            if (status == -1 || status == 0) {
                basic.consoleLogger("ERROR: exports.login_1_Html: " + err);
                res.redirect("login.html");
            }
        }

        function success(theUser) {
            function successUpdate() {
                if (theUser.isAdmin == 'yes') {
                    res.redirect('admin.html');
                } else if (theUser.isAdmin == 'no') {
                    res.redirect('client.html');
                } else {
                    error();
                }
            }

            userDB.updateCuCls(req.user.openId, req.body.customUsername, 1, error, error, successUpdate)
        }

        if (!req.user) {
            res.redirect("login.html");
        } else {
            userDB.findUser(req.user.openId, error, error, success);
        }
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
            if (req.user) {
                if (theUser.customLoggedInStatus == 1) {
                    if (theUser.isAdmin == 'yes') {
                        res.redirect('admin.html');
                    } else if (theUser.isAdmin == 'no') {
                        res.sendFile(path.join(__dirname, '../views/client', 'client.html'));
                    }
                }
                else {
                    res.redirect("login1.html");
                }
            }
            else {
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
            if (req.user) {
                if (theUser.customLoggedInStatus == 1) {
                    if (theUser.isAdmin == 'yes') {
                        res.sendFile(path.join(__dirname, '../views/admin', 'admin.html'));
                    } else if (theUser.isAdmin == 'no') {
                        res.redirect('client.html');
                    }
                }
                else {
                    res.redirect("login1.html");
                }
            }
            else {
                res.redirect("login.html");
            }
        }

        userDB.findUser(req.user.openId, error, error, success);
    }
};