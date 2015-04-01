angular.module('grillApp')
    .controller('AvailableModalController', ['$window', '$location', '$log', '$scope', '$rootScope', '$interval', '$modalInstance', 'globals', 'grillStatusService', 'ReferenceService', 'EditService',
        function ($window, $location, $log, $scope, $rootScope, $interval, $modalInstance, globals, grillStatusService, ReferenceService, EditService) {

            globals.currentGrillStatus(null, true, true);

            //variable to keep track if the user made changes to the confirm card that have not been updated yet
            $scope.confirmModalIsDirty = false;
            $scope.makeConfirmModalDirty = function () {
                $scope.confirmModalIsDirty = true;
            };


            //******************order components******************************
            //functions to get all order components
            //updated as per every modalInstance therefore no need to store them in factory
            $scope.allOrderComponents = [];
            $scope.allOmelets = [];
            $scope.allWeeklySpecials = [];
            $scope.allExtras = [];

            function getAllOrderComponents() {
                EditService.getAllOrderComponents()
                    .success(function (orderComponents) {
                        $rootScope.$broadcast('responseStatusHandler', orderComponents);
                        $scope.allOrderComponents = orderComponents.allComponents;
                    })
                    .error(function (errResponse) {
                        $rootScope.$broadcast('responseStatusHandler', errResponse);
                    });
            }

            function getAllOmelets() {
                EditService.getAllOmelets()
                    .success(function (orderComponents) {
                        $rootScope.$broadcast('responseStatusHandler', orderComponents);
                        $scope.allOmelets = orderComponents.allComponents;
                    })
                    .error(function (errResponse) {
                        $rootScope.$broadcast('responseStatusHandler', errResponse);
                    });
            }


            function getAllWeeklySpecials() {
                EditService.getAllWeeklySpecials()
                    .success(function (orderComponents) {
                        $rootScope.$broadcast('responseStatusHandler', orderComponents);
                        $scope.allWeeklySpecials = orderComponents.allComponents;
                    })
                    .error(function (errResponse) {
                        $rootScope.$broadcast('responseStatusHandler', errResponse);
                    });
            }

            function getAllExtras() {
                EditService.getAllExtras()
                    .success(function (orderComponents) {
                        $rootScope.$broadcast('responseStatusHandler', orderComponents);
                        $scope.allExtras = orderComponents.allComponents;
                    })
                    .error(function (errResponse) {
                        $rootScope.$broadcast('responseStatusHandler', errResponse);
                    });
            }


            function getAllAll() {
                getAllOrderComponents();
                getAllOmelets();
                getAllWeeklySpecials();
                getAllExtras();
            }

            //get all components
            getAllAll();

            //this functions enables the use of checkbox as a radio button on the weekly special available/not-available card
            //it takes in the componentIndex and makes it's available key to yes, which switches on the checkbox(ng-true-value == 'yes
            //after that, it turns all weekly special available values to 'no' hence checkbox
            $scope.weeklySpecialRadioChange = function (componentIndex) {
                $scope.confirmModalIsDirty = true;
                //manipulate al weekly specials
                $scope.allWeeklySpecials.forEach(function (weeklySpecial) {
                    if (weeklySpecial.componentIndex == componentIndex) {
                        weeklySpecial.available = "yes";
                    } else {
                        weeklySpecial.available = "no";
                    }
                })
            };

            //this function un-selects all weekly specials. It turns their available key values to 'no
            $scope.unSelectAllWeeklySpecials = function () {
                $scope.confirmModalIsDirty = true;
                $scope.allWeeklySpecials.forEach(function (weeklySpecial) {
                    weeklySpecial.available = "no";
                })
            };


            //function used to update available components
            $scope.updateAvailableComponents = function () {
                $rootScope.$broadcast('isLoadingTrue');
                var allComponents = [];
                allComponents = allComponents.concat($scope.allOrderComponents);
                allComponents = allComponents.concat($scope.allOmelets);
                allComponents = allComponents.concat($scope.allWeeklySpecials);
                allComponents = allComponents.concat($scope.allExtras);

                grillStatusService.updateAvailableComponents(allComponents)
                    .success(function (resp) {
                        $rootScope.$broadcast('responseStatusHandler', resp);
                        getAllAll();
                        $rootScope.$broadcast('isLoadingFalse');
                        $scope.confirmModalIsDirty = false;
                    })
                    .error(function (errResponse) {
                        $rootScope.$broadcast('isLoadingFalse');
                        $rootScope.$broadcast('responseStatusHandler', errResponse);
                    });
            };


            //******************socket listeners

            //receives grill status
            $rootScope.$on('currentGrillStatus', function (event, currentGrillStatus) {
                $scope.currentGrillStatus = currentGrillStatus;
            });

            $rootScope.$on('reconnectSuccess', function () {
                globals.currentGrillStatus(null, true, true);
                getAllAll();
            });

            //***********************end of socket listeners


            //********************modal actions
            $scope.ok = function () {
                $modalInstance.close("ok");
            };

            $scope.cancel = function () {
                $modalInstance.dismiss("cancel");
            };
            //end of modal actions


            $log.info('AvailableModalController booted successfully');
        }])

    .controller('ConfirmCloseGrillModalController', ['$window', '$location', '$log', '$scope', '$rootScope', '$interval', '$modalInstance',
        function ($window, $location, $log, $scope, $rootScope, $interval, $modalInstance) {

            $scope.ok = function () {
                $modalInstance.close("ok");
            };

            $scope.cancel = function () {
                $modalInstance.dismiss("cancel");
            };

            $log.info('ConfirmCloseGrillModalController booted successfully');
        }]);