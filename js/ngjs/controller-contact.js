angular.module("configurationApp")
.controller("contactCtrl", function ($scope, $state, $http, 
    dataSourceUrl, pipelineInterface, jsonpCallback){

	$scope.showSpinner = true;
	var getScmUserUrl = requestIp + dataSourceUrl + pipelineInterface
        + "getAllUserBySCM" + '?' + jsonpCallback;
    $http.jsonp(getScmUserUrl)
    .success(function(data){
        $scope.showSpinner = false;
        $scope.scmUser = data;
    });
});