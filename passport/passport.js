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
var bcrypt = require('bcrypt');

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
            var realName = profile.displayName || "";
            var email = profile.email || "";
            var realEmail = profile.email || "";

            userDB.findUser(openId, error, error, success);

            function success(theUser) {
                done(null, theUser, null);
            }

            //defining all callbacks
            function error(status, err) {
                if (status == 0) {
                    var user = new User({
                        openId: openId,
                        isAdmin: isAdmin,
                        uniqueCuid: uniqueCuid,
                        socketRoom: socketRoom,
                        realName: realName,
                        displayName: displayName,
                        realEmail: realEmail,
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

        }
    ));

    passport.use(new LocalStrategy(
        function (username, password, done) {
            var module = 'LocalStrategy';
            receivedLogger(module);

            if (username.length > 0 && password.length > 0) {
                //this function returns a status of 1 if the user does not exist, and (-1,theUser) if the
                //user exists
                //else (-1,err) if there was an error while executing db operations
                userDB.findUserWithUsername(username, errorDbUsername, errorDbUsername, successDbUsername);

                function successDbUsername(status, theUser) {
                    if (status == -1) {
                        //means the user exists
                        bcrypt.compare(password, theUser.password, function (err, res) {
                            if (err) {
                                consoleLogger(errorLogger(module, 'error comparing passwords', err));
                                done("A problem occurred when trying to log you in. Please try again", false, "error comparing password");
                            } else if (res) {
                                //means the password checks with hash
                                done(null, theUser, null)
                            } else {
                                //passwords don't check
                                consoleLogger(errorLogger(module, 'Failed! User local strategy authentication failed'));
                                done('You have entered incorrect credentials. Please try again', false, 'You have entered incorrect credentials. Please try again')
                            }
                        });
                    } else {
                        //means user does not exist(status here is 1, theUser is empty
                        //proceed to create the new user while checking that they have used the passwords tempclient/hgadmin

                        if (password == 'hgadmin') {
                            var openId = cuid();
                            var uniqueCuid = cuid();

                            var user = new User({
                                openId: openId,
                                isAdmin: 'yes',
                                uniqueCuid: uniqueCuid,
                                socketRoom: 'adminSocketRoom',
                                realName: '',
                                displayName: '',
                                username: username
                            });

                            userDB.saveUser(user, saveError, saveError, saveSuccess);

                            function saveSuccess(theSavedUser) {
                                done(null, theSavedUser, null)
                            }

                            function saveError(status, err) {
                                consoleLogger(errorLogger(module, 'Error saving user', err));
                                done("A problem occurred while trying to log you in. Please try again", false, "A problem occurred while trying to log you in. Please try again");
                            }

                        } else if (password == 'tempclient') {

                            //these are for development only, used to imitate a client

                            var openIdTemp = cuid();
                            var uniqueCuidTemp = cuid();
                            var socketRoomTemp = 'tempClient' + cuid();

                            var userTemp = new User({
                                openId: openIdTemp,
                                isAdmin: 'no',
                                uniqueCuid: uniqueCuidTemp,
                                socketRoom: socketRoomTemp,
                                realName: '',
                                displayName: '',
                                username: username
                            });

                            userDB.saveUser(userTemp, saveErrorTemp, saveErrorTemp, saveSuccessTemp);

                            function saveSuccessTemp(theSavedUser) {
                                done(null, theSavedUser, null)
                            }

                            function saveErrorTemp(status, err) {
                                consoleLogger(errorLogger(module, 'Error saving user', err));
                                done("A problem occurred when trying to log you in. Please try again", false, "A problem occurred when trying to log you in. Please try again");
                            }

                        } else {
                            consoleLogger(errorLogger(module, 'Failed! User local strategy authentication failed'));
                            done('You have entered incorrect credentials. Please try again', false, 'You have entered incorrect credentials. Please try again');
                        }
                    }
                }

                function errorDbUsername() {
                    consoleLogger(errorLogger(module, 'Error while trying to find user', err));
                    done("A problem occurred when trying to log you in. Please try again", false, "A problem occurred when trying to log you in. Please try again");
                }

            } else {
                consoleLogger(errorLogger(module, 'Failed! User local strategy authentication failed, username and(or) password required'));
                done('Username and(or) password required. Please try again', false, 'Username and(or) password required. Please try again');
            }
        }));

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