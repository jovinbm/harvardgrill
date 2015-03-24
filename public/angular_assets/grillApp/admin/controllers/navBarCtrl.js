angular.module('grillApp')
    .controller('NavBarController', ['$window', '$log', '$scope', '$rootScope', 'logoutService',
        function ($window, $log, $scope, $rootScope, logoutService) {

            $scope.adminLogout = function () {
                logoutService.adminLogout()
                    .success(function (response) {
                        $window.location.href = "/views/admin_login.html";
                    })
                    .error(function (errResponse) {
                        $scope.showToast("error", "A fatal error has occurred. Please reload the page");
                    });
            };

            $log.info('NavBarController booted successfully');
        }]);