angular.module("configurationApp")
.controller('moduleInfoCtrl', function ($scope, $state, $http,
    dataSourceUrl, releaseInterface, jsonpCallback) {
    $scope.updateModuleInfo = function(name,prefix,owner,moduleid){
        var updateModuleUrl = requestIp + dataSourceUrl + releaseInterface + 'updateModule?name=' +
            name + "&version_prefix=" + prefix + "&module_owner=" + owner + "&moduleId=" + moduleid 
            + '&' + jsonpCallback;
        $http.jsonp(updateModuleUrl)
        .success(function(data){
            BootstrapDialog.show({
                    type   : BootstrapDialog.TYPE_SUCCESS,
                    title  : 'Notice',
                    message: '更新Module信息成功!'
                });
            
        }).error(function(){
            BootstrapDialog.show({
                    type   : BootstrapDialog.TYPE_DANGER,
                    title  : 'Notice',
                    message: '更新Module信息失败!'
                });
        });
    }
});