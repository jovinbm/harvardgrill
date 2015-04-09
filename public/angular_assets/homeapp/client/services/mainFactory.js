angular.module('clientHomeApp')
    .factory('mainService', ['$log', '$window', '$rootScope', 'socket', 'socketService', 'globals',
        function ($log, $window, $rootScope, socket, socketService, globals) {

            socket.on('joined', function () {
                //as of now, clientStartup just initially seeks all grill statuses
                socketService.clientHomeStartUp()
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