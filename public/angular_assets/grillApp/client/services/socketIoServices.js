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


    .factory('socketService', ['$http', '$rootScope',
        function ($http, $rootScope) {
            return {
                getSocketRoom: function () {
                    $rootScope.$broadcast('isLoadingTrue');
                    return $http.get('/api/getMyRoom');
                },

                clientStartUp: function () {
                    $rootScope.$broadcast('isLoadingTrue');
                    return $http.post('/api/clientStartUp');
                },

                getCurrentGrillStatus: function () {
                    $rootScope.$broadcast('isLoadingTrue');
                    return $http.post('/api/getCurrentGrillStatus');
                }
            }
        }])


    .factory('logoutService', ['$http',
        function ($http) {
            return {
                logoutCustomOrder: function () {
                    return $http.post('/api/logoutCustomOrder');
                },

                logoutHarvardOrder: function () {
                    return $http.post('/api/logoutHarvardOrder');
                }
            }
        }]);