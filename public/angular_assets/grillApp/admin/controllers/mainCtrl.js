angular.module('grillApp')
    .controller('MainController', ['$window', '$location', '$log', '$scope', '$rootScope', 'socket', 'mainService', 'socketService', 'globals',
        function ($window, $location, $log, $scope, $rootScope, socket, mainService, socketService, globals) {

            //gets user's details
            $scope.customUsername = globals.customUsername();
            $scope.uniqueCuid = globals.uniqueCuid();

            $scope.showToast = function (toastType, text) {
                switch (toastType) {
                    case "success":
                        toastr.clear();
                        toastr.success(text);
                        break;
                    case "warning":
                        toastr.warning(text, 'Warning', {
                            closeButton: true,
                            tapToDismiss: true
                        });
                        break;
                    case "error":
                        toastr.error(text, 'Error', {
                            closeButton: true,
                            tapToDismiss: true,
                            timeOut: false
                        });
                        break;
                    default:
                        //clears current list of toasts
                        toastr.clear();
                }
            };

            $rootScope.$on('showToast', function (event, data) {
                var toastType = data.toastType;
                var text = data.text;

                $scope.showToast(toastType, text);
            });

            //keeping track of how many times the state has changed (useful for refreshing controllers if the state has changed once)
            $scope.stateChanges = 0;
            $rootScope.$on('$stateChangeSuccess',
                function (event, toState, toParams, fromState, fromParams) {
                    $scope.stateChanges++;
                });

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


            $log.info('MainController booted successfully');
        }]);