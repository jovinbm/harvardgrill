angular.module('grillApp')

    .factory('globals', ['$rootScope', 'socketService', function ($rootScope, socketService) {
        var username;
        var myUniqueCuid;
        var grillName;
        var mySocketRoom;
        var currentGrillStatus = {};
        return {
            username: function (newUsername) {
                if (newUsername) {
                    username = newUsername;
                    return username;
                } else {
                    return username;
                }
            },

            grillName: function (newGrillName) {
                if (newGrillName) {
                    grillName = newGrillName;
                    return grillName;
                } else {
                    return grillName;
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
            },

            currentGrillStatus: function (newGrillStatus, broadcast, refreshGrillStatus) {
                if (refreshGrillStatus) {
                    socketService.getCurrentGrillStatus()
                        .success(function (resp) {
                            $rootScope.$broadcast('responseStatusHandler', resp);
                            currentGrillStatus = resp.currentGrillStatus;

                            if (broadcast) {
                                $rootScope.$broadcast('currentGrillStatus', currentGrillStatus);
                            }
                        })
                        .error(function (errResponse) {
                            $rootScope.$broadcast('responseStatusHandler', errResponse);
                        });
                }

                if (newGrillStatus) {
                    currentGrillStatus = newGrillStatus;
                }
                if (broadcast) {
                    $rootScope.$broadcast('currentGrillStatus', currentGrillStatus);
                }

                return currentGrillStatus;
            }

        }
    }]);
