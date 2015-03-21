angular.module('grillApp')
    .controller('NavBarController', ['$window', '$log', '$scope', '$rootScope', 'logoutService',
        function ($window, $log, $scope, $rootScope, logoutService) {

            $scope.logoutCustomOrder = function () {
                logoutService.logoutCustomOrder()
                    .success(function (response) {
                        $window.location.href = "/login1.html";
                    })
                    .error(function (errResponse) {
                        $scope.showToast("error", "A fatal error has occurred. Please reload the page");
                    });
            };

            $scope.logoutHarvardOrder = function () {
                logoutService.logoutHarvardOrder()
                    .success(function (response) {
                        $window.location.href = "/login.html";
                    })
                    .error(function (errResponse) {
                        $scope.showToast("error", "A fatal error has occurred. Please reload the page");
                    });
            };

            $log.info('NavBarController booted successfully');
        }]);