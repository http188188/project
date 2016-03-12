angular.module("configurationApp")
.controller('infomationCtrl', function (ngDialog, $scope, $state, $http,
    dataSourceUrl, releaseInterface, jsonpCallback) {
    $scope.pageCount = 20;
    $scope.pageCountList = [20, 30, 50, 100];
    $scope.pageNumbers = [];
    $scope.currentPage = 0;
    $scope.preBtn = true;
    $scope.nextBtn = true;
    $scope.searchContent = "";

    $scope.getModuleVersionList = function(pageCount, pageNum){
        $scope.preBtn = true;
        $scope.nextBtn = true;
        $scope.showSpinner = true;
        $scope.currentPage = pageNum;
        if(pageCount == null) pageCount = '';

        var moduleVersionListUrl = requestIp + dataSourceUrl + 
        releaseInterface + 
        'getAllModuleCurrentVersion?isAll=true&pagecount=' + 
        pageCount + "&pagenum=" + pageNum + "&name=" + 
        $scope.searchContent + '&' + jsonpCallback;

        $http.jsonp(moduleVersionListUrl)
        .success(
            function(data){
                $scope.pages = data.totalPage;
                $scope.pageNumbers = [];
                $scope.getPages();
                $scope.moduleVersionList = data.moduleHistoryVO;
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

    $scope.search = function (){
        $scope.getModuleVersionList($scope.pageCount, 1);
    }

    $scope.getPages = function (){
        for (var i = 1; i < $scope.pages + 1; i++) {
            $scope.pageNumbers.push(i);
        } 
    }

    $scope.getActivePage = function (page){
        return $scope.currentPage == page ? "active" : "";
    }

    $scope.disablePre = function (){
        var disableClass = "";
        if($scope.currentPage == 1){
            disableClass = "disabled";
            $scope.preBtn = false;
        }
        return disableClass;
    }

    $scope.disableNext = function (){
        var disableClass = "";
        if($scope.currentPage == $scope.pages){
            disableClass = "disabled";
            $scope.nextBtn = false;
        }
        return disableClass;
    }

    $scope.productLineList = 
    ['主站产品','商业产品','内容产品','无线产品','平台产品'];

    $scope.getProductList = function(){
        $scope.productList = [$scope.productLine+'1',$scope.productLine+'2',$scope.productLine+'3',$scope.productLine+'4'];
    };

    $scope.showNewModuleForm = function (){
        ngDialog.open({ template: baseUrl + "js/pages/newmodule.html",
                        scope:    $scope,
                        closeByDocument: false });
    };

});