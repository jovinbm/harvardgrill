angular.module('grillApp')
    .controller('NavBarController', ['$log', '$window', '$scope', '$rootScope', 'logoutService',
        function ($log, $window, $scope, $rootScope, logoutService) {

            $scope.logoutClientSession = function () {
                logoutService.logoutClientSession()
                    .success(function (resp) {
                        $scope.responseStatusHandler(resp);
                    })
                    .error(function (errResponse) {
                        $scope.responseStatusHandler(errResponse);
                    });
            };

            $scope.logoutClientFull = function () {
                logoutService.logoutClientFull()
                    .success(function (resp) {
                        $scope.responseStatusHandler(resp);
                    })
                    .error(function (errResponse) {
                        $scope.responseStatusHandler(errResponse);
                    });
            };

            $log.info('NavBarController booted successfully');
        }]);