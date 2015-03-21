angular.module('grillApp')

    .factory('grillStatusService', ['$window', '$location', '$http', '$rootScope',
        function ($window, $location, $http, $rootScope) {
            return {
                openGrill: function () {
                    return $http.get('api/openGrill');
                },

                closeGrill: function () {
                    return $http.get('api/closeGrill');
                },

                updateAvailableComponents: function (allComponents) {
                    return $http.post('/api/updateAvailableComponents', {
                        allComponents: allComponents
                    })
                }
            }
        }]);