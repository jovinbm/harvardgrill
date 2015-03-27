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
                $scope.currentGrillStatus = globals.currentGrillStatus(null, null, true);
            }
            $scope.grillStatusReference = ReferenceService.refreshGrillStatusCard();

            //receives grill status
            $rootScope.$on('currentGrillStatus', function (event, currentGrillStatus) {
                $scope.grillStatusReference = ReferenceService.refreshGrillStatusCard(currentGrillStatus);
                $scope.currentGrillStatus = currentGrillStatus;
            });

            //*****************end of refreshing the current grill status***********


            //******************order components******************************
            //ng-models for the input groups in edit view
            $scope.orderComponentModel = {};
            $scope.omeletModel = {};
            $scope.weeklySpecialModel = {};
            $scope.extraModel = {};


            $scope.allOrderComponents = [];
            $scope.allOmelets = [];
            $scope.allWeeklySpecials = [];
            $scope.allExtras = [];

            $scope.editViewReference = {};

            //request all components;
            function getAllOrderComponents() {
                EditService.getAllOrderComponents()
                    .success(function (orderComponents) {
                        $scope.allOrderComponents = orderComponents.allComponents;
                        $scope.editViewReference = ReferenceService.refreshEditViewReference(orderComponents.allComponents);
                    })
                    .error(function (errResponse) {
                        $scope.requestErrorHandler(errResponse);
                    });
            }

            function getAllOmelets() {
                EditService.getAllOmelets()
                    .success(function (orderComponents) {
                        $scope.allOmelets = orderComponents.allComponents;
                        $scope.editViewReference = ReferenceService.refreshEditViewReference(orderComponents.allComponents);
                    })
                    .error(function (errResponse) {
                        $scope.requestErrorHandler(errResponse);
                    });
            }


            function getAllWeeklySpecials() {
                EditService.getAllWeeklySpecials()
                    .success(function (orderComponents) {
                        $scope.allWeeklySpecials = orderComponents.allComponents;
                        $scope.editViewReference = ReferenceService.refreshEditViewReference(orderComponents.allComponents);
                    })
                    .error(function (errResponse) {
                        $scope.requestErrorHandler(errResponse);
                    });
            }

            function getAllExtras() {
                EditService.getAllExtras()
                    .success(function (orderComponents) {
                        $scope.allExtras = orderComponents.allComponents;
                        $scope.editViewReference = ReferenceService.refreshEditViewReference(orderComponents.allComponents);
                    })
                    .error(function (errResponse) {
                        $scope.requestErrorHandler(errResponse);
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
                $scope.grillStatusReference.openCloseClass = "btn btn-primary btn-xs disabled";

                if ($scope.currentGrillStatus.grillStatus == "closed") {
                    var aModalInstance = $scope.openAvailableModalInstance();
                    aModalInstance.result
                        .then(function (result) {
                            console.log(result);
                            grillStatusService.openGrill()
                                .success(function (resp) {
                                    globals.currentGrillStatus(resp.newGrillStatus, true);
                                    $scope.showToast("success", "The Grill is now open");
                                })
                                .error(function (errResponse) {
                                    $scope.requestErrorHandler(errResponse);
                                });
                        }, function (error) {
                            $scope.grillStatusReference.openCloseClass = "btn btn-default btn-xs";
                            console.log(error);
                        });
                } else if ($scope.currentGrillStatus.grillStatus == "open") {
                    var cModalInstance = $scope.openConfirmCloseModalInstance();
                    cModalInstance.result
                        .then(function (result) {
                            grillStatusService.closeGrill()
                                .success(function (resp) {
                                    $scope.isLoadingFalse();
                                    globals.currentGrillStatus(resp.newGrillStatus, true);
                                    $scope.showToast("success", "The Grill is now closed");
                                })
                                .error(function (errResponse) {
                                    $scope.isLoadingFalse();
                                    $scope.requestErrorHandler(errResponse);
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
                    componentGroup: "oc"
                };

                EditService.addComponent(component)
                    .success(function (savedComponent) {
                        getAllOrderComponents();
                        $scope.orderComponentModel.inputText = "";
                        $scope.showToast("success", "Saved");
                    })
                    .error(function (errResponse) {
                        $scope.requestErrorHandler(errResponse);
                    });

            };

            $scope.addOmelet = function () {
                var component = {
                    name: $scope.omeletModel.inputText,
                    componentGroup: "oo"
                };

                EditService.addComponent(component)
                    .success(function (savedComponent) {
                        getAllOmelets();
                        $scope.omeletModel.inputText = "";
                        $scope.showToast("success", "Saved");
                    })
                    .error(function (errResponse) {
                        $scope.requestErrorHandler(errResponse);
                    });

            };

            $scope.addWeeklySpecial = function () {
                var component = {
                    name: $scope.weeklySpecialModel.inputText,
                    componentGroup: "ws"
                };

                EditService.addComponent(component)
                    .success(function (savedComponent) {
                        getAllWeeklySpecials();
                        $scope.weeklySpecialModel.inputText = "";
                        $scope.showToast("success", "Saved");
                    })
                    .error(function (errResponse) {
                        $scope.requestErrorHandler(errResponse);
                    });

            };

            $scope.addExtra = function () {
                var component = {
                    name: $scope.extraModel.inputText,
                    componentGroup: "oe"
                };

                EditService.addComponent(component)
                    .success(function (savedComponent) {
                        getAllExtras();
                        $scope.extraModel.inputText = "";
                        $scope.showToast("success", "Saved");
                    })
                    .error(function (errResponse) {
                        $scope.requestErrorHandler(errResponse);
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
                    .success(function () {
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

                        $scope.showToast("success", "All changes saved");
                    })
                    .error(function (errResponse) {
                        $scope.requestErrorHandler(errResponse);
                    });

            };


            $scope.saveEditedOrderComponent = function (componentIndex, name, componentGroup) {

                EditService.saveEditedOrderComponent(componentIndex, name)
                    .success(function () {
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

                        $scope.showToast("success", "All changes saved");
                    })
                    .error(function (errResponse) {
                        $scope.requestErrorHandler(errResponse);
                    });

            };

            //**************** end of functions for manipulating components == add,edit,delete


            $rootScope.$on('reconnectSuccess', function () {
                getAllAll();
                $scope.currentGrillStatus = globals.currentGrillStatus(null, null, true);
                $scope.grillStatusReference = ReferenceService.refreshGrillStatusCard();
            });

            $log.info('EditViewController booted successfully');
        }
    ]);