var AssetBundle = {cashBundle:[],cashBundleLookup:{},coinBundle:[],coinBundleLookup:{},waterBundle:[],waterBundleLookup:{}}
var getAssetBundle = function() {
    var deferred = $.Deferred(),
        retryCount = 1,
        getData;

    getData = function(retryCount) {
        $.ajax({
            async: true,
            dataType: 'json',
            url: '/assetbundle',
            success: function (data) {
                for (var i = 0; i < data.length; i++) {
                    var item = data[i]
                    switch (item.assetType){
                        case "vBuck":
                            AssetBundle.cashBundle.push({
                                'bundleid': item.bundleid,
                                'vBucks': item.assetValue,
                                'pay': item.assetPrice,
                                'isActive': item.active
                            });
                            AssetBundle.cashBundleLookup[item.bundleid] = AssetBundle.cashBundle[AssetBundle.cashBundle.length - 1];
                            break;
                        case "coin":
                            AssetBundle.coinBundle.push({
                                'bundleid': item.bundleid,
                                'coins': item.assetValue,
                                'pay': item.assetPrice,
                                'isActive': item.active
                            });
                            AssetBundle.coinBundleLookup[item.bundleid] = AssetBundle.coinBundle[AssetBundle.coinBundle.length - 1];
                            break;
                        case "water":
                            AssetBundle.waterBundle.push({
                                'bundleid': item.bundleid,
                                'water': item.assetValue,
                                'pay': item.assetPrice,
                                'isActive': item.active
                            });
                            AssetBundle.waterBundleLookup[item.bundleid] = AssetBundle.waterBundle[AssetBundle.waterBundle.length - 1];
                            break;
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