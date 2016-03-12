angular.module("configurationApp")
.run( function (editableOptions) {
    editableOptions.theme = 'bs3';
})
.controller('adminCtrl', function ($scope, $http){
    $scope.adminMenu = [        
        {name: 'Quickbuild', url: '.quickbuild', btnCss: 'btn-warning'},
        {name: 'Permission', url: '.permission', btnCss: 'btn-primary'},
        {name: 'Wiki', url: '.adminwiki', btnCss: 'btn-danger'}
    ];

    $scope.selectedMenu = {};
    $scope.getMenuActive = function (eachMenu){
        return $scope.selectedMenu.url == eachMenu.url ? "active": "";
    };

    $scope.select = function (eachMenu){
        $scope.selectedMenu = eachMenu;
    };
})
.controller("permissionCtrl", function ($scope, $http, $q){

    $scope.showAddBtn = true;
    $scope.adminList = {};
    $scope.tableLineCount = 6;
    $scope.spinnerShow = true;
    $http.get(baseUrl + 'test/getAdminList')
    .success(function(data){
        $scope.adminList = data;
        $scope.spinnerShow = false;
    });

    $scope.rangeList = function (){
        var pageList = [];
        for (var i = 0; i < Math.ceil($scope.adminList.length / $scope.tableLineCount); i++) {
            pageList.push(i);
        };
        return pageList;
    };

    $scope.hideBtn = function (){
        $scope.showAddBtn = false;
    };

    $scope.showBtn = function (){
        $scope.showAddBtn = true;
        $scope.addUser = {};
    };

    $scope.addAdmin = function (user){
        var existed = false;
        for (var i = 0; i < $scope.adminList.length; i++) {
            if(user.name == $scope.adminList[i].name){
                existed = true;
                break;
            }
        }
        if(existed){
            BootstrapDialog.show({
                type   : BootstrapDialog.TYPE_DANGER,
                title  : 'Notice',
                message: user.name + ' already existed!'
            });
        }else{
            $scope.doAddAdmin(user);
        }
    };

    $scope.doAddAdmin = function (user){
        
        $scope.addUser = {};
        $http({
                method: "POST",
                url:    baseUrl + 'test/addAdminPermission',
                data:   $.param(user),
                headers:{'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .success(function(data){
            user.id = data;
            $scope.adminList.push(user);
            $scope.showAddBtn = true;
        })
        .error(function(data){
            BootstrapDialog.show({
                type   : BootstrapDialog.TYPE_DANGER,
                title  : 'Notice',
                message: 'Add Admin User ' + user.name + '!'
            });
        });
    }

    $scope.updatePermission = function (user){
        var existed = false;
        for (var i = 0; i < $scope.adminList.length; i++) {
            if( user.name == $scope.adminList[i].name &&
                user.id != $scope.adminList[i].id){
                existed = true; 
                break;
            }
        }
        if(existed){
            return user.name + " already existed!";
        }else{
            return $scope.doUpdatePermission(user);
        }
    }

    $scope.doUpdatePermission = function (user){
        var d = $q.defer();
        $http({
        method: "POST",
        url:    baseUrl + 'test/updateAdminPermission',
        data:   $.param(user),
        headers:{'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .success(function(data){
            if(data){
                d.resolve();
            }else{
                d.reject('Update Database Failure!');
            }
        })
        .error(function(data){
            d.reject('Update Admin User Failure!');
        });
        return d.promise;
    };

    $scope.confirmDeletion = function (user){
        BootstrapDialog.show({
            type   : BootstrapDialog.TYPE_WARNING,
            title  : 'Notice',
            message: 'Confirm to delete Admin User <font color="red">'+user.name+'</font>??',
            buttons   : [
                        {
                            label    : 'Delete',
                            cssClass : 'btn-danger',
                            action   : function(dialogItself){
                                $scope.deletePermission(user.id);
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
    }

    $scope.deletePermission = function (userId){
        $http({
                method: "POST",
                url:    baseUrl + 'test/deleteAdminPermission',
                data:   $.param({id:userId}),
                headers:{'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .success(function(data){
            if(data){
                for (var i = 0; i < $scope.adminList.length; i++) {
                    if ($scope.adminList[i].id == userId) {
                        $scope.adminList.splice(i, 1);
                        break;
                    }
                }
            }else{
                BootstrapDialog.show({
                    type   : BootstrapDialog.TYPE_DANGER,
                    title  : 'Notice',
                    message: 'Delete Database Failure!'
                });
            }
        })
        .error(function(data){
            BootstrapDialog.show({
                type   : BootstrapDialog.TYPE_DANGER,
                title  : 'Notice',
                message: 'Delete Admin User Failure!'
            });
        });
    }

});