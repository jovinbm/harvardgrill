angular.module('clientHomeApp')

    .factory('logoutService', ['$http',
        function ($http) {
            return {
                logoutClientFull: function () {
                    return $http.post('/api/logoutClientFull');
                }
            }
        }]);