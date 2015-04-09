angular.module('adminHomeApp')
    .directive('adminInfoLogin', [function () {
        return {
            templateUrl: 'views/admin/login_partials/forms/admin_info_login.html',
            restrict: 'AEC',
            link: function ($scope, $element, $attrs) {
            }
        }
    }])
    .directive('adminHomeTopNav', [function () {
        return {
            templateUrl: 'views/admin/login_partials/navs/admin_home_top_nav.html',
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