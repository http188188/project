angular.module("configurationApp")
.controller('historyDetailCtrl', function ($scope, $state, $stateParams, $http, dataSourceUrl, releaseInterface, jsonpCallback) {
    // $scope.pipelilneCaseId = $stateParams.pipelineCaseId;

    var viewHistoryUrl = requestIp + dataSourceUrl + releaseInterface +
    "getSpecificPiplineCase?pipelineCaseId=" + $scope.pipelilneCaseId + '&' + jsonpCallback;

    $scope.historyFlow = [];
    $scope.historyStatus = 'open';
    $scope.showSpinner = true;
    $http.jsonp(viewHistoryUrl)
    .success(function(data){
        $scope.showSpinner = false;
        if(data != null){
            $scope.historyFlow = data.node;
            $scope.historyStatus = data.pipline_status;
        }
    })
    .error(function(){
        $scope.showSpinner = false;
        BootstrapDialog.show({
            type   : BootstrapDialog.TYPE_DANGER,
            title  : 'Notice',
            message: '获取历史数据失败'
        });
    });

    $scope.historyEndNodePosition = function(){
        return $scope.historyFlow.length % 6 == 0 ? 'col-md-offset-1' : '';
    };
})