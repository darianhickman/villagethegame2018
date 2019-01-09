var GameConfig = {config:{}}
var getGameConfig = function(retryCount){
    retryCount = retryCount || 1;
    $.ajax({
        async: true,
        dataType: 'json',
        method: 'POST',
        url: '/config',
        success: function(data) {
            GameConfig.config = data
            for(var item in GameConfig.config){
                if (item.indexOf("String") !== -1){
                    GameConfig.config[item] = GameConfig.config[item].replace(/\\n/g, "\n")
                }
            }
            // load material not using ige api
            vlg.soundinit();  // makes call to sound lib howler

            // load material for ige controlled content.
            var loaderScript = document.createElement('script'),
                loaderLocation = document.getElementById("gameStartScript").getAttribute("data-location");
            if(loaderLocation === "localhost")
                loaderScript.src = '/ige/engine/loader.js';
            else if(loaderLocation === "deploy")
                loaderScript.src = '/client/deploy/gameStartMin.js';

            loaderScript.addEventListener('error', function () {
                throw('ERROR LOADING loader/game.js - does it exist?');
            }, true);

            document.getElementsByTagName('head')[0].appendChild(loaderScript);
        },
        error : function(jqXHR, textStatus, errorThrown ){
            if(retryCount === 3){
                alert('Game does not load at the moment. Please try again later.')
                return;
            }
            retryCount++;
            getGameConfig(retryCount);
        }
    })
}
getGameConfig();