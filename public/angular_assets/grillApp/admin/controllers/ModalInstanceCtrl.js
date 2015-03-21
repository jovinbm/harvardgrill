angular.module('grillApp')
    .controller('AvailableModalController', ['$window', '$location', '$log', '$scope', '$rootScope', '$interval', '$modalInstance', 'globals', 'grillStatusService', 'ReferenceService', 'EditService',
        function ($window, $location, $log, $scope, $rootScope, $interval, $modalInstance, globals, grillStatusService, ReferenceService, EditService) {

            $scope.isLoading = false;

            $scope.ok = function () {
                $modalInstance.close("ok");
            };

            $scope.cancel = function () {
                $modalInstance.dismiss("cancel");
            };


            $scope.currentGrillStatus = globals.currentGrillStatus(null, null, true);
            $scope.grillStatusReference = ReferenceService.refreshGrillStatusCard();


            //receives grill status
            $rootScope.$on('currentGrillStatus', function (event, currentGrillStatus) {
                $scope.grillStatusReference = ReferenceService.refreshGrillStatusCard(currentGrillStatus);
                $scope.currentGrillStatus = currentGrillStatus;
            });


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
                        $rootScope.$broadcast("showToast", {
                            toastType: 'success',
                            text: 'Update successful'
                        });
                        getAllAll();
                        $scope.isLoading = false;
                    })
                    .error(function (errResponse) {
                        console.log(JSON.stringify(errResponse));
                        $rootScope.$broadcast("showToast", {
                            toastType: 'error',
                            text: 'A problem has occurred. Please try again or reload the page'
                        });
                        $scope.isLoading = false;
                    });
            };


            $rootScope.$on('reconnectSuccess', function () {
                $scope.currentGrillStatus = globals.currentGrillStatus(null, null, true);
                $scope.grillStatusReference = ReferenceService.refreshGrillStatusCard();
                getAllAll();
            });

            $log.info('AvailableModalController booted successfully');
        }]);