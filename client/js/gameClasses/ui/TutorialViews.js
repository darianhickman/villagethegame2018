var TutorialViews = IgeClass.extend({
    classId: 'TutorialViews',

    init: function(){
        var self = this;

        self.views = [
            {
                id: 'welcomeScreen',
                view: '<div><p>' + LocalizationManager.getValueByLabel('welcomeScreen') + '</p><button id="dialogButton">Play</button></div>'
            },
            {
                id: 'speedProgressInfoScreen',
                view: '<div><p>' + LocalizationManager.getValueByLabel('speedProgressInfoScreen') + '</p><button id="dialogButton">Continue</button></div>'
            },
            {
                id: 'speedProgressScreen',
                view: '<div><p>' + LocalizationManager.getValueByLabel('speedProgressScreen') + '</p><button id="dialogButton">Yes</button></div>'
            },
            {
                id: 'firstHomeBuiltScreen',
                view: '<div><p>' + LocalizationManager.getValueByLabel('firstHomeBuiltScreen') + '</p><button id="dialogButton">Continue</button></div>'
            },
            {
                id: 'fastForwardScreen',
                view: '<div><p>' + LocalizationManager.getValueByLabel('fastForwardScreen') + '</p><button id="dialogButton">Continue</button></div>'
            },
            {
                id: 'notEnoughMoneyScreen',
                view: '<div><p>' + LocalizationManager.getValueByLabel('notEnoughMoneyScreen') + '</p><button id="dialogButton">Continue</button></div>'
            },
            {
                id: 'creditCardScreen',
                view: '<div><p>' + LocalizationManager.getValueByLabel('creditCardScreen') + '</p><button id="dialogButton">Continue</button></div>'
            },
            {
                id: 'newGoalFirstScreen',
                view: '<div><p>' + LocalizationManager.getValueByLabel('newGoalFirstScreen') + '</p><button id="dialogButton">Continue</button></div>'
            },
            {
                id: 'newGoalSecondScreen',
                view: '<div><p>' + LocalizationManager.getValueByLabel('newGoalSecondScreen') + '</p><button id="dialogButton">Continue</button></div>'
            },
            {
                id: 'newGoalThirdScreen',
                view: '<div><p>' + LocalizationManager.getValueByLabel('newGoalThirdScreen') + '</p><button id="dialogButton">Continue</button></div>'
            },
            {
                id: 'newGoalFourthScreen',
                view: '<div><p>' + LocalizationManager.getValueByLabel('newGoalFourthScreen') + '</p><button id="dialogButton">Continue</button></div>'
            },
            {
                id: 'finishTutorial',
                view: '<div><p>' + LocalizationManager.getValueByLabel('finishTutorial') + '</p><button id="dialogButton">Play</button></div>'
            }
        ];

        self.viewsLookup = [];

        for(var i = 0; i < self.views.length; i++){
            self.viewsLookup[self.views[i].id] = self.views[i];
        }

    },

    getViewByID: function(id){
        return this.viewsLookup[id];
    }
})