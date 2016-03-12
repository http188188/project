angular.module("configurationApp")
.controller('moduleVersionCtrl', function (ngDialog, $scope, $state, $http,
    dataSourceUrl, releaseInterface, adminInterface,dataServiceInterface, pipelineInterface, jsonpCallback) {
    $scope.pageCount = 10;
    $scope.pageCountList = [5,10,15];
    $scope.pageNumbers = [];
    $scope.showPages = [1, 2, 3, 4];
    $scope.currentPage = 0;
    $scope.preBtn = true;
    $scope.nextBtn = true;
    $scope.searchContent = "";
    $scope.currentCategory = "";
    $scope.moduleType = "";
    $scope.moduleurl = "";
    $scope.time = {};

    $scope.getModuleVersionList = function(pageCount, pageNum, productId){
        $scope.currentCategory = productId;
        $scope.preBtn = true;
        $scope.nextBtn = true;
        $scope.showSpinner = true;
        $scope.currentPage = pageNum;
        if(pageCount == null) pageCount = '';

        var moduleVersionListUrl = requestIp + dataSourceUrl + releaseInterface + 'getAllModuleCurrentVersion?pagecount=' +
            pageCount + "&pagenum=" + pageNum + "&name=" + $scope.searchContent + '&product_id=' + productId + '&' + jsonpCallback;

        $http.jsonp(moduleVersionListUrl)
        .success(
            function(data){
                $scope.pages = data.totalPage;
                $scope.pageNumbers = [];
                $scope.getPages();
                $scope.moduleVersionList = data.moduleHistoryVO;
                $scope.showSpinner = false;
                $scope.totalNum = data.totalCount;
                $scope.getShowPages();
                if(pageCount == '') $scope.pageCount =$scope.totalNum;
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

    $scope.getModuleCode = function(moduleid){
        
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
                            "&time_start=" + $scope.time.start + "&time_end=" + $scope.time.end + '&' + jsonpCallback;

        $http.jsonp(moduleCodeListUrl)
        .success(
            function(data){
                if(data.status == false){
                    BootstrapDialog.show({
                        type   : BootstrapDialog.TYPE_DANGER,
                        title  : 'Notice',
                        message: '获取数据失败'
                    }); 
                }
                else{
                    $scope.moduleCodeList = data.user;
                }
            }
        ).error(function(){
            
                BootstrapDialog.show({
                    type   : BootstrapDialog.TYPE_DANGER,
                    title  : 'Notice',
                    message: '获取数据失败'
                });
        });
    };

    $scope.getCategoryList = function (productId){
        $scope.searchContent = "";
        $scope.getModuleVersionList($scope.pageCount, 1, productId);
    };

    $scope.search = function (){
        $scope.getModuleVersionList($scope.pageCount, 1);
    };

    $scope.getPages = function (){
        for (var i = 1; i < $scope.pages + 1; i++) {
            $scope.pageNumbers.push(i);
        } 
    };

    $scope.getActivePage = function (page){
        return $scope.currentPage == page ? "paginate_active" : "paginate_button";
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
    $scope.getShowPages = function (){
        var start;
        var end;
        if($scope.currentPage >= 4){
            if ($scope.currentPage > $scope.pages - 3){
                start = $scope.pages - 4;
                end   = $scope.pages;
            } else{
                start = $scope.currentPage - 3;
                end   = $scope.currentPage + 1
            }
            
        } else{
            if ($scope.currentPage < 4){
                start = 0;
                end   = 4;
            }
        }
        $scope.showPages = $scope.pageNumbers.slice(start, end)
    };
    $scope.lastShowNum = function (){
        var lastNum;
        if($scope.currentPage == $scope.pages){
            lastNum =  $scope.totalNum;
        }
        else{
            lastNum = $scope.pageCount * $scope.currentPage;
        }
        return lastNum;
    }
    $scope.getShowPages = function (){
        var start;
        var end;
        if($scope.currentPage >= 4){
            if ($scope.currentPage > $scope.pages - 3){
                start = $scope.pages - 4;
                end   = $scope.pages;
            } else{
                start = $scope.currentPage - 3;
                end   = $scope.currentPage + 1
            }
            
        } else{
            if ($scope.currentPage < 4){
                start = 0;
                end   = 4;
            }
        }
        $scope.showPages = $scope.pageNumbers.slice(start, end)
    };

    $scope.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    $scope.series = ['2015 Online', '2015 Rollback'];

    $scope.showChart = false;
    $scope.getModuleData = function (module){
        var getStatisticUrl = requestIp + dataSourceUrl + dataServiceInterface +
        "releaseAndRollBackNumByModuleId?moduleId=" + module.id + "&" + jsonpCallback;
        $http.jsonp(getStatisticUrl)
        .success(function(data){
            $scope.showChart = true;
            $scope.moduleName = module.name;
            $scope.moduleVersion = module.current_online_version;
            $scope.year = data.year;
            $scope.onlineTime = data.total_release;
            $scope.rollbackTime = data.total_rollback;
            $scope.dataChart = [data.month_release, data.month_rollback];

        }).error(function(){
            $scope.showChart = false;
            BootstrapDialog.show({
                type   : BootstrapDialog.TYPE_DANGER,
                title  : 'Notice',
                message: '获取统计数据错误!'
            });
        });
    };

    $scope.categoryStyle = ["warning","success","primary","danger","primary"];

    $scope.getCategory = function (){
        var getCategoryUrl = requestIp + dataSourceUrl + pipelineInterface +
        "getProductLine?" + jsonpCallback;
        $http.jsonp(getCategoryUrl)
        .success(function(data){
            $scope.category = data;
        }).error(function(){
            BootstrapDialog.show({
                type   : BootstrapDialog.TYPE_DANGER,
                title  : 'Notice',
                message: '获取业务分类数据错误!'
            });
        });
    };

    $scope.getIndex = function (id){
        return id % $scope.categoryStyle.length -1;
    };
});