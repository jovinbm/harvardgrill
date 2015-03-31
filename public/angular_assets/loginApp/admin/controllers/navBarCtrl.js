angular.module('adminLoginApp')

    .controller('NavBarController', ['$log', '$window', '$scope', '$rootScope', 'logoutService',
        function ($log, $window, $scope, $rootScope, logoutService) {

            $scope.logoutCustomOrder = function () {
                logoutService.logoutCustomOrder()
                    .success(function (response) {
                        $window.location.href = "/clientLogin.html";
                    })
                    .error(function (errResponse) {
                        $scope.requestErrorHandler(errResponse);
                    });
            };

            $scope.logoutHarvardOrder = function () {
                logoutService.logoutHarvardOrder()
                    .success(function (response) {
                        $window.location.href = "/login.html";
                    })
                    .error(function (errResponse) {
                        $scope.requestErrorHandler(errResponse);
                    });
            };

            $log.info('NavBarController booted successfully');
        }]);