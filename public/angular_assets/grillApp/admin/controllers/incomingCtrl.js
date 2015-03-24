angular.module('grillApp')
    .controller('IncomingController', ['$filter', '$window', '$location', '$log', '$scope', '$rootScope', '$interval', '$modal', 'globals', 'grillStatusService', 'ReferenceService', 'EditService', 'socketService',
        function ($filter, $window, $location, $log, $scope, $rootScope, $interval, $modal, globals, grillStatusService, ReferenceService, EditService, socketService) {

            $scope.currentIncomingOrders = [];

            //refresh here replaces all the currentIncoming orders with new ones instead of just pushing
            function getAdminClientOrders(amount, refresh) {
                if (refresh) {
                    globals.adminClientOrders(amount, true, true);

                }
            }

            function updateTimeAgo() {
                $scope.currentIncomingOrders.forEach(function (order) {
                    order.theTimeAgo = $filter('timeago')(order.orderTime);
                });
            }

            $interval(updateTimeAgo, 60000, 0, true);

            getAdminClientOrders(10, true);


            $rootScope.$on('adminClientOrders', function (event, data) {
                data.forEach(function (order) {
                    order.momentJsTime = moment(order.orderTime).format("ddd, MMM D, H:mm");
                    order.theTimeAgo = $filter('timeago')(order.orderTime);
                });
                $scope.currentIncomingOrders = data;
            });

            $log.info('IncomingController booted successfully');
        }
    ]);