var igeClientConfig = {
	include: [
		/* Your custom game JS scripts */
		'/js/gameClasses/managers/Goals.js',
		'/js/gameClasses/managers/ProblemManager.js',
		'/js/gameClasses/managers/QueueManager.js',
		'/js/gameClasses/managers/LoginManager.js',
		'/js/gameClasses/managers/EventEmitter.js',
		'/js/gameClasses/ui/AssetAnimation.js',
		'/js/gameClasses/managers/RewardMechanism.js',
		'/js/gameClasses/managers/GameLogic.js',
		'/js/gameClasses/managers/EditorManager.js',
		'/js/gameClasses/managers/LocalizationManager.js',
// 		'/js/gameClasses/ui/Dialog.js',
		'/js/gameClasses/ui/MarketDialog.js',
		'/js/gameClasses/ui/EditorMarketDialog.js',
		'/js/gameClasses/ui/CoinParticle.js',
        '/js/gameClasses/ui/CashDialog.js',
        '/js/gameClasses/ui/CoinDialog.js',
        '/js/gameClasses/ui/WaterDialog.js',
        '/js/gameClasses/ui/BuyStatus.js',
        '/js/gameClasses/ui/BuyConfirm.js',
        '/js/gameClasses/ui/MessageDialog.js',
		'/js/gameClasses/ui/TutorialViews.js',
		'/js/gameClasses/ui/EditorViews.js',
		'/js/gameClasses/managers/Tutorial.js',

        '/js/gameClasses/misc/util.js',
        '/js/plugins/crypto-js-hmac.js',
		'/js/plugins/jquery.fullscreen.js',
		'/js/plugins/jquery.easing.1.3.js',
		'/js/plugins/jquery.jqpagination.js',
		'/js/plugins/jquery.animateNumber.min.js',
		'/js/plugins/jQueryRotate.js',
		'/js/plugins/menu.js',
        // try inline span container
        '/js/gameClasses/misc/SpanContainer.js',
        //enable zoom and scroll
		'/js/gameClasses/components/LimitZoomPanComponent.js',
		'/js/gameClasses/components/ScrollZoomComponent.js',
		'/js/gameClasses/components/ScaleToPointComponent.js',
		'/js/gameClasses/components/PinchZoomComponent.js',
		'/js/gameClasses/components/TexturePackerAtlas.js',
		'/assets/misc/uiAtlas.json',
		'/assets/misc/catalogAtlas.json',
		// Game objects
		'/js/gameClasses/base/GameObject.js',
		'/js/gameClasses/base/Villager.js',
		'/js/gameClasses/base/HiEntity.js',

		'/js/gameClasses/loaders/GameAssets.js',
		'/js/gameClasses/loaders/GameProblems.js',
		'/js/gameClasses/loaders/AssetBundle.js',
		'/js/gameClasses/loaders/GameGoals.js',
		'/js/gameClasses/loaders/DropDownMenu.js',
		'/js/gameClasses/loaders/SpecialEvents.js',
		'/js/gameClasses/loaders/GameMessages.js',
		'/js/gameClasses/loaders/GameFSM.js',
        '/js/gameClasses/misc/clientApiSupport.js',
        '/js/gameClasses/misc/clientBuy.js',
        '/js/gameClasses/misc/clientHelpers.js',
        '/js/gameClasses/misc/gameObjects.js',
        '/js/gameClasses/loaders/gameCatalog.js',
       /* '/js/gameClasses/loaders/NewsFeed.js', */

		// Graphs
		'/js/gameClasses/graphs/GraphLevel1.js',
		'/js/gameClasses/graphs/GraphTutorial.js',
		'/js/gameClasses/graphs/GraphEditor.js',
		'/js/gameClasses/graphs/GraphView.js',
		'/js/gameClasses/graphs/GraphUi.js',
		'/js/gameClasses/graphs/GraphUiEditor.js',

		/* Standard game scripts */
		'/js/gameClasses/client.js',
		'/js/gameClasses/index.js',
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = igeClientConfig; }
