angular.module('clientLoginApp')

    .factory('globals', ['$window', '$rootScope', 'socketService',
        function ($window, $rootScope, socketService) {
            var username;
            var myUniqueCuid;
            var grillName;
            var mySocketRoom;
            var allGrillStatuses = {};
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

                allGrillStatuses: function (newAllGrillStatuses, broadcast, refreshGrillStatus) {
                    if (refreshGrillStatus) {
                        socketService.getAllGrillStatuses()
                            .success(function (resp) {
                                $rootScope.$broadcast('responseStatusHandler', resp);
                                allGrillStatuses = resp.allGrillStatuses;

                                if (broadcast) {
                                    $rootScope.$broadcast('allGrillStatuses', allGrillStatuses);
                                }
                                $rootScope.$broadcast('responseStatusHandler', resp);
                            })
                            .error(function (errResponse) {
                                $rootScope.$broadcast('responseStatusHandler', errResponse);
                            });
                    } else {

                        if (newAllGrillStatuses) {
                            allGrillStatuses = newAllGrillStatuses;
                        }

                        if (broadcast) {
                            $rootScope.$broadcast('allGrillStatuses', allGrillStatuses);
                        }
                    }

                    return allGrillStatuses;
                }

            }
        }]);
