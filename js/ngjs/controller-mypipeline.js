angular.module("configurationApp")
.controller('myPipelineCtrl', function ($scope, $state, $http,
    dataSourceUrl, releaseInterface, jsonpCallback) {
    $scope.userName = userName;
    $scope.pageCount = 10;
    $scope.pageCountList = [5,10,15];
    $scope.pageNumbers = [];
    $scope.showPages = [1, 2, 3, 4];
    $scope.currentPage = 0;
    $scope.preBtn = true;
    $scope.nextBtn = true;
    $scope.searchContent = "";

    var runningState = "";
    if($state.current.name == 'ongoingpipeline') runningState = 'running';

    $scope.getPipelineList = function(user, pageCount, pageNum, running){
        $scope.preBtn = true;
        $scope.nextBtn = true;
        $scope.showSpinner = true;
        $scope.currentPage = pageNum;
        if(pageCount == null) pageCount = '' ;

        var getMyCodeListUrl = requestIp + dataSourceUrl + releaseInterface + 'getReleaseList?pagecount=' +
            pageCount + "&pagenum=" + pageNum + "&username=" + user + "&name=" + $scope.searchContent + '&stage=' +
            running + '&' + jsonpCallback;

        $http.jsonp(getMyCodeListUrl)
        .success(
            function(data){
                $scope.pages = data.totalPage;
                $scope.pageNumbers = [];
                $scope.getPages();
                $scope.myPipelineList = data.listRelease;
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

    $scope.owners = [];
    $scope.getPipelineOwner = function (ownerList, index){
        $scope.owners[index] = ownerList.split(';');
    };

    $scope.search = function (){
        // $scope.startSearch = $scope.searchContent ? $scope.searchContent : "";
        $scope.getPipelineList(userName, $scope.pageCount, 1, runningState);
    };

    $scope.getPages = function (){
        for (var i = 1; i < $scope.pages + 1; i++) {
            $scope.pageNumbers.push(i);
        } 
    };
    
    $scope.getActivePage = function (page){
        return ($scope.currentPage == page ) ? "paginate_active" : "paginate_button";
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

});