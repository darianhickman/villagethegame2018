var BuyConfirm = Dialog.extend({
	classId: 'BuyConfirm',
    init: function (message, prize, callback, confirmOnly) {
        Dialog.prototype.init.call(this);

        var self = this;

        ige.client.newBuyConfirm = self;

        $("#buyConfirmMessage").html(message);
        $("#buyConfirmPrize").html(prize);
        if(confirmOnly !== null && confirmOnly !== undefined && confirmOnly === true){
            $("#buyConfirmYes").hide();
            $("#buyConfirmOK")
                .click(function() {
                    ga("send",  "Confirm dialog");
                    $("#buyConfirmOK").unbind("click");
                    self.closeMe();
                    if(callback !== null && callback !== undefined)
                        callback();
                })
                .show();
        }else{
            $("#buyConfirmOK").hide();

            $("#buyConfirmYes")
                .click(function() {
                    ga("send",  "Confirm buy");
                    $("#buyConfirmYes").unbind("click");
                    self.closeMe();
                    callback();
                })
                .show();
        }

        this.closeButton.hide();
        this._underlay.hide();
    },

    show: function () {
        var self = this;

        ige.client.fsm.enterState('buyConfirmDialog', null, function (err) {
            if (!err) {
                $( "#" + GameFSM.settings["buyConfirmDialog"].dialogID ).dialog({ resizable: false, draggable: true, closeOnEscape: false, width: 'auto', height: 'auto', modal: true, autoOpen: false, close: function( event, ui ) {$("#buyConfirmYes").unbind("click");$("#buyConfirmOK").unbind("click");self.closeMe();} });
                $( "#" + GameFSM.settings["buyConfirmDialog"].dialogID ).dialog( "open" );
                Dialog.prototype.show.call(self);
            }
        });

        return this;
    },

    hide: function () {
        var self = this;

        $( "#" + GameFSM.settings["buyConfirmDialog"].dialogID ).dialog({close: function( event, ui ) {}});
        $( "#" + GameFSM.settings["buyConfirmDialog"].dialogID ).dialog( "close" );
        Dialog.prototype.hide.call(self);

        return this;
    }
})
