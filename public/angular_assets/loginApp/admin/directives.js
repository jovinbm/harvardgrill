angular.module('adminLoginApp')
    .directive('adminInfoLogin', [function () {
        return {
            templateUrl: 'views/admin/login_partials/forms/admin_info_login.html',
            restrict: 'AEC',
            link: function ($scope, $element, $attrs) {
            }
        }
    }])
    .directive('adminRegistration', [function () {
        return {
            templateUrl: 'views/admin/login_partials/forms/admin_registration.html',
            restrict: 'AEC',
            link: function ($scope, $element, $attrs) {
            }
        }
    }])
    .directive('adminLoginTopNav', [function () {
        return {
            templateUrl: 'views/admin/login_partials/navs/admin_login_top_nav.html',
            restrict: 'AEC',
            link: function ($scope, $element, $attrs) {
            }
        }
    }])
    .directive('adminLoginFooter', [function () {
        return {
            templateUrl: 'views/admin/login_partials/navs/admin_login_footer.html',
            restrict: 'AEC',
            link: function ($scope, $element, $attrs) {
            }
        }
    }])
    .directive('grillsEdit', [function () {
        return {
            templateUrl: 'views/admin/login_partials/sections/grill_edit.html',
            restrict: 'AEC',
            link: function ($scope, $element, $attrs) {
            }
        }
    }]);