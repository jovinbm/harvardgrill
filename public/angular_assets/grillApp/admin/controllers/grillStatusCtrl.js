angular.module('grillApp')
    .controller('GrillStatusController', ['$window', '$location', '$log', '$scope', '$rootScope', '$interval', '$modal', 'globals', 'grillStatusService', 'ReferenceService', 'EditService',
        function ($window, $location, $log, $scope, $rootScope, $interval, $modal, globals, grillStatusService, ReferenceService, EditService) {

            //variable to keep track if the user made changes to the available card that have not been updated yet
            $scope.availableCardIsDirty = false;
            $scope.makeAvailableCardDirty = function () {
                $scope.availableCardIsDirty = true;
            };


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

            //the grillStatus reference holds the grillStatusCard classes such as
            //openCloseText, openCloseClass, grillStatusAlertText, grillStatusAlertClass
            //it is updated by the ReferenceService.refreshGrillStatusCard() function
            $scope.grillStatusReference = ReferenceService.refreshGrillStatusCard();

            //*****************end of refreshing the current grill status***********


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


                if ($scope.currentGrillStatus.grillStatus == "closed") {
                    var aModalInstance = $scope.openAvailableModalInstance();
                    aModalInstance.result
                        .then(function (result) {
                            grillStatusService.openGrill()
                                .success(function (resp) {
                                    getAllAll();
                                    globals.currentGrillStatus(resp.newGrillStatus, true);
                                    $scope.isLoadingFalse();
                                    $scope.responseStatusHandler(resp);
                                })
                                .error(function (errResponse) {
                                    $scope.isLoadingFalse();
                                    $scope.responseStatusHandler(errResponse);
                                });
                        }, function (error) {
                            getAllAll();
                            $scope.isLoadingFalse();
                            $scope.grillStatusReference.openCloseClass = "btn btn-success btn-md";
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


            //******************order components******************************
            //functions to get all order components
            //these are updated on every state change when controller restarts therefore no need to store them in factory
            $scope.allOrderComponents = [];
            $scope.allOmelets = [];
            $scope.allWeeklySpecials = [];
            $scope.allExtras = [];

            //request all components;
            function getAllOrderComponents() {
                EditService.getAllComponents('oc')
                    .success(function (orderComponents) {
                        $scope.allOrderComponents = orderComponents.allComponents;
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
                        $scope.responseStatusHandler(orderComponents);
                    })
                    .error(function (errResponse) {
                        $scope.responseStatusHandler(errResponse);
                    });
            }


            function getAllAll() {
                getAllOrderComponents();
                getAllOmelets();
                getAllWeeklySpecials();
                getAllExtras();
            }

            getAllAll();


            //this functions enables the use of checkbox as a radio button on the weekly special available/not-available card
            //it takes in the componentIndex and makes it's available key to yes, which switches on the checkbox(ng-true-value == 'yes
            //after that, it turns all weekly special available values to 'no' hence checkbox
            $scope.weeklySpecialRadioChange = function (componentIndex) {
                $scope.availableCardIsDirty = true;
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
                $scope.availableCardIsDirty = true;
                $scope.allWeeklySpecials.forEach(function (weeklySpecial) {
                    weeklySpecial.available = "no";
                })
            };


            //function used to update available components
            $scope.updateAvailableComponents = function () {
                $scope.isLoadingTrue();
                var allComponents = [];
                allComponents = allComponents.concat($scope.allOrderComponents);
                allComponents = allComponents.concat($scope.allOmelets);
                allComponents = allComponents.concat($scope.allWeeklySpecials);
                allComponents = allComponents.concat($scope.allExtras);

                grillStatusService.updateAvailableComponents(allComponents)
                    .success(function (resp) {
                        $scope.responseStatusHandler(resp);
                        getAllAll();
                        $scope.isLoadingFalse();
                        $scope.availableCardIsDirty = false;
                    })
                    .error(function (errResponse) {
                        $scope.isLoadingFalse();
                        $scope.responseStatusHandler(errResponse);
                    });
            };


            //***********************socket listeners

            //receives grill status
            $rootScope.$on('currentGrillStatus', function (event, currentGrillStatus) {
                $scope.grillStatusReference = ReferenceService.refreshGrillStatusCard(currentGrillStatus);
                $scope.currentGrillStatus = currentGrillStatus;
            });

            $rootScope.$on('reconnectSuccess', function () {
                globals.currentGrillStatus(null, true, true);
                $scope.grillStatusReference = ReferenceService.refreshGrillStatusCard();
                getAllAll();
            });

            //************************end of socket listeners

            $log.info('GrillStatusController booted successfully');
        }
    ]);