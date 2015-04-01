angular.module('grillApp')
    .factory('mainService', ['$window', '$rootScope', '$log', 'socket', 'socketService', 'globals',
        function ($window, $rootScope, $log, socket, socketService, globals) {

            socket.on('joined', function () {
                //adminStartup request seeks the overall status of the grill e.g open, closed, etc(not the orders)
                socketService.adminStartUp()
                    .success(function (resp) {
                        $rootScope.$broadcast('responseStatusHandler', resp);
                        globals.currentGrillStatus(resp.currentGrillStatus, true);
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