angular.module('adminLoginApp')

    .factory('logoutService', ['$http',
        function ($http) {
            return {
                logoutAdminFull: function () {
                    return $http.post('/api/logoutAdminFull');
                },

                logoutAdminSession: function () {
                    return $http.post('/api/logoutAdminSession');
                }
            }
        }]);