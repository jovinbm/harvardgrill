angular.module('grillApp')
    .controller('MainController', ['$filter', '$log', '$interval', '$window', '$location', '$scope', '$rootScope', 'socket', 'mainService', 'socketService', 'globals', 'ComponentService',
        function ($filter, $log, $interval, $window, $location, $scope, $rootScope, socket, mainService, socketService, globals, ComponentService) {

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
                        $scope.universalDisableFalse();
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

            //gets user's details
            $scope.customUsername = globals.customUsername();
            $scope.uniqueCuid = globals.uniqueCuid();

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

            //********************toastr show functions
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

            //****************************end of toastr show functions


            //******************loads the available components and deals with order**************
            //updated on every state change hence no need to store them in factory
            $scope.availableOrderComponents = [];
            $scope.availableOmelets = [];
            $scope.availableWeeklySpecials = [];
            $scope.availableExtras = [];

            //this object holds a combination of all the available components. It is used to check the availability
            //of components after a quick refresh and as ng-model in the recent order cards. Can be used for other purposes too. Keys are componentIndexes, and values
            //are the full components
            //it is updated on every state change therefore no need to store it in factory
            $scope.allAvailableCombinedObject = {};

            //this object is updated when all orders are loaded. It's keys are indexes of every order component,
            //and it's values can either be yes, or no, depending on whether the user has checked the checkbox on the main
            //order card. The act as ng-models for the checkboxes
            //n.b. initially, all values are set to 'no', and after ordering, all values should be set to no again
            $scope.myNewOrder = {};

            //request available components;
            //the refreshMyNewOrder value here is optional. If provided to true, the functions will get the
            //available components and refresh the myNewOrder object, thus setting all values to 'no'
            //in turn un-checking all checked boxes. Be careful!

            function getAvailableOrderComponents(refreshMyNewOrder) {
                ComponentService.getAvailableOrderComponents()
                    .success(function (orderComponents) {
                        $scope.availableOrderComponents = orderComponents.availableComponents;

                        $scope.availableOrderComponents.forEach(function (component) {
                            $scope.allAvailableCombinedObject[component.componentIndex] = component;
                        });

                        if (refreshMyNewOrder) {
                            $scope.availableExtras.forEach(function (component) {
                                $scope.myNewOrder[component.componentIndex] = 'no';
                            });
                        }
                    })
                    .error(function (errResponse) {
                        $scope.requestErrorHandler(errResponse);
                    });
            }

            function getAvailableOmelets(refreshMyNewOrder) {
                ComponentService.getAvailableOmelets()
                    .success(function (orderComponents) {
                        $scope.availableOmelets = orderComponents.availableComponents;

                        $scope.availableOmelets.forEach(function (component) {
                            $scope.allAvailableCombinedObject[component.componentIndex] = component;
                        });

                        if (refreshMyNewOrder) {
                            $scope.availableExtras.forEach(function (component) {
                                $scope.myNewOrder[component.componentIndex] = 'no';
                            });
                        }
                    })
                    .error(function (errResponse) {
                        $scope.requestErrorHandler(errResponse);
                    });
            }


            function getAvailableWeeklySpecials(refreshMyNewOrder) {
                ComponentService.getAvailableWeeklySpecials()
                    .success(function (orderComponents) {
                        $scope.availableWeeklySpecials = orderComponents.availableComponents;

                        $scope.availableWeeklySpecials.forEach(function (component) {
                            $scope.allAvailableCombinedObject[component.componentIndex] = component;
                        });

                        if (refreshMyNewOrder) {
                            $scope.availableExtras.forEach(function (component) {
                                $scope.myNewOrder[component.componentIndex] = 'no';
                            });
                        }
                    })
                    .error(function (errResponse) {
                        $scope.requestErrorHandler(errResponse);
                    });
            }

            function getAvailableExtras(refreshMyNewOrder) {
                ComponentService.getAvailableExtras()
                    .success(function (orderComponents) {
                        $scope.availableExtras = orderComponents.availableComponents;

                        $scope.availableExtras.forEach(function (component) {
                            $scope.allAvailableCombinedObject[component.componentIndex] = component;
                        });

                        if (refreshMyNewOrder) {
                            $scope.availableExtras.forEach(function (component) {
                                $scope.myNewOrder[component.componentIndex] = 'no';
                            });
                        }
                    })
                    .error(function (errResponse) {
                        $scope.requestErrorHandler(errResponse);
                    });
            }


            //the refreshMyNewOrder value here is optional. If provided to true, the functions will get the
            //available components and refresh the myNewOrder object, thus setting all values to 'no'
            //in turn un-checking all checked boxes. Be careful!
            function getAllAvailable(refreshMyNewOrder) {
                if (refreshMyNewOrder) {
                    getAvailableOrderComponents(true);
                    getAvailableOmelets(true);
                    getAvailableWeeklySpecials(true);
                    getAvailableExtras(true);
                } else {
                    getAvailableOrderComponents();
                    getAvailableOmelets();
                    getAvailableWeeklySpecials();
                    getAvailableExtras();
                }
            }

            getAllAvailable(true);

            //************************end of functions that deal with available components


            //***************************functions that deal with sending new orders
            $scope.placeMyNewOrderOrder = function () {
                $scope.isLoadingTrue();
                var orderComponentIndexArray = [];

                //push the componentIndexes in the myNewOrder object with values yes into the array
                for (var componentIndex in $scope.myNewOrder) {

                    if ($scope.myNewOrder.hasOwnProperty(componentIndex)) {

                        if ($scope.myNewOrder[componentIndex] == 'yes') {
                            orderComponentIndexArray.push(componentIndex);
                        }

                    }

                }


                if (orderComponentIndexArray.length > 0) {
                    ComponentService.placeMyNewOrder(orderComponentIndexArray)
                        .success(function (resp) {
                            $scope.myNewOrder = {};
                            getAllAvailable(true);
                            globals.currentGrillStatus(null, true, true);
                            getMyRecentOrders();
                            $scope.showToast('success', 'Your order has been placed');
                            $scope.isLoadingFalse();
                        }).error(function (errResponse) {
                            $scope.requestErrorHandler(errResponse);
                            $scope.isLoadingFalse();
                        })
                } else {
                    $scope.showToast('warning', 'At least one component has to be selected');
                    $scope.isLoadingFalse();
                }

            };

            //**********************end of functions for sending in new orders


            //*******************************functions for getting my recent orders
            //updated on every state change and by polling therefore no need to store them in factory
            $scope.myRecentOrders = [];

            function updateTimeAgo() {
                $scope.myRecentOrders.forEach(function (order) {
                    order.theTimeAgo = $filter('timeago')(order.orderTime);
                    order.readyTimeAgo = $filter('timeago')(order.readyTime);
                    order.declineTimeAgo = $filter('timeago')(order.declineTime);
                });
            }

            $interval(updateTimeAgo, 60000, 0, true);

            function getMyRecentOrders() {
                ComponentService.getMyRecentOrders()
                    .success(function (resp) {

                        $scope.myRecentOrders = resp.myRecentOrders;

                        $scope.myRecentOrders.forEach(function (component) {
                            //momentJS time is time it was ordered e.g. Sun, Mar 17..
                            component.momentJsTime = moment(component.orderTime).format("ddd, MMM D, H:mm");

                            //theTimeAgo is interval from the time it was ordered eg 10 mins ago
                            component.theTimeAgo = $filter('timeago')(component.orderTime);

                            //readyTimeAgo is the interval from the time the order was processed e.g 5 mins ago
                            component.readyTimeAgo = $filter('timeago')(component.readyTime);

                            //declineTimeAgo is the interval from the time the order was declined e.g 2 mins ago
                            component.readyTimeAgo = $filter('timeago')(component.declineTime);

                            //there is a bug that causes the readyTimeAgo and declineTimeAgo to display 'never' if
                            //updateTimeAgo is not called immediately here
                            updateTimeAgo();
                        });
                    })
                    .error(function (errResponse) {
                        $scope.requestErrorHandler(errResponse);
                    })
            }

            getMyRecentOrders();

            //*************continue polling if there is order in processing
            //if there is a order in processing stage, keep polling the server for the recent orders
            function checkIfProcessing() {
                var orderInProcessing = false;
                $scope.myRecentOrders.forEach(function (recentOrder) {
                    if (recentOrder.status == 'processing') {
                        orderInProcessing = true;
                    }
                });

                return orderInProcessing;
            }

            //this function polls the real getMyRecentOrders if there is order in processing
            function ifProcessingGetMyRecentOrders() {
                var temp = checkIfProcessing();
                if (temp) {
                    getMyRecentOrders();
                }
            }

            $interval(ifProcessingGetMyRecentOrders, 30000, 0, true);

            //***************end polling


            //*********************************end of functions concerned with getting my recent orders

            //*********crucial intervals

            //polls current grill status
            function pollCurrentGrillStatus() {
                globals.currentGrillStatus(null, true, true);
            }

            $interval(pollCurrentGrillStatus, 300000, 0, true);
            //**********end of crucial intervals


            //**********************socket listeners
            socket.on('orderStatusChange', function () {
                $log.info("'orderStatusChange' event received");
                $rootScope.$broadcast('orderStatusChange');
            });

            socket.on('adminChanges', function () {
                $log.info("'adminChanges' event received");
                $rootScope.$broadcast('adminChanges');
            });

            //refresh everything on orderStatusChange
            $rootScope.$on('orderStatusChange', function () {
                getMyRecentOrders();
                globals.currentGrillStatus(null, true, true);
                getAllAvailable(true);
            });

            //refresh everything on orderStatusChange
            $rootScope.$on('adminChanges', function () {
                getMyRecentOrders();
                globals.currentGrillStatus(null, true, true);
                getAllAvailable(true);
            });

            //receives grill status
            $rootScope.$on('currentGrillStatus', function (event, currentGrillStatus) {
                $scope.mainCurrentGrillStatus = currentGrillStatus;
            });


            $rootScope.$on('reconnectSuccess', function () {
                getMyRecentOrders();
                globals.currentGrillStatus(null, true, true);
                getAllAvailable(true);
            });

            $log.info('MainController booted successfully');

        }
    ]);