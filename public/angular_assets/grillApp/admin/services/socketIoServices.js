angular.module('grillApp')

    .factory('socket', ['$location', '$rootScope',
        function ($location, $rootScope) {
            var url;
            if ($location.port()) {
                url = $location.host() + ":" + $location.port();
            } else {
                url = $location.host();
            }
            var socket = io.connect(url);
            //return socket;
            return {
                on: function (eventName, callback) {
                    socket.on(eventName, function () {
                        var args = arguments;
                        $rootScope.$apply(function () {
                            callback.apply(socket, args);
                        });
                    });
                },

                emit: function (eventName, data, callback) {
                    socket.emit(eventName, data, function () {
                        var args = arguments;
                        $rootScope.$apply(function () {
                            if (callback) {
                                callback.apply(socket, args);
                            }
                        });
                    })
                },

                removeAllListeners: function (eventName, callback) {
                    socket.removeAllListeners(eventName, function () {
                        var args = arguments;
                        $rootScope.$apply(function () {
                            callback.apply(socket, args);
                        });
                    });
                }
            }
        }])


    .factory('socketService', ['$http',
        function ($http) {
            var grillName;
            return {
                grillName: function (newGrillName) {
                    if (newGrillName) {
                        grillName = newGrillName;
                        return grillName;
                    } else {
                        return grillName;
                    }
                },

                getSocketRoom: function () {
                    //no grillName required here since this is the very first request
                    //grillName updated in mainController which will call the grillName function above
                    //on success
                    return $http.get('/api/getMyRoom');
                },

                adminStartUp: function () {
                    return $http.post('/api/adminStartUp');
                },

                getCurrentGrillStatus: function () {
                    return $http.post('/api/getCurrentGrillStatus');
                },

                getAdminClientOrders: function (amount, currentOrdersToBeSkipped) {
                    return $http.post('/api/getAdminClientOrders', {
                        amount: amount,
                        currentOrdersToBeSkipped: currentOrdersToBeSkipped
                    });
                },


                getAllComponentsIndexNames: function () {
                    return $http.post('/api/getAllComponentsIndexNames');
                },

                reconnect: function (currentPage) {
                    return $http.post('/api/adminReconnect', {
                        "page": currentPage
                    })
                }
            }
        }])


    .factory('logoutService', ['$http',
        function ($http) {
            return {
                logoutAdminFull: function () {
                    return $http.post('/api/logoutAdminFull');
                },

                logoutAdminSession: function () {
                    return $http.post('/api/logoutAdminSession');
                }
            }
        }]);