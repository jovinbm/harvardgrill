angular.module('grillApp')
    .controller('MainController', ['$window', '$location', '$scope', '$rootScope', 'socket', 'mainService', 'socketService', 'globals',
        function ($window, $location, $scope, $rootScope, socket, mainService, socketService, globals) {

            //gets user's details
            $scope.customUsername = globals.customUsername();
            $scope.uniqueCuid = globals.uniqueCuid();

            //back navigation functionality -- saves previous urls
            var history = [];
            $rootScope.$on('$routeChangeSuccess', function () {
                history.push($location.$$path);
            });
            $rootScope.back = function () {
                var prevUrl = history.length > 1 ? history.splice(-2)[0] : "/";
                $location.path(prevUrl);
            };

            //initial requests
            socketService.getSocketRoom()
                .success(function (data) {
                    console.log(JSON.stringify(data));
                    globals.socketRoom(data.socketRoom);
                    $scope.customUsername = globals.customUsername(data.customUsername);
                    $scope.uniqueCuid = globals.uniqueCuid(data["uniqueCuid"]);
                    socket.emit('joinRoom', {
                        room: data.socketRoom,
                        customUsername: data.customUsername
                    });

                    //a success emit is picked up by "mainService" in mainFactory.js
                })
                .error(function (errResponse) {
                    $window.location.href = "/error/500.html";
                });

        }]);