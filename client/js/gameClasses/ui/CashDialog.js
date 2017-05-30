var CashDialog = Dialog.extend({
	classId: 'CashDialog',

    init: function () {
        Dialog.prototype.init.call(this);

        var self = this,
            bucks = [], pay = [], clonedItem;

        for(var i = 0; i < CashBundle.bundle.length; i++){
            if(CashBundle.bundle[i].isActive !== "yes")
                continue;
            bucks.push(parseFloat(CashBundle.bundle[i].vBucks));
            pay.push(parseFloat(CashBundle.bundle[i].pay));
        }

        for(var i=0; i < bucks.length; i ++) {
            clonedItem = $('#cashAssetList li').first().clone();
            clonedItem.find(".assetAmount").first().text(bucks[i] + " VBucks for ");
            clonedItem.find(".assetPay").first().text( pay[i] + "  USD");

            (function(i) {
                clonedItem.click(function() {
                    ige.input.stopPropagation();
                    // ige.client.audio.normClick.play();
                    vlg.sfx['select'].play();

                    var price = {
                        cash: bucks[i],
                        coins: 0
                    };


                    var message = 'Buy ' + bucks[i] + ' VBucks for $' + pay[i] + '?';

                    var cashDialog = new BuyConfirm(message,
                        function() {
                            Buy.buy(price);
                        })
			            .layer(1)
			            .show()
			            .mount(ige.$('uiScene'));
                })
            })(i);

            $('#cashAssetList').append(clonedItem);
        }
        $('#cashAssetList li').first().hide();

        this.closeButton.hide();
        this._underlay.hide();
    },

    show: function () {
        var self = this;

        ige.client.fsm.enterState('cashDialog', null, function (err) {
            if (!err) {
                $( "#cashBuyDialog" ).dialog({ resizable: false, draggable: true, closeOnEscape: false, width: 'auto', height: 'auto', modal: true, autoOpen: false, close: function( event, ui ) {self.closeMe();} });
                $( "#cashBuyDialog" ).dialog( "open" );
                Dialog.prototype.show.call(self);
            }
        });

        return this;
    },

    hide: function () {
        var self = this;

        $( "#cashBuyDialog" ).dialog({close: function( event, ui ) {}});
        $( "#cashBuyDialog" ).dialog( "close" );
        Dialog.prototype.hide.call(self);

        return this;
    }
})
