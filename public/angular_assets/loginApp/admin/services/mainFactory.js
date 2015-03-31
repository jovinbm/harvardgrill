angular.module('adminLoginApp')
    .factory('mainService', ['$log', '$window', '$rootScope', 'socket', 'socketService', 'globals',
        function ($log, $window, $rootScope, socket, socketService, globals) {

            socket.on('joined', function () {
                //clientStartup request seeks the overall status of the grill e.g open, closed, etc(not the orders);
                socketService.adminLoginStartUp()
                    .success(function (resp) {
                        $rootScope.$broadcast('allGrillStatuses', resp.allGrillStatus);
                    })
                    .error(function (errResponse) {
                        $rootScope.$broadcast('requestErrorHandler', errResponse);
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