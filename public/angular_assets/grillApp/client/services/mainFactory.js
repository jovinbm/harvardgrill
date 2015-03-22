angular.module('grillApp')
    .factory('mainService', ['$window', '$rootScope', 'socket', 'socketService', 'globals',
        function ($window, $rootScope, socket, socketService, globals) {

            socket.on('joined', function () {
                console.log("Joined Successfully");
                //socketService.startUp()
                //    .success(function (resp) {
                //        var questionArray = resp.questionsArray;
                //        questionService.totalQuestions(resp.questionCount);
                //        var temp = {};
                //
                //        temp["uniqueCuid"] = globals.uniqueCuid(resp["uniqueCuid"]);
                //        globals.upvotedIndexes(resp.upvotedIndexes);
                //        temp.questionReference = detailStorage.add(questionArray, true);
                //        detailStorage.add(questionArray, true);
                //        detailStorage.add(resp.topVotedArray, true);
                //        globals.currentQuestions(questionArray, true);
                //        globals.currentTop(resp.topVotedArray, true);
                //        $rootScope.$broadcast('startUpSuccess', temp);
                //    })
                //    .error(function (errResponse) {
                //        $window.location.href = "/public/error/500.html";
                //    });
            });

            //socket.on('reconnect', function () {
            //    console.log("'reconnect' triggered");
            //    socketService.reconnect(questionService.getCurrPage())
            //        .success(function (resp) {
            //            questionService.totalQuestions(resp.questionCount);
            //            var questionArray = resp.questionsArray;
            //            var temp = {};
            //
            //            temp.uniqueCuid = globals.uniqueCuid(resp["uniqueCuid"]);
            //            globals.upvotedIndexes(resp.upvotedIndexes);
            //            temp.questionReference = detailStorage.add(questionArray, true);
            //            globals.currentQuestions(null, null, true);
            //            globals.currentQuestions(questionArray, true);
            //            globals.currentTop(resp.topVotedArray, true);
            //            $rootScope.$broadcast('reconnectSuccess', temp);
            //        })
            //        .error(function (errResponse) {
            //            $window.location.href = "/error/500.html";
            //        });
            //});

            return {
                done: function () {
                    return 1;
                }
            }
        }]);