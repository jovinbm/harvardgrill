angular.module('grillApp')

    .factory('globals', ['$rootScope', 'socketService', function ($rootScope, socketService) {
        var myCustomUsername;
        var myUniqueCuid;
        var mySocketRoom;
        var currentGrillStatus = {};
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
            },

            currentGrillStatus: function (newGrillStatus, broadcast, refreshGrillStatus) {
                if (refreshGrillStatus) {
                    $rootScope.$broadcast('isLoadingTrue');
                    socketService.getCurrentGrillStatus()
                        .success(function (resp) {
                            currentGrillStatus = resp.currentGrillStatus;
                            $rootScope.$broadcast('isLoadingFalse');
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
