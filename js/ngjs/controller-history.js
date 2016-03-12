angular.module("configurationApp")
.controller('historyCtrl', function ($scope, $state, $http,
    dataSourceUrl, releaseInterface, jsonpCallback, $rootScope) {
    $scope.pageCount = 10;
    $scope.pageNumbers = [];
    $scope.currentPage = 0;
    $scope.preBtn = true;
    $scope.nextBtn = true;
    $scope.notRollback = true;

    $scope.getHistoryList = function(moduleId, pageCount, pageNum){
        $scope.preBtn = true;
        $scope.nextBtn = true;
        $scope.showSpinner = true;
        $scope.currentPage = pageNum;
        if(pageCount == null)   pageCount = '';

        var getHistoryListUrl = requestIp + dataSourceUrl + releaseInterface + 'getReleaseHistory?pagecount=' +
            pageCount + "&pagenum=" + pageNum + "&moduleId=" + moduleId + "&piplineDefId=" + $rootScope.pipelineCaseId + '&' + jsonpCallback;

        $http.jsonp(getHistoryListUrl)
        .success(
            function(data){
                if(data.pipeline_type == "rollback") $scope.notRollback = false;
                $scope.pages = data.totalPage;
                $scope.pageNumbers = [];
                $scope.getPages();
                $scope.historyList = data.listReleasHistory;
                $scope.moduleVersion = data.module_version;
                $scope.showSpinner = false;
                $scope.totalNum = data.totalCount;
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

    $scope.getPages = function (){
        for (var i = 1; i < $scope.pages + 1; i++) {
            $scope.pageNumbers.push(i);
        } 
    };

    $scope.getActivePage = function (page){
        return $scope.currentPage == page ? "active" : "";
    };

    $scope.disablePre = function (){
        var disableClass = "";
        if($scope.currentPage == 1){
            disableClass = "disabled";
            $scope.preBtn = false;
        }
        return disableClass;
    };

    $scope.disableNext = function (){
        var disableClass = "";
        if($scope.currentPage == $scope.pages){
            disableClass = "disabled";
            $scope.nextBtn = false;
        }
        return disableClass;
    };

    $scope.showRollBack = function(item, modVer){
        return item.piplineCase.status != "fail" 
        && item.piplineCase.is_release_version == 1
        && modVer != item.piplineCase.version;
    };

    $scope.getFromVersion = function(fromVersion){
        var fromVersionStr = fromVersion;
        if(fromVersion != ''){
            fromVersionStr = fromVersion + " ->" + " ";
        }
        return fromVersionStr;
    };

})