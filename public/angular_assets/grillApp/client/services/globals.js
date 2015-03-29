angular.module('grillApp')

    .factory('globals', ['$rootScope', 'socketService', function ($rootScope, socketService) {
        var customUsername;
        var myUniqueCuid;
        var grillName;
        var mySocketRoom;
        var currentGrillStatus = {};
        return {
            customUsername: function (newCustomUsername) {
                if (newCustomUsername) {
                    customUsername = newCustomUsername;
                    return customUsername;
                } else {
                    return customUsername;
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
                            currentGrillStatus = resp.currentGrillStatus;

                            if (broadcast) {
                                $rootScope.$broadcast('currentGrillStatus', currentGrillStatus);
                            }
                        })
                        .error(function (errResponse) {
                            $rootScope.$broadcast('requestErrorHandler', errResponse);
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
