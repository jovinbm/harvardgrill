angular.module('grillApp')
    .controller('EditViewController', ['$window', '$location', '$log', '$scope', '$rootScope', '$interval', '$modal', 'globals', 'grillStatusService', 'ReferenceService', 'EditService',
        function ($window, $location, $log, $scope, $rootScope, $interval, $modal, globals, grillStatusService, ReferenceService, EditService) {

            //************time functions****************
            $scope.currentTime = "";

            //set current Date
            $scope.currentTime = moment().format("ddd, MMM D, H:mm");
            var updateCurrentTime = function () {
                $scope.currentTime = moment().format("ddd, MMM D, H:mm");
            };
            $interval(updateCurrentTime, 20000, 0, true);

            //***************end time functions***********************


            //**************refreshing the current grill status**********
            //if the state has been changed more than once, then refresh the currentGrillStatus on every
            //state change
            if ($scope.stateChanges < 2) {
                $scope.currentGrillStatus = globals.currentGrillStatus();
            } else {
                globals.currentGrillStatus(null, true, true);
            }
            $scope.grillStatusReference = ReferenceService.refreshGrillStatusCard();


            //*****************end of refreshing the current grill status***********


            //******************order components******************************
            //ng-models for the input groups in edit view
            //these are updated on every state change by getAllAll function therefore no need to store them in factory
            $scope.orderComponentModel = {};
            $scope.omeletModel = {};
            $scope.weeklySpecialModel = {};
            $scope.extraModel = {};


            $scope.allOrderComponents = [];
            $scope.allOmelets = [];
            $scope.allWeeklySpecials = [];
            $scope.allExtras = [];

            //the editView reference carries variable classes for the edit, save and cancel
            //buttons in the editView.
            //it is updated by the ReferenceService.refreshEditViewReference() function
            $scope.editViewReference = ReferenceService.refreshEditViewReference(null);

            //request all components;
            function getAllOrderComponents() {
                EditService.getAllComponents('oc')
                    .success(function (orderComponents) {
                        $scope.allOrderComponents = orderComponents.allComponents;
                        $scope.editViewReference = ReferenceService.refreshEditViewReference(orderComponents.allComponents);

                        $scope.responseStatusHandler(orderComponents);
                    })
                    .error(function (errResponse) {
                        $scope.responseStatusHandler(errResponse);
                    });
            }

            function getAllOmelets() {
                EditService.getAllComponents('oo')
                    .success(function (orderComponents) {
                        $scope.allOmelets = orderComponents.allComponents;
                        $scope.editViewReference = ReferenceService.refreshEditViewReference(orderComponents.allComponents);

                        $scope.responseStatusHandler(orderComponents);
                    })
                    .error(function (errResponse) {
                        $scope.responseStatusHandler(errResponse);
                    });
            }


            function getAllWeeklySpecials() {
                EditService.getAllComponents('ws')
                    .success(function (orderComponents) {
                        $scope.allWeeklySpecials = orderComponents.allComponents;
                        $scope.editViewReference = ReferenceService.refreshEditViewReference(orderComponents.allComponents);

                        $scope.responseStatusHandler(orderComponents);
                    })
                    .error(function (errResponse) {
                        $scope.responseStatusHandler(errResponse);
                    });
            }

            function getAllExtras() {
                EditService.getAllComponents('oe')
                    .success(function (orderComponents) {
                        $scope.allExtras = orderComponents.allComponents;
                        $scope.editViewReference = ReferenceService.refreshEditViewReference(orderComponents.allComponents);

                        $scope.responseStatusHandler(orderComponents);
                    })
                    .error(function (errResponse) {
                        $scope.responseStatusHandler(errResponse);
                    });
            }

            getAllOrderComponents();
            getAllOmelets();
            getAllWeeklySpecials();
            getAllExtras();

            function getAllAll() {
                getAllOrderComponents();
                getAllOmelets();
                getAllWeeklySpecials();
                getAllExtras();
            }


            //*****************what's available modal controller****************
            //size can be empty==normal; 'lg'==large; 'sm'==small
            $scope.openAvailableModalInstance = function (size) {

                var availableModalInstance = $modal.open({
                    templateUrl: 'views/admin/partials/modals/confirm_available.html',
                    controller: 'AvailableModalController',
                    backdrop: 'static',
                    size: size
                });

                //returns a promise
                return availableModalInstance
            };


            //****************end of available modal controller********************

            //*****************confirm_close_grill modal controller****************
            //size can be empty==normal; 'lg'==large; 'sm'==small
            $scope.openConfirmCloseModalInstance = function (size) {

                var confirmCloseModalInstance = $modal.open({
                    templateUrl: 'views/admin/partials/modals/confirm_close_grill.html',
                    controller: 'ConfirmCloseGrillModalController',
                    size: size
                });

                //returns a promise
                return confirmCloseModalInstance
            };


            //****************end of confirm_close_grill modal controller********************


            //****************open/close grill************************
            //function to open grill
            $scope.openCloseGrill = function () {
                $scope.isLoadingTrue();

                //the openclose class is updated back by either a success, or manually when there is an error
                $scope.grillStatusReference.openCloseClass = "btn btn-primary btn-xs disabled";

                if ($scope.currentGrillStatus.grillStatus == "closed") {
                    var aModalInstance = $scope.openAvailableModalInstance();
                    aModalInstance.result
                        .then(function (result) {
                            console.log(result);
                            grillStatusService.openGrill()
                                .success(function (resp) {
                                    $scope.isLoadingFalse();
                                    globals.currentGrillStatus(resp.newGrillStatus, true);
                                    $scope.responseStatusHandler(resp);
                                })
                                .error(function (errResponse) {
                                    $scope.isLoadingFalse();
                                    $scope.responseStatusHandler(errResponse);
                                });
                        }, function (error) {
                            $scope.isLoadingFalse();
                            $scope.grillStatusReference.openCloseClass = "btn btn-default btn-xs";
                        });
                } else if ($scope.currentGrillStatus.grillStatus == "open") {
                    var cModalInstance = $scope.openConfirmCloseModalInstance();
                    cModalInstance.result
                        .then(function (result) {
                            grillStatusService.closeGrill()
                                .success(function (resp) {
                                    $scope.isLoadingFalse();
                                    globals.currentGrillStatus(resp.newGrillStatus, true);
                                    $scope.responseStatusHandler(resp);
                                })
                                .error(function (errResponse) {
                                    $scope.isLoadingFalse();
                                    $scope.responseStatusHandler(errResponse);
                                });
                        }, function (error) {
                            getAllAll();
                            $scope.isLoadingFalse();
                            $scope.grillStatusReference.openCloseClass = "btn btn-warning btn-md";
                        });
                }
            };

            //*******************end of open/close grill**************************


            //****************functions for manipulating components == add,edit,delete
            //functions to add and delete components
            $scope.addOrderComponent = function () {
                var component = {
                    name: $scope.orderComponentModel.inputText,
                    componentGroup: "oc",
                    grillName: globals.grillName()
                };

                EditService.addComponent(component)
                    .success(function (savedComponent) {
                        getAllOrderComponents();
                        $scope.orderComponentModel.inputText = "";
                        $scope.responseStatusHandler(savedComponent);
                    })
                    .error(function (errResponse) {
                        $scope.responseStatusHandler(errResponse);
                    });

            };

            $scope.addOmelet = function () {
                var component = {
                    name: $scope.omeletModel.inputText,
                    componentGroup: "oo",
                    grillName: globals.grillName()
                };

                EditService.addComponent(component)
                    .success(function (savedComponent) {
                        getAllOmelets();
                        $scope.omeletModel.inputText = "";
                        $scope.responseStatusHandler(savedComponent);
                    })
                    .error(function (errResponse) {
                        $scope.responseStatusHandler(errResponse);
                    });

            };

            $scope.addWeeklySpecial = function () {
                var component = {
                    name: $scope.weeklySpecialModel.inputText,
                    componentGroup: "ws",
                    grillName: globals.grillName()
                };

                EditService.addComponent(component)
                    .success(function (savedComponent) {
                        getAllWeeklySpecials();
                        $scope.weeklySpecialModel.inputText = "";
                        $scope.responseStatusHandler(savedComponent);
                    })
                    .error(function (errResponse) {
                        $scope.responseStatusHandler(errResponse);
                    });

            };

            $scope.addExtra = function () {
                var component = {
                    name: $scope.extraModel.inputText,
                    componentGroup: "oe",
                    grillName: globals.grillName()
                };

                EditService.addComponent(component)
                    .success(function (savedComponent) {
                        getAllExtras();
                        $scope.extraModel.inputText = "";
                        $scope.responseStatusHandler(savedComponent);
                    })
                    .error(function (errResponse) {
                        $scope.responseStatusHandler(errResponse);
                    });

            };


            $scope.editComponent = function (componentIndex) {
                //this will be replaced with 'false' in reference factory upon successful update
                $scope.editViewReference[componentIndex].componentEditingMode = true;
                $scope.editViewReference.isInEditingMode = true;
            };

            $scope.cancelComponentEdit = function (componentIndex, componentGroup) {
                //the componentEditing mode and isInEditingMode will both be replaced with 'false' in reference factory upon successful refresh
                //of either of the following

                switch (componentGroup) {
                    case "oc":
                        getAllOrderComponents();
                        break;
                    case "oo":
                        getAllOmelets();
                        break;
                    case "ws":
                        getAllWeeklySpecials();
                        break;
                    case "oe":
                        getAllExtras();
                        break;
                    default:
                        getAllAll();
                }
            };


            $scope.deleteComponent = function (componentIndex, componentGroup) {

                EditService.deleteComponent(componentIndex)
                    .success(function (resp) {
                        switch (componentGroup) {
                            case "oc":
                                getAllOrderComponents();
                                break;
                            case "oo":
                                getAllOmelets();
                                break;
                            case "ws":
                                getAllWeeklySpecials();
                                break;
                            case "oe":
                                getAllExtras();
                                break;
                            default:
                                getAllAll();
                        }

                        $scope.responseStatusHandler(resp);
                    })
                    .error(function (errResponse) {
                        $scope.responseStatusHandler(errResponse);
                    });

            };


            $scope.saveEditedOrderComponent = function (componentIndex, name, componentGroup) {

                EditService.saveEditedOrderComponent(componentIndex, name)
                    .success(function (resp) {
                        switch (componentGroup) {
                            case "oc":
                                getAllOrderComponents();
                                break;
                            case "oo":
                                getAllOmelets();
                                break;
                            case "ws":
                                getAllWeeklySpecials();
                                break;
                            case "oe":
                                getAllExtras();
                                break;
                            default:
                                getAllAll();
                        }

                        $scope.responseStatusHandler(resp);
                    })
                    .error(function (errResponse) {
                        $scope.responseStatusHandler(errResponse);
                    });

            };

            //**************** end of functions for manipulating components == add,edit,delete


            //*******************socket listeners

            $rootScope.$on('currentGrillStatus', function (event, currentGrillStatus) {
                $scope.grillStatusReference = ReferenceService.refreshGrillStatusCard(currentGrillStatus);
                $scope.currentGrillStatus = currentGrillStatus;
            });

            $rootScope.$on('reconnectSuccess', function () {
                getAllAll();
                globals.currentGrillStatus(null, true, true);
                $scope.grillStatusReference = ReferenceService.refreshGrillStatusCard();
            });

            //***********************end of socket listeners

            $log.info('EditViewController booted successfully');
        }
    ]);