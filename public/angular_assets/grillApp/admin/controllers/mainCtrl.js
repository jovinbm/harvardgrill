angular.module('grillApp')
    .controller('MainController', ['$filter', '$interval', '$window', '$location', '$log', '$scope', '$rootScope', 'socket', 'mainService', 'socketService', 'globals',
        function ($filter, $interval, $window, $location, $log, $scope, $rootScope, socket, mainService, socketService, globals) {

            //*************request error handler****************

            //universalDisable variable is used to disable everything crucial in case an error
            //occurs.This is sometimes needed if a reload did not work
            $scope.universalDisable = false;
            $scope.universalDisableTrue = function () {
                $scope.universalDisable = true;
            };
            $scope.universalDisableFalse = function () {
                $scope.universalDisable = false;
            };

            $scope.requestErrorHandler = function (errResponse) {
                if (errResponse) {
                    if (errResponse.redirectToError == true) {
                        $window.location.href = errResponse.redirectPage;
                    }
                    if (errResponse.disable == true) {
                        $scope.universalDisableTrue();
                    }
                    $scope.showToast(errResponse.type, errResponse.msg);
                    $log.error(errResponse.reason);
                } else {
                    $scope.showToast('warning', 'Connection lost, please try again')
                }
            };

            $rootScope.$on('requestErrorHandler', function (event, errResponse) {
                $scope.requestErrorHandler(errResponse);
            });


            //***************end of request error handler**************


            //*******isLoadingFunctions****************
            $scope.isLoading = false;

            $scope.isLoadingTrue = function () {
                $scope.isLoading = true;
            };
            $scope.isLoadingFalse = function () {
                $scope.isLoading = false;
            };

            $rootScope.$on('isLoadingTrue', function () {
                $scope.isLoading = true;
            });

            $rootScope.$on('isLoadingFalse', function () {
                $scope.isLoading = false;
            });

            //************end of isLoading****************

            //gets user's details
            $scope.customUsername = globals.customUsername();
            $scope.uniqueCuid = globals.uniqueCuid();

            //****************toastr functions
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

            //*****************end of toastr functions


            //keeping track of how many times the state has changed (useful for refreshing controllers if the state has changed once)
            $scope.stateChanges = 0;
            $rootScope.$on('$stateChangeSuccess',
                function (event, toState, toParams, fromState, fromParams) {
                    $scope.stateChanges++;
                });


            //initial requests
            socketService.getSocketRoom()
                .success(function (data) {
                    globals.socketRoom(data.socketRoom);
                    $scope.customUsername = globals.customUsername(data.customUsername);
                    $scope.grillName = globals.grillName(data.grillName);

                    //updates the socket service with the grillName also, since globals
                    //requires socketService and you can't have socketService require globals
                    socketService.grillName(data.grillName);

                    $scope.uniqueCuid = globals.uniqueCuid(data["uniqueCuid"]);
                    socket.emit('joinRoom', {
                        room: data.socketRoom,
                        customUsername: data.customUsername
                    });

                    //a success emit is picked up by "mainService" in mainFactory.js
                })
                .error(function (errResponse) {
                    $scope.requestErrorHandler(errResponse);
                });


            //***************functions to deal with all key component indexes

            //allComponentsIndexNames is a variable that caries all references to the names of all component index
            //the key is the componentIndex, and value is it's name. It is updated by the function 'getAllComponentsIndexNames'
            //updated on every state change by the getAllComponentsIndexNames() function when controller restarts
            $scope.allComponentsIndexNames = {};


            //gets the index names of all components
            function getAllComponentsIndexNames() {
                socketService.getAllComponentsIndexNames()
                    .success(function (resp) {
                        resp.allComponentsIndexNames.forEach(function (componentReference) {
                            $scope.allComponentsIndexNames[componentReference.componentIndex] = componentReference.name;
                        });
                    })
                    .error(function (errResponse) {
                        $scope.requestErrorHandler(errResponse);
                    })
            }

            getAllComponentsIndexNames();

            //*******************end of functions concerned with allComponent indexes


            //*********crucial intervals

            //polls current grill status
            function pollCurrentGrillStatus() {
                globals.currentGrillStatus(null, true, true);
            }

            $interval(pollCurrentGrillStatus, 30000, 0, true);
            //**********end of crucial intervals


            $log.info('MainController booted successfully');
        }]);