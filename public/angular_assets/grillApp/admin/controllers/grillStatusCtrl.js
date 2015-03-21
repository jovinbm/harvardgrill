angular.module('grillApp')
    .controller('GrillStatusController', ['$window', '$location', '$log', '$scope', '$rootScope', '$interval', '$modal', 'globals', 'grillStatusService', 'ReferenceService', 'EditService',
        function ($window, $location, $log, $scope, $rootScope, $interval, $modal, globals, grillStatusService, ReferenceService, EditService) {

            $scope.isLoading = false;
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
                $scope.isLoading = true;
                $scope.grillStatusReference.openCloseClass = "btn btn-primary btn-xs disabled";

                if ($scope.currentGrillStatus.grillStatus == "closed") {
                    var aModalInstance = $scope.open();
                    aModalInstance.result
                        .then(function (result) {
                            grillStatusService.openGrill()
                                .success(function (resp) {
                                    getAllAll();
                                    globals.currentGrillStatus(resp.newGrillStatus, true);
                                    $scope.isLoading = false;
                                    $scope.showToast("success", "The Grill is now open");
                                })
                                .error(function (errResponse) {
                                    $scope.isLoading = false;
                                    console.log(JSON.stringify(errResponse));
                                    $window.location.href = "/error/500.html";
                                });
                        }, function (error) {
                            getAllAll();
                            $scope.isLoading = false;
                            $scope.grillStatusReference.openCloseClass = "btn btn-success btn-md";
                        });
                } else if ($scope.currentGrillStatus.grillStatus == "open") {
                    grillStatusService.closeGrill()
                        .success(function (resp) {
                            $scope.isLoading = false;
                            globals.currentGrillStatus(resp.newGrillStatus, true);
                            $scope.showToast("success", "The Grill is now closed");
                        })
                        .error(function (errResponse) {
                            $scope.isLoading = false;
                            console.log(JSON.stringify(errResponse));
                            $window.location.href = "/error/500.html";
                        });
                }
            };


            //functions to get all order components
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
                        console.log(JSON.stringify(errResponse));
                        $scope.showToast("error", "A problem has occurred. Please reload the page");
                    });
            }

            function getAllOmelets() {
                EditService.getAllOmelets()
                    .success(function (orderComponents) {
                        $scope.allOmelets = orderComponents.allComponents;
                        $scope.editViewReference = ReferenceService.refreshEditViewReference(orderComponents.allComponents);
                    })
                    .error(function (errResponse) {
                        console.log(JSON.stringify(errResponse));
                        $scope.showToast("error", "A problem has occurred. Please reload the page");
                    });
            }


            function getAllWeeklySpecials() {
                EditService.getAllWeeklySpecials()
                    .success(function (orderComponents) {
                        $scope.allWeeklySpecials = orderComponents.allComponents;
                        $scope.editViewReference = ReferenceService.refreshEditViewReference(orderComponents.allComponents);
                    })
                    .error(function (errResponse) {
                        console.log(JSON.stringify(errResponse));
                        $scope.showToast("error", "A problem has occurred. Please reload the page");
                    });
            }

            function getAllExtras() {
                EditService.getAllExtras()
                    .success(function (orderComponents) {
                        $scope.allExtras = orderComponents.allComponents;
                        $scope.editViewReference = ReferenceService.refreshEditViewReference(orderComponents.allComponents);
                    })
                    .error(function (errResponse) {
                        console.log(JSON.stringify(errResponse));
                        $scope.showToast("error", "A problem has occurred. Please reload the page");
                    });
            }


            function getAllAll() {
                getAllOrderComponents();
                getAllOmelets();
                getAllWeeklySpecials();
                getAllExtras();
            }

            getAllAll();

            $scope.weeklySpecialRadioChange = function (componentIndex) {
                //manipulate al weekly specials
                $scope.allWeeklySpecials.forEach(function (weeklySpecial) {
                    if (weeklySpecial.componentIndex == componentIndex) {
                        weeklySpecial.available = "yes";
                    } else {
                        weeklySpecial.available = "no";
                    }
                })
            };

            $scope.unSelectAllWeeklySpecials = function () {
                $scope.allWeeklySpecials.forEach(function (weeklySpecial) {
                    weeklySpecial.available = "no";
                })
            };


            $scope.updateAvailableComponents = function () {
                $scope.isLoading = true;
                var allComponents = [];
                allComponents = allComponents.concat($scope.allOrderComponents);
                allComponents = allComponents.concat($scope.allOmelets);
                allComponents = allComponents.concat($scope.allWeeklySpecials);
                allComponents = allComponents.concat($scope.allExtras);

                grillStatusService.updateAvailableComponents(allComponents)
                    .success(function (resp) {
                        $scope.showToast("success", "Update successful");
                        getAllAll();
                        $scope.isLoading = false;
                    })
                    .error(function (errResponse) {
                        console.log(JSON.stringify(errResponse));
                        $scope.showToast("error", "A problem has occurred. Please try again or reload the page");
                        $scope.isLoading = false;
                    });
            };


            $rootScope.$on('reconnectSuccess', function () {
                $scope.currentGrillStatus = globals.currentGrillStatus(null, null, true);
                $scope.grillStatusReference = ReferenceService.refreshGrillStatusCard();
                getAllAll();
            });

            $log.info('GrillStatusController booted successfully');
        }
    ]);