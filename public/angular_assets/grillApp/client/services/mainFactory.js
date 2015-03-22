angular.module('grillApp')
    .factory('mainService', ['$log', '$window', '$rootScope', 'socket', 'socketService', 'globals',
        function ($log, $window, $rootScope, socket, socketService, globals) {

            socket.on('joined', function () {
                //clientStartup request seeks the overall status of the grill e.g open, closed, etc(not the orders);
                socketService.clientStartUp()
                    .success(function (resp) {
                        globals.currentGrillStatus(resp.currentGrillStatus, true);
                    })
                    .error(function (errResponse) {
                        $window.location.href = "/error/500.html";
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