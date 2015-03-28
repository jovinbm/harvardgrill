angular.module('grillApp')
    .controller('NavBarController', ['$window', '$log', '$scope', '$rootScope', 'logoutService',
        function ($window, $log, $scope, $rootScope, logoutService) {

            $scope.adminLogout = function () {
                logoutService.adminLogout()
                    .success(function (response) {
                        $window.location.href = "/adminLogin.html";
                    })
                    .error(function (errResponse) {
                        $scope.requestErrorHandler(errResponse);
                    });
            };

            $log.info('NavBarController booted successfully');
        }]);