var receivedLogger = function (module) {
    var rL = require('./basic.js').receivedLogger;
    rL('authenticate.js', module);
};

var successLogger = function (module, text) {
    var sL = require('./basic.js').successLogger;
    return sL('authenticate.js', module, text);
};

var errorLogger = function (module, text, err) {
    var eL = require('./basic.js').errorLogger;
    return eL('authenticate.js', module, text, err);
};

module.exports = {

    //authenticates requests
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            next()
        } else {
            res.status(401).send({
                code: 401,
                notify: true,
                type: 'error',
                msg: 'You are not logged in. Please reload page',
                reason: errorLogger(module, 'req.isAuthenticated: user not logged in', err),
                disable: false,
                redirect: false,
                redirectPage: '/error/500.html'
            });
        }
    }
};