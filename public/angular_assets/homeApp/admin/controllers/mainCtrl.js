angular.module('adminHomeApp')
    .controller('MainController', ['$filter', '$log', '$interval', '$window', '$location', '$scope', '$rootScope', 'socket', 'mainService', 'socketService', 'globals', 'referenceService', 'allGrillService',
        function ($filter, $log, $interval, $window, $location, $scope, $rootScope, socket, mainService, socketService, globals, referenceService, allGrillService) {

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
                    if (resp.registrationBanner) {
                        if (resp.bannerClass && resp.msg) {
                            $scope.showRegistrationBanner = true;
                            $scope.registrationBannerClass = resp.bannerClass;
                            $scope.registrationBannerMessage = resp.msg;
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

            $scope.toGrillOrderFormModel = {
                username: "",
                password: "",
                //grillName is updated when submitting
                grillName: ""
            };

            $scope.allGrillStatuses = globals.allGrillStatuses(null, true, true);
            $scope.mySocketRoom = globals.socketRoom();
            $scope.myUsername = globals.username();
            $scope.myUniqueCuid = globals.uniqueCuid();


            //******************registration details and functions
            $scope.registrationDetails = {
                updatePassword: false,
                firstName: "",
                lastName: "",
                username: "",
                email: "",
                password1: "",
                password2: "",
                invitationCode: ""
            };
            //variable set to 'loading' to prevent showing of both the registration form / login form while the content is being loaded
            $scope.isFullyRegistered = 'loading';

            $scope.completeAccountRegistration = function () {
                socketService.completeAccountRegistration($scope.registrationDetails)
                    .success(function (resp) {
                        //the responseStatusHandler handles all basic response stuff including redirecting the user if a success is picked
                        $scope.responseStatusHandler(resp);
                    })
                    .error(function (errResponse) {
                        //hide password field since grill selection will be refreshed

                        $scope.oneGrillIsSelected = false;
                        globals.allGrillStatuses(null, true, true);
                        $scope.registrationDetails.password1 = "";
                        $scope.registrationDetails.password2 = "";
                        $scope.registrationDetails.invitationCode = "";
                        $scope.responseStatusHandler(errResponse);
                    })
            };

            //************end of registration details

            //initial requests
            socketService.checkIfFullyRegistered()
                .success(function (resp) {
                    $scope.isFullyRegistered = true;
                    continueSocketRoom();
                })
                .error(function (errResponse) {
                    if (errResponse.loginErrorType == 'user') {
                        //then user is not logged in
                        $scope.isFullyRegistered = false;
                        $scope.registrationDetails.fullName = errResponse.availableDetails.fullName;
                        $scope.registrationDetails.username = errResponse.availableDetails.username;
                        $scope.registrationDetails.email = errResponse.availableDetails.email;
                        if (errResponse.updatePassword) {
                            $scope.registrationDetails.updatePassword = true;
                        }
                    } else {
                        $scope.responseStatusHandler(errResponse);
                    }
                    continueSocketRoom();
                });

            function continueSocketRoom() {
                //initial requests
                socketService.getSocketRoom()
                    .success(function (resp) {
                        $scope.mySocketRoom = globals.socketRoom(resp.socketRoom);
                        $scope.myUsername = globals.username(resp.username);
                        $scope.toGrillOrderFormModel.username = resp.username;
                        $scope.myUniqueCuid = globals.uniqueCuid(resp.uniqueCuid);

                        //join the random temporary socketRoom given
                        socket.emit('joinRoom', {
                            room: resp.socketRoom
                        });

                        //a success emit("joined") is picked up by "mainService" in mainFactory.js

                        $scope.responseStatusHandler(resp);
                    })
                    .error(function (errResponse) {
                        $scope.responseStatusHandler(errResponse);
                    });
            }


            //************THE ADMIN LOGIN FORM*****************

            $scope.toGrillOrderFormModel = {
                username: "",
                password: "",
                //grillName is updated when submitting
                grillName: ""
            };

            $scope.signInToGrillOrder = function () {
                //check that only one grill is selected
                checkIfGrillIsSelected();
                if ($scope.oneGrillIsSelected) {
                    //find which grill is selected
                    for (var prop in $scope.allGrillStatusesModel) {
                        if ($scope.allGrillStatusesModel.hasOwnProperty(prop)) {
                            if ($scope.allGrillStatusesModel[prop].isSelected == 'yes') {
                                $scope.toGrillOrderFormModel.grillName = prop;
                            }
                        }
                    }
                    //submit the login
                    socketService.adminInfoLogin($scope.toGrillOrderFormModel)
                        .success(function (resp) {
                            //the responseStatusHandler handles all basic response stuff including redirecting the user if a success is picked
                            $scope.responseStatusHandler(resp);
                        })
                        .error(function (errResponse) {
                            //hide password field since grill selection will be refreshed

                            $scope.oneGrillIsSelected = false;
                            globals.allGrillStatuses(null, true, true);
                            $scope.toGrillOrderFormModel.password = "";
                            $scope.responseStatusHandler(errResponse);
                        })
                } else {
                    $scope.showToast('warning', 'At least one dining grill should be selected');
                }
            };

            //get from factory, key=grillName, value=the grillStatus, default isSelected in each = 'no'
            $scope.allGrillStatusesModel = referenceService.refreshAllGrillStatusesModel();

            //this variable keeps track if the user has selected a grill, it is updated by the loop in checkIfGrillIsSelected
            $scope.oneGrillIsSelected = false;

            //this functions enables the use of checkbox as a radio button on selecting the grills
            //it takes in the grillName and makes it's isSelected key to yes, which switches on the checkbox(ng-true-value == 'yes
            //after that, it turns all other isSelected values to 'no' hence checkbox
            function grillSelectRadioChange(grillName) {
                //manipulate
                for (var prop in $scope.allGrillStatusesModel) {
                    if ($scope.allGrillStatusesModel.hasOwnProperty(prop)) {
                        if (prop == grillName) {
                            $scope.allGrillStatusesModel[prop].isSelected = 'yes'
                        } else {
                            $scope.allGrillStatusesModel[prop].isSelected = 'no';
                        }
                    }
                }

                checkIfGrillIsSelected();
            }

            function checkIfGrillIsSelected() {
                var numberOfSelected = 0;

                for (var prop in $scope.allGrillStatusesModel) {
                    if ($scope.allGrillStatusesModel.hasOwnProperty(prop)) {
                        if ($scope.allGrillStatusesModel[prop].isSelected == 'yes') {
                            numberOfSelected++;
                        }
                    }
                }

                //make sure one and only one grill is selected
                if (numberOfSelected == 0) {
                    $scope.oneGrillIsSelected = false;
                }

                if (numberOfSelected == 1) {
                    $scope.oneGrillIsSelected = true;
                }

                if (numberOfSelected > 1) {
                    $scope.oneGrillIsSelected = false;
                    //disable everything, only one grill should be selected or else the grillSelectRadioChange is not working
                    $scope.universalDisableTrue();
                    $scope.showToast('error', 'An error occurred with your grill selection. Please reload the page');
                }
            }

            $scope.selectGrill = function (grillName) {
                grillSelectRadioChange(grillName);
            };

            //*************END OF ADMIN LOGIN FORM FUNCTIONS*********

            //***********GRILL MANIPULATIONS

            //a variable that is used to hold details for manipulating grills
            $scope.grillObject = {
                newGrillName: ""
            };

            $scope.createGrill = function (grillName) {
                allGrillService.createGrill(grillName)
                    .success(function (resp) {
                        pollAllGrillStatuses();
                        $scope.responseStatusHandler(resp);
                        $scope.grillObject.newGrillName = "";
                    })
                    .error(function (errResponse) {
                        $scope.responseStatusHandler(errResponse);
                    })
            };

            $scope.deleteGrill = function (grillName) {
                allGrillService.deleteGrill(grillName)
                    .success(function (resp) {
                        pollAllGrillStatuses();
                        $scope.responseStatusHandler(resp);
                    })
                    .error(function (errResponse) {
                        $scope.responseStatusHandler(errResponse);
                    })
            };

            //***********END OF GRILL MANIPULATIONS

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
                $scope.allGrillStatusesModel = referenceService.refreshAllGrillStatusesModel(allGrillStatuses);
            });


            $rootScope.$on('reconnectSuccess', function () {
            });

            $log.info('MainController booted successfully');

        }
    ]);