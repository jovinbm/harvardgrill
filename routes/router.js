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

function getTheUser(req) {
    return req.customData.theUser;
}
function getTheCurrentGrillStatus(req) {
    return req.customData.currentGrillStatus;
}

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

    local_login_Html: function (req, res) {
        var module = 'local_login_Html';
        receivedLogger(module);

        if (req.user) {
            res.redirect("clientLogin.html");
        } else {
            res.render('local_login', {
                errorCode: 0,
                errorMessage: "No errors"
            })
        }
    },


    clientLogin_Html: function (req, res) {
        var module = 'clientLogin_Html';
        receivedLogger(module);
        var theUser = getTheUser(req);

        if (theUser.customLoggedInStatus == 1 && theUser.isAdmin == 'yes') {
            res.redirect('admin.html');
        } else if (theUser.customLoggedInStatus == 1 && theUser.isAdmin == 'no') {
            res.redirect('client.html');
        } else {
            if (theUser.isAdmin == 'yes') {
                res.redirect('adminLogin.html');
            } else {
                var gaUserId = "ga('set', '&uid', " + "'" + theUser.uniqueCuid + "');";
                res.render('client/client_login', {
                    gAnalyticsUserId: gaUserId
                })
            }
        }
    },


    adminLogin_Html: function (req, res) {
        var module = 'admin_login_Html';
        receivedLogger(module);
        var theUser = getTheUser(req);

        if (theUser.customLoggedInStatus == 1 && theUser.isAdmin == 'yes') {
            res.redirect('admin.html');
        } else if (theUser.customLoggedInStatus == 1 && theUser.isAdmin == 'no') {
            res.redirect('client.html');
        } else {
            if (theUser.isAdmin == 'yes') {
                var gaUserId = "ga('set', '&uid', " + "'" + theUser.uniqueCuid + "');";
                res.render('admin/admin_login', {
                    gAnalyticsUserId: gaUserId
                })
            } else {
                res.redirect('clientLogin.html')
            }
        }
    },


    client_Html: function (req, res) {
        var module = 'client_Html';
        receivedLogger(module);
        var theUser = getTheUser(req);

        if (theUser.isAdmin == 'yes') {
            res.redirect('admin.html');
        } else if (theUser.isAdmin == 'no') {
            var gaUserId = "ga('set', '&uid', " + "'" + theUser.uniqueCuid + "');";
            res.render('client/client.ejs', {
                gAnalyticsUserId: gaUserId
            });
        }
    },

    client_profile_Html: function (req, res) {
        var module = 'client_profile_Html';
        receivedLogger(module);
        var theUser = getTheUser(req);

        if (theUser.isAdmin == 'yes') {
            res.redirect('adminProfile.html');
        } else if (theUser.isAdmin == 'no') {
            var gaUserId = "ga('set', '&uid', " + "'" + theUser.uniqueCuid + "');";
            res.render('client/client_profile.ejs', {
                gAnalyticsUserId: gaUserId,
                displayName: theUser.displayName
            });
        }
    },

    admin_Html: function (req, res) {
        var module = 'admin_Html';
        receivedLogger(module);
        var theUser = getTheUser(req);

        if (theUser.isAdmin == 'yes') {
            var gaUserId = "ga('set', '&uid', " + "'" + theUser.uniqueCuid + "');";
            res.render('admin/admin.ejs', {
                gAnalyticsUserId: gaUserId
            });
        } else if (theUser.isAdmin == 'no') {
            res.redirect('client.html');
        }
    },

    admin_profile_Html: function (req, res) {
        var module = 'admin_profile_Html';
        receivedLogger(module);
        var theUser = getTheUser(req);

        if (theUser.isAdmin == 'yes') {
            var gaUserId = "ga('set', '&uid', " + "'" + theUser.uniqueCuid + "');";
            res.render('admin/admin_profile.ejs', {
                gAnalyticsUserId: gaUserId,
                displayName: theUser.displayName
            });
        } else if (theUser.isAdmin == 'no') {
            res.redirect('clientProfile.html');
        }
    }
};