var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var statsDB = require('../db/stats_db.js');

module.exports = {

    adminStartUp: function (req, res, theUser) {
        consoleLogger('startUp: ADMIN_STARTUP handler called');

        function adminStartUpError(status, err) {
            if (status == -1) {
                consoleLogger("adminStartUp handler: adminStartup: Error while retrieving startup info: err = " + err);
                res.status(500).send({
                    msg: 'adminStartUp handler: adminStartup: Error while retrieving startup info',
                    err: err
                });
                consoleLogger('adminStartUp: failed!');
            } else if (status == 0) {
                consoleLogger("adminStartUp handler: adminStartup: Could not find data, proceeding to create first instance");
            }
        }

        function success(currentGrillStatus) {
            consoleLogger("adminStartUp handler: adminStartup: Success");
            res.status(200).send({
                currentGrillStatus: currentGrillStatus
            });
        }

        statsDB.getCurrentGrillStatus("stats", adminStartUpError, adminStartUpError, success)

    }


    //reconnect: function (req, res, theHarvardUser, page) {
    //    consoleLogger('reconnect: RECONNECT handler called');
    //    var limit = 10;
    //    ioJs.emitToOne(theHarvardUser.socketRoom, "usersOnline", online.getUsersOnline());
    //
    //    var temp = {};
    //    temp['uniqueCuid'] = theHarvardUser.uniqueCuid;
    //    temp['upvotedIndexes'] = theHarvardUser.votedQuestionIndexes;
    //
    //    function getQuestionsErr(status, err) {
    //        if (status == -1) {
    //            consoleLogger("reconnect handler: getQuestions: Error while retrieving home details" + err);
    //            res.status(500).send({msg: 'reconnect: getQuestions: Error while retrieving home details', err: err});
    //            consoleLogger('reconnect handler: failed!');
    //        }
    //    }
    //
    //    function getTopErr(status, err) {
    //        if (status == -1) {
    //            consoleLogger("reconnect handler: GetTop: Error while retrieving home details" + err);
    //            res.status(500).send({msg: 'reconnect: GetTop: Error while retrieving home details', err: err});
    //            consoleLogger('reconnect handler: failed!');
    //        }
    //    }
    //
    //    function done(topVotedArray) {
    //        if (topVotedArray == []) {
    //            consoleLogger('reconnect: Did not find any top voted');
    //        }
    //        temp['topVotedArray'] = topVotedArray;
    //        res.status(200).send(temp);
    //        consoleLogger("reconnect success");
    //    }
    //
    //    function getTop() {
    //        questionDB.findTopVotedQuestions(-1, 10, getTopErr, getTopErr, done);
    //    }
    //
    //    function success(questionsArray, questionCount) {
    //        if (questionsArray == []) {
    //            consoleLogger("reconnect: no questions found");
    //        }
    //        temp['questionsArray'] = questionsArray;
    //        temp['questionCount'] = questionCount;
    //        getTop();
    //    }
    //
    //    questionDB.getQuestions(-1, page, limit, getQuestionsErr, getQuestionsErr, success)
    //}


};