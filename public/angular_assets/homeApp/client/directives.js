angular.module('clientHomeApp')
    .directive('clientInfoLogin', [function () {
        return {
            templateUrl: 'views/client/login_partials/forms/client_info_login.html',
            restrict: 'AEC',
            link: function ($scope, $element, $attrs) {
            }
        }
    }])
    .directive('clientHomeTopNav', [function () {
        return {
            templateUrl: 'views/client/login_partials/navs/client_home_top_nav.html',
            restrict: 'AEC',
            link: function ($scope, $element, $attrs) {
            }
        }
    }])
    .directive('completeRegistration', [function () {
        return {
            templateUrl: 'views/client/login_partials/forms/registration.html',
            restrict: 'AEC',
            link: function ($scope, $element, $attrs) {
            }
        }
    }]);