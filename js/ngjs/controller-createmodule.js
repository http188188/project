angular.module("configurationApp")
.run( function (editableOptions) {
    editableOptions.theme = 'bs3';
})
.controller("createModuleCtrl", function ($scope, $state, $http, 
    dataSourceUrl, adminInterface, jsonpCallback){

    $scope.showSpinner = false;

    $scope.codeTypeList = ['php','java','js'];
    $scope.versionControlList = ['git','svn'];
    $scope.pipelineTypeList = 
    ['normal_release', 'urgent_release','rollback', 'build'];
    $scope.packageTypeList = ['war','source', 'tag'];

    $scope.nodeTypeList = 
    ['deploy_preview_env','test_preview_env','openflow_preview_env',
     'test_openflow_preivew_env','deploy_release_package',
     'test_online_regression','build','prepare_release','release'];

    $scope.testTypeList = ['auto','manual'];

    $scope.showErrorMessage = false;
    $scope.submitForm = false;
    $scope.firstStep = true;
    $scope.secondStep = false;
    $scope.errorMessage = "信息不完整！";

    $scope.showNodeForm = false;
    $scope.nodeList = [];
    $scope.showBtn = true;

    $scope.start_next_node = "";
    $scope.testType = "";


    $scope.addNodeForm = function(){
        $scope.showNodeForm = true;
        $scope.showBtn = false;
    };

    $scope.getTitle = function (){
        if($scope.firstStep) return "输入模块基本信息";
        return "输入Pipeline基本信息";
    };

    $scope.createBaseModuleInfo = function(){
        $scope.showSpinner = true;
        var createNewModuleUrl = requestIp + dataSourceUrl + adminInterface
            + "insertModuleInfo" + '?' + "name=" + $scope.moduleName +
            "&code_type=" + $scope.codeType + "&module_owner=" + 
            $scope.moduleOwner + "&push_list=" + $scope.pushList + 
            "&url_online=" + $scope.onlineUrl + "&qb_job_def_url=" + 
            $scope.qbUrl + "&tool_type=" + $scope.versionControl + 
            "&code_url=" + $scope.codeUrl + "&tag_url=" + $scope.tagUrl + 
            "&version_prefix=" + $scope.prefix + "&" + jsonpCallback;
        var returnCode = true;
        $scope.module_id = "";
        $http.jsonp(createNewModuleUrl)
        .success(function(data){
            $scope.showSpinner = false;
            if($scope.secondStep){
                $scope.createNodeInfo(data.module_id);
            }
            // BootstrapDialog.show({
            //     type   : BootstrapDialog.TYPE_SUCCESS,
            //     title  : 'Notice',
            //     message: "模块" + $scope.moduleName + " 创建成功！"
            // });
        })
        .error(function(data){
            $scope.showSpinner = false;
            returnCode = false;
            // BootstrapDialog.show({
            //     type   : BootstrapDialog.TYPE_DANGER,
            //     title  : 'Notice',
            //     message: "网络错误！"
            // });
        });
    };

    $scope.createNodeInfo = function (module){
        $scope.showSpinner = true;
        var createPipelineUrl = requestIp + dataSourceUrl + adminInterface
        + "insertPiplineAndNodeDef" + '?' + "pipelinename=" + $scope.pipelineName +
        "&pipeline_type=" + $scope.pipelineType + "&package_type=" + 
        $scope.packageType + "&pipeline_owner=" + $scope.pipelineOwner +
        "&module_id=" + module;

        var nodeList = {};
        nodeList.node = JSON.stringify($scope.nodeList);

        $.ajax({
            type : "POST",
            url : createPipelineUrl,
            cache : false,
            dataType : "jsonp",
            jsonp : "callback",
            jsonpCallback : "jsonpcallback",
            data: nodeList,
            success: function(data){
                $scope.showSpinner = false;
            }
        });
    };

    $scope.createModule = function (enable1,enable2){

        if($scope.firstStep){
            if(enable1){
                $scope.showErrorMessage = true;
                return true;
            }
            $scope.createBaseModuleInfo();

        }else{
            if(enable2){
                $scope.showErrorMessage = true;
                return true;
            }
            if($scope.nodeList.length == 0){
                $scope.showErrorMessage = true;
                $scope.errorMessage = "请填加节点信息！";
                return true;
            }
            $scope.module_id = $scope.createBaseModuleInfo();
        }
    };

    $scope.addNode = function (){
        var nodeList = {
            "job_url"           : $scope.jobUrl,
            "name"              : $scope.jobName,
            "type"              : $scope.nodesType,
            "start_next_node"   : $scope.start_next_node,
            "test_type"         : $scope.testType,
            "notification_mail" : $scope.mailList
        };
        console.log(nodeList);
        $scope.nodeList.push(nodeList);
        $scope.jobUrl = "";
        $scope.jobName = "";
        $scope.nodesType = "";
        $scope.start_next_node = "";
        $scope.testType =  "";
        $scope.mailList = "";
        $scope.cancelAdd();
    };

    $scope.cancelAdd = function (){
        $scope.showNodeForm = false;
        $scope.showBtn = true;
    };

    $scope.toSecondStep = function (){
        $scope.firstStep = false;
        $scope.secondStep = true;
        $scope.showErrorMessage = false;
    };

    $scope.toFirstStep = function (){
        $scope.firstStep = true;
        $scope.secondStep = false;
        $scope.showErrorMessage = false;
    };

    $scope.test = function (){
        $scope.nodeList = {};
        $scope.nodeList.node = "testnode";
        $scope.nodeList.node = [{"name":"test1", "grade":"level1"},
                            {"name":"test2", "grade":"level2"},
                            {"name":"test3", "grade":"level3"},
                            {"name":"test4", "grade":"level4"}
                            ];
        $scope.nodeList.node = JSON.stringify($scope.nodeList.node);
        $scope.nodeList.pipelinename = "atest";
        console.log(JSON.stringify($scope.nodeList));
        var testUrl = requestIp + dataSourceUrl + adminInterface + "insertPiplineAndNodeDef";
        $.ajax({
                type : "POST",
                url : testUrl,
                cache : false,
                dataType : "jsonp",
                jsonp : "callback",
                jsonpCallback : "jsonpcallback",
                data: $scope.nodeList,
                // data: JSON.stringify($scope.nodeList),
                success: function(data){
                    // alert(data);
                    console.log(data);
                }
        });
    };

});
