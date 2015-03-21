angular.module('grillApp')
    .controller('EditViewController', ['$window', '$location', '$log', '$scope', '$rootScope', '$interval', '$modal', 'globals', 'grillStatusService', 'ReferenceService', 'EditService',
        function ($window, $location, $log, $scope, $rootScope, $interval, $modal, globals, grillStatusService, ReferenceService, EditService) {

            //ng-models for the input groups
            $scope.orderComponentModel = {};
            $scope.omeletModel = {};
            $scope.weeklySpecialModel = {};
            $scope.extraModel = {};


            $scope.allOrderComponents = [];
            $scope.allOmelets = [];
            $scope.allWeeklySpecials = [];
            $scope.allExtras = [];

            //request all components;
            function getAllOrderComponents() {
                EditService.getAllOrderComponents()
                    .success(function (orderComponents) {
                        $scope.allOrderComponents = orderComponents.allComponents;
                    })
                    .error(function (errResponse) {
                        console.log(JSON.stringify(errResponse));
                        $scope.showToast("error", "A problem has occured. Please reload the page");
                    });
            }

            function getAllOmelets() {
                EditService.getAllOmelets()
                    .success(function (orderComponents) {
                        $scope.allOmelets = orderComponents.allComponents;
                    })
                    .error(function (errResponse) {
                        console.log(JSON.stringify(errResponse));
                        $scope.showToast("error", "A problem has occured. Please reload the page");
                    });
            }


            function getAllWeeklySpecials() {
                EditService.getAllWeeklySpecials()
                    .success(function (orderComponents) {
                        $scope.allWeeklySpecials = orderComponents.allComponents;
                    })
                    .error(function (errResponse) {
                        console.log(JSON.stringify(errResponse));
                        $scope.showToast("error", "A problem has occured. Please reload the page");
                    });
            }

            function getAllExtras() {
                EditService.getAllExtras()
                    .success(function (orderComponents) {
                        $scope.allExtras = orderComponents.allComponents;
                    })
                    .error(function (errResponse) {
                        console.log(JSON.stringify(errResponse));
                        $scope.showToast("error", "A problem has occured. Please reload the page");
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

            $scope.currentTime = "";
            if ($scope.stateChanges < 2) {
                $scope.currentGrillStatus = globals.currentGrillStatus();
            } else {
                $scope.currentGrillStatus = globals.currentGrillStatus(null, null, true);
            }
            $scope.grillStatusReference = ReferenceService.refreshGrillStatusCard();

            //set current Date
            $scope.currentTime = moment().format("ddd, MMM D, H:mm");
            var updateCurrentTime = function () {
                $scope.currentTime = moment().format("ddd, MMM D, H:mm");
            };
            $interval(updateCurrentTime, 20000, 0, true);


            //receives grill status
            $rootScope.$on('currentGrillStatus', function (event, currentGrillStatus) {
                $scope.grillStatusReference = ReferenceService.refreshGrillStatusCard(currentGrillStatus);
                $scope.currentGrillStatus = currentGrillStatus;
            });


            //what's available modal controller
            //size can be empty==normal; 'lg'==large; 'sm'==small
            $scope.open = function (size) {

                var availableModalInstance = $modal.open({
                    templateUrl: 'AvailableModalContent.html',
                    controller: 'AvailableModalController',
                    backdrop: 'static',
                    size: size
                });

                //returns a promise
                return availableModalInstance
            };


            //function to open grill
            $scope.openCloseGrill = function () {
                $scope.grillStatusReference.openCloseClass = "btn btn-primary btn-xs disabled";

                if ($scope.currentGrillStatus.grillStatus == "closed") {
                    var aModalInstance = $scope.open();
                    aModalInstance.result
                        .then(function (result) {
                            console.log(result);
                            grillStatusService.openGrill()
                                .success(function (resp) {
                                    globals.currentGrillStatus(resp.newGrillStatus, true);
                                    $scope.showToast("success", "The Grill is now open");
                                })
                                .error(function (errResponse) {
                                    console.log(JSON.stringify(errResponse));
                                    $scope.showToast("error", "Please try again or reload this page");
                                });
                        }, function (error) {
                            $scope.grillStatusReference.openCloseClass = "btn btn-default btn-xs";
                            console.log(error);
                        });
                } else if ($scope.currentGrillStatus.grillStatus == "open") {
                    grillStatusService.closeGrill()
                        .success(function (resp) {
                            globals.currentGrillStatus(resp.newGrillStatus, true);
                            $scope.showToast("success", "The grill is now closed");
                        })
                        .error(function (errResponse) {
                            console.log(JSON.stringify(errResponse));
                            $scope.showToast("error", "Please try again or reload this page");
                        });
                }
            };


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
                        console.log(JSON.stringify(errResponse));
                        $scope.showToast("error", "Please try again or reload this page");
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
                        console.log(JSON.stringify(errResponse));
                        $scope.showToast("error", "Please try again or reload this page");
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
                        console.log(JSON.stringify(errResponse));
                        $scope.showToast("error", "Please try again or reload this page");
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
                        console.log(JSON.stringify(errResponse));
                        $scope.showToast("error", "Please try again or reload this page");
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
                        console.log(JSON.stringify(errResponse));
                        $scope.showToast("error", "Please try again or reload this page");
                    });

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
                        console.log(JSON.stringify(errResponse));
                        $scope.showToast("error", "Please try again or reload this page");
                    });

            };

            $log.info('EditViewController booted successfully');
        }
    ]);