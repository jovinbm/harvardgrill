angular.module('grillApp')

    .factory('ComponentService', ['$window', '$http', '$rootScope', 'globals',
        function ($window, $http, $rootScope, globals) {

            return {
                getAvailableComponents: function (componentGroup) {
                    return $http.post('/api/getAvailableComponents', {
                        componentGroup: componentGroup
                    })
                },

                getMyRecentOrders: function () {
                    return $http.post('/api/getMyRecentOrders')
                },

                placeMyNewOrder: function (orderComponentIndexArray) {
                    return $http.post('/api/newClientOrder', {
                        theOrderArray: orderComponentIndexArray
                    })
                }
            }
        }])
;