angular.module('grillApp')

    .factory('EditService', ['$window', '$http', '$rootScope', 'globals',
        function ($window, $http, $rootScope, globals) {

            var allOrderComponents;
            var allOmelets;
            var allWeeklySpecials;
            var allExtras;

            return {
                addComponent: function (theComponentObject) {
                    if (globals.currentGrillStatus().grillStatus == "closed") {
                        return $http.post('/api/addComponent', theComponentObject);
                    }
                },

                saveEditedOrderComponent: function (componentIndex, name) {
                    var temp = {
                        componentIndex: componentIndex,
                        name: name
                    };
                    if (globals.currentGrillStatus().grillStatus == "closed") {
                        return $http.post('/api/saveEditedComponent', temp);
                    }
                },

                deleteComponent: function (componentIndex) {
                    var temp = {
                        componentIndex: componentIndex
                    };
                    if (globals.currentGrillStatus().grillStatus == "closed") {
                        return $http.post('/api/deleteComponent', temp);
                    }
                },

                getAllOrderComponents: function () {
                    return $http.get('/api/getAllOrderComponents')
                },

                getAllOmelets: function () {
                    return $http.get('/api/getAllOmelets')
                },

                getAllWeeklySpecials: function () {
                    return $http.get('/api/getAllWeeklySpecials')
                },

                getAllExtras: function () {
                    return $http.get('/api/getAllExtras')
                }
            }
        }])
;