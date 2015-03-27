angular.module('grillApp')

    .factory('globals', ['$window', '$rootScope', 'socketService',
        function ($window, $rootScope, socketService) {
            var myCustomUsername;
            var myUniqueCuid;
            var mySocketRoom;
            var currentGrillStatus = {};
            var adminClientOrders = [];
            return {
                customUsername: function (newCustomUsername) {
                    if (newCustomUsername) {
                        myCustomUsername = newCustomUsername;
                        return myCustomUsername;
                    } else {
                        return myCustomUsername;
                    }
                },

                uniqueCuid: function (newUniqueCuid) {
                    if (newUniqueCuid) {
                        myUniqueCuid = newUniqueCuid;
                        return myUniqueCuid;
                    } else {
                        return myUniqueCuid;
                    }
                },

                socketRoom: function (newSocketRoom) {
                    if (newSocketRoom) {
                        mySocketRoom = newSocketRoom;
                    } else {
                        return mySocketRoom;
                    }
                },

                currentGrillStatus: function (newGrillStatus, broadcast, refreshGrillStatus) {
                    if (refreshGrillStatus) {
                        socketService.getCurrentGrillStatus()
                            .success(function (resp) {
                                currentGrillStatus = resp.currentGrillStatus;

                                if (broadcast) {
                                    $rootScope.$broadcast('currentGrillStatus', currentGrillStatus);
                                }
                            })
                            .error(function (errResponse) {
                                $rootScope.$broadcast('requestErrorHandler', errResponse);
                            });
                    } else {

                        if (newGrillStatus) {
                            currentGrillStatus = newGrillStatus;
                        }

                        if (broadcast) {
                            $rootScope.$broadcast('currentGrillStatus', currentGrillStatus);
                        }
                    }

                    return currentGrillStatus;
                },


                adminClientOrders: function (amount, broadcast, getFromServer, refresh, currentOrdersToBeSkipped) {
                    if (getFromServer) {
                        socketService.getAdminClientOrders(amount, currentOrdersToBeSkipped)
                            .success(function (resp) {
                                adminClientOrders = resp.orders;

                                if (refresh) {
                                    //a true of refresh causes a broadcast an event which refreshes the currentIncomingOrders
                                    if (broadcast) {
                                        $rootScope.$broadcast('adminClientOrdersRefresh', adminClientOrders);
                                    }
                                } else {
                                    //no refresh
                                    //just broadcast the one new order, this does not cause a refresh of the current
                                    // incoming orders
                                    if (broadcast) {
                                        $rootScope.$broadcast('adminClientOrdersRefreshNoRefresh', adminClientOrders);
                                    }
                                }
                            })
                            .error(function (errResponse) {
                                $rootScope.$broadcast('requestErrorHandler', errResponse);
                            });
                    } else if (broadcast) {
                        $rootScope.$broadcast('adminClientOrders', adminClientOrders);
                    }
                    return adminClientOrders;
                }

            }
        }]);
