angular.module('grillApp')
    .controller('NavBarController', ['$window', '$log', '$scope', '$rootScope', 'logoutService',
        function ($window, $log, $scope, $rootScope, logoutService) {

            $scope.logoutAdminFull = function () {
                logoutService.logoutAdminFull()
                    .success(function (resp) {
                        $scope.responseStatusHandler(resp);
                    })
                    .error(function (errResponse) {
                        $scope.responseStatusHandler(errResponse);
                    });
            };

            $scope.logoutAdminSession = function () {
                logoutService.logoutAdminSession()
                    .success(function (resp) {
                        $scope.responseStatusHandler(resp);
                    })
                    .error(function (errResponse) {
                        $scope.responseStatusHandler(errResponse);
                    });
            };

            $log.info('NavBarController booted successfully');
        }]);