angular.module('grillApp')
    .controller('MainController', ['$filter', '$log', '$interval', '$window', '$location', '$scope', '$rootScope', 'socket', 'mainService', 'socketService', 'globals', 'ComponentService', 'logoutService',
        function ($filter, $log, $interval, $window, $location, $scope, $rootScope, socket, mainService, socketService, globals, ComponentService, logoutService) {

            //***********quick logout helpers**********
            $scope.logoutSession = function () {
                logoutService.logoutClientSession()
                    .success(function (resp) {
                        $scope.responseStatusHandler(resp);
                    })
                    .error(function (errResponse) {
                        $scope.responseStatusHandler(errResponse);
                    });
            };

            $scope.logoutFull = function () {
                logoutService.logoutClientFull()
                    .success(function (resp) {
                        $scope.responseStatusHandler(resp);
                    })
                    .error(function (errResponse) {
                        $scope.responseStatusHandler(errResponse);
                    });
            };
            //**************end of quick logout helpers


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

            $rootScope.$on('responseStatusHandler', function (event, errResponse) {
                $scope.responseStatusHandler(errResponse);
            });


            //***************end of request error handler**************

            //gets user's details
            $scope.username = globals.username();
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
                    $scope.username = globals.username(data.username);
                    $scope.grillName = globals.grillName(data.grillName);

                    //updates the socket service with the grillName also, since globals
                    //requires socketService and you can't have socketService require globals
                    socketService.grillName(data.grillName);
                    $scope.uniqueCuid = globals.uniqueCuid(data["uniqueCuid"]);
                    socket.emit('joinRoom', {
                        room: data.socketRoom,
                        username: data.username
                    });

                    $scope.responseStatusHandler(data);

                    //a success emit is picked up by "mainService" in mainFactory.js
                })
                .error(function (errResponse) {
                    $scope.responseStatusHandler(errResponse);
                });

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


            //******************loads the available components and deals with order**************
            //updated on every state change hence no need to store them in factory
            $scope.availableOrderComponents = [];
            $scope.availableOmelets = [];
            $scope.availableWeeklySpecials = [];
            $scope.availableExtras = [];

            //***************functions to deal with all key component indexes

            //allComponentsIndexNames is a variable that caries all references to the names of all component index
            //the key is the componentIndex, and value is it's name. It is updated by the function 'getAllComponentsIndexNames'
            //updated on every state change by the getAllComponentsIndexNames() function when controller restarts
            $scope.allComponentsIndexNames = {};


            //gets the index names of all components
            function getAllComponentsIndexNames() {
                socketService.getAllComponentsIndexNames()
                    .success(function (resp) {
                        $scope.responseStatusHandler(resp);
                        resp.allComponentsIndexNames.forEach(function (componentReference) {
                            $scope.allComponentsIndexNames[componentReference.componentIndex] = componentReference.name;
                        });
                    })
                    .error(function (errResponse) {
                        $scope.responseStatusHandler(errResponse);
                    })
            }

            getAllComponentsIndexNames();

            //*******************end of functions concerned with allComponent indexes

            //this object is updated when all orders are loaded. It's keys are indexes of every order component,
            //and it's values can either be yes, or no, depending on whether the user has checked the checkbox on the main
            //order card. The act as ng-models for the checkboxes
            //n.b. initially, all values are set to 'no', and after ordering, all values should be set to no again
            //UPDATE: its keys = indexes, its values by default are {isSelected: 'no', quantity: '1'}
            $scope.myNewOrder = {};

            //request available components;
            //the refreshMyNewOrder value here is optional. If provided to true, the functions will get the
            //available components and refresh the myNewOrder object, thus setting all values to 'no'
            //in turn un-checking all checked boxes. Be careful!

            function getAvailableOrderComponents(refreshMyNewOrder) {
                ComponentService.getAvailableComponents('oc')
                    .success(function (orderComponents) {
                        $scope.availableOrderComponents = orderComponents.availableComponents;

                        if (refreshMyNewOrder) {
                            $scope.availableOrderComponents.forEach(function (component) {
                                //check if the object is already set, if not, set it to {} first
                                if (!$scope.myNewOrder[component.componentIndex]) {
                                    $scope.myNewOrder[component.componentIndex] = {};
                                }
                                $scope.myNewOrder[component.componentIndex]['isSelected'] = 'no';
                                $scope.myNewOrder[component.componentIndex]['quantity'] = 1;
                            });
                        }
                        $scope.responseStatusHandler(orderComponents);
                    })
                    .error(function (errResponse) {
                        $scope.responseStatusHandler(errResponse);
                    });
            }

            function getAvailableOmelets(refreshMyNewOrder) {
                ComponentService.getAvailableComponents('oo')
                    .success(function (orderComponents) {
                        $scope.availableOmelets = orderComponents.availableComponents;

                        if (refreshMyNewOrder) {
                            $scope.availableOmelets.forEach(function (component) {
                                //check if the object is already set, if not, set it to {} first
                                if (!$scope.myNewOrder[component.componentIndex]) {
                                    $scope.myNewOrder[component.componentIndex] = {};
                                }
                                $scope.myNewOrder[component.componentIndex]['isSelected'] = 'no';
                                $scope.myNewOrder[component.componentIndex]['quantity'] = 1;
                            });
                        }

                        $scope.responseStatusHandler(orderComponents);
                    })
                    .error(function (errResponse) {
                        $scope.responseStatusHandler(errResponse);
                    });
            }


            function getAvailableWeeklySpecials(refreshMyNewOrder) {
                ComponentService.getAvailableComponents('ws')
                    .success(function (orderComponents) {
                        $scope.availableWeeklySpecials = orderComponents.availableComponents;

                        if (refreshMyNewOrder) {
                            $scope.availableWeeklySpecials.forEach(function (component) {
                                //check if the object is already set, if not, set it to {} first
                                if (!$scope.myNewOrder[component.componentIndex]) {
                                    $scope.myNewOrder[component.componentIndex] = {};
                                }
                                $scope.myNewOrder[component.componentIndex]['isSelected'] = 'no';
                                $scope.myNewOrder[component.componentIndex]['quantity'] = 1;
                            });
                        }
                        $scope.responseStatusHandler(orderComponents);
                    })
                    .error(function (errResponse) {
                        $scope.responseStatusHandler(errResponse);
                    });
            }

            function getAvailableExtras(refreshMyNewOrder) {
                ComponentService.getAvailableComponents('oe')
                    .success(function (orderComponents) {
                        $scope.availableExtras = orderComponents.availableComponents;

                        if (refreshMyNewOrder) {
                            $scope.availableExtras.forEach(function (component) {
                                //check if the object is already set, if not, set it to {} first
                                if (!$scope.myNewOrder[component.componentIndex]) {
                                    $scope.myNewOrder[component.componentIndex] = {};
                                }
                                $scope.myNewOrder[component.componentIndex]['isSelected'] = 'no';
                                $scope.myNewOrder[component.componentIndex]['quantity'] = 1;
                            });
                        }

                        $scope.responseStatusHandler(orderComponents);
                    })
                    .error(function (errResponse) {
                        $scope.responseStatusHandler(errResponse);
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

            $scope.increaseComponentQuantity = function (componentIndex) {
                $scope.myNewOrder[componentIndex]['quantity'] = $scope.myNewOrder[componentIndex]['quantity'] + 1;
            };

            $scope.decreaseComponentQuantity = function (componentIndex) {
                if ($scope.myNewOrder[componentIndex]['quantity'] > 1) {
                    $scope.myNewOrder[componentIndex]['quantity'] = $scope.myNewOrder[componentIndex]['quantity'] - 1;
                }
            };

            $scope.placeMyNewOrderOrder = function () {
                $scope.isLoadingTrue();
                var orderComponentIndexArray = [];

                //push the componentIndexes in the myNewOrder object with values yes into the array
                for (var componentIndex in $scope.myNewOrder) {

                    if ($scope.myNewOrder.hasOwnProperty(componentIndex)) {

                        if ($scope.myNewOrder[componentIndex]['isSelected'] == 'yes') {
                            //this is gonna push the selected component together with it's quantity
                            orderComponentIndexArray.push({
                                componentIndex: componentIndex,
                                quantity: $scope.myNewOrder[componentIndex]['quantity']
                            });
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
                            $scope.responseStatusHandler(resp);
                            $scope.isLoadingFalse();
                        }).error(function (errResponse) {
                            $scope.responseStatusHandler(errResponse);
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

                            $scope.responseStatusHandler(resp);
                        });
                    })
                    .error(function (errResponse) {
                        $scope.responseStatusHandler(errResponse);
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
                $scope.showToast('success', 'This page has been refreshed to reflect changes in the system');
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