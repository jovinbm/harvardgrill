angular.module('adminLoginApp')

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
                                allGrillStatuses = resp.allGrillStatuses;

                                if (broadcast) {
                                    $rootScope.$broadcast('allGrillStatuses', allGrillStatuses);
                                }
                            })
                            .error(function (errResponse) {
                                $rootScope.$broadcast('requestErrorHandler', errResponse);
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
