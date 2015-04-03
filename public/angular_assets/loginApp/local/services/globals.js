angular.module('localLoginApp')

    .factory('globals', ['$window', '$rootScope', 'socketService',
        function ($window, $rootScope, socketService) {
            var myTemporarySocketRoom;
            var allGrillStatuses = {};
            return {

                temporarySocketRoom: function (newTemporarySocketRoom) {
                    if (newTemporarySocketRoom) {
                        myTemporarySocketRoom = newTemporarySocketRoom;
                    } else {
                        return myTemporarySocketRoom;
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
