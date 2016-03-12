angular.module("configurationApp")
.controller("defaultCtrl", function ($scope, $state, $http, 
    dataSourceUrl, pipelineInterface, jsonpCallback){

    $scope.baseUrl = baseUrl;
    $scope.username = "jintao3";

    $scope.menuSpinner = true;

    var getMenuListUrl = requestIp + dataSourceUrl + pipelineInterface
        + "getMenuByName?name=" + userName + '&' + jsonpCallback;
    $http.jsonp(getMenuListUrl)
    .success(function(data){
        $scope.menuSpinner = false;
        $scope.menuList = data;
    });
    
    $scope.getSelectedMenu = function (eachMenu){
        return $scope.selectedListMenu == eachMenu.url ? "active": "";
    };

    $scope.selectMenu = function (eachMenu){
        $scope.selectedListMenu = eachMenu.url;
        $scope.selectedMenuName = eachMenu.name;
    };

    $scope.clearSideMenu = function (){
        $scope.selectedListMenu = null;
    };
});
