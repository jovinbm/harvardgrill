angular.module('adminLoginApp')

    .factory('logoutService', ['$http',
        function ($http) {
            return {
                adminLogout: function () {
                    return $http.post('/api/adminLogout');
                }
            }
        }]);