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
            res.redirect("clientLogin.html");
        } else {
            res.render('login', {
                errorCode: 0,
                errorMessage: "No errors"
            })
        }
    },


    clientLogin_Html: function (req, res) {
        var module = 'clientLogin_Html';
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
                var gaUserId = "ga('set', '&uid', " + "'" + theUser.uniqueCuid + "');";
                res.render('client_login', {
                    displayName: theUser.displayName,
                    errorCode: 0,
                    errorMessage: "No errors",
                    gAnalyticsUserId: gaUserId
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
            res.redirect("clientLogin.html");
        } else {
            res.render('admin_login.ejs', {
                errorCode: 0,
                errorMessage: "No errors"
            })
        }
    },


    clientInfoLogin: function (req, res) {
        var module = 'clientInfoLogin';
        receivedLogger(module);

        var username = req.body.username;
        var password = req.body.password;
        var grillName = req.body.grillName;

        function error(status, err) {
            if (status == -1 || status == 0) {
                consoleLogger(errorLogger(module, 'Could not retrieve user', err));
                res.redirect("login.html");
            }
        }

        function success(theUser) {

            function errorCuCls(status, err) {
                res.status(401).send({
                    code: 401,
                    notify: true,
                    type: 'warning',
                    msg: 'Failed to log you in. Please try again',
                    reason: errorLogger(module, 'Could not update customLoggedinStatus', err),
                    disable: false,
                    redirect: false,
                    redirectPage: '/error/500.html'
                });
                consoleLogger(errorLogger(module, 'Could not update customLoggedinStatus', err));
            }

            function successUpdateCuCls() {

                function errorUpdateGrillName(status, err) {
                    res.status(401).send({
                        code: 401,
                        notify: true,
                        type: 'warning',
                        msg: 'Failed to log you in. Please try again',
                        reason: errorLogger(module, 'Could not update grillName', err),
                        disable: false,
                        redirect: false,
                        redirectPage: '/error/500.html'
                    });
                    consoleLogger(errorLogger(module, 'Could not update grillName', err));
                }

                function successUpdateGrillName() {

                    function errorUpdateUsername(status, err) {
                        res.status(401).send({
                            code: 401,
                            notify: true,
                            type: 'warning',
                            msg: 'Failed to log you in. Please try again',
                            reason: errorLogger(module, 'Could not update username', err),
                            disable: false,
                            redirect: false,
                            redirectPage: '/error/500.html'
                        });
                        consoleLogger(errorLogger(module, 'Could not update username', err));
                    }

                    function successUpdateUsername() {
                        //TO-do Check the username if it is available, if not render back
                        //clientLogin using
                        //res.render('client_login', {
                        //displayName: theUser.displayName,
                        //        errorCode: 1,
                        //        errorMessage: "Name already assigned to another individual. Please make another choice"
                        //});
                        //make a warning dismissible banner as in login.ejs

                        if (theUser.isAdmin == 'yes') {
                            res.redirect('admin.html');
                            res.status(200).send({
                                code: 200,
                                redirect: true,
                                redirectPage: '/admin.html'
                            });
                            consoleLogger(errorLogger(module, 'Could not update username', err));
                        } else if (theUser.isAdmin == 'no') {
                            res.status(200).send({
                                code: 200,
                                redirect: true,
                                redirectPage: '/client.html'
                            });
                        } else {
                            errorCuCls();
                        }
                    }

                    userDB.updateUsername(req.user.openId, username, errorUpdateUsername, errorUpdateUsername, successUpdateUsername);

                }

                userDB.updateGrillName(req.user.openId, grillName, errorUpdateGrillName, errorUpdateGrillName, successUpdateGrillName);
            }

            userDB.updateCuCls(req.user.openId, req.body.username, 1, errorCuCls, errorCuCls, successUpdateCuCls)
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

        //get the username
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
                        var gaUserId = "ga('set', '&uid', " + "'" + theUser.uniqueCuid + "');";
                        res.render('client/client.ejs', {
                            gAnalyticsUserId: gaUserId
                        });
                    }
                }
                else {
                    res.redirect("clientLogin.html");
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

        //get the username
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
                        var gaUserId = "ga('set', '&uid', " + "'" + theUser.uniqueCuid + "');";
                        res.render('admin/admin.ejs', {
                            gAnalyticsUserId: gaUserId
                        });
                    } else if (theUser.isAdmin == 'no') {
                        res.redirect('client.html');
                    }
                }
                else {
                    res.redirect("clientLogin.html");
                }
            }
            else {
                res.redirect("login.html");
            }
        }

        userDB.findUser(req.user.openId, error, error, success);
    }
};