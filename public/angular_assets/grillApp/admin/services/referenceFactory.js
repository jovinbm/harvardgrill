angular.module('grillApp')

    //stores class and text references for short phrases and button texts
    .factory('ReferenceService', ['$http', '$rootScope', 'globals',
        function ($http, $rootScope, globals) {

            var editReference = {};

            var GrillStatusCard = {};
            //grillStatusCard keys == openCloseText, openCloseClass, grillStatusAlertText, grillStatusAlertClass

            //receives grill status
            $rootScope.$on('currentGrillStatus', function (event, currentGrillStatus) {
                GrillStatusCard = refreshGrillStatusCard(currentGrillStatus);
            });

            function refreshGrillStatusCard(currentGrillStatus, broadcast) {
                //if currentGrillStatus is supplied, use it to update reference
                if (currentGrillStatus) {
                    //openCloseText
                    if (currentGrillStatus.grillStatus == "open") {
                        GrillStatusCard.openCloseText = "Close Grill"
                    } else if (currentGrillStatus.grillStatus == "closed") {
                        GrillStatusCard.openCloseText = "Open Grill"
                    }

                    //openCloseClass
                    if (currentGrillStatus.grillStatus == "open") {
                        GrillStatusCard.openCloseClass = "btn btn-warning btn-md"
                    } else if (currentGrillStatus.grillStatus == "closed") {
                        GrillStatusCard.openCloseClass = "btn btn-success btn-md"
                    }

                    //grillStatusAlertText
                    if (currentGrillStatus.grillStatus == "open") {
                        GrillStatusCard.grillStatusAlertText = "Open, accepting orders"
                    } else if (currentGrillStatus.grillStatus == "closed") {
                        GrillStatusCard.grillStatusAlertText = "Closed, not accepting orders"
                    }

                    //grillStatusAlertClass
                    if (currentGrillStatus.grillStatus == "open") {
                        GrillStatusCard.grillStatusAlertClass = "alert alert-dismissible alert-success"
                    } else if (currentGrillStatus.grillStatus == "closed") {
                        GrillStatusCard.grillStatusAlertClass = "alert alert-dismissible alert-warning"
                    }
                }

                if (broadcast) {
                    $rootScope.broadcast('GrillStatusCard', GrillStatusCard);
                }
                return GrillStatusCard;
            }


            //this function can take in an array and makes an edit reference out of it
            //this reference is used in the edit page to hold the button classess, and put's the default isInEditingMode to false
            //isInEditing mode means that there is a content that is being edited in the edit view page
            function editViewReference(componentArray) {
                if (componentArray.length != 0) {
                    componentArray.forEach(function (component) {
                        //give the component an editing mode
                        component.componentEditingMode = false;
                        //give the component other classes
                        component.editButtonClass = "btn btn-primary btn-md";
                        component.deleteButtonClass = "btn btn-warning btn-md";
                        component.saveButtonClass = "btn btn-primary btn-md";
                        component.cancelButtonClass = "btn btn-default btn-md";

                        //save the component
                        editReference[component.componentIndex] = component;

                    });
                    //add a universal editing mode
                    editReference.isInEditingMode = false;

                    return editReference;
                } else {
                    return {};
                }
            }

            return {
                refreshGrillStatusCard: function (currentGrillStatus, broadcast) {
                    if (currentGrillStatus) {
                        return refreshGrillStatusCard(currentGrillStatus, broadcast)
                    } else {
                        return refreshGrillStatusCard(globals.currentGrillStatus());
                    }
                },


                refreshEditViewReference: function (componentArray) {
                    return editViewReference(componentArray);
                }
            }
        }]);