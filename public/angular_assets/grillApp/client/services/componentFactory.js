angular.module('grillApp')

    .factory('ComponentService', ['$window', '$http', '$rootScope', 'globals',
        function ($window, $http, $rootScope, globals) {

            return {
                getAvailableOrderComponents: function () {
                    return $http.post('/api/getAvailableOrderComponents')
                },

                getAvailableOmelets: function () {
                    return $http.post('/api/getAvailableOmelets')
                },

                getAvailableWeeklySpecials: function () {
                    return $http.post('/api/getAvailableWeeklySpecials')
                },

                getAvailableExtras: function () {
                    return $http.post('/api/getAvailableExtras')
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