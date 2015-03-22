angular.module('grillApp')

    .factory('globals', ['$rootScope', function ($rootScope) {
        var myCustomUsername;
        var myUniqueCuid;
        var mySocketRoom;
        return {
            customUsername: function (newCustomUsername) {
                if (newCustomUsername) {
                    myCustomUsername = newCustomUsername;
                    return myCustomUsername;
                } else {
                    return myCustomUsername;
                }
            },

            uniqueCuid: function (newUniqueCuid) {
                if (newUniqueCuid) {
                    myUniqueCuid = newUniqueCuid;
                    return myUniqueCuid;
                } else {
                    return myUniqueCuid;
                }
            },

            socketRoom: function (newSocketRoom) {
                if (newSocketRoom) {
                    mySocketRoom = newSocketRoom;
                } else {
                    return mySocketRoom;
                }
            }
        }
    }]);
