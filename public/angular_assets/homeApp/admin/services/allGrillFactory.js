angular.module('adminHomeApp')

    .factory('allGrillService', ['$log', '$http', '$rootScope',
        function ($log, $http, $rootScope) {

            return {

                createGrill: function (grillName) {
                    return $http.post('/api/createGrill', {
                        grillName: grillName
                    });
                },

                deleteGrill: function (grillName) {
                    return $http.post('/api/deleteGrill', {
                        grillName: grillName
                    });
                }
            }
        }
    ]);