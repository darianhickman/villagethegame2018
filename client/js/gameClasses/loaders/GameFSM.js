var GameFSM = {FSMList:[], settings:[]}
var getGameFSM = function() {
    var deferred = $.Deferred(),
        retryCount = 1,
        getData;

    getData = function(retryCount) {
        $.ajax({
            async: true,
            dataType: 'json',
            url: '/fsm',
            success: function (data) {
                //GameFSM.settings = data;
                for(var i = 0; i < data.length; i++){
                    GameFSM.FSMList.push(data[i].FSM);
                    GameFSM.settings[data[i].FSM] = data[i];
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