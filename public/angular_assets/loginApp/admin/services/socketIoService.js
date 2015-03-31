angular.module('adminLoginApp')

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

            return {

                getMyTemporarySocketRoom: function () {
                    //give this user a temporary socketRoom using cuid()
                    //when the server does not find the user
                    return $http.get('/api/getTemporarySocketRoom');
                },

                adminLoginStartUp: function () {
                    //currently, this gets all the grillStatuses
                    //may be used to get other things that need to be displayed
                    return $http.post('/api/adminLoginStartUp');
                },

                getAllGrillStatuses: function () {
                    return $http.post('/api/getAllGrillStatuses');
                },

                adminUserLogin: function (loginData) {
                    return $http.post('/adminUserLogin', loginData);
                }
            }
        }
    ]);