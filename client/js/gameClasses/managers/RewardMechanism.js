var RewardMechanism = IgeEventingClass.extend({
    classId: 'RewardMechanism',

    init: function () {
        var self = this,
            textureList = JSON.parse(GameConfig.config['rewardMechanismTextureList']);

        self.uiScene = ige.$('uiScene');
        self.textureListLookup = {};

        for(var i = 0; i < textureList.length; i++){
            self.textureListLookup[textureList[i].name] = textureList[i];
        }
    },

    claimReward: function(assetName, amount, translateObj, itemRef){
        switch(assetName){
            case "xp":
                //add xp
                break;
            case "coins":
                API.addCoins(parseInt(amount))
                break;
            case "cash":
                API.addCash(parseInt(amount))
                break;
            case "water":
                API.addWater(parseInt(amount))
                break;
        }

    },

})
