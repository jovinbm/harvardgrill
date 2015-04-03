angular.module('clientLoginApp')
    .directive('clientInfoLogin', [function () {
        return {
            templateUrl: 'views/client/login_partials/forms/client_info_login.html',
            restrict: 'AEC',
            link: function ($scope, $element, $attrs) {
            }
        }
    }])
    .directive('clientRegistration', [function () {
        return {
            templateUrl: 'views/client/login_partials/forms/client_registration.html',
            restrict: 'AEC',
            link: function ($scope, $element, $attrs) {
            }
        }
    }])
    .directive('clientLoginTopNav', [function () {
        return {
            templateUrl: 'views/client/login_partials/navs/client_login_top_nav.html',
            restrict: 'AEC',
            link: function ($scope, $element, $attrs) {
            }
        }
    }])
    .directive('clientLoginFooter', [function () {
        return {
            templateUrl: 'views/client/login_partials/navs/client_login_footer.html',
            restrict: 'AEC',
            link: function ($scope, $element, $attrs) {
            }
        }
    }]);