angular.module('grillApp')
    .factory('mainService', ['$log', '$window', '$rootScope', 'socket', 'socketService', 'globals',
        function ($log, $window, $rootScope, socket, socketService, globals) {

            socket.on('joined', function () {
                $rootScope.$broadcast('isLoadingFalse');
                //clientStartup request seeks the overall status of the grill e.g open, closed, etc(not the orders);
                socketService.clientStartUp()
                    .success(function (resp) {
                        $rootScope.$broadcast('isLoadingFalse');

                        //n.b. this call to global.currentGrillStatus does not refresh(request new from server) the currentGrillStatus in globals
                        //a current grill status is passed in from the response on the server
                        globals.currentGrillStatus(resp.currentGrillStatus, true);
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