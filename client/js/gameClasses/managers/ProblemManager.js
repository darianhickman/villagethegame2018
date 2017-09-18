var ProblemManager = IgeEventingClass.extend({
    classId: 'ProblemManager',

    init: function () {

        var self = this;

        self.currentProblemID;
    },

    showProblem: function (problemID) {
        ige.client.eventEmitter.emit('showMessage', {
            "title" : GameProblems.problemsLookup[problemID].title,
            "message" : "<div class='problemDialogMascot'><img class='problemDialogMascotImg' src='" + GameConfig.config['problemDialogMascotURL'] + "'></div><div class='problemDialogInfo speechBubble'>" + GameProblems.problemsLookup[problemID].details + "</div>",
            "callback" : function(){
                ige.client.eventEmitter.emit('loadGoal', {
                    "goalID" : GameProblems.problemsLookup[problemID].goalID
                });
            }
        });
    },

    getGoalIDbyProblemID: function (problemID) {
        return GameProblems.problemsLookup[problemID].goalID;
    },

    getProblemIDbyGoalID: function (goalID) {
        return GameProblems.goalsLookup[goalID].problemID;
    }
});
