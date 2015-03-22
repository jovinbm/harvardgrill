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


    .factory('socketService', ['$http', 'globals',
        function ($http, globals) {
            return {
                getSocketRoom: function () {
                    return $http.get('/api/getMyRoom');
                },

                startUp: function () {
                    return $http.post('/api/startUp');
                },

                reconnect: function (currentPage) {
                    return $http.post('/api/reconnect', {
                        "page": currentPage
                    })
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
                },

                logoutHarvardLogin: function () {
                    return $http.post('/api/logoutHarvardLogin');
                }
            }
        }]);