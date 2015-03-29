angular.module('grillApp')

    .factory('grillStatusService', ['$window', '$location', '$http', '$rootScope',
        function ($window, $location, $http, $rootScope) {
            return {
                openGrill: function () {
                    return $http.post('api/openGrill');
                },

                closeGrill: function () {
                    return $http.post('api/closeGrill');
                },

                updateAvailableComponents: function (allComponents) {
                    return $http.post('/api/updateAvailableComponents', {
                        allComponents: allComponents
                    })
                },

                markOrderAsDone: function (orderUniqueCuid, processedOrderComponents) {
                    return $http.post('/api/markOrderAsDone', {
                        orderUniqueCuid: orderUniqueCuid,
                        processedOrderComponents: processedOrderComponents
                    })
                },

                markOrderAsDeclined: function (orderUniqueCuid) {
                    return $http.post('/api/markOrderAsDeclined', {
                        orderUniqueCuid: orderUniqueCuid
                    })
                }
            }
        }]);