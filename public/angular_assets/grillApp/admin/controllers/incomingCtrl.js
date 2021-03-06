angular.module('grillApp')
    .controller('IncomingController', ['socket', '$filter', '$window', '$location', '$log', '$scope', '$rootScope', '$interval', '$modal', 'globals', 'grillStatusService', 'ReferenceService', 'EditService', 'socketService',
        function (socket, $filter, $window, $location, $log, $scope, $rootScope, $interval, $modal, globals, grillStatusService, ReferenceService, EditService, socketService) {

            //array that holds current incoming orders
            //updated on every state change by socketRefresh therefore no need to store them in factory
            $scope.currentIncomingOrders = [];

            //this variables' keys are orderIndexes of the currentIncoming orders.
            //each key carries an object whose keys are the orderComponents indexes that the client ordered (looped from the orderComponent array on the order)
            //the values can either be 'yes' or 'no' depending on what is processed
            //the default value is 'no'
            //updated on every state change, therefore no need to store it in factory
            $scope.processedOrderModels = {};

            //refresh here replaces all the currentIncoming orders with new ones instead of just pushing
            function getAdminClientOrders(amount, refresh, currentOrdersToBeSkipped) {
                if (!currentOrdersToBeSkipped) {
                    //set it to empty. This is tested by the handlers to let order_db know if it should
                    //skip orders or not
                    currentOrdersToBeSkipped = [];
                }

                if (refresh) {
                    globals.adminClientOrders(amount, true, true, true, currentOrdersToBeSkipped);
                } else {
                    globals.adminClientOrders(amount, true, true, false, currentOrdersToBeSkipped);
                }
            }

            getAdminClientOrders(10, true);

            //when there is a new socket refresh forcing, check the number of orders and request
            function socketRefresh() {
                if ($scope.currentIncomingOrders.length == 0) {
                    getAdminClientOrders(10, true);
                } else if ($scope.currentIncomingOrders.length < 10) {

                    //this is an array that carries the current orders that should be skipped when asking for new orders
                    //from server
                    var currentOrdersToBeSkipped = [];
                    $scope.currentIncomingOrders.forEach(function (order) {
                        currentOrdersToBeSkipped.push(order.orderIndex);
                    });
                    getAdminClientOrders(10 - $scope.currentIncomingOrders.length, false, currentOrdersToBeSkipped);
                }
            }

            //*************continue polling for new orders if admin has no orders on screen
            //call the socketRefresh function

            $interval(socketRefresh, 30000, 0, true);

            //***************end polling


            //*************function to update timeago on all orders in the currentIncoming
            //updates the timeago on all incoming orders using the timeago filter
            function updateTimeAgo() {
                $scope.currentIncomingOrders.forEach(function (order) {
                    order.theTimeAgo = $filter('timeago')(order.orderTime);
                });
            }

            $interval(updateTimeAgo, 60000, 0, true);

            //*********end of functions to update timeago


            //*****************admin order actions*********************

            $scope.increaseComponentQuantity = function (orderIndex, componentIndex) {
                ++$scope.processedOrderModels[orderIndex][componentIndex]['quantity'];
            };

            $scope.decreaseComponentQuantity = function (orderIndex, componentIndex) {
                if ($scope.processedOrderModels[orderIndex][componentIndex]['quantity'] > 1) {
                    --$scope.processedOrderModels[orderIndex][componentIndex]['quantity'];
                }
            };

            $scope.resetComponentQuantity = function (orderIndex, componentIndex) {
                $scope.processedOrderModels[orderIndex][componentIndex]['quantity'] = 1;
            };

            $scope.markOrderAsDone = function (orderUniqueCuid, orderIndex) {
                $scope.isLoadingTrue();

                //push the componentIndexes into an array that will be the processedOrderComponents
                var processedOrderComponents = [];

                for (var componentIndex in $scope.processedOrderModels[orderIndex]) {

                    if ($scope.processedOrderModels[orderIndex].hasOwnProperty(componentIndex)) {

                        if ($scope.processedOrderModels[orderIndex][componentIndex]['isSelected'] == 'yes') {
                            processedOrderComponents.push({
                                componentIndex: componentIndex,
                                quantity: $scope.processedOrderModels[orderIndex][componentIndex]['quantity']
                            });
                        }

                    }

                }

                grillStatusService.markOrderAsDone(orderUniqueCuid, processedOrderComponents)
                    .success(function (resp) {
                        //delete order from currentIncoming order
                        $scope.currentIncomingOrders.forEach(function (order) {
                            if (order.orderUniqueCuid == orderUniqueCuid) {
                                var index = $scope.currentIncomingOrders.indexOf(order);
                                $scope.currentIncomingOrders.splice(index, 1)
                            }
                        });

                        //delete it from the processedOrderModels
                        for (var oIndex in $scope.processedOrderModels) {
                            if ($scope.processedOrderModels.hasOwnProperty(oIndex)) {
                                if (oIndex == orderIndex) {
                                    delete $scope.processedOrderModels[oIndex];
                                }
                            }
                        }

                        //this is an array that carries the current orders that should be skipped when asking for new orders
                        //from server
                        var currentOrdersToBeSkipped = [];
                        $scope.currentIncomingOrders.forEach(function (order) {
                            currentOrdersToBeSkipped.push(order.orderIndex);
                        });


                        //pull one new order and insert it into the currentIncoming orders
                        //also pull grill status
                        globals.currentGrillStatus(null, true, true);
                        getAdminClientOrders(1, false, currentOrdersToBeSkipped);

                        $scope.responseStatusHandler(resp);
                        $scope.isLoadingFalse();
                    }).error(function (errResponse) {
                        $scope.isLoadingFalse();
                        $scope.responseStatusHandler(errResponse);
                    })
            };

            $scope.markOrderAsDeclined = function (orderUniqueCuid, orderIndex) {
                $scope.isLoadingTrue();
                grillStatusService.markOrderAsDeclined(orderUniqueCuid)
                    .success(function (resp) {

                        //delete order from currentIncoming order
                        $scope.currentIncomingOrders.forEach(function (order) {
                            if (order.orderUniqueCuid == orderUniqueCuid) {
                                var index = $scope.currentIncomingOrders.indexOf(order);
                                $scope.currentIncomingOrders.splice(index, 1)
                            }
                        });

                        //delete it from the processedOrderModels
                        for (var oIndex in $scope.processedOrderModels) {
                            if ($scope.processedOrderModels.hasOwnProperty(oIndex)) {
                                if (oIndex == orderIndex) {
                                    delete $scope.processedOrderModels[oIndex];
                                }
                            }
                        }

                        //this is an array that carries the current orders that should be skipped when asking for new orders
                        //from server
                        var currentOrdersToBeSkipped = [];
                        $scope.currentIncomingOrders.forEach(function (order) {
                            currentOrdersToBeSkipped.push(order.orderIndex);
                        });


                        globals.currentGrillStatus(null, true, true);
                        //pull one new order and insert it into the currentIncoming orders
                        getAdminClientOrders(1, false, currentOrdersToBeSkipped);

                        $scope.responseStatusHandler(resp);
                        $scope.isLoadingFalse();
                    }).error(function (errResponse) {
                        $scope.isLoadingFalse();
                        $scope.responseStatusHandler(errResponse);
                    })
            };

            //*****************end of admin order actions*********************


            //************socket Listeners****************
            socket.on('newOrders', function () {
                $log.info("'newOrders' event received");
                socketRefresh();
            });

            //receives the adminClientOrders that contains an array of all the current Incoming orders
            $rootScope.$on('adminClientOrdersRefresh', function (event, data) {
                data.forEach(function (order) {

                    //updates the processedOrderModels
                    $scope.processedOrderModels[order.orderIndex] = {};
                    order.orderComponents.forEach(function (componentIndexCarrierObject) {
                        //the "componentIndexCarrierObject" in the orderComponents array has the format {componentIndex: 1, quantity: 1}

                        //set the default to yes, as this makes it easy for thr admin to un-check unavailable
                        //than available
                        if (!$scope.processedOrderModels[order.orderIndex][componentIndexCarrierObject.componentIndex]) {
                            $scope.processedOrderModels[order.orderIndex][componentIndexCarrierObject.componentIndex] = {};
                        }
                        $scope.processedOrderModels[order.orderIndex][componentIndexCarrierObject.componentIndex] = {
                            isSelected: 'yes',
                            quantity: componentIndexCarrierObject.quantity
                        };
                    });

                    //momentJS time is time it was ordered e.g. Sun, Mar 17..
                    order.momentJsTime = moment(order.orderTime).format("ddd, MMM D, H:mm");

                    //theTimeAgo is interval from the time it was ordered eg 10 mins ago
                    order.theTimeAgo = $filter('timeago')(order.orderTime);
                });

                //REFRESH THE WHOLE CURRENTINCOMINGORDERS
                $scope.currentIncomingOrders = data;
            });

            //receives the broadcast that contains one order after admin has processed or declines another order
            $rootScope.$on('adminClientOrdersRefreshNoRefresh', function (event, data) {
                data.forEach(function (order) {

                    //updates the processedOrderModels
                    $scope.processedOrderModels[order.orderIndex] = {};
                    order.orderComponents.forEach(function (componentIndexCarrierObject) {
                        //the "componentIndexCarrierObject" in the orderComponents array has the format {componentIndex: 1, quantity: 1}

                        //set the default to yes, as this makes it easy for thr admin to un-check unavailable
                        //than available
                        if (!$scope.processedOrderModels[order.orderIndex][componentIndexCarrierObject.componentIndex]) {
                            $scope.processedOrderModels[order.orderIndex][componentIndexCarrierObject.componentIndex] = {};
                        }
                        $scope.processedOrderModels[order.orderIndex][componentIndexCarrierObject.componentIndex] = {
                            isSelected: 'yes',
                            quantity: componentIndexCarrierObject.quantity
                        };
                    });

                    order.theTimeAgo = $filter('timeago')(order.orderTime);
                    order.momentJsTime = moment(order.orderTime).format("ddd, MMM D, H:mm");
                    order.theTimeAgo = $filter('timeago')(order.orderTime);
                });

                //HERE WE DONT REFRESH, WE JUST PUSH THE NEW DATA
                //push the one order, which is of course the first element of the array received
                //only push if the data contains some order, to avoid pushing null
                if (data.length > 0) {
                    $scope.currentIncomingOrders.push(data[0]);
                }
            });

            //********************end of socket listeners


            $log.info('IncomingController booted successfully');
        }
    ]);