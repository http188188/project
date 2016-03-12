angular.module("configurationApp")
.controller('wikiCtrl', function ($scope, $http){

    $scope.wikiList = {};

    $scope.getType = function (){
        $http.get("test/getFolderFile")
        .success(function(data){
            $scope.folderStructure = data;
        })
        .error(function(msg){

        });
    };

    $scope.getFileName = function (str){
        var reg = /.html$/;
        return str.replace(reg,'');
    };

    $scope.getTitle = function (key, str){
        str = $scope.getFileName(str);
        $http.get("test/getFileContent/" + key + "/" + str)
        .success(function (data){
            if($scope.wikiList[key] == undefined){
                $scope.wikiList[key] = [];   
            }
            $scope.wikiList[key][str] = data;
        });
    };
});