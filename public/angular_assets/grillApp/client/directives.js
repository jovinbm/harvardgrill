angular.module('grillApp')
    .directive('clientTopNav', [function () {
        return {
            templateUrl: 'views/client/partials/navs/client_top_nav.html',
            restrict: 'AEC',
            link: function ($scope, $element, $attrs) {
            }
        }
    }])
    .directive('mainOrderJumbo', [function () {
        return {
            templateUrl: 'views/client/partials/sections/main_order_card.html',
            restrict: 'AEC',
            link: function ($scope, $element, $attrs) {
            }
        }
    }])
    .directive('myRecentOrders', [function () {
        return {
            templateUrl: 'views/client/partials/sections/my_recent_orders.html',
            restrict: 'AEC',
            link: function ($scope, $element, $attrs) {
            }
        }
    }])
    .directive('recentOrderStream', [function () {
        return {
            templateUrl: 'views/client/partials/sections/recent_order_stream.html',
            restrict: 'AEC',
            link: function ($scope, $element, $attrs) {
            }
        }
    }]);