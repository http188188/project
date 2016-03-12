angular.module("configurationApp")
.controller('pipelineCtrl', function ($scope, $state, $http,
    dataSourceUrl, pipelineInterface, jsonpCallback, timeInterval) {

    $scope.projectList = {};
    $scope.pipelineStatus = {};
    $scope.pipelineStatus.status = "open";
    $scope.pipelineStatus.valid  = false;
    $scope.selectedValue = null;
    $scope.selectedDeployedType  = [];

    $scope.data = {};
    $scope.data.deployed = [];
    $scope.data.candidate = [];
    $scope.data.flowMap   = [];

    $scope.packageType = "";
    $scope.sourceVersion = "";
    $scope.sourceDevVersion = "";

    $scope.candidateDeployedType = [];

    $scope.data.int = -1;

    $scope.nodeStatus = {
        "open"     : {"text": "未启动", "style": "warning", "start": "点击启动"},
        "on-going" : {"text": "进行中", "style": "primary", "start": "已启动"},
        "success"  : {"text": "成功", "style": "success" , "start": "已成功"},
        "skip"  : {"text": "成功", "style": "success" , "start": "已成功"},
        "pass"  : {"text": "成功", "style": "success" , "start": "已成功"},
        "fail"     : {"text": "失败", "style": "danger", "start": "已失败"}
    };

    $scope.alertBox = {};

    $scope.alertMessage = {
        "getPipeline"       : "无法获取该Pipeline流程!",
        "formOfWar" : "请正确输入War包地址，回滚包地址, 部署类型！(不可为空)",
        "formOfSource" : "请选择部署类型！"
    };
    
    $scope.showAlert = {};

    $http.jsonp(requestIp + dataSourceUrl + pipelineInterface + 'getAllModuleNameAndId?' + jsonpCallback)
    .success(
        function(data){
            $scope.projectList = data;
        }
    ).error(function(){
        //TODO exception Handling
        angular.element("#project").html("<option value='error'>发生错误</option>");
    });

    $scope.typeListShow = function(){

        return $scope.selectedValue != null ? true : false;
    };

    $scope.listPipelineList = function(){

        if($scope.selectedValue != null){

            var getPipelineListByModuleIdUrl = requestIp + dataSourceUrl + pipelineInterface + 
            'getPipelineListByModuleId?moduleId=' + 
            $scope.selectedValue + '&' + jsonpCallback;

            $http.jsonp(getPipelineListByModuleIdUrl)
            .success(
                function(data){
                    $scope.pipelineList = data;
                }
            ).error(function(){
                //TODO exception Handling
                angular.element("#palertBox").show();
            });

        }else{
            $scope.pipelineList = null;
        }
    };

    $scope.createViewMap = function (eachModule){

        if($scope.data.int != -1) window.clearInterval($scope.data.int);
        $scope.showAlert = {};
        $scope.packageType  = eachModule.package_type;
        var viewPipelineUrl = requestIp + dataSourceUrl + pipelineInterface + "viewPiplineByDefId?user="
        + $scope.username + "&piplineDefId=" + eachModule.id + "&packageType="
        + eachModule.package_type + '&' + jsonpCallback;

        if( eachModule.id != $scope.pipelineStatus.id || 
            !$scope.pipelineStatus.valid || 
            $scope.pipelineStatus.status == "fail" ||
            $scope.pipelineStatus.status == "success"){

            $http.jsonp(viewPipelineUrl)
            .success(
                function(data){
                    if(data != null){
                        if($scope.packageType == "source"){
                            $scope.sourceVersion = data.version;
                            $scope.sourceDevVersion = data.dev_version;
                        }
                        $scope.pipelineStatus.id     = data.piplineDefId;
                        if(data.node.length != 0){
                            $scope.data.flowMap = data.node;
                            $scope.addDeployedType(data);
                            $scope.pipelineStatus.status = data.pipline_status;
                            // angular.element("#pipelineFlow").show();
                            $scope.pipelineStatus.valid = true;
                        }else{
                            // angular.element("#pipelineFlow").hide();
                            $scope.pipelineStatus.valid = false;

                            BootstrapDialog.show({
                                type   : BootstrapDialog.TYPE_DANGER,
                                title  : 'Notice',
                                message: '此Pipeline还未创建!'
                            });
                        }
                        if(data.pipline_status == "on-going"){
                            $scope.data.disableStart = true;
                            if($scope.packageType == "war"){
                                $scope.data.warAddess = data.releaseWarUrl;
                                $scope.data.rollback  = data.rollBackWarUrl;
                            }
                            $scope.data.comments = data.comments;
                            $scope.data.pipelineInstanceId = data.pipline_case_id;
                            $scope.updateInfo(data.pipline_case_id);
                        }else{
                            $scope.data.disableStart = false;
                        }

                    }else{
                        $scope.showAlert.getPipeline = true;
                    }
                }
            ).error(function(){
                //TODO exception Handling
                $scope.showAlert.getPipeline = true;
            });
        }
    };

    $scope.addDeployedType = function (data){

        var strsAll= new Array();
        strsAll = data.allReleaseType.split(";");
        var candidateStr = new Array();

        if(data.releaseType != ""){
            $scope.selectedDeployedType = data.releaseType.split(";");
        }

        $.each(strsAll, function(i, val){
            if($.inArray(val, $scope.selectedDeployedType) == -1){
                candidateStr.push(val);
            }
        });
        $scope.candidateDeployedType = candidateStr;
    };

    $scope.removeElement = function (strArray, ele){
        for(var i = 0; i < strArray.length; i++){
            if(strArray[i] == ele){
                strArray.splice(i,1);
                break;
            }
        }
    }

    $scope.styleOfSelectedDeployType = function() {
        return $scope.selectedDeployedType.length > 0 ? 'label-primary' : 'label-danger';
    }

    $scope.addRemove = function(each, add, remove){
        for(var i = 0; i < each.length; i++){
            add.push(each[i]);
            $scope.removeElement(remove, each[i]);
        }
        each.length = 0;
    };

    $scope.addRemoveAll = function(add, remove){
        for(var i = 0; i < add.length; i++){
            remove.push(add[i]);
        }
        add.length = 0;
    };

    $scope.disBtn = function(arrayList, selected){
        return $scope.data.disableStart || arrayList.length == 0 || selected == 0 ? true : false;
    };

    $scope.warOrSource = function (){
        return $scope.baseUrl + "js/pages/" + 
        ($scope.packageType == "war" ? 'war.html' : 'source.html');
    };

    $scope.selectLine = function (index){
        return index > 1 && index % 6 == 1 ? 'col-md-offset-1' : '';
    };

    $scope.endNodePosition = function(){
        return $scope.data.flowMap.length % 6 == 0 ? 'col-md-offset-1' : '';
    };

    $scope.offsetRight = function (index){
        return index == 0 ? 'col-md-offset-1' : '';
    };

    $scope.startImg = function (start){
        return start && $scope.selectedDeployedType.length > 0 ? true : false;
    }

    $scope.startPipeline = function(start){

        if(!(start && $scope.selectedDeployedType.length > 0)){
            $scope.packageType == "war" ? $scope.showAlert.formOfWar = true :
            $scope.showAlert.formOfSource = true;
            return;
        }else{
            $scope.packageType == "war" ? $scope.showAlert.formOfWar = false :
            $scope.showAlert.formOfSource = false;
        }

        if($scope.data.disableStart){

            BootstrapDialog.show({
                type   : BootstrapDialog.TYPE_DANGER,
                title  : 'Notice',
                message: 'pipeline is already started!!'
            });
            return;
        }
        var updatePipelineUrl = requestIp + dataSourceUrl + pipelineInterface + "startPiplineByDefId";

        var postData = {    
                            packageType:  $scope.packageType,
                            piplineDefId: $scope.pipelineStatus.id,
                            comments: $scope.data.comments,
                            operator: $scope.username,
                            releaseType: $scope.selectedDeployedType.join(';')
                        };

        if($scope.packageType == "war"){
            postData.releaseWarUrl  = $scope.data.warAddess;
            postData.rollBackWarUrl = $scope.data.rollback;
        }

        //TODO use angular $http.jsonp to realize
        $.ajax({
                type : "POST",
                url : updatePipelineUrl,
                cache : false,
                dataType : "jsonp",
                jsonp : "callback",
                jsonpCallback : "jsonpcallback",
                data: postData,
                success: function(data){

                    BootstrapDialog.show({
                        type   : BootstrapDialog.TYPE_SUCCESS,
                        title  : 'Infomation',
                        message: '已成功启动Pipeline!'
                    });

                    $scope.data.disableStart = true;
                    $scope.data.pipelineInstanceId = data.pipline_case_id;
                    $scope.data.flowMap = data.node;
                    $scope.updateInfo($scope.data.pipelineInstanceId);
                },
                error : function(){

                    BootstrapDialog.show({
                        type   : BootstrapDialog.TYPE_DANGER,
                        title  : 'Notice',
                        message: '无法启动!'
                    });
                }
        });
    };

    $scope.trigger = function (node,result){
        $scope.data.runningNodeId = -1;
        var triggerUrl = requestIp + dataSourceUrl + pipelineInterface +
        "platfromCiNodePostCallback?result=" + result + 
        "&pipelineCaseId=" + $scope.data.pipelineInstanceId + "&nodeCaseId=" +
        node.id + '&' + jsonpCallback;

        $http.jsonp(triggerUrl)
        .success(function (msg){
            if(msg.result == "fail"){

                BootstrapDialog.show({
                    type   : BootstrapDialog.TYPE_DANGER,
                    title  : 'Notice',
                    message: msg.message
                });

            }
        })
        .error(function(msg){

            BootstrapDialog.show({
                type   : BootstrapDialog.TYPE_DANGER,
                title  : 'Notice',
                message: msg.message
            });

        });
    }

    $scope.hideTestBox = function (node){
        // if(angular.isUndefined($scope.data.runningNodeId)){
        //     return true;
        // }else{
        //     return $scope.data.runningNodeId < node.id ? true : false;
        // }
        return node.status == "success" ? false : true;
    }

    $scope.disableTestBox = function(node){
        return $scope.data.runningNodeId != node.id && node.status != 'on-going' ? true : false;
    }

    $scope.updateInfo = function (instanceId){
        $scope.data.int = setInterval(function(){
            var url = requestIp + dataSourceUrl + pipelineInterface + "getPiplineCaseJsonById?pipelineCaseId=" 
                + instanceId + '&' + jsonpCallback;

            $http.jsonp(url, {cache: false})
            .success( function (data){
                // console.log(data);
                $scope.data.flowMap = data.node;
                $scope.pipelineStatus.status = data.pipline_status;
                if(data.pipline_status != "on-going"){
                    window.clearInterval($scope.data.int);
                }else{
                    for(var i = 0; i < data.node.length; i++){
                        if(data.node[i].status == "on-going"){
                            $scope.data.runningNodeId = data.node[i].id;
                            break;
                        }
                    }
                }                
            })
            .error(function(data){

            });
        
        },timeInterval);
    }

    $scope.endStatus = function(){
        var imgName = $scope.pipelineStatus.status;
        if(imgName == "on-going"){
            imgName = "open";
        }
        return imgName;
    }

    $scope.showLog = function (node){

        if(node.status != "open" && node.job_log_url != ""){

            $http.jsonp(requestIp + dataSourceUrl + pipelineInterface + "getLogUrlContent?logUrl="
                + node.job_log_url + "&" + jsonpCallback)
            .success(function (data){
                BootstrapDialog.show({
                    type      : node.status == "on-going" ? 
                                BootstrapDialog.TYPE_INFO : 
                                node.status == "success" ? 
                                BootstrapDialog.TYPE_SUCCESS :
                                BootstrapDialog.TYPE_DANGER,
                    size      : BootstrapDialog.SIZE_WIDE,
                    animate   : false,
                    draggable : true,
                    title     : node.name + " LOG",
                    message   : data.log,
                    buttons   : [
                        {
                            label    : node.status == "on-going"?'刷新':'关闭',
                            cssClass : 'btn-primary',
                            action   : function(dialogItself){
                                node.status == "on-going" ? 
                                $http.jsonp(requestIp + dataSourceUrl + pipelineInterface + "getLogUrlContent?logUrl="
                                    + node.job_log_url + "&" + jsonpCallback)
                                .success(function (data){
                                    dialogItself.setMessage(data.log)
                                }):
                                dialogItself.close();
                        }
                    }]
                });
            })
            .error(function (data){

                BootstrapDialog.show({
                    type   : BootstrapDialog.TYPE_DANGER,
                    title  : 'Notice',
                    message: "暂时无法获取" + node.name + "LOG"
                });
            });            
        }
    }

    $scope.showTips = function (node){
        return node.status == "open"? "" : "点击查看" + node.name + "LOG";
    }
});