angular.module('localLoginApp')
    .controller('MainController', ['$filter', '$log', '$interval', '$window', '$location', '$scope', '$rootScope', 'socket', 'mainService', 'socketService', 'globals',
        function ($filter, $log, $interval, $window, $location, $scope, $rootScope, socket, mainService, socketService, globals) {

            $scope.allGrillStatuses = globals.allGrillStatuses(null, true, true);

            //*************request error handler****************

            //universalDisable variable is used to disable everything crucial in case an error
            //occurs.This is sometimes needed if a reload did not work
            $scope.universalDisable = false;
            $scope.showBanner = false;
            $scope.bannerClass = "";
            $scope.bannerMessage = "";

            $scope.universalDisableTrue = function () {
                $scope.universalDisable = true;
            };
            $scope.universalDisableFalse = function () {
                $scope.universalDisable = false;
            };
            $scope.responseStatusHandler = function (resp) {
                if (resp) {
                    if (resp.redirect) {
                        if (resp.redirect) {
                            $window.location.href = resp.redirectPage;
                        }
                    }
                    if (resp.disable) {
                        if (resp.disable) {
                            $scope.universalDisableTrue();
                        }
                    }
                    if (resp.notify) {
                        if (resp.type && resp.msg) {
                            $scope.showToast(resp.type, resp.msg);
                        }
                    }
                    if (resp.banner) {
                        if (resp.bannerClass && resp.msg) {
                            $scope.showBanner = true;
                            $scope.bannerClass = resp.bannerClass;
                            $scope.bannerMessage = resp.msg;
                        }
                    }
                    if (resp.reason) {
                        $log.warn(resp.reason);
                    }
                } else {
                    //do nothing
                }
            };

            $rootScope.$on('responseStatusHandler', function (event, resp) {
                $scope.responseStatusHandler(resp);
            });


            //***************end of request error handler**************

            //gets temp user's details (NB: THIS USER HAS NOT LOGGED IN, HELL IT MIGHT EVEN BE A HACKER)
            $scope.temporarySocketRoom = globals.temporarySocketRoom();

            //*****************************isLoading functions to disable elements while content is loading or processing
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

            //**********************************end of isLoading functions

            //********************toastr show functions
            $scope.showToast = function (toastType, text) {
                switch (toastType) {
                    case "success":
                        toastr.clear();
                        toastr.success(text);
                        break;
                    case "warning":
                        toastr.clear();
                        toastr.warning(text, 'Warning', {
                            closeButton: true,
                            tapToDismiss: true
                        });
                        break;
                    case "error":
                        toastr.clear();
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

            //****************************end of toastr show functions


            //***********time functions*****************
            $scope.currentTime = "";

            //set current Date
            $scope.currentTime = moment().format("ddd, MMM D, H:mm");
            var updateCurrentTime = function () {
                $scope.currentTime = moment().format("ddd, MMM D, H:mm");
            };
            $interval(updateCurrentTime, 20000, 0, true);

            //***************end of time functions******************

            //initial requests
            socketService.getMyTemporarySocketRoom()
                .success(function (resp) {
                    $scope.temporarySocketRoom = globals.temporarySocketRoom(resp.temporarySocketRoom);

                    //join the random temporary socketRoom given
                    socket.emit('joinRoom', {
                        room: resp.temporarySocketRoom
                    });

                    //a success emit("joined") is picked up below

                    $scope.responseStatusHandler(resp);
                })
                .error(function (errResponse) {
                    $scope.responseStatusHandler(errResponse);
                });

            socket.on('joined', function () {
                pollAllGrillStatuses();
            });


            //************THE LOCAL LOGIN FORM*****************

            $scope.masterLocalLoginForm = {
                username: "",
                password: ""
            };

            $scope.submitLocalLoginForm = function () {
                socketService.localUserLogin($scope.masterLocalLoginForm)
                    .success(function (resp) {
                        //the responseStatusHandler handles all basic response stuff including redirecting the user if a success is picked
                        $scope.responseStatusHandler(resp);
                    })
                    .error(function (errResponse) {
                        globals.allGrillStatuses(null, true, true);
                        $scope.masterLocalLoginForm.password = "";
                        $scope.responseStatusHandler(errResponse);
                    })
            };

            //*************END OF LOCAL LOGIN FORM FUNCTIONS*********


            //*********crucial intervals

            //polls current grill status
            function pollAllGrillStatuses() {
                globals.allGrillStatuses(null, true, true);
            }

            $interval(pollAllGrillStatuses, 300000, 0, true);
            //**********end of crucial intervals


            //**********************socket listeners

            socket.on('adminChanges', function () {
                $log.info("'adminChanges' event received");
                $rootScope.$broadcast('adminChanges');
            });

            //refresh everything on orderStatusChange
            $rootScope.$on('adminChanges', function () {
                globals.allGrillStatuses(null, true, true);
                $scope.showToast('success', 'This page has been refreshed to reflect changes in the system');
            });

            //receives grill status
            $rootScope.$on('allGrillStatuses', function (event, allGrillStatuses) {
                $scope.allGrillStatuses = allGrillStatuses;
            });


            $rootScope.$on('reconnectSuccess', function () {
            });

            $log.info('MainController booted successfully');

        }
    ]);