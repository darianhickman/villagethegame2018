var WaterDialog = Dialog.extend({
    classId: 'WaterDialog',

    init: function () {
        Dialog.prototype.init.call(this);

        var self = this,
            water = [], pay = [], clonedItem;

        for(var i = 0; i < AssetBundle.waterBundle.length; i++){
            if(AssetBundle.waterBundle[i].isActive !== "yes")
                continue;
            water.push(parseFloat(AssetBundle.waterBundle[i].water));
            pay.push(parseFloat(AssetBundle.waterBundle[i].pay));
        }

        for(var i=0; i < 5; i ++) {
            clonedItem = $('#waterAssetList li').first().clone();
            clonedItem.find(".assetAmount").first().text(water[i]);
            clonedItem.find(".assetPay").first().text(pay[i]);

            (function(i) {
                clonedItem.click(function() {
                    ige.input.stopPropagation();
                    vlg.sfx['select'].play();

                    var price = {
                        cash: pay[i],
                        coins: 0
                    };

                    var message = 'Buy ' + water[i] + ' water for ' + pay[i] + ' VBuck' + ((pay[i] > 1) ? "s" : "") + '?';

                    var callBack = function() {
                        if(!API.reduceAssets(
                                {coins: parseInt(price.coins, 10),
                                    cash: parseInt(price.cash, 10)}).status) {
                            // Not enough money?
                            ga("send",  "Not enough money");
                            ige.$('cashDialog').show();
                            return;
                        }
                        dataLayer.push({'assetBuyActionName': "Water Buy"});
                        dataLayer.push({'event': 'assetBuy'});
                        API.addWater(parseInt(water[i], 10));
                    }

                    if(price.cash > API.state.cash){
                        // Not enough money?
                        ga("send",  "Not enough money");
                        message = LocalizationManager.getValueByLabel('notEnoughCashString');
                        callBack = function() {
                            ige.$('cashDialog').show();
                        }
                    }

                    var cashDialog = new BuyConfirm(message,callBack)
                        .layer(1)
                        .show()
                        .mount(ige.$('uiScene'));
                })
            })(i);

            $('#waterAssetList').append(clonedItem);
        }
        $('#waterAssetList li').first().hide();

        this.closeButton.hide();
        this._underlay.hide();
    },

    show: function () {
        var self = this;

        ige.client.fsm.enterState('waterDialog', null, function (err) {
            if (!err) {
                $( "#waterBuyDialog" ).dialog({ resizable: false, draggable: true, closeOnEscape: false, width: 'auto', height: 'auto', modal: true, autoOpen: false, close: function( event, ui ) {self.closeMe();} });
                $( "#waterBuyDialog" ).dialog( "open" );
                Dialog.prototype.show.call(self);
            }
        });

        return this;
    },

    hide: function () {
        var self = this;

        $( "#waterBuyDialog" ).dialog({close: function( event, ui ) {}});
        $( "#waterBuyDialog" ).dialog( "close" );
        Dialog.prototype.hide.call(self);

        return this;
    }
})

