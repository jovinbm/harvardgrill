var dbURL = 'mongodb://localhost:27017/grill';
var dbURL = 'mongodb://jovinbm:paka1995@ds049171.mongolab.com:49171/grill';
//var dbURL = 'mongodb://jovinbm:paka1995@dbh55.mongolab.com:27557/grilldev';


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

var basic = require('./functions/basic.js');
var consoleLogger = require('./functions/basic.js').consoleLogger;
var authenticate = require('./functions/authenticate.js');
var routes = require('./routes/router.js');
var basicAPI = require('./routes/basic_api.js');
var grillStatusAPI = require('./routes/grillStatus_api');
var componentAPI = require('./routes/component_api');
var orderAPI = require('./routes/order_api');
var logoutAPI = require('./routes/logout_api.js');

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


app.post('/harvardId/login', passport.authenticate('openid'));
//admin login
app.post('/adminLogin',
    passport.authenticate('local', {

        //the login1 in router will figure out if this user is an admin or not
        successRedirect: '/login1.html',

        //return the user to the admin login page
        failureRedirect: '/views/admin_login.html'
    }));

//client login
app.get('/harvardId',
    passport.authenticate('openid', {
        successRedirect: '/login1.html',
        failureRedirect: '/login.html'
    }));


app.get('/', routes.loginHtml);
app.get('/login.html', routes.loginHtml);
app.get('/login1.html', authenticate.ensureAuthenticated, routes.login_1_Html);
app.get('/admin.html', authenticate.ensureAuthenticated, routes.admin_Html);
app.get('/client.html', authenticate.ensureAuthenticated, routes.client_Html);
app.post('/infoLogin', routes.infoLogin);
app.get('/socket.io/socket.io.js', function (req, res) {
    res.sendfile("socket.io/socket.io.js");
});

//API
app.post('/sendEmail', basicAPI.sendEmail);
app.get('/api/getMyRoom', authenticate.ensureAuthenticated, basicAPI.getSocketRoom);
app.post('/api/adminStartUp', authenticate.ensureAuthenticated, basicAPI.adminStartUp);
app.post('/api/clientStartUp', authenticate.ensureAuthenticated, basicAPI.clientStartUp);

app.get('/api/openGrill', authenticate.ensureAuthenticated, grillStatusAPI.openGrill);
app.get('/api/closeGrill', authenticate.ensureAuthenticated, grillStatusAPI.closeGrill);
app.post('/api/getCurrentGrillStatus', authenticate.ensureAuthenticated, grillStatusAPI.getCurrentGrillStatus);
app.post('/api/getAllComponentsIndexNames', authenticate.ensureAuthenticated, grillStatusAPI.getAllComponentsIndexNames);
app.post('/api/updateAvailableComponents', authenticate.ensureAuthenticated, grillStatusAPI.updateAvailableComponents);

app.post('/api/addComponent', authenticate.ensureAuthenticated, componentAPI.addComponent);
app.post('/api/saveEditedComponent', authenticate.ensureAuthenticated, componentAPI.saveEditedComponent);
app.post('/api/deleteComponent', authenticate.ensureAuthenticated, componentAPI.deleteComponent);

app.get('/api/getAllOrderComponents', authenticate.ensureAuthenticated, componentAPI.getAllOrderComponents);
app.get('/api/getAllOmelets', authenticate.ensureAuthenticated, componentAPI.getAllOmelets);
app.get('/api/getAllWeeklySpecials', authenticate.ensureAuthenticated, componentAPI.getAllWeeklySpecials);
app.get('/api/getAllExtras', authenticate.ensureAuthenticated, componentAPI.getAllExtras);

app.get('/api/getAvailableOrderComponents', authenticate.ensureAuthenticated, componentAPI.getAvailableOrderComponents);
app.get('/api/getAvailableOmelets', authenticate.ensureAuthenticated, componentAPI.getAvailableOmelets);
app.get('/api/getAvailableWeeklySpecials', authenticate.ensureAuthenticated, componentAPI.getAvailableWeeklySpecials);
app.get('/api/getAvailableExtras', authenticate.ensureAuthenticated, componentAPI.getAvailableExtras);

app.post('/api/getAdminClientOrders', authenticate.ensureAuthenticated, orderAPI.getAdminClientOrders);
app.get('/api/getMyRecentOrders', authenticate.ensureAuthenticated, orderAPI.getMyRecentOrders);
app.post('/api/newClientOrder', authenticate.ensureAuthenticated, orderAPI.newClientOrder);
app.post('/api/markOrderAsDone', authenticate.ensureAuthenticated, orderAPI.markOrderAsDone);
app.post('/api/markOrderAsDeclined', authenticate.ensureAuthenticated, orderAPI.markOrderAsDeclined);

app.post('/api/logoutHarvardLogin', authenticate.ensureAuthenticated, logoutAPI.logoutHarvardLogin);
app.post('/api/logoutCustomOrder', authenticate.ensureAuthenticated, logoutAPI.logoutCustomOrder);
app.post('/api/logoutHarvardOrder', authenticate.ensureAuthenticated, logoutAPI.logoutHarvardOrder);
app.post('/api/adminLogout', authenticate.ensureAuthenticated, logoutAPI.adminLogout);

server.listen(port, function () {
    consoleLogger("Server listening at port " + port);
});

exports.io = io;