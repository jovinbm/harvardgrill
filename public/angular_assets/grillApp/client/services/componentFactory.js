angular.module('grillApp')

    .factory('ComponentService', ['$window', '$http', '$rootScope', 'globals',
        function ($window, $http, $rootScope, globals) {

            return {
                getAvailableOrderComponents: function () {
                    return $http.get('/api/getAvailableOrderComponents')
                },

                getAvailableOmelets: function () {
                    return $http.get('/api/getAvailableOmelets')
                },

                getAvailableWeeklySpecials: function () {
                    return $http.get('/api/getAvailableWeeklySpecials')
                },

                getAvailableExtras: function () {
                    return $http.get('/api/getAvailableExtras')
                },

                getMyRecentOrders: function () {
                    return $http.get('/api/getMyRecentOrders')
                },

                placeMyNewOrder: function (orderComponentIndexArray) {
                    return $http.post('/api/newClientOrder', {
                        theOrderArray: orderComponentIndexArray
                    })
                }
            }
        }])
;