angular.module('clientLoginApp')

    //stores class and text references for short phrases and button texts
    .factory('referenceService', ['$http', '$rootScope', 'globals',
        function ($http, $rootScope, globals) {

            var allGrillStatusesModel = {};

            //this function can take in an array and makes an edit reference out of it
            //this reference is used in the edit page to hold the button classes, and puts the default isInEditingMode to false
            //isInEditing mode means that there is a content that is being edited in the edit view page
            function refreshAllGrillStatusesModel(newAllGrillStatus) {
                if (newAllGrillStatus) {
                    newAllGrillStatus.forEach(function (grill) {
                        //give the grill an isSelected key
                        grill.isSelected = 'no';

                        //save the grill
                        allGrillStatusesModel[grill.grillName] = grill;

                    });
                    return allGrillStatusesModel;
                } else {
                    return allGrillStatusesModel;
                }
            }

            return {

                refreshAllGrillStatusesModel: function (newAllGrillStatus) {
                    return refreshAllGrillStatusesModel(newAllGrillStatus);
                }
            }
        }]);