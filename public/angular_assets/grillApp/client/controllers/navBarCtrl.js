angular.module('grillApp')
    .controller('NavBarController', ['$window', '$scope', '$rootScope', 'logoutService',
        function ($window, $scope, $rootScope, logoutService) {

            $scope.logoutCustomOrder = function () {
                logoutService.logoutCustomOrder()
                    .success(function (response) {
                        $window.location.href = "/login1.html";
                    })
                    .error(function (errResponse) {
                        $window.location.href = "/error/500.html";
                    });
            };

            $scope.logoutHarvardOrder = function () {
                logoutService.logoutHarvardOrder()
                    .success(function (response) {
                        $window.location.href = "/login.html";
                    })
                    .error(function (errResponse) {
                        $window.location.href = "/error/500.html";
                    });
            };

        }]);