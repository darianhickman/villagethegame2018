var MarketDialog = Dialog.extend({
	classId: 'MarketDialog',

	init: function () {
		Dialog.prototype.init.call(this);
		this.itemCount = parseInt(GameConfig.config['itemCount']);
		this._pageRefs = [];
		this._items = [];
		this._pageItems = [];
		this._pageCount = 0;
		this._activePageNo = 1;

		$('#marketDialogPageTemplate ul table tr').first().hide();

        this.closeButton.hide();
		this._underlay.hide();
	},

	createSinglePage: function() {
		// So no loop over itemCount ???  how is this hardcoded to 6 now? 
		var self = this,
			pageRef;

		pageRef = $("#marketDialogPageTemplate").clone().prop({ id: "marketDialogPage" + self._pageCount})
			.insertBefore("#marketDialogPagination")
			.hide();

		$("#marketDialogPage" + self._pageCount + " li").remove();

		self._pageRefs["marketDialogPage" + self._pageCount] = pageRef;
	},

	createPages: function(totalPages) {
		var self = this

		for(var i=0; i<totalPages; i++) {
			self._pageCount++;
			self.createSinglePage()
		}

		self.pageTemplate = $('#marketDialogPageTemplate');

		$('#marketDialogPagination').jqPagination({
			max_page: totalPages,
			paged: function(page) {
				self.changeToPage(page);
			}
		});

		self._pageRefs["marketDialogPage" + self._activePageNo].show();
	},

	changeToPage: function(pageNo){
		this._pageRefs["marketDialogPage" + this._activePageNo].hide();
		this._activePageNo = pageNo
		this._pageRefs["marketDialogPage" + pageNo].show();
	},

	show: function () {
		var self = this;

		ige.client.fsm.enterState('marketDialog', null, function (err) {
			if (!err) {
				$( "#" + GameFSM.settings["marketDialog"].dialogID ).dialog({ resizable: true, draggable: true, closeOnEscape: false, width: 'auto', height: 'auto', modal: true, autoOpen: false, close: function( event, ui ) {self.closeMe();} });
				$( "#" + GameFSM.settings["marketDialog"].dialogID ).dialog( "open" );
				Dialog.prototype.show.call(self);
			}
		});

		return this;
	},

	hide: function () {
		var self = this;

		$( "#" + GameFSM.settings["marketDialog"].dialogID ).dialog({close: function( event, ui ) {}});
		$( "#" + GameFSM.settings["marketDialog"].dialogID ).dialog( "close" );
		Dialog.prototype.hide.call(self);

		return this;
	},

	addItem: function (itemData) {
		// Create backing tile for item
        if (itemData==null) {return;}
        var self = this,
			pageIndex = 1,
			clonedItem, options, dummyElem, imgWidth, imgHeight;

		clonedItem = $('#marketDialogPageTemplate ul table tr').first().clone();
		clonedItem.show().find(".marketItemTitle").first().text(itemData.title).attr("id", "marketItemButton" + itemData.id);

		options = GameObjects.catalogLookup[itemData.id]
		dummyElem = $("<div class='marketItemImage'></div>").hide().appendTo("body");
		// imgHeight = dummyElem.css("height").substr(0,dummyElem.css("height").indexOf('px'));
		// imgWidth = ige.client.textures[itemData.id]._sizeX / (ige.client.textures[itemData.id]._sizeY / imgHeight)
		// dummyElem.remove();
        if (options.iconUrl.substr(0,4)=="/gs2/") {
                                 clonedItem.find(".marketItemImage").first().attr("src", "https://drive.google.com/drive/folders/"+options.iconUrl.substr(4));
        }
        else {
             clonedItem.find(".marketItemImage").first().attr("src", options.iconUrl);
        }
		//
		// clonedItem.find(".marketItemImage").first().css("background-image","url(" + options.textureUrl + ")")
		// 	.css("width", imgWidth / ige.client.textures[itemData.id]._cellColumns + "px")
		// 	.css("background-size", imgWidth + "px " + imgHeight + "px")
		// 	.css("background-position-x", imgWidth / ige.client.textures[itemData.id]._cellColumns + "px");

		if(itemData.coins != 0)
			clonedItem.find(".marketItemCoins").contents().last()[0].textContent=itemData.coins;
		else
			clonedItem.find(".marketItemCoins").first().remove();
		if(itemData.cash != 0)
            clonedItem.find(".marketItemCash").contents().last()[0].textContent=itemData.cash;
		else
			clonedItem.find(".marketItemCash").first().remove();

		// how does this work without being wrapped in a condition block ???
		itemData.entity = clonedItem;
		itemData.unlockButton = clonedItem.find(".unlock").first();
		itemData.unlockprice = itemData.unlockButton.find(".unlockprice").first();
		itemData.unlockInfo = clonedItem.find(".marketItemInfo").first();
		// need to update to no dependencies or unlocked.
		if(itemData.dependency === "none" || $.inArray(itemData.id, API.state.unlockedItems)>= 0) {
			self.removeItemCover(itemData);
			self.bindItemAction(itemData);
		}else{
			clonedItem.addClass("locked");
			// display price.  		price.cash = itemData.unlockValue;
			itemData.unlockprice.text(itemData.unlockValue);
			itemData.unlockButton.attr("id", "unlock" + itemData.id);
			itemData.unlockButton.click(function (event) {
				event.stopPropagation();
				self.hide();
				self.unlockItemByCash(itemData);
			});
			itemData.unlockInfo.attr("title","Unlocked by Building " + GameObjects.catalogLookup[itemData.dependency].name);
			itemData.unlockInfo.tooltip({
				position: { my: "right center", at: "left center" }
			});
		}

		this._items.push(itemData);

		while (this._pageItems[pageIndex] && this._pageItems[pageIndex].length === this.itemCount) {
			pageIndex++;
		}

		$('#marketDialogPage' + pageIndex + ' ul').append(clonedItem);

		// Add the item to the free page
		this._pageItems[pageIndex] = this._pageItems[pageIndex] || [];
		this._pageItems[pageIndex].push(itemData);

		return clonedItem;
	},

	unlockItemByCash: function(itemData){
		if (itemData==null) {return;}
        var message, callback, price = {coins:0}, self = this, prize;

		price.cash = itemData.unlockValue;

		//show are you sure and reduce assets
		message  = 'Unlock ' + itemData.title + ' for ' + price.cash + ' VBuck' + ((price.cash > 1) ? "s" : "") + '?';
        prize = price.cash + '<img class="marketCashIcon" src="assets/images/ui/Banknotes.png">';
		callBack = function() {
			if(!API.reduceAssets(
					{coins: parseInt(price.coins, 10),
						cash: parseInt(price.cash, 10)}).status) {
				// Not enough money?
				ga("send",  "Not enough money");
				prize = LocalizationManager.getValueByLabel('unsufficientVbucks');
                new BuyConfirm(LocalizationManager.getValueByLabel('notEnoughCashString'), prize,
					function () {
						ige.$('cashDialog').show();
					})
					.layer(1)
					.show()
					.mount(ige.$('uiScene'));
				return;
			}
			dataLayer.push({'event': 'unlockItemByCash'});
			self.removeItemCover(itemData);
			self.bindItemAction(itemData);
			ige.client.gameLogic.showUnlockedItemMessage(itemData.id);
			API.addUnlockedItem(itemData.id);
		}

		var cashDialog = new BuyConfirm(message, prize, callBack)
			.layer(100)
			.show()
			.mount(ige.$('uiScene'));
	},

	removeItemCover:function(itemData){
		if (itemData==null) {return;}
        if(itemData.unlockButton){
			itemData.unlockButton.remove();
			itemData.unlockButton = null;
			itemData.unlockInfo.remove();
			itemData.unlockInfo = null;
			itemData.entity.removeClass('locked');
		}
	},

	bindItemAction: function(itemData){
		if (itemData==null) {return;}
        var self = this;

		if(itemData.isActionBound === undefined || itemData.isActionBound === null){
			itemData.entity.click(function () {
				ige.input.stopPropagation();

				// Play the audio
				// ige.client.audio.normClick.play();
				vlg.sfx['select'].play();

				// Switch to build mode
				ige.client.fsm.enterState('build', {
					classId: itemData.classId,
					coins: itemData.coins,
					cash: itemData.cash,
				});
			});
		}
		itemData.isActionBound = true;
	},

	getItemByID: function(id){
		for(var i = 0; i < this._items.length; i++){
			if(this._items[i].id == id){
				return this._items[i];
			}
		}
		return null;
	}
});
