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
                                toastr.error("A fatal error has occurred. Please reload the page", 'Error');
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


                adminClientOrders: function (amount, broadcast, refresh) {
                    if (refresh) {
                        socketService.getAdminClientOrders(amount)
                            .success(function (resp) {
                                adminClientOrders = resp.orders;

                                if (broadcast) {
                                    $rootScope.$broadcast('adminClientOrders', adminClientOrders);
                                }
                            })
                            .error(function (errResponse) {
                                toastr.error("A fatal error has occurred. Please reload the page", 'Error');
                            });
                    } else if (broadcast) {
                        $rootScope.$broadcast('adminClientOrders', adminClientOrders);
                    }
                    return adminClientOrders;
                }

            }
        }]);
