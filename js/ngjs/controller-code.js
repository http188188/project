angular.module("configurationApp")
.controller('moduleCodeCtrl', function (ngDialog, $scope, $state, $http,
    dataSourceUrl, releaseInterface, adminInterface,dataServiceInterface, pipelineInterface, jsonpCallback) {
	$scope.moduleType = "";
    $scope.moduleurl = "";
    $scope.startTime = "gjgj";
    $scope.endTime = "ghgjhj";
    $scope.moduleId = 0;
    $scope.getModuleCode = function(moduleid){
        $scope.moduleId = moduleid;
        var moduleCodeUrl = requestIp + dataSourceUrl + adminInterface + 'getSpecificModuleAndUrl?module_id=' +
          moduleid + '&' + jsonpCallback;

        $http.jsonp(moduleCodeUrl)
        .success(
            function(data){
                $scope.moduleType = data[0].tool_type;
                $scope.moduleurl = data[0].code_url;

            }
        ).error(function(){
            $scope.showSpinner = false;
            BootstrapDialog.show({
                type   : BootstrapDialog.TYPE_DANGER,
                title  : 'Notice',
                message: '获取数据失败'
            });
        });
    };

    $scope.getModuleCodeList= function(){

        
        var moduleCodeListUrl = "http://10.13.1.213:5000/gitstat?repo_url=" + $scope.moduleurl + 
                                "&time_start=" + $scope.startTime + "&time_end=" + $scope.endTime  + '&' + jsonpCallback;
        $http.jsonp(moduleCodeListUrl)
        .success(
            function(data){
                if(data.status == false){
                    BootstrapDialog.show({
                        type   : BootstrapDialog.TYPE_DANGER,
                        title  : 'Notice',
                        message: '获取数据'
                    }); 
                }
                else{
                    $scope.moduleCodeList = data.user;
                }
            }
        ).error(function(){
            $scope.showSpinner = true;
            BootstrapDialog.show({
                type   : BootstrapDialog.TYPE_DANGER,
                title  : 'Notice',
                message: '获取数据失'
            });
        });
    };
});