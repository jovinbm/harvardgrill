angular.module('clientHomeApp')
    .controller('NavBarController', ['$window', '$log', '$scope', '$rootScope', 'logoutService',
        function ($window, $log, $scope, $rootScope, logoutService) {

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