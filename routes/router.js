var path = require('path');
var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var userDB = require('../db/user_db.js');

var receivedLogger = function (module) {
    var rL = require('../functions/basic.js').receivedLogger;
    rL('router', module);
};

var successLogger = function (module, text) {
    var sL = require('../functions/basic.js').successLogger;
    return sL('router', module, text);
};
var errorLogger = function (module, text, err) {
    var eL = require('../functions/basic.js').errorLogger;
    return eL('router', module, text, err);
};


module.exports = {
    loginHtml: function (req, res) {
        var module = 'loginHtml';
        receivedLogger(module);

        if (req.user) {
            res.redirect("login1.html");
        } else {
            res.render('login', {
                errorCode: 0,
                errorMessage: "No errors"
            })
        }
    },


    getUserUniqueCuid: function (req, res) {
        var module = 'getUserUniqueCuid';
        receivedLogger(module);

        function error(status, err) {
            //send err message, this is printed on the console window
            res.status(500).send(err);
        }

        function success(theUser) {
            res.status(200).send({
                userUniqueCuid: theUser.uniqueCuid
            });
        }

        userDB.findUser(req.user.openId, error, error, success);
    },


    login_1_Html: function (req, res) {
        var module = 'login_1_Html';
        receivedLogger(module);

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.redirect("login.html");
                consoleLogger(errorLogger(module, 'Could not retrieve user', err));
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
                res.render('login1', {
                    displayName: theUser.displayName,
                    errorCode: 0,
                    errorMessage: "No errors"
                });
            } else {
                res.redirect("login.html");
            }
        }

        userDB.findUser(req.user.openId, error, error, success);
    },


    admin_login_Html: function (req, res) {
        var module = 'admin_login_Html';
        receivedLogger(module);

        if (req.user) {
            res.redirect("login1.html");
        } else {
            res.render('admin_login.ejs', {
                errorCode: 0,
                errorMessage: "No errors"
            })
        }
    },


    infoLogin: function (req, res) {
        var module = 'infoLogin';
        receivedLogger(module);

        function error(status, err) {
            if (status == -1 || status == 0) {
                consoleLogger(errorLogger(module, 'Could not retrieve user', err));
                res.redirect("login.html");
            }
        }

        function success(theUser) {

            function errorCuCls(status, err) {
                if (status == -1 || status == 0) {
                    if (status == -1 || status == 0) {
                        res.redirect("login.html");
                        consoleLogger(errorLogger(module, 'Could not toggle customLoggedIn status', err));
                    }
                }
            }

            function successUpdate() {

                //TO-do Check the username if it is available, if not render back
                //login1 using
                //res.render('login1', {
                //displayName: theUser.displayName,
                //        errorCode: 1,
                //        errorMessage: "Name already assigned to another individual. Please make another choice"
                //});
                //make a warning dismissible banner as in login.ejs

                if (theUser.isAdmin == 'yes') {
                    res.redirect('admin.html');
                } else if (theUser.isAdmin == 'no') {
                    res.redirect('client.html');
                } else {
                    errorCuCls();
                }
            }

            userDB.updateCuCls(req.user.openId, req.body.customUsername, 1, errorCuCls, errorCuCls, successUpdate)
        }

        if (!req.user) {
            res.redirect("login.html");
        } else {
            userDB.findUser(req.user.openId, error, error, success);
        }
    },


    client_Html: function (req, res) {
        var module = 'client_Html';
        receivedLogger(module);

        //get the customUsername
        function error(status, err) {
            if (status == -1 || status == 0) {
                consoleLogger(errorLogger(module, 'Could not retrieve user', err));
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
        var module = 'admin_Html';
        receivedLogger(module);

        //get the customUsername
        function error(status, err) {
            if (status == -1 || status == 0) {
                consoleLogger(errorLogger(module, 'Could not retrieve user', err));
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