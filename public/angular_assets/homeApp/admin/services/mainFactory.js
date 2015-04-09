angular.module('adminHomeApp')
    .factory('mainService', ['$log', '$window', '$rootScope', 'socket', 'socketService', 'globals',
        function ($log, $window, $rootScope, socket, socketService, globals) {

            socket.on('joined', function () {
                //adminHomeStartup request seeks the overall status of the grill e.g open, closed, etc(not the orders);
                socketService.adminHomeStartUp()
                    .success(function (resp) {
                        $rootScope.$broadcast('responseStatusHandler', resp);
                        $rootScope.$broadcast('allGrillStatuses', resp.allGrillStatuses);
                    })
                    .error(function (errResponse) {
                        $rootScope.$broadcast('responseStatusHandler', errResponse);
                    });
            });

            socket.on('reconnect', function () {
                $log.info("'reconnect sequence' triggered");
                $rootScope.$broadcast('reconnectSuccess');
            });

            return {
                done: function () {
                    return 1;
                }
            }
        }]);