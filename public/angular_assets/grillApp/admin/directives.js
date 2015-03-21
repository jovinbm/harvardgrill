angular.module('grillApp')
    .directive('adminTopNav', [function () {
        return {
            templateUrl: 'views/admin/partials/navs/admin_top_nav.html',
            restrict: 'AEC',
            link: function ($scope, $element, $attrs) {
            }
        }
    }])
    .directive('incomingOrdersColumn', [function () {
        return {
            restrict: 'AEC',
            templateUrl: 'views/admin/partials/incoming_orders.html',
            link: function ($scope, $element, $attrs) {
            }
        }
    }])
    .directive('dashboardColumn', [function () {
        return {
            restrict: 'AEC',
            templateUrl: 'views/admin/partials/dashboard/dashboard_column.html',
            link: function ($scope, $element, $attrs) {
            }
        }
    }])
    .directive('grillStatusCard', [function () {
        return {
            restrict: 'AEC',
            templateUrl: 'views/admin/partials/dashboard/grill_status_card.html',
            link: function ($scope, $element, $attrs) {
            }
        }
    }])
    .directive('availableCard', [function () {
        return {
            restrict: 'AEC',
            templateUrl: 'views/admin/partials/dashboard/available_card.html',
            link: function ($scope, $element, $attrs) {
            }
        }
    }])
    .directive('confirmAvailableModal', [function () {
        return {
            restrict: 'AEC',
            templateUrl: 'views/admin/partials/modals/confirm_available.html',
            link: function ($scope, $element, $attrs) {
            }
        }
    }]);