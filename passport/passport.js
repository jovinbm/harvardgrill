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
            var uniqueCuid = cuid();
            var socketRoom = cuid();
            var isAdmin = 'no';
            var displayName = profile.displayName || "";
            var email = profile.email || "";

            //defining all callbacks
            function error(status, err) {
                if (status == 0) {
                    var user = new User({
                        openId: openId,
                        isAdmin: isAdmin,
                        uniqueCuid: uniqueCuid,
                        socketRoom: socketRoom,
                        displayName: displayName,
                        email: email
                    });

                    function saveError(status, err) {
                        consoleLogger(errorLogger(module, 'Error saving user', err));
                        done("Authorization failed. Please try again", false, "Authorization failed. Please try again");
                    }

                    function saveSuccess(theSavedUser) {
                        done(null, theSavedUser, null)
                    }

                    userDB.saveUser(user, saveError, saveError, saveSuccess);
                } else {
                    done("Authorization failed. Please try again", false, "Authorization failed. Please try again");
                }
            }

            function success(theUser) {
                done(null, theUser, null);
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
                var tempUsername = 'Admin';
                var customLoggedInStatus = 1;

                var user = new User({
                    openId: openId,
                    isAdmin: isAdmin,
                    uniqueCuid: uniqueCuid,
                    socketRoom: socketRoom,
                    displayName: displayName,
                    username: tempUsername,
                    customLoggedInStatus: customLoggedInStatus
                });

                function saveError(status, err) {
                    consoleLogger(errorLogger(module, 'Error saving user', err));
                    done("A problem occurred while trying to log you in. Please try again", false, "A problem occurred while trying to log you in. Please try again");
                }

                function saveSuccess(theSavedUser) {
                    done(null, theSavedUser, null)
                }

                userDB.saveUser(user, saveError, saveError, saveSuccess);

            } else if (username.length > 0 && password.length > 0 && password == 'tempclient') {

                //these are for development only, used to imitate a client

                var openIdTemp = cuid();
                var isAdminTemp = 'no';
                var uniqueCuidTemp = cuid();
                var socketRoomTemp = 'tempClient' + cuid();
                var displayNameTemp = 'TempClient';
                var usernameTemp = 'TempClient';

                var userTemp = new User({
                    openId: openIdTemp,
                    isAdmin: isAdminTemp,
                    uniqueCuid: uniqueCuidTemp,
                    socketRoom: socketRoomTemp,
                    displayName: displayNameTemp,
                    username: usernameTemp
                });

                function saveErrorTemp(status, err) {
                    consoleLogger(errorLogger(module, 'Error saving user', err));
                    done("A problem occurred when trying to log you in. Please try again", false, "A problem occurred when trying to log you in. Please try again");
                }

                function saveSuccessTemp(theSavedUser) {
                    done(null, theSavedUser, null)
                }

                userDB.saveUser(userTemp, saveErrorTemp, saveErrorTemp, saveSuccessTemp);

            } else {
                consoleLogger(errorLogger(module, 'Failed! User local strategy authentication failed'));
                done('You have entered incorrect credentials. Please try again', false, 'You have entered incorrect credentials. Please try again')
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