angular.module('grillApp')

    .factory('EditService', ['$window', '$http', '$rootScope', 'globals',
        function ($window, $http, $rootScope, globals) {

            return {
                addComponent: function (theComponentObject) {
                    if (globals.currentGrillStatus().grillStatus == "closed") {
                        return $http.post('/api/addComponent', {
                            theComponentObject: theComponentObject
                        });
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

                getAllComponents: function (componentGroup) {
                    return $http.post('/api/getAllComponents', {
                        componentGroup: componentGroup
                    })
                }
            }
        }])
;