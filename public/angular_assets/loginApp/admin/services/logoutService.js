angular.module('adminLoginApp')

    .factory('logoutService', ['$http',
        function ($http) {
            return {
                logoutCustomOrder: function () {
                    return $http.post('/api/logoutCustomOrder');
                },

                logoutHarvardOrder: function () {
                    return $http.post('/api/logoutHarvardOrder');
                }
            }
        }]);