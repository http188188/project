angular.module("configurationApp")
.run( function (editableOptions) {
    editableOptions.theme = 'bs3';
})
.controller("modulePermissionCtrl", function ($scope, $http, $q,
 dataSourceUrl, releaseInterface,jsonpCallback){

    $scope.showAddBtn = false;

    $scope.showAddForm = function(){
        $scope.showAddBtn = true;
    };

    $scope.hideAddForm = function(){
        $scope.showAddBtn = false;
    };

    $scope.addUser = function(userName, groupId, group){
        var addUserUrl = requestIp + dataSourceUrl + releaseInterface + 
        "insertUserToGroup?userName=" + userName + "+&groupId="
        + groupId + '&' + jsonpCallback;
        $http.jsonp(addUserUrl)
        .success(function(data){
            group.user.push({'name':userName});
        }).error(function(data){
        });
    };

    $scope.deleteUser = function(userName, groupId, group){
        var deleteUserUrl = requestIp + dataSourceUrl + releaseInterface + 
        "deleteUserToGroup?userName=" + userName + "+&groupId="
        + groupId + '&' + jsonpCallback;
        $http.jsonp(deleteUserUrl)
        .success(function(data){
            for (var i = 0; i < group.user.length; i++) {
                if (group.user[i].name == userName) {
                    group.user.splice(i, 1);
                    break;
                }
            }
        }).error(function(){
        });
    };

    $scope.confirmDeletion = function (user, groupId, group){
        BootstrapDialog.show({
            type   : BootstrapDialog.TYPE_WARNING,
            title  : 'Notice',
            message: 'Confirm to delete Admin User <font color="red">'+user.name+'</font>??',
            buttons   : [
                        {
                            label    : 'Delete',
                            cssClass : 'btn-danger',
                            action   : function(dialogItself){
                                $scope.deleteUser(user.name, groupId, group);
                                dialogItself.close();
                            }
                        },{
                            label    : 'Cancel',
                            cssClass : 'btn-default',
                            action   : function(dialogItself){
                                dialogItself.close();
                            }
                        }]
        });
    };
});