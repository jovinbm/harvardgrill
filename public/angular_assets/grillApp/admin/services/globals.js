angular.module('grillApp')

    .factory('globals', ['$window', '$rootScope', 'socketService',
        function ($window, $rootScope, socketService) {
            var username;
            var grillName;
            var myUniqueCuid;
            var mySocketRoom;
            var currentGrillStatus = {};
            var adminClientOrders = [];
            return {
                username: function (newUsername) {
                    if (newUsername) {
                        username = newUsername;
                        return username;
                    } else {
                        return username;
                    }
                },

                grillName: function (newGrillName) {
                    if (newGrillName) {
                        grillName = newGrillName;
                        return grillName;
                    } else {
                        return grillName;
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
                                $rootScope.$broadcast('responseStatusHandler', resp);
                                currentGrillStatus = resp.currentGrillStatus;

                                if (broadcast) {
                                    $rootScope.$broadcast('currentGrillStatus', currentGrillStatus);
                                }
                            })
                            .error(function (errResponse) {
                                $rootScope.$broadcast('responseStatusHandler', errResponse);
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
                                $rootScope.$broadcast('responseStatusHandler', resp);
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
                                $rootScope.$broadcast('responseStatusHandler', errResponse);
                            });
                    } else if (broadcast) {
                        $rootScope.$broadcast('adminClientOrders', adminClientOrders);
                    }
                    return adminClientOrders;
                }

            }
        }]);
