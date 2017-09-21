var GameAssets = {assets:{}}
var getGameAssets = function(){
    var deferred = $.Deferred(),
        retryCount = 1,
        getData;

    getData = function(retryCount) {
        $.ajax({
            async: true,
            dataType: 'json',
            url: '/assets',
            success: function (data) {
                GameAssets.assets = data
                for(var i = 0; i < GameAssets.assets.length; i++){
                    GameAssets.assets[i].id = GameAssets.assets[i].url.substr(GameAssets.assets[i].url.lastIndexOf('/') + 1);
                    GameAssets.assets[i].name = GameAssets.assets[i].id.substr(0,GameAssets.assets[i].id.lastIndexOf('.'));
                    if(GameAssets.assets[i].url.indexOf('audio') !==  -1 || GameAssets.assets[i].url.indexOf('sound') !==  -1){
                        GameAssets.assets[i].attachTo = 'audio';
                        GameAssets.assets[i].type = 'Audio';
                    } else{
                        GameAssets.assets[i].attachTo = 'textures';
                        if(GameAssets.assets[i].url.indexOf('fonts') !==  -1)
                            GameAssets.assets[i].type = 'FontSheet';
                        else if(GameAssets.assets[i].url.indexOf('cellsheets') !==  -1)
                            GameAssets.assets[i].type = 'CellSheet';
                        else
                            GameAssets.assets[i].type = 'Texture';
                    }

                }
                deferred.resolve("ok");
            },
            error : function(jqXHR, textStatus, errorThrown ){
                if(retryCount === parseInt(GameConfig.config['URLRetryCount'])){
                    deferred.reject();
                    return;
                }
                retryCount++;
                getData(retryCount);
            }
        })
    }
    getData(retryCount);
    return deferred.promise();
}