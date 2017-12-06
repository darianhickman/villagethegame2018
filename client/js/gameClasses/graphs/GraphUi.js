var GraphUi = IgeSceneGraph.extend({
  classId: 'GraphUi',

  /**
   * Called when loading the graph data via ige.addGraph().
   * @param options
   */
 addGraph: function (options) {
    var self = this,
        clientself = ige.client,
        uiScene = ige.$('uiScene'),
        dialogList = [
            {id:GameFSM.settings["marketDialog"].dialogID, image:"Shop"},
            {id:GameFSM.settings["goalDialog"].dialogID, image:"star"},
            {id:GameFSM.settings["cashDialog"].dialogID, image:"Banknotes"},
            {id:GameFSM.settings["coinDialog"].dialogID, image:"Coin1"},
            {id:GameFSM.settings["waterDialog"].dialogID, image:"Water-48"}
        ];

		var marketDialog = new MarketDialog()
        .id('marketDialog')
        .layer(1)
        .hide()
        .mount(uiScene);

    GameObjects.setupMarket(marketDialog)

    var cashDialog = new CashDialog()
        .id('cashDialog')
        .layer(1)
        .hide()
        .mount(uiScene);

    var coinDialog = new CoinDialog()
        .id('coinDialog')
        .layer(1)
        .hide()
        .mount(uiScene);

    var waterDialog = new WaterDialog()
        .id('waterDialog')
        .layer(1)
        .hide()
        .mount(uiScene);

    var buyStatus = new BuyStatus()
        .id('buyStatus')
        .layer(1)
        .hide()
        .mount(uiScene);

    $( "#cashbarProgress" ).progressbar({
        max:100000,
        value: 0
    });

    $( "#coinbarProgress" ).progressbar({
        max:1000000,
        value: 0
    });

    $( "#waterbarProgress" ).progressbar({
        max:1000000,
        value: 0
    });


    if(GameConfig.config['xpFeature'] === "on"){
        var xpBar = new IgeUiElement()
            .id('xpBar')
            .texture(ige.client.textures.xpBar)
            .dimensionsFromTexture()
            .left(325)
            .mount(topNav);

        new IgeUiProgressBar()
            .id('xpProgress')
            //.barBackColor('#f2b982')
            //.barBorderColor('#3a9bc5')
            .barColor('#69f22f')
            .min(0)
            .max(500)
            .progress(80)
            .width(87)
            .height(18)
            .right(17)
            .barText('', ' XP', 'black')
            .mount(xpBar);
    }

    if(GameConfig.config['energyFeature'] === "on"){
        new IgeUiElement()
            .id('energyBar')
            .texture(ige.client.textures.energyBar)
            .dimensionsFromTexture()
            .left(475)
            //.barText('', '%', 'black')
            .mount(topNav);
    }

    //add icons for dialogs
    if(ige.client.isFirstLoadFinished !== true){
        for(var i = 0; i < dialogList.length; i++){
            var item = dialogList[i];
            $( "#" + item.id ).dialog();
            $( "#" + item.id ).closest('div.ui-dialog').find('div.ui-dialog-titlebar')
                .prepend("<img src='assets/images/ui/" + item.image + ".png' class='dialogTitleImage'>");
            $( "#" + item.id ).dialog('close');
        }
    }

    //implement tooltip
    $("#topToolbar").tooltip();
    $("#topToolbar").show();
    $("#notifyIconContainer").show();
    $("#newGoalNotification").hide();
    $("#goalCompleteNotification").hide();
    $("#NotLoggedin").show();
    $("#Loggedin").hide();
    $("#endMove").hide();
    $("#topArrow").hide();
    $("#marketArrow").hide();

    $("#dropDownContent")
        .html(DropDownMenu.dropDownContent);

    $(".c-menu__items")
        .html(DropDownMenu.dropDownLinksList);

    for(var i = 0; i < DropDownMenu.links.length; i++){
        $('#' + DropDownMenu.links[i].id).html(DropDownMenu.links[i].string);
    }

    if(API.user.picture_url === 'no-picture'){
        $("#loginPicture").attr("src", DropDownMenu.offlinePictureURL);
    }
    else{
        $("#loginPicture").attr("src", API.user.picture_url);
    }

    if(API.loginStatus === 'offline'){
        $("#NotLoggedin").show();
        $("#Loggedin").hide();
        $("#logoutLink").hide();
        $("#shareMyVillageLink").hide();
    }else{
        $("NotLoggedin").hide();
        $("#Loggedin").show();
        $("#loginLink").hide();
        $("#loginID").html(API.user.name);
    }

    if(API.user.editor_enabled === "false"){
        $("#editorLink").hide();
    }

    if(parseInt(GameConfig.config["zoomLevels"]) === 1){
        $("#zoomInButton").hide();
        $("#zoomOutButton").hide();
    }

    new IgeParticleEmitter()
        .id('coinEmitter')
        .layer(10)
        .quantityTimespan(60)
        .quantityBase(10)
        .velocityVector(new IgePoint3d(0, -0.030, 0), new IgePoint3d(-0.025, -0.005, 0), new IgePoint3d(0.025, -0.01, 0))
        .linearForceVector(new IgePoint3d(0, 0.25, 0), new IgePoint3d(0, 0, 0), new IgePoint3d(0, 0, 0))
        .scaleBaseX(2)
        .scaleBaseY(2)
        .deathScaleBaseX(2)
        .deathScaleBaseY(2)
        .deathRotateBase(0)
        .deathRotateVariance(0, 360)
        .deathOpacityBase(0)
        .quantityMax(10)
        .particle(CoinParticle)
        .mount(uiScene)
        .top(20)
        .left(380);

        clientself.slideRight = new Menu({
            wrapper: '#o-wrapper',
            type: 'slide-right',
            menuOpenerClass: '.c-button',
            showMask: false
        });

      this.addActions();

  },

  addActions: function () {
        var self = this,
            clientself = ige.client;

        $('#dropDownIcon').on('click',function(){
            ige.client.fsm.enterState('playerMenu');
        })

        $(".c-menu__close").on('click',function(){
            ige.client.fsm.enterState('select');
        })

        $(".c-mask").on('click',function(){
            ige.client.fsm.enterState('select');
        })

        document.addEventListener("fullscreenchange", onFullScreenChange, false);
        document.addEventListener("webkitfullscreenchange", onFullScreenChange, false);
        document.addEventListener("mozfullscreenchange", onFullScreenChange, false);

        function onFullScreenChange() {
            var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;

            // if in fullscreen mode fullscreenElement won't be null
            if(!fullscreenElement){
                $( "#fullscreenIcon img:first-child").show();
                $( "#fullscreenIcon img:nth-child(2)").hide();
            }
        }
                                   
        $('img').on('mouseover',function(){
            $(this).css("width",this.width*1.2);
            $(this).css("height",this.height*1.2);
        })
        
        $('#fullscreenIcon').on('click',function(){
            ga("send",  "Go fullscreen");
            $( "#fullscreenIcon" ).find('img').toggle();
            if($.FullScreen.isFullScreen()){
                $.FullScreen.cancelFullScreen();
            }else{
                $('body').requestFullScreen();
            }
        })

        $('#fullscreenIcon').on('mouseover',function(){
            // No sound for now mouseover.
           // ige.client.audio.select.play();
        })

        $('#saveButton').on('click',function(){
            if(API.loginStatus === 'offline'){
                ga("send",  "Click login");
                ige.client.fsm.enterState('login');
            }
        })

        $('#loginLink').on('click',function(){
            ga("send",  "Click login");
            ige.client.fsm.enterState('login');
        })

        $('#logoutLink').on('click',function(){
            ga("send",  "Logout");
            ige.client.fsm.enterState('logout');
        })

        $('#helpLink').on('click',function(){
            ige.client.fsm.enterState('tutorial');
        })

        $('#feedbackLink').on('click',function(){
            ige.client.fsm.enterState('feedbackDialog');
        })

        $('#aboutLink').on('click', function() {
            ige.client.fsm.enterState('aboutDialog');
        });

        $('#contactLink').on('click', function() {
            ige.client.fsm.enterState('contactDialog');
        });

        $('#editorLink').on('click',function(){
            ige.client.slideRight.close();

            ige.client.editorManager = new EditorManager();
            ige.client.editorManager.gotoStep('init');

            ige.$('vp1')
                .mousePan.enabled(false)
                .scrollZoom.enabled(false)
                .camera.translateTo(0, 0, 0)
                .camera.scaleTo(parseFloat(GameConfig.config['scaleMax']), parseFloat(GameConfig.config['scaleMax']), 0);
            ige.$('vp1').scrollZoom.currentZoomLevel = ige.$('vp1').scrollZoom._options.zoomLevels

            ige.$('level1').hide();
            ige.addGraph('GraphEditor');
            ige.addGraph('GraphUiEditor');

            ige.client.fsm.enterState('editor');
        })

        $('#shareMyVillageLink').on('click',function(){
            ige.client.fsm.enterState('shareMyVillage');
        })

        if(vlg.isSFXOn){
            $('#toggleSFXLink').append("<span id='toggleSFXStatus'> - On</span>")
        }else{
            $('#toggleSFXLink').append("<span id='toggleSFXStatus'> - Off</span>")
        }
        $('#toggleSFXLink').on('click',function(){
            vlg.isSFXOn = !vlg.isSFXOn;
            if(vlg.isSFXOn){
                $('#toggleSFXStatus').html(" - On");
            }else{
                $('#toggleSFXStatus').html(" - Off");
            }
        })

        if(vlg.isMusicOn){
            $('#toggleMusicLink').append("<span id='toggleMusicStatus'> - On</span>")
        }else{
            $('#toggleMusicLink').append("<span id='toggleMusicStatus'> - Off</span>")
        }
        $('#toggleMusicLink').on('click',function(){
            vlg.isMusicOn = !vlg.isMusicOn;
            if(vlg.isMusicOn){
                $('#toggleMusicStatus').html(" - On");
            }else{
                $('#toggleMusicStatus').html(" - Off");
            }
            toggleMusic();
        })

    $('#marketButton')
        .click(function () {
        // Open the build menu
                $("#marketArrow").hide();
                ga("send",  "Open market dialog");
                self.toggleDialog('marketDialog');
        });

        $('#goalButton')
            .click(function () {
               self.toggleGoalDialog();
          });

        $('#signinButton')
            .click(function () {
                ga("send",  "Click login");
                ige.client.fsm.enterState('login');
        });

        $('#cashbar')
            .click(function() {
                ga("send",  "Open cash dialog");
                self.toggleDialog('cashDialog');
            });

        $('#coinbar')
            .click(function() {
                ga("send",  "Open coin dialog");
                self.toggleDialog('coinDialog');
            });

        $('#waterbar')
            .click(function() {
                ga("send",  "Open water dialog");
                self.toggleDialog('waterDialog');
            });

        $('#moveButton')
            .click(function () {
               $("#topArrow").hide();
               ige.client.fsm.enterState('move');
            });

      $('#zoomInButton')
          .click(function () {
              ige.$('vp1').scrollZoom._handleManualZoom("in")
          });

      $('#zoomOutButton')
          .click(function () {
              ige.$('vp1').scrollZoom._handleManualZoom("out")
          });
    },

    removeActions: function () {
        $("#dropDownIcon").unbind("click");
        $(".c-menu__close").unbind("click");
        $(".c-mask").unbind("click");
        $("#fullscreenIcon").unbind("click");
        $("#loginLink").unbind("click");
        $("#logoutLink").unbind("click");
        $("#helpLink").unbind("click");
        $("#feedbackLink").unbind("click");
        $("#aboutLink").unbind("click");
        $('#contactLink').unbind("click");
        $("#editorLink").unbind("click");
        $("#shareMyVillageLink").unbind("click");
        $("#toggleSFXLink").unbind("click");
        $("#toggleMusicLink").unbind("click");
        $("#marketButton").unbind("click");
        $("#goalButton").unbind("click");
        $("#NotLoggedin").unbind("click");
        $("#Loggedin").unbind("click");
        $("#cashbar").unbind("click");
        $("#coinbar").unbind("click");
        $("#waterbar").unbind("click");
        $("#moveButton").unbind("click");
        $("#zoomInButton").unbind("click");
        $("#zoomOutButton").unbind("click");
    },

  toggleDialog: function(name){
        if(ige.$(name).isVisible())
            ige.$(name).closeMe();
        else
            ige.$(name).show();

    },

    toggleGoalDialog: function(name){
        if(ige.client.fsm.currentStateName() === "goalDialog"){
            ige.client.fsm.enterState('select');
        }
        else{
            // Open the goal dialog
            ga("send",  "Open goal dialog");
            $('#newGoalNotification').hide();
            $('#goalCompleteNotification').hide();
            ige.client.fsm.enterState('goalDialog', null, function (err) {
                if (!err) {
                    $( "#" + GameFSM.settings["goalDialog"].dialogID ).dialog({ resizable: false, draggable: true, closeOnEscape: true, close: function( event, ui ) {ige.client.fsm.enterState('select')}, width: 'auto', height: 'auto', modal: true, autoOpen: false });
                    $( "#" + GameFSM.settings["goalDialog"].dialogID ).dialog( "open" );
                }
            });
        }
    },

  /**
   * The method called when the graph items are to be removed from the
   * active graph.
   */
  removeGraph: function () {
    // Since all our objects in addGraph() were mounted to the
    // 'scene1' entity, destroying it will remove everything we
    // added to it.
        this.removeActions();
  }
});
