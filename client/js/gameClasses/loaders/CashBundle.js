var CashBundle = {bundle:[],bundleLookup:{}}
var getCashBundle = function() {
    var deferred = $.Deferred(),
        retryCount = 1,
        getData;

    getData = function(retryCount) {
        $.ajax({
            async: true,
            dataType: 'json',
            url: '/cashbundle',
            success: function (data) {
                for (var i = 0; i < data.length; i++) {
                    var item = data[i]
                    CashBundle.bundle.push({
                        'bundleid': item.bundleid,
                        'vBucks': item.VilageCash,
                        'pay': item.USD,
                        'isActive': item.active
                    });
                    CashBundle.bundleLookup[item.bundleid] = CashBundle.bundle[CashBundle.bundle.length - 1];
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