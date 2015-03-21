angular.module('grillApp')

    //stores class and text references for short phrases and button texts
    .factory('ReferenceService', ['$http', '$rootScope', 'globals',
        function ($http, $rootScope, globals) {

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

            return {
                refreshGrillStatusCard: function (currentGrillStatus, broadcast) {
                    if (currentGrillStatus) {
                        return refreshGrillStatusCard(currentGrillStatus, broadcast)
                    } else {
                        return refreshGrillStatusCard(globals.currentGrillStatus());
                    }
                },


                updateGrillStatusCard: function (whatToUpdate, value, broadcast) {
                    GrillStatusCard[whatToUpdate] = value;
                    if (broadcast) {
                        $rootScope.broadcast('newGrillStatusCard', GrillStatusCard);
                    }
                    return GrillStatusCard;
                }
            }
        }]);