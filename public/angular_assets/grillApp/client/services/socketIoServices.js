angular.module('grillApp')


    .factory('socket', ['$log', '$location', '$rootScope',
        function ($log, $location, $rootScope) {
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


    .factory('socketService', ['$log', '$http', '$rootScope',
        function ($log, $http, $rootScope) {

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

                clientStartUp: function () {
                    return $http.post('/api/clientStartUp');
                },

                getCurrentGrillStatus: function () {
                    return $http.post('/api/getCurrentGrillStatus');
                },

                getAllComponentsIndexNames: function () {
                    return $http.post('/api/getAllComponentsIndexNames');
                },
            }
        }
    ])


    .factory('logoutService', ['$http',
        function ($http) {
            return {
                logoutClientSession: function () {
                    return $http.post('/api/logoutClientSession');
                },

                logoutClientFull: function () {
                    return $http.post('/api/logoutClientFull');
                }
            }
        }]);