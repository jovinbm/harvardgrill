angular.module('grillApp')
    .factory('mainService', ['$window', '$rootScope', 'socket', 'socketService', 'globals',
        function ($window, $rootScope, socket, socketService, globals) {

            socket.on('joined', function () {
                console.log("JOINED EVENT RECEIVED");

                //adminStartup request seeks the overall status of the grill e.g open, closed, etc(not the orders)
                socketService.adminStartUp()
                    .success(function (resp) {
                        globals.currentGrillStatus(resp.currentGrillStatus, true);
                    })
                    .error(function (errResponse) {
                        $window.location.href = "/error/500.html";
                    });
            });

            return {
                done: function () {
                    return 1;
                }
            }
        }]);