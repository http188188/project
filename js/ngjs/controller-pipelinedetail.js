angular.module("configurationApp")
.controller('pipelineDetailCtrl', function (ngDialog,$scope,$sce,$state,$stateParams, $http, 
    dataSourceUrl, pipelineInterface, rollbackInterface, jsonpCallback, timeInterval, $rootScope) {
    $scope.username = userName;
    $scope.packageType = $stateParams.package_type;
    $scope.pipelineName = $stateParams.name;

    $scope.data = {};
    $scope.pipelineStatus = {};
    $scope.pipelineStatus.status = "open";
    $scope.pipelineStatus.id = $stateParams.id;
    $rootScope.pipelineCaseId = $scope.pipelineStatus.id;
    $scope.pipelineDetailState = $stateParams.state;
    $scope.moduleId = $stateParams.moduleId;
    $scope.moduleVersion = $stateParams.moduleVersion;
    $scope.data.rollbackVersion = $stateParams.rollbackVersion;
    $scope.data.release_package_url = $stateParams.release_package_url;

    $scope.loadLogDone = false;

    $scope.rollbackParams = function(){
        return $stateParams.rollbackVersion != "";
    };

    $scope.piplelineTitle = {
        "mypipeline":"我的发布",
        "ongoingpipeline":"进行中的发布",
        "allprojectlist": "所有发布"
    };

    $scope.data.flowMap = [];
    $scope.data.exist = false;
    $scope.data.showMessage = false;
    $scope.showSpinner = true;

    $scope.sourceVersion = "";
    $scope.sourceDevVersion = "";

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
        "formOfTag" : "请选择回滚版本！",
        "formOfSource" : "请选择部署类型和CONFS_TAG！",
    };
    
    $scope.showAlert = {};

    $scope.detailMenu = [
        {name: $scope.pipelineName, url: '.ongoing'},
        {name: '历史记录', url: '.history'}
    ];

    $scope.selectedMenu = {};
    $scope.selectedMenu.url = ".ongoing";
    if($state.current.name == "pipelinedetail.history"){
        $scope.selectedMenu.url = ".history";
    }
    $scope.getMenuActive = function (eachMenu){
        return $scope.selectedMenu.url == eachMenu.url ? "active": "";
    };

    $scope.select = function (eachMenu){
        $scope.selectedMenu = eachMenu;
    };

    $scope.versionUrl = {};
    $scope.getRollbackVersioinList = function(moduleId){
        var getVersionUrl = requestIp + dataSourceUrl + rollbackInterface + 
        "getAllSucessHistoryVersionByModuleId?moduleId="
        + moduleId + '&' + jsonpCallback;
        $http.jsonp(getVersionUrl)
        .success(function(data){
            $scope.versionList = data.pipelineCase;
            for(var i = 0; i < $scope.versionList.length; i++){
                if($scope.versionList[i].svn_url != "" 
                    && $scope.versionList[i] != null){
                    var version = $scope.versionList[i].version;
                    $scope.versionUrl[version] = $scope.versionList[i].svn_url;
                }
            }
        }).error(function(){
            console.log("无法获取rollback version list!");
        });
    };

    var viewPipelineUrl = requestIp + dataSourceUrl + pipelineInterface + "viewPiplineByDefId?user="
        + userName + "&piplineDefId=" + $scope.pipelineStatus.id + "&packageType="
        + $scope.packageType + '&' + jsonpCallback;

    $http.jsonp(viewPipelineUrl)
    .success(function(data){
        $scope.showSpinner = false;
        if(data != null){
            if($scope.packageType == "source"){
                $scope.sourceVersion = data.version;
                $scope.sourceDevVersion = data.dev_version;
            }
            // $scope.pipelineStatus.id     = data.piplineDefId;
            if(data.node.length != 0){
                $scope.data.exist = true;
                $scope.data.flowMap = data.node;
                $scope.pipelineStatus.status = data.pipline_status;
            }else{
                $scope.data.showMessage = true;
                BootstrapDialog.show({
                    type   : BootstrapDialog.TYPE_DANGER,
                    title  : 'Notice',
                    message: 'Pipeline节点获取错误!'
                });
            }
            if(data.pipline_status == "on-going"){
                $scope.data.disableStart = true;
                if($scope.packageType == "war"){
                    $scope.data.warAddess = data.releaseWarUrl;
                    $scope.data.rollback  = data.rollBackWarUrl;
                }
                if($scope.packageType == "tag"){
                    $scope.data.rollbackVersion = data.rollBackVersion;
                }
                // $scope.data.comments = data.comments;
                $scope.data.pipelineInstanceId = data.pipline_case_id;
                $scope.updateInfo(data.pipline_case_id);
            }else{

                $scope.data.disableStart = false;
            }
        }else{
            
            $scope.showSpinner = false;
            $scope.showAlert.getPipeline = true;
        }
    })
    .error(function(){
        $scope.showAlert.getPipeline = true;
        $scope.showSpinner = false;
        $scope.data.showMessage = true;
        BootstrapDialog.show({
            type   : BootstrapDialog.TYPE_DANGER,
            title  : 'Notice',
            message: 'pipeline "' + $scope.pipelineName + '" 未创建!!'
        });
    });

    $scope.warOrSource = function (){
        return $scope.baseUrl + "js/pages/" + $scope.packageType + ".html";
        // return $scope.baseUrl + "js/pages/docker.html";
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
        return start ? true : false;
    };

    $scope.startPipeline = function(start){

        if(!start){
            $scope.packageType == "war" ? $scope.showAlert.formOfWar = true :
            $scope.packageType == "source" ? $scope.showAlert.formOfSource = true :
            $scope.showAlert.formOfTag = true;
            return;
        }else{
            $scope.packageType == "war" ? $scope.showAlert.formOfWar = false :
            $scope.packageType == "source" ? $scope.showAlert.formOfSource = false :
            $scope.showAlert.formOfTag = false;
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
                            // comments: $scope.data.comments,
                            operator: $scope.username,
                            rollBackVersion: $scope.data.sourceVersion
                        };

        if($scope.packageType == "war"){
            postData.releaseWarUrl  = $scope.data.warAddess;
            postData.rollBackWarUrl = $scope.data.rollback;
        }
        if($scope.packageType == "tag"){
            postData.rollBackVersion = $scope.data.rollbackVersion;
        }
        if(!$stateParams.release_package_url){
            postData.release_package_url = $scope.versionUrl[$scope.data.rollbackVersion];
        }else{
            postData.release_package_url = $stateParams.release_package_url;
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
    };

    $scope.hideTestBox = function (node){
        return node.status == "success" ? false : true;
    };

    $scope.disableTestBox = function(node){
        return $scope.data.runningNodeId != node.id && node.status != 'on-going' ? true : false;
    };

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
    };

    $scope.endStatus = function(){
        var imgName = $scope.pipelineStatus.status;
        if(imgName == "on-going"){
            imgName = "open";
        }
        return imgName;
    };

    $scope.currentLog = "build";
    $scope.getActiveLog = function(log){
        return $scope.currentLog == log ? "active":"";
    };
    $scope.selectLog = function(log){
        $scope.currentLog = log;
    };

    $scope.checkLogType = function (){
        return $scope.currentLog == 'diff' || $scope.currentLog == 'comments' ? true : false;
    };

    $scope.deliberatelyTrustDangerousSnippet = function(content) {  
        return $sce.trustAsHtml(content);
    };

    $scope.refreshLog = function (url){
        $scope.loadLogDone = true;
        $http.jsonp(requestIp + dataSourceUrl + pipelineInterface + "getLogUrlContent?logUrl="
                + url + "&" + jsonpCallback)
            .success(function (data){
                $scope.loadLogDone = false;
                $scope.logContent = data.log;
            }).error(function(data){
                $scope.loadLogDone = false;
                BootstrapDialog.show({
                    type   : BootstrapDialog.TYPE_DANGER,
                    title  : 'Notice',
                    message: "暂时无法获取当前节点LOG"
                });
            });
    };

    $scope.getStyleOfPanel = function(status){
        return status == "on-going" ? "panel-primary" :
               status == "success"  ? "panel-success" : "panel-danger";
    };

    $scope.showLog = function (node){
        $scope.currentLog = "build";
        if(node.status != "open" && node.job_log_url != ""){

            $scope.loadLogDone = true;

            $http.jsonp(requestIp + dataSourceUrl + pipelineInterface + "getLogUrlContent?logUrl="
                + node.job_log_url + "&" + jsonpCallback)
            .success(function (data){
                $scope.loadLogDone = false;
                $scope.logContent   = data.log;
                $scope.logName      = node.name;
                $scope.currentNode  = node;
                ngDialog.open({ template: $scope.baseUrl + "js/pages/tablog.html",
                                scope:    $scope });
                // BootstrapDialog.show({
                //     type      : node.status == "on-going" ? 
                //                 BootstrapDialog.TYPE_INFO : 
                //                 node.status == "success" ? 
                //                 BootstrapDialog.TYPE_SUCCESS :
                //                 BootstrapDialog.TYPE_DANGER,
                //     size      : BootstrapDialog.SIZE_WIDE,
                //     animate   : false,
                //     draggable : true,
                //     title     : node.name + " LOG",
                //     message   : data.log,
                //     // message   : $('<div></div>').load($scope.baseUrl + "js/pages/tablog.html"),
                //     buttons   : [
                //         {
                //             label    : node.status == "on-going"?'刷新':'关闭',
                //             cssClass : 'btn-primary',
                //             action   : function(dialogItself){
                //                 node.status == "on-going" ? 
                //                 $http.jsonp(requestIp + dataSourceUrl + pipelineInterface + "getLogUrlContent?logUrl="
                //                     + node.job_log_url + "&" + jsonpCallback)
                //                 .success(function (data){
                //                     dialogItself.setMessage(data.log)
                //                 }):
                //                 dialogItself.close();
                //         }
                //     }]
                // });
            })
            .error(function (data){
                $scope.loadLogDone = false;
                BootstrapDialog.show({
                    type   : BootstrapDialog.TYPE_DANGER,
                    title  : 'Notice',
                    message: "暂时无法获取" + node.name + "LOG"
                });
            });            
        }
    };

    // $scope.$on('ngDialog.opened', function (event, $dialog) {
    //     $dialog.find('.ngdialog-content').css('width', '70%');
    // });

    $scope.showTips = function (node){
        return node.status == "open"? "" : "点击查看" + node.name + "LOG";
    };

    $scope.getNodeName = function (name){
        var maxLengthName = 13;
        if(name.length <= maxLengthName){
            return name;
        }else{
            return name.substring(0,maxLengthName) + "....";
        }
    };

});