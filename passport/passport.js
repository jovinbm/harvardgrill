var receivedLogger = function (module) {
    var rL = require('../functions/basic.js').receivedLogger;
    rL('passport.js', module);
};

var successLogger = function (module, text) {
    var sL = require('../functions/basic.js').successLogger;
    return sL('passport.js', module, text);
};

var errorLogger = function (module, text, err) {
    var eL = require('../functions/basic.js').errorLogger;
    return eL('passport.js', module, text, err);
};


//harvard openId config
//var returnURL = "https://harvardgrill.herokuapp.com/harvardId";
//var realmURL = "https://harvardgrill.herokuapp.com";
var returnURL = "http://localhost:4000/harvardId";
var realmURL = "http://localhost:4000/";

var cuid = require('cuid');
var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var userDB = require('../db/user_db.js');
var User = require("../database/users/user_model.js");

module.exports = function (passport, OpenIDStrategy, LocalStrategy) {
    passport.use(new OpenIDStrategy({
            returnURL: returnURL,
            realm: realmURL,

            profile: true
        },
        function (identifier, profile, done) {
            var module = 'OpenIDStrategy';

            var openId = identifier;
            var isAdmin = 'no';
            var uniqueCuid = cuid();
            var socketRoom = cuid();
            var displayName = profile.displayName || "Harvard Member";
            var email = profile.emails[0].value || cuid() + "@harvardclass.com";
            var customLoggedInStatus = 0;

            //defining all callbacks
            function error(status, err) {
                var user = new User({
                    openId: openId,
                    isAdmin: isAdmin,
                    uniqueCuid: uniqueCuid,
                    socketRoom: socketRoom,
                    displayName: displayName,
                    email: email,
                    customLoggedInStatus: customLoggedInStatus
                });

                function saveError(status, err) {
                    errorLogger(module, 'Error saving user', err);
                    done("Authentication failed. Please try again", false);
                }

                function saveSuccess(theSavedUser) {
                    done(null, theSavedUser)
                }

                userDB.saveUser(user, saveError, saveError, saveSuccess);
            }

            function success(theUser) {
                done(null, theUser);
            }

            userDB.findUser(openId, error, error, success);

        }
    ));

    passport.use(new LocalStrategy(
        function (username, password, done) {
            var module = 'LocalStrategy';

            if (username.length > 0 && password.length > 0 && password == 'hgadmin') {
                var openId = cuid();
                var isAdmin = 'yes';
                var uniqueCuid = cuid();
                var socketRoom = 'adminSocketRoom';
                var displayName = 'Admin';
                var customUsername = 'Admin';
                var email = 'admin@harvardclass.com';
                var customLoggedInStatus = 1;

                var user = new User({
                    openId: openId,
                    isAdmin: isAdmin,
                    uniqueCuid: uniqueCuid,
                    socketRoom: socketRoom,
                    displayName: displayName,
                    customUsername: customUsername,
                    email: email,
                    customLoggedInStatus: customLoggedInStatus
                });

                function saveError(status, err) {
                    errorLogger(module, 'Error saving user', err);
                    done("A problem occurred while trying to log you in. Please try again", false);
                }

                function saveSuccess(theSavedUser) {
                    done(null, theSavedUser)
                }

                userDB.saveUser(user, saveError, saveError, saveSuccess);

            } else if (username.length > 0 && password.length > 0 && password == 'tempclient') {

                //these are for development only, used to imitate a client

                var openIdTemp = cuid();
                var isAdminTemp = 'no';
                var uniqueCuidTemp = cuid();
                var socketRoomTemp = 'tempClient' + cuid();
                var displayNameTemp = 'TempClient';
                var customUsernameTemp = 'TempClient';
                var emailTemp = 'tempclient@harvardclass.com';
                var customLoggedInStatusTemp = 0;

                var userTemp = new User({
                    openId: openIdTemp,
                    isAdmin: isAdminTemp,
                    uniqueCuid: uniqueCuidTemp,
                    socketRoom: socketRoomTemp,
                    displayName: displayNameTemp,
                    customUsername: customUsernameTemp,
                    email: emailTemp,
                    customLoggedInStatus: customLoggedInStatusTemp
                });

                function saveErrorTemp(status, err) {
                    errorLogger(module, 'Error saving user', err);
                    done("A problem occurred while trying to log you in. Please try again", false);
                }

                function saveSuccessTemp(theSavedUser) {
                    done(null, theSavedUser)
                }

                userDB.saveUser(userTemp, saveErrorTemp, saveErrorTemp, saveSuccessTemp);

            } else {
                errorLogger(module, 'Failed! User local strategy authentication failed');
                done(null, false, 'You have entered incorrect credentials. Please try again')
            }
        }
    ));

    passport.serializeUser(function (user, done) {
        //only save the user openId into the session to keep the data stored low
        done(null, user.openId);
    });

    passport.deserializeUser(function (openId, done) {
        //deserialize the saved openId in session and find the user with the userId
        function error(status) {
            if (status == -1 || status == 0) {
                next(null, false);
            }
        }

        function success(theUser) {
            done(null, theUser);
        }

        userDB.findUser(openId, error, error, success);
    });
};