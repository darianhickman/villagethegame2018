var CoinDialog = Dialog.extend({
	classId: 'CoinDialog',

	init: function () {
		Dialog.prototype.init.call(this);

        var self = this,
            coins = [], pay = [], clonedItem;

        for(var i = 0; i < AssetBundle.coinBundle.length; i++){
            if(AssetBundle.coinBundle[i].isActive !== "yes")
                continue;
            coins.push(parseFloat(AssetBundle.coinBundle[i].coins));
            pay.push(parseFloat(AssetBundle.coinBundle[i].pay));
        }

        for(var i=0; i < 5; i ++) {
            clonedItem = $('#coinAssetList table tr').first().clone();
            clonedItem.find(".assetAmount").first().text(coins[i]);
            clonedItem.find(".assetPay").first().text(pay[i]);

            (function(i) {
                clonedItem.click(function() {
                    ige.input.stopPropagation();
                    vlg.sfx['select'].play();

                    var price = {
                        cash: pay[i],
                        coins: 0
                    };

                    var message = 'Buy ' + coins[i] + ' coins for ' + pay[i] + ' VBuck' + ((pay[i] > 1) ? "s" : "") + '?';
                    var prize = pay[i] +'<img class="marketCashIcon" src="assets/images/ui/Banknotes.png">';
                    var callBack = function() {
                        if(!API.reduceAssets(
                            {coins: parseInt(price.coins, 10),
                                cash: parseInt(price.cash, 10)}).status) {
                            // Not enough money?
                            ga("send",  "Not enough money");
                            ige.$('cashDialog').show();
                            return;
                        }
                        dataLayer.push({'assetBuyActionName': "Coin Buy"});
                        dataLayer.push({'event': 'assetBuy'});
                        API.addCoins(parseInt(coins[i], 10));
                    }

                    if(price.cash > API.state.cash){
                        // Not enough money?
                        ga("send",  "Not enough money");
                        message = LocalizationManager.getValueByLabel('notEnoughCashString');
                        callBack = function() {
                            ige.$('cashDialog').show();
                        }
                    }

                    var cashDialog = new BuyConfirm(message,prize, callBack)
                        .layer(1)
                        .show()
                        .mount(ige.$('uiScene'));
                })
            })(i);

            $('#coinAssetList').append(clonedItem);
        }
        $('#coinAssetList table tr').first().hide();

        this.closeButton.hide();
        this._underlay.hide();
    },

    show: function () {
        var self = this;

        ige.client.fsm.enterState('coinDialog', null, function (err) {
            if (!err) {
                $( "#" + GameFSM.settings["coinDialog"].dialogID ).dialog({ resizable: false, draggable: true, closeOnEscape: false, width: 'auto', height: 'auto', modal: true, autoOpen: false, close: function( event, ui ) {self.closeMe();} });
                $( "#" + GameFSM.settings["coinDialog"].dialogID ).dialog( "open" );
                Dialog.prototype.show.call(self);
            }
        });

        return this;
    },

    hide: function () {
        var self = this;

        $( "#" + GameFSM.settings["coinDialog"].dialogID ).dialog({close: function( event, ui ) {}});
        $( "#" + GameFSM.settings["coinDialog"].dialogID ).dialog( "close" );
        Dialog.prototype.hide.call(self);

        return this;
    }
})

