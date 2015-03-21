angular.module('grillApp')
    .controller('GrillStatusController', ['$window', '$location', '$log', '$scope', '$rootScope', '$interval', '$modal', 'globals', 'grillStatusService', 'ReferenceService',
        function ($window, $location, $log, $scope, $rootScope, $interval, $modal, globals, grillStatusService, ReferenceService) {

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
                                    $window.location.href = "/error/500.html";
                                });
                        }, function (error) {
                            $scope.grillStatusReference.openCloseClass = "btn btn-default btn-xs";
                            console.log(error);
                        });
                } else if ($scope.currentGrillStatus.grillStatus == "open") {
                    grillStatusService.closeGrill()
                        .success(function (resp) {
                            globals.currentGrillStatus(resp.newGrillStatus, true);
                            $scope.showToast("success", "The Grill is now closed");
                        })
                        .error(function (errResponse) {
                            console.log(JSON.stringify(errResponse));
                            $window.location.href = "/error/500.html";
                        });
                }
            };

            $log.info('GrillStatusController booted successfully');
        }
    ]);