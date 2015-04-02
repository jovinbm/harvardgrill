//var dbURL = 'mongodb://localhost:27017/grill';
//var dbURL = 'mongodb://jovinbm:paka1995@ds049171.mongolab.com:49171/grill';
var dbURL = 'mongodb://jovinbm:paka1995@dbh55.mongolab.com:27557/grilldev';


//THE APP
var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 4000;
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var OpenIDStrategy = require('passport-openid').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var moment = require('moment');
var fs = require('fs');

var basic = require('./functions/basic.js');
var consoleLogger = require('./functions/basic.js').consoleLogger;
var authenticate = require('./functions/authenticate.js');
var routes = require('./routes/router.js');
var basicAPI = require('./routes/basic_api.js');
var grillStatusAPI = require('./routes/grillStatus_api');
var componentAPI = require('./routes/component_api');
var orderAPI = require('./routes/order_api');
var loginAPI = require('./routes/login_api.js');
var logoutAPI = require('./routes/logout_api.js');

//db
var userDB = require('./db/user_db.js');

var receivedLogger = function (module) {
    var rL = require('./functions/basic.js').receivedLogger;
    rL('app.js', module);
};

var successLogger = function (module, text) {
    var sL = require('./functions/basic.js').successLogger;
    return sL('app.js', module, text);
};

var errorLogger = function (module, text, err) {
    var eL = require('./functions/basic.js').errorLogger;
    return eL('app.js', module, text, err);
};


//version1 of connect
mongoose.connect(dbURL);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: Problem while attempting to connect to database'));
db.once('open', function () {
    consoleLogger("Successfully connected to database");
});
autoIncrement.initialize(mongoose.connection);

//mongoose models that require access to connection params
var componentSchema = require('./database/order_components/component_schema.js');
componentSchema.plugin(autoIncrement.plugin, {
    model: 'Component',
    field: 'componentIndex',
    startAt: 1
});

var orderSchema = require('./database/orders/order_schema.js');
orderSchema.plugin(autoIncrement.plugin, {
    model: 'Order',
    field: 'orderIndex',
    startAt: 1
});

// view engine setup
app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use("/public", express.static(path.join(__dirname, '/public')));
app.use("/views", express.static(path.join(__dirname, '/views')));
app.use("/error", express.static(path.join(__dirname, '/public/error')));
app.use("/bower_components", express.static(path.join(__dirname, '/bower_components')));

app.use(cookieParser());
app.use(session({
    key: 'grillkey',
    cookie: {path: '/', httpOnly: true, secure: false, maxAge: 604800000000},
    secret: 'hssjbm12234bsidh)))^Hjdsb',
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    saveUninitialized: false,
    resave: false
}));
app.use(passport.initialize());
app.use(passport.session());

//configure passport
require('./passport/passport.js')(passport, OpenIDStrategy, LocalStrategy);


//insert any new client into a unique room == to his socketID
io.on('connection', function (socket) {
    socket.on('joinRoom', function (data) {
        var room = data.room;
        socket.join(room);
        socket.emit('joined');
    });
});

//harvard login
app.post('/harvardId/login', passport.authenticate('openid'));


//admin login
app.post('/adminUserLogin', function (req, res, next) {
    var grillName = req.body.grillName;

    passport.authenticate('local', function (err, user, info) {
        var module = 'app.post /adminUserLogin';

        if (err) {
            return res.status(500).send({
                code: 500,
                banner: true,
                bannerClass: 'alert alert-dismissible alert-warning',
                msg: info || err,
                reason: errorLogger(module, info || err, err)
            });
        }
        if (!user) {
            return res.status(401).send({
                code: 401,
                banner: true,
                bannerClass: 'alert alert-dismissible alert-warning',
                msg: info || err,
                reason: errorLogger(module, info || err, err)
            });
        }
        req.logIn(user, function (err) {
            if (err) {
                errorLogger('req.login', err, err);

                return res.status(500).send({
                    code: 500,
                    banner: true,
                    bannerClass: 'alert alert-dismissible alert-warning',
                    msg: "A problem occurred when trying to log you in. Please try again",
                    reason: errorLogger(module, 'Failed! req.login()', err)
                });
            } else {
                //add the grillName to the user
                userDB.updateGrillName(user.openId, grillName, errorUpdateGrillName, errorUpdateGrillName, success);

                function errorUpdateGrillName(status, err) {
                    errorLogger('updateGrillName', err, err);
                    //log the user out
                    req.logout();

                    return res.status(500).send({
                        code: 500,
                        banner: true,
                        bannerClass: 'alert alert-dismissible alert-warning',
                        msg: "A problem occurred when trying to log you in. Please try again",
                        reason: errorLogger(module, 'Failed! userDB.updateGrillName')
                    });
                }

                function success() {
                    return res.status(200).send({
                        code: 200,
                        notify: false,
                        type: 'success',
                        msg: "You have successfully logged in",
                        reason: successLogger(module, 'adminLoginSuccess'),
                        disable: false,
                        redirect: true,
                        redirectPage: '/clientLogin.html'
                    });
                }
            }
        });
    })(req, res, next);
});

//client login
app.get('/harvardId', function (req, res, next) {
    passport.authenticate('openid', function (err, user, info) {
        var module = 'app.post /harvardId';

        if (err) {
            errorLogger(module, err, err);
            return res.render('login', {
                errorCode: 1,
                errorMessage: "Authentication failed. Please try again"
            })
        }
        if (!user) {
            errorLogger(module, "Authentication failed. Please try again", err);
            return res.render('login', {
                errorCode: 1,
                errorMessage: "Authentication failed. Please try again"
            })
        }
        req.logIn(user, function (err) {
            if (err) {
                errorLogger(module, err, err);
                return res.render('login', {
                    errorCode: 1,
                    errorMessage: "Authentication failed. Please try again"
                })
            }
            return res.redirect('clientLogin.html');
        });
    })(req, res, next);
});


app.get('/', routes.loginHtml);
app.get('/login.html', routes.loginHtml);
app.get('/adminLogin.html', routes.admin_login_Html);
app.get('/clientLogin.html', authenticate.ensureAuthenticated, routes.clientLogin_Html);
app.get('/admin.html', authenticate.ensureAuthenticated, routes.admin_Html);
app.get('/client.html', authenticate.ensureAuthenticated, routes.client_Html);
app.post('/checkIfFullyRegistered', authenticate.ensureAuthenticatedAngular, authenticate.checkIfFullyRegistered);
app.post('/updateUserDetails', authenticate.ensureAuthenticatedAngular, loginAPI.updateUserDetails);
app.post('/clientInfoLogin', authenticate.ensureAuthenticatedAngular, routes.clientInfoLogin);
app.get('/socket.io/socket.io.js', function (req, res) {
    res.sendfile("socket.io/socket.io.js");
});

//API
app.get('/api/getTemporarySocketRoom', loginAPI.getTemporarySocketRoom);
app.post('/api/getAllGrillStatuses', loginAPI.getAllGrillStatuses);

app.post('/api/adminLoginStartUp', loginAPI.adminLoginStartUp);
app.post('/api/clientLoginStartUp', authenticate.ensureAuthenticatedAngular, loginAPI.clientLoginStartUp);

app.post('/sendEmail', basicAPI.sendEmail);
app.get('/api/getMyRoom', authenticate.ensureAuthenticatedAngular, basicAPI.getSocketRoom);
app.post('/api/adminStartUp', authenticate.ensureAuthenticatedAngular, basicAPI.adminStartUp);
app.post('/api/clientStartUp', authenticate.ensureAuthenticatedAngular, basicAPI.clientStartUp);

app.post('/api/openGrill', authenticate.ensureAuthenticatedAngular, grillStatusAPI.openGrill);
app.post('/api/closeGrill', authenticate.ensureAuthenticatedAngular, grillStatusAPI.closeGrill);
app.post('/api/getCurrentGrillStatus', authenticate.ensureAuthenticatedAngular, grillStatusAPI.getCurrentGrillStatus);
app.post('/api/getAllComponentsIndexNames', authenticate.ensureAuthenticatedAngular, grillStatusAPI.getAllComponentsIndexNames);
app.post('/api/updateAvailableComponents', authenticate.ensureAuthenticatedAngular, grillStatusAPI.updateAvailableComponents);

app.post('/api/addComponent', authenticate.ensureAuthenticatedAngular, componentAPI.addComponent);
app.post('/api/saveEditedComponent', authenticate.ensureAuthenticatedAngular, componentAPI.saveEditedComponent);
app.post('/api/deleteComponent', authenticate.ensureAuthenticatedAngular, componentAPI.deleteComponent);

app.post('/api/getAllOrderComponents', authenticate.ensureAuthenticatedAngular, componentAPI.getAllOrderComponents);
app.post('/api/getAllOmelets', authenticate.ensureAuthenticatedAngular, componentAPI.getAllOmelets);
app.post('/api/getAllWeeklySpecials', authenticate.ensureAuthenticatedAngular, componentAPI.getAllWeeklySpecials);
app.post('/api/getAllExtras', authenticate.ensureAuthenticatedAngular, componentAPI.getAllExtras);

app.post('/api/getAvailableOrderComponents', authenticate.ensureAuthenticatedAngular, componentAPI.getAvailableOrderComponents);
app.post('/api/getAvailableOmelets', authenticate.ensureAuthenticatedAngular, componentAPI.getAvailableOmelets);
app.post('/api/getAvailableWeeklySpecials', authenticate.ensureAuthenticatedAngular, componentAPI.getAvailableWeeklySpecials);
app.post('/api/getAvailableExtras', authenticate.ensureAuthenticatedAngular, componentAPI.getAvailableExtras);

app.post('/api/getAdminClientOrders', authenticate.ensureAuthenticatedAngular, orderAPI.getAdminClientOrders);
app.post('/api/getMyRecentOrders', authenticate.ensureAuthenticatedAngular, orderAPI.getMyRecentOrders);
app.post('/api/newClientOrder', authenticate.ensureAuthenticatedAngular, orderAPI.newClientOrder);
app.post('/api/markOrderAsDone', authenticate.ensureAuthenticatedAngular, orderAPI.markOrderAsDone);
app.post('/api/markOrderAsDeclined', authenticate.ensureAuthenticatedAngular, orderAPI.markOrderAsDeclined);

app.post('/api/logoutHarvardLogin', authenticate.ensureAuthenticatedAngular, logoutAPI.logoutHarvardLogin);
app.post('/api/logoutClientSession', authenticate.ensureAuthenticatedAngular, logoutAPI.logoutClientSession);
app.post('/api/logoutClientFull', authenticate.ensureAuthenticatedAngular, logoutAPI.logoutClientFull);
app.post('/api/adminLogout', authenticate.ensureAuthenticatedAngular, logoutAPI.adminLogout);

//error handlers
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
app.use(function (err, req, res, next) {
    res.status(err.status);
    res.sendFile(path.join(__dirname, './public/error/', '404.html'));
    errorLogger('404 Handler', 'New 404 DEVELOPMENT error');
});


server.listen(port, function () {
    consoleLogger("Server listening at port " + port);
});

exports.io = io;