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
var middleware = require('./functions/middleware.js');
var email = require('./functions/email.js');
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

app.get('/harvardId', loginAPI.clientHarvardLogin);
app.post('/localUserLogin', loginAPI.localUserLogin);
app.post('/adminInfoLogin', middleware.ensureAuthenticatedAngular, middleware.addUserData, loginAPI.adminInfoLogin);
app.post('/clientInfoLogin', middleware.ensureAuthenticatedAngular, middleware.addUserData, loginAPI.clientInfoLogin);


app.post('/harvardId/login', passport.authenticate('openid'));
app.get('/socket.io/socket.io.js', function (req, res) {
    res.sendfile("socket.io/socket.io.js");
});

//getting files
app.get('/', routes.index_Html);
app.get('/index.html', routes.index_Html);
app.get('/adminLogin.html', middleware.ensureAuthenticated, middleware.addUserData, routes.adminLogin_Html);
app.get('/clientLogin.html', middleware.ensureAuthenticated, middleware.addUserData, routes.clientLogin_Html);
app.get('/admin.html', middleware.ensureAuthenticated, middleware.addUserData, middleware.checkCustomLoggedInStatus, routes.admin_Html);
app.get('/adminProfile.html', middleware.ensureAuthenticated, middleware.addUserData, middleware.checkCustomLoggedInStatus, routes.admin_profile_Html);
app.get('/client.html', middleware.ensureAuthenticated, middleware.addUserData, middleware.checkCustomLoggedInStatus, routes.client_Html);
app.get('/clientProfile.html', middleware.ensureAuthenticated, middleware.addUserData, middleware.checkCustomLoggedInStatus, routes.client_profile_Html);
//end of getting files


//login api
app.get('/api/getTemporarySocketRoom', loginAPI.getTemporarySocketRoom);
app.post('/api/getAllGrillStatuses', loginAPI.getAllGrillStatuses);
app.post('/createAccount', loginAPI.createAccount);
app.post('/checkIfFullyRegistered', middleware.ensureAuthenticatedAngular, middleware.addUserData, loginAPI.checkIfFullyRegistered);
app.post('/updateUserDetails', middleware.ensureAuthenticatedAngular, middleware.addUserData, loginAPI.updateUserDetails);
app.post('/api/adminLoginStartUp', middleware.ensureAuthenticatedAngular, middleware.addUserData, loginAPI.adminLoginStartUp);
app.post('/api/clientLoginStartUp', middleware.ensureAuthenticatedAngular, middleware.addUserData, loginAPI.clientLoginStartUp);
//end of login api


//api inside the grill order
//getMyRoom is also accessed from login therefore don't disable, ie, don't put customLoggedInStatus check
app.get('/api/getMyRoom', middleware.ensureAuthenticatedAngular, middleware.addUserData, middleware.addUserGrillStatus, basicAPI.getSocketRoom);
app.post('/api/adminStartUp', middleware.ensureAuthenticatedAngular, middleware.addUserData, middleware.addUserGrillStatus, middleware.checkCustomLoggedInStatusAngular, middleware.checkUserIsAdmin, basicAPI.adminStartUp);
app.post('/api/clientStartUp', middleware.ensureAuthenticatedAngular, middleware.addUserData, middleware.addUserGrillStatus, middleware.checkCustomLoggedInStatusAngular, basicAPI.clientStartUp);

app.post('/api/openGrill', middleware.ensureAuthenticatedAngular, middleware.addUserData, middleware.addUserGrillStatus, middleware.checkCustomLoggedInStatusAngular, middleware.checkUserIsAdmin, middleware.checkGrillIsClosed, grillStatusAPI.openGrill);
app.post('/api/closeGrill', middleware.ensureAuthenticatedAngular, middleware.addUserData, middleware.addUserGrillStatus, middleware.checkCustomLoggedInStatusAngular, middleware.checkUserIsAdmin, middleware.checkGrillIsOpen, grillStatusAPI.closeGrill);
app.post('/api/createGrill', middleware.ensureAuthenticatedAngular, middleware.addUserData, middleware.checkUserIsAdmin, grillStatusAPI.createGrill);
app.post('/api/deleteGrill', middleware.ensureAuthenticatedAngular, middleware.addUserData, middleware.checkUserIsAdmin, grillStatusAPI.deleteGrill);
app.post('/api/getCurrentGrillStatus', middleware.ensureAuthenticatedAngular, middleware.addUserData, middleware.addUserGrillStatus, middleware.checkCustomLoggedInStatusAngular, grillStatusAPI.getCurrentGrillStatus);
app.post('/api/getAllComponentsIndexNames', middleware.ensureAuthenticatedAngular, middleware.addUserData, middleware.addUserGrillStatus, middleware.checkCustomLoggedInStatusAngular, grillStatusAPI.getAllComponentsIndexNames);
app.post('/api/updateAvailableComponents', middleware.ensureAuthenticatedAngular, middleware.addUserData, middleware.addUserGrillStatus, middleware.checkCustomLoggedInStatusAngular, middleware.checkUserIsAdmin, grillStatusAPI.updateAvailableComponents);

app.post('/api/addComponent', middleware.ensureAuthenticatedAngular, middleware.addUserData, middleware.addUserGrillStatus, middleware.checkCustomLoggedInStatusAngular, middleware.checkUserIsAdmin, middleware.checkGrillIsClosed, componentAPI.addComponent);
app.post('/api/saveEditedComponent', middleware.ensureAuthenticatedAngular, middleware.addUserData, middleware.addUserGrillStatus, middleware.checkCustomLoggedInStatusAngular, middleware.checkUserIsAdmin, middleware.checkGrillIsClosed, componentAPI.saveEditedComponent);
app.post('/api/deleteComponent', middleware.ensureAuthenticatedAngular, middleware.addUserData, middleware.addUserGrillStatus, middleware.checkCustomLoggedInStatusAngular, middleware.checkUserIsAdmin, middleware.checkGrillIsClosed, componentAPI.deleteComponent);

app.post('/api/getAllComponents', middleware.ensureAuthenticatedAngular, middleware.addUserData, middleware.addUserGrillStatus, middleware.checkCustomLoggedInStatusAngular, componentAPI.getAllComponents);
app.post('/api/getAvailableComponents', middleware.ensureAuthenticatedAngular, middleware.addUserData, middleware.addUserGrillStatus, middleware.checkCustomLoggedInStatusAngular, componentAPI.getAvailableComponents);

app.post('/api/getAdminClientOrders', middleware.ensureAuthenticatedAngular, middleware.addUserData, middleware.addUserGrillStatus, middleware.checkCustomLoggedInStatusAngular, middleware.checkUserIsAdmin, orderAPI.getAdminClientOrders);
app.post('/api/getMyRecentOrders', middleware.ensureAuthenticatedAngular, middleware.addUserData, middleware.addUserGrillStatus, middleware.checkCustomLoggedInStatusAngular, orderAPI.getMyRecentOrders);
app.post('/api/newClientOrder', middleware.ensureAuthenticatedAngular, middleware.addUserData, middleware.addUserGrillStatus, middleware.checkCustomLoggedInStatusAngular, middleware.checkGrillIsOpen, orderAPI.newClientOrder);
app.post('/api/markOrderAsDone', middleware.ensureAuthenticatedAngular, middleware.addUserData, middleware.addUserGrillStatus, middleware.checkCustomLoggedInStatusAngular, middleware.checkUserIsAdmin, orderAPI.markOrderAsDone);
app.post('/api/markOrderAsDeclined', middleware.ensureAuthenticatedAngular, middleware.addUserData, middleware.addUserGrillStatus, middleware.checkCustomLoggedInStatusAngular, middleware.checkUserIsAdmin, orderAPI.markOrderAsDeclined);
//end of api inside the grill order

//logout api
app.post('/api/logoutHarvardLogin', middleware.ensureAuthenticatedAngular, middleware.addUserData, logoutAPI.logoutHarvardLogin);
app.post('/api/logoutClientSession', middleware.ensureAuthenticatedAngular, middleware.addUserData, logoutAPI.logoutClientSession);
app.post('/api/logoutClientFull', middleware.ensureAuthenticatedAngular, middleware.addUserData, logoutAPI.logoutClientFull);
app.post('/api/logoutAdminFull', middleware.ensureAuthenticatedAngular, middleware.addUserData, logoutAPI.logoutAdminFull);
app.post('/api/logoutAdminSession', middleware.ensureAuthenticatedAngular, middleware.addUserData, logoutAPI.logoutAdminSession);
//end of logout api

//error handlers
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
app.use(function (err, req, res, next) {
    consoleLogger(errorLogger('404 Handler', 'New 404 DEVELOPMENT error'));
    res.status(err.status);
    res.sendFile(path.join(__dirname, './public/error/', '404.html'));
});


server.listen(port, function () {
    consoleLogger("Server listening at port " + port);
});

exports.io = io;