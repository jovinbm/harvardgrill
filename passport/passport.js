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
            var openId = identifier;
            var uniqueCuid = cuid();
            var socketRoom = cuid();
            var displayName = profile.displayName || "Harvard Member";
            var email = profile.emails[0].value || cuid() + "@harvardclass.com";

            //defining all callbacks
            function error(status, err) {
                consoleLogger("**** Passport.use err = " + err);
                if (status == -1 || status == 0) {
                    var user = new User({
                        openId: openId,
                        uniqueCuid: uniqueCuid,
                        socketRoom: socketRoom,
                        displayName: displayName,
                        email: email
                    });

                    function saveError(status, err) {
                        if (status == -1) {
                            consoleLogger("**** Passport.use: saveError = " + err);
                            done(new Error("ERROR: app.js: passport.use: Error saving/ retrieving info"));
                        }
                    }

                    function saveSuccess(theSavedUser) {
                        done(null, theSavedUser)
                    }

                    userDB.saveUser(user, saveError, saveError, saveSuccess);
                }
            }

            function success(theUser) {
                done(null, theUser);
            }

            userDB.findUser(openId, error, error, success);

        }
    ));

    passport.use(new LocalStrategy(
        function (username, password, done) {
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
                    if (status == -1) {
                        consoleLogger("**** Passport.use: saveError = " + err);
                        done(new Error("ERROR: app.js: passport.use: Error saving/ retrieving info"));
                    }
                }

                function saveSuccess(theSavedUser) {
                    done(null, theSavedUser)
                }

                userDB.saveUser(user, saveError, saveError, saveSuccess);

            } else {
                done(new Error("ERROR: app.js: passport.use: Incorrect Username or Password"));
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
                done(new Error("ERROR: app.js: passport.deserializeUser: Error retrieving info"));
            }
        }

        function success(theUser) {
            done(null, theUser);
        }

        userDB.findUser(openId, error, error, success);
    });
};