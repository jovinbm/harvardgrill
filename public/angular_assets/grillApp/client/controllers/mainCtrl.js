angular.module('grillApp')
    .controller('MainController', ['$filter', '$log', '$interval', '$window', '$location', '$scope', '$rootScope', 'socket', 'mainService', 'socketService', 'globals', 'ComponentService',
        function ($filter, $log, $interval, $window, $location, $scope, $rootScope, socket, mainService, socketService, globals, ComponentService) {

            //gets user's details
            $scope.customUsername = globals.customUsername();
            $scope.uniqueCuid = globals.uniqueCuid();

            //isLoading functions to disable elements while content is loading or processing
            $scope.isLoading = true;

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

            //end of isLoading functions


            $scope.currentTime = "";

            //set current Date
            $scope.currentTime = moment().format("ddd, MMM D, H:mm");
            var updateCurrentTime = function () {
                $scope.currentTime = moment().format("ddd, MMM D, H:mm");
            };
            $interval(updateCurrentTime, 20000, 0, true);

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
                    $rootScope.$broadcast('isLoadingFalse');
                    socket.emit('joinRoom', {
                        room: data.socketRoom,
                        customUsername: data.customUsername
                    });

                    //a success emit is picked up by "mainService" in mainFactory.js
                })
                .error(function (errResponse) {
                    $window.location.href = "/error/500.html";
                });

            //toastr show functions
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

            //end of toastr show functions

            //receives grill status
            $rootScope.$on('currentGrillStatus', function (event, currentGrillStatus) {
                $scope.mainCurrentGrillStatus = currentGrillStatus;
            });


            //******************loads the available components and deals with order**************
            $scope.availableOrderComponents = [];
            $scope.availableOmelets = [];
            $scope.availableWeeklySpecials = [];
            $scope.availableExtras = [];

            //this object holds a combination of all the available components. It is used to check the availability
            //of components after a quick refresh and as ng-model in the recent order cards. Can be used for other purposes too. Keys are componentIndexes, and values
            //are the full components
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
                        console.log(JSON.stringify(errResponse));
                        $scope.isLoadingTrue();
                        $scope.showToast("error", "A problem has occurred. Please reload the page");
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
                        console.log(JSON.stringify(errResponse));
                        $scope.isLoadingTrue();
                        $scope.showToast("error", "A problem has occurred. Please reload the page");
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
                        console.log(JSON.stringify(errResponse));
                        $scope.isLoadingTrue();
                        $scope.showToast("error", "A problem has occurred. Please reload the page");
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
                        console.log(JSON.stringify(errResponse));
                        $scope.isLoadingTrue();
                        $scope.showToast("error", "A problem has occurred. Please reload the page");
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

            //end of functions that deal with available components


            //functions that deal with sending new orders
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
                            getAllAvailable(true);
                            $scope.mainCurrentGrillStatus = globals.currentGrillStatus(null, true, true);
                            getMyRecentOrders();
                            $scope.isLoadingFalse();
                        }).error(function (errResponse) {
                            if (errResponse.msg) {
                                $scope.showToast('error', errResponse.msg);
                                $scope.isLoadingFalse();
                            } else {
                                $scope.showToast('error', 'An error occurred while placing your order. Please try again or reload this page');
                                $scope.isLoadingFalse();
                            }
                        })
                } else {
                    $scope.showToast('warning', 'At least one component has to be selected')
                }

            };

            //end of functions for sending in new orders

            //functions for getting my recent orders


            $scope.myRecentOrders = [];

            function updateTimeAgo() {
                $scope.myRecentOrders.forEach(function (order) {
                    order.theTimeAgo = $filter('timeago')(order.orderTime);
                });
            }

            $interval(updateTimeAgo, 60000, 0, true);

            function getMyRecentOrders() {
                ComponentService.getMyRecentOrders()
                    .success(function (resp) {

                        $scope.myRecentOrders = resp.myRecentOrders;

                        $scope.myRecentOrders.forEach(function (component) {
                            component.momentJsTime = moment(component.orderTime).format("ddd, MMM D, H:mm");
                            component.theTimeAgo = $filter('timeago')(component.orderTime);
                        });
                    })
                    .error(function (errResponse) {
                        if (errResponse.msg) {
                            $scope.showToast('error', errResponse.msg);
                        } else {
                            $scope.showToast('error', 'An error has occurred while loading your page. Please reload this page');
                        }
                    })
            }

            getMyRecentOrders();

            //end of functions concerned with getting my recent orders


            $rootScope.$on('reconnectSuccess', function () {
                getMyRecentOrders();
                $scope.currentGrillStatus = globals.currentGrillStatus(null, null, true);
                getAllAvailable(true);
            });

            $log.info('MainController booted successfully');

        }
    ]);