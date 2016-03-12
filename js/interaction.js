var packageType = "";
var defid = "";
var timeInterval = 2000;
var runningId;
var currentNode = -1;

var pipelineInstanceId = 0;

var btnTriggerUrl = 'http://10.210.230.79:9090/scm_plat_data/services/scmPlatPiplineService/platfromCiNodePostCallback?';

//  TODO get the Username of the login
var username = "jintao3";

$('document').ready(function(){
    var url = 'http://10.210.230.79:9090/scm_plat_data/services/scmPlatPiplineService/getAllModuleNameAndId';
    $.ajax({
            type : "GET",
            url : url,
            cache : false,
            dataType : "jsonp",
            jsonp : "callback",
            jsonpCallback : "jsonpcallback",
//          complete : function(){$("#load").hide();},
            success :addList,
            error : function(){
                $("#project").html("<option value='error'>发生错误</option>");
            }
          });
});

$("#project").change(function(){
    $("#pipeline").hide();

    var moduleId = $(this).val();
    var url = 'http://10.210.230.79:9090/scm_plat_data/services/scmPlatPiplineService/getPipelineListByModuleId?moduleId='+moduleId;
    
    $.ajax({
            type : "GET",
            url : url,
            cache : false,
            dataType : "jsonp",
            jsonp : "callback",
            jsonpCallback : "jsonpcallback",
//           complete : function(){$("#load").hide();},
            success :typeList,
            error : function(){
                $("#palertBox").show();
            }
          });
});

$("#flow").delegate('#start', 'click', function(){
    var war = $("#waraddr").val() != "";
    var rollback = $("#rollback").val() != "";

    if(war && rollback){
        $("#alertBox").slideUp();
        var url = "http://10.210.230.79:9090/scm_plat_data/services/scmPlatPiplineService/startPiplineByDefId"

        var releaseType = "";
        $("#select2 option").each(function(){
            releaseType += $(this).text() + ";";
        });
        releaseType = releaseType.substring(0,releaseType.length-1);

        var httpdata = packageType == "war"?{
                    packageType:  packageType,
                    piplineDefId: defid,
                    releaseWarUrl: $("#waraddr").val(),
                    rollBackWarUrl: $("#rollback").val(),
                    comments: $("#comments").val(),
                    operator: username,
                    releaseType: releaseType
                }:{};
        var jsonString = JSON.stringify(httpdata);
        $.ajax({
                type : "POST",
                url : url,
                cache : false,
                dataType : "jsonp",
                jsonp : "callback",
                jsonpCallback : "jsonpcallback",
                data: httpdata,
                success :startPipeline,
                error : function(){
                $("#startalert").html('<div class="row" id="alertBox"><div class="col-md-6"><div class="alert alert-danger alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button><p>无法启动该Pipeline流程！</p></div></div></div>');
                }
        });
    }
    else{
        checkValid();
    }
    return false;
});

$("#detail").delegate('.review', 'click', function(){
    var rowRun = $(this).parent().parent().find(".defid");
    defid = rowRun.text();
    packageType = rowRun.attr('types');

    if(packageType == "war") {
        $("#parameter").show();
    }
    else{

        //TODO if any other package type
    }

    var url = "http://10.210.230.79:9090/scm_plat_data/services/scmPlatPiplineService/viewPiplineByDefId?user="+username+"&piplineDefId="+defid+"&packageType="+packageType;
    $.ajax({
            type : "GET",
            url : url,
            cache : false,
            dataType : "jsonp",
            jsonp : "callback",
            jsonpCallback : "jsonpcallback",
//           complete : function(){$("#load").hide();},
            success :flowList,
            error : function(){
                $("#pipealert").slideDown();
            }
          });
});

function flowList(data){
    $("#pipealert").slideUp();

    if(data.node.length != 0){

        var strsAll= new Array();
        strsAll=data.allReleaseType.split(";");
        var alloptions = "";

        var strs = new Array();
        if(data.releaseType != ""){
            
            strs = data.releaseType.split(";");
            var options = "";
            $.each(strs, function(i, val){
                options += "<option value='"+val+"'>"+val+"</option>";
            })
            $("#select2").html(options);
        }

        $.each(strsAll, function(i, val){
            if($.inArray(val, strs) == -1){
                alloptions += "<option value='"+val+"'>"+val+"</option>";
            }
        });

        $("#select1").html(alloptions);
        var startIcon = "label-warning";
        var startT    = "点击启动";
        if(data.pipline_status == "on-going"){
            startIcon = "label-success";
            startT    = "已启动";
        }
        var flowContent = '<div class="col-md-1"><div class="row row-c"><span id="startBtn" class="label '+startIcon+'">'+startT+'</span></div><div class="row"><a id="start" href="javascript:void(0)"><img src="'+baseUrl+'/images/pipeline_start.png" /></a></div></div>';
        flowContent += '<div class="col-md-1 col-md-1-s"><div class="row row-s"><img id="tostart" width="40px" src="'+baseUrl+'/images/to_not_start.png" /></div></div>';
    var testArea = [];
        $.each(data.node, function(i, val){
        if($("#myTab>li").length < data.node.length){
                $("#myTab").append('<li id=tab'+i+'><a href="#'+i+'" data-toggle="tab">'+val.name+'</a></li>');
                $("#myTabContent").append('<div role="tabpanel" class="tab-pane in" id="'+i+'"><textarea class="form-control" id=textarea'+i+' disabled="disabled" rows=10></textarea></div>');
        }
            var nodeType = val.type;
            if(nodeType.substring(0,4) == "test"){
        testArea.push(val);
            }
            var nodeImagePath = baseUrl+"/images/node_"+val.status+".png";
            var toImagePath   = baseUrl+"/images/to_not_start.png";
            var statusText    = "未启动";
            var icon          = "label-default";
            if(val.status == "success") {
                statusText = "已完成(成功)";
                icon       = "label-success";
                toImagePath = baseUrl+"/images/to_success.png";
            }
            if(val.status == "fail"){
                statusText = "已完成(失败)";
                icon       = "label-danger";
            }
            if(val.status == "on-going") {
                statusText = "进行中";
                icon       = "label-primary";
            }

            flowContent += '<div class="col-md-1"><div class="row"><span class="label label-warning">'+val.name+'</span></div><div class="row"><img width="72px" id="node'+i+ '" src="'+nodeImagePath+'" /></div><div class="row"><span id="label'+i+'" class="label '+icon+'">'+statusText+'</span></div></div>';
            flowContent += '<div class="col-md-1 col-md-1-s"><div class="row row-s"><img id="tostart'+i+'" width="40px" src="'+toImagePath+'" /></div></div>';
        });
        
        flowContent += '<div class="col-md-1"><div class="row row-c"><span id="endLabel" class="label label-warning">结束</span></div><div class="row"><img id="end" src="'+baseUrl+'/images/pipeline_not_start.png" /></a></div></div>';

        $("#flow").html(flowContent);
        if(data.pipline_status == "on-going" || !data.whether_to_start ){
            
            $("#flow").unbind("click");
            $('#parameter').undelegate();
            disstart();
        }
        if(!data.whether_to_start){
            $("#start img").attr("src", baseUrl+"/images/pipeline_start_noright.png");
        }
        $("#pipeline").slideDown();

        if(data.pipline_status == "on-going"){
        if(false){addLogTab(data);}

        $("#btns").setTemplateURL(baseUrl+"/test/getButtonGroup?data="+(+new Date()),null,{filter_data: true});
        $("#btns").processTemplate(testArea);
        $("#btns").slideDown();

            getOngoingRecord(data);
            updateInfo(data.pipline_case_id);
            $("#flowlog").show();
            $("#tostart").attr("src", baseUrl+"/images/to_success.png");
        }

    }else{

        alert("此Pipeline还未创建！");

    }
}

function addLogTab(data){

    $.each(data.node, function(i, val){
        if(val.status != "open"){
            var activePannel = "";
            if(val.status == "on-going"){
        $("#tab"+i).addClass("active");
        $("#"+i).addClass("active");
        }

            if(val.job_log_url != ""){
                var url = "http://10.210.230.79:9090/scm_plat_data/services/scmPlatPiplineService/getLogUrlContent?logUrl="+val.job_log_url;
                $.ajax({
                    type : "GET",
                    url : url,
                    cache : false,
                    dataType : "jsonp",
                    jsonp : "callback",
                    jsonpCallback : "jsonpcallback",
                    success : function(result){$("#textarea"+i).html(result.log);},
                    error : function(msg){console.log(msg);}
                });
            }
        }
    });
}


function getOngoingRecord(data){

    $("#waraddr").val(data.releaseWarUrl);
    $("#rollback").val(data.rollBackWarUrl);
    $("#comments").val(data.comments);
}

function addList(data){

    $.each(data,function(i,val)
    {
        $("#project").append("<option value='"+val.moduleId+"'>"+val.moduleName+"</option>");
    });
}

function typeList(data){
    $("#palertBox").hide();
    var detail = "";
    $.each(data, function(i,val){
        detail += "<tr><td class='defid' types='"+val.package_type+"'>"+val.id+"</td><td>"+val.name+"</td><td><button type='button' class='btn btn-primary btn-xs review'>查看</button></td></tr>";
    });
    $("#detail").html(detail);
    $("#type").slideDown();
//  $("#pipeline").hide();
}

$("#parameter").delegate('#waraddr', 'blur', function(){
    // $("#waraddr").blur(function(){
    var war = $("#waraddr").val() != "";
    var rollback = $("#rollback").val() != "";
    if(!war){
        $("#labelwar").removeClass("label-primary");
        $("#labelwar").addClass("label-danger");
        $("#alertBox").slideDown();
    }else{
        $("#labelwar").removeClass("label-danger");
        $("#labelwar").addClass("label-primary");
        if(rollback){
            $("#alertBox").slideUp();
        }
    }
});

$("#parameter").delegate('#rollback', 'blur', checkValid);

function checkValid(){
    var war = $("#waraddr").val() != "";
    var rollback = $("#rollback").val() != "";

    if(!war){
        $("#labelwar").removeClass("label-primary");
        $("#labelwar").addClass("label-danger");
        $("#alertBox").slideDown();

    }else{

        $("#labelwar").removeClass("label-danger");
        $("#labelwar").addClass("label-primary");
    }

    if(!rollback){
        $("#labelroll").removeClass("label-primary");
        $("#labelroll").addClass("label-danger");
        $("#alertBox").slideDown();

    }else{

        $("#labelroll").removeClass("label-danger");
        $("#labelroll").addClass("label-primary");
    }
    if(war && rollback){
        $("#alertBox").slideUp();
    }
}

function disstart(){
    $("#waraddr").attr("readonly","readonly");
    $("#rollback").attr("readonly", "readonly");
    $("#comments").attr("readonly", "readonly");
    $("#select1").attr("readonly", "readonly");
    $("#select2").attr("readonly", "readonly");
    $(".selbut").attr("disabled","disabled");
}

function startPipeline(data){
    if(data.pipline_case_id != 0){
        $("#flow").unbind("click");

        $("#startBtn").text("已启动");
        $("#startBtn").removeClass("label-warning");
        $("#startBtn").addClass("label-success");

        $("#startalert").hide();
        disstart();
        $("#start").attr("disabled","true");
        $("#tostart").attr("src", baseUrl+"/images/to_success.png");
        $("#flowlog").show();

    var testArea= [];
    $.each(data.node, function(i,val){
        
            var nodeType = val.type;
            if(nodeType.substring(0,4) == "test"){
            testArea.push(val);
            }
    });
    $("#btns").setTemplateURL(baseUrl+"/test/getButtonGroup?data="+(+new Date()),null,{filter_data: true});
    $("#btns").processTemplate(testArea);
    $("#btns").slideDown();
    
        //TODO
        // 判断如果data 为-1  处理exception
        updateInfo(data.pipline_case_id);
    }
    else{
        alert("启动pipeline无法获取实例id, 无法启动该Pipeline！");
    }
}

function updateInfo(instanceId)
{
    if(pipelineInstanceId == 0){
        pipelineInstanceId = instanceId;
    }
    var int = setInterval(function(counter){
        var url = "http://10.210.230.79:9090/scm_plat_data/services/scmPlatPiplineService/getPiplineCaseJsonById?pipelineCaseId="+instanceId;
        $.ajax({
            type : "GET",
            url : url,
            cache : false,
            dataType : "jsonp",
            jsonp : "callback",
            jsonpCallback : "jsonpcallback",
//           complete : function(){$("#load").hide();},
            success :function (data)
            {

                changeStatus(data);
                printNodeLog(data);

                if(data.pipline_status != "on-going"){
                $(".btn-block").attr("disabled","disabled");
                    int = window.clearInterval(int);
                }
            },
            error : function(){alert("获取Pipeline实例数据出错！");}
        });
    },timeInterval);
}

function changeStatus(data){
    $.each(data.node, function(i, val){

        if(val.status == "on-going"){
            runningId   = val.id;
        $("#pass"+val.id).removeAttr("disabled");
        $("#fail"+val.id).removeAttr("disabled");
        }else{
            $("#pass"+val.id).attr("disabled","disabled");
            $("#fail"+val.id).attr("disabled","disabled");
    }
        

        $("#node"+ i).attr("src",baseUrl+"/images/node_"+val.status+".png");
        if(val.status == "success"){
            $("#tostart" + i).attr("src",baseUrl+"/images/to_success.png");
            $("#label" + i).text("已完成(成功)");
            $("#label" + i).removeClass("label-default");
            $("#label" + i).addClass("label-success");
        } else if(val.status == "fail"){
            $("#tostart" + i).attr("src",baseUrl+"/images/to_success.png");
            $("#label" + i).text("已完成(失败)");
            $("#label" + i).removeClass("label-default");
            $("#label" + i).addClass("label-danger");
        }else if(val.status == "on-going"){
            $("#label" + i).text("进行中");
            $("#label" + i).removeClass("label-default");
            $("#label" + i).addClass("label-primary");
        }
    });
    if(data.pipline_status == "success"){
        $("#end").attr("src",baseUrl+"/images/pipeline_success.png");
        $("#endLabel").removeClass("label-warning");
        $("#endLabel").addClass("label-success");
    }
    if(data.pipline_status == "fail"){
        $("#end").attr("src",baseUrl+"/images/pipeline_fail.png");
        $("#endLabel").removeClass("label-warning");
        $("#endLabel").addClass("label-danger");
    }
}

function printNodeLog(data){
    var log_url;
    var runningNode = -1;
    $.each(data.node, function(i,val){
            if(val.status == "on-going"){
                log_url = val.job_log_url;
            runningNode = i;
            if(currentNode == -1){
            currentNode = i;
            }
                return false;
        }
        });

    var logInterfaceUrl = "http://10.210.230.79:9090/scm_plat_data/services/scmPlatPiplineService/getLogUrlContent?logUrl=";
    if(runningNode != -1){
    if(currentNode != runningNode){
    var preLogUrl = data.node[currentNode];

    preLogUrl = preLogUrl.job_log_url;
    
        $.ajax({
            type : "GET",
            url : logInterfaceUrl + preLogUrl,
            cache : false,
            dataType : "jsonp",
            jsonp : "callback",
            jsonpCallback : "jsonpcallback",
            success :function(msg){
            $("#textarea"+currentNode).val(msg.log);
            currentNode = runningNode;
            },
            error : function(msg){
                // alert(msg);
                console.log("获取当前NODE LOG出错!");
            }
        });

    }

    $.ajax({
            type : "GET",
            url : logInterfaceUrl + log_url,
            cache : false,
            dataType : "jsonp",
            jsonp : "callback",
            jsonpCallback : "jsonpcallback",
            success :function(msg){
            $("#textarea"+runningNode).val(msg.log);
        },
            error : function(){alert("获取当前NODE LOG1出错!");}
        });
    }
}

$('#add').click(function() {
    $('#select1 option:selected').appendTo('#select2');
});
$('#remove').click(function() {
    $('#select2 option:selected').appendTo('#select1');
});
$('#add_all').click(function() {
    $('#select1 option').appendTo('#select2');
});
$('#remove_all').click(function() {
    $('#select2 option').appendTo('#select1');
});
$('#select1').dblclick(function(){
    $("option:selected",this).appendTo('#select2');
});
$('#select2').dblclick(function(){
   $("option:selected",this).appendTo('#select1');
});

function getHookResult(Url){
    $.ajax({
            type : "GET",
            url : Url,
            cache : false,
            dataType : "jsonp",
            jsonp : "callback",
            jsonpCallback : "jsonpcallback",
//           complete : function(){$("#load").hide();},
            success : function(msg){
            if(msg.result == "fail"){alert("Already clicked by other people,Please wait!")}
        },
            error : function(msg){
                  alert(msg.message);
            }
          });
}

$("#btns").delegate('.btn-pass', 'click', function(){
    var passUrl = btnTriggerUrl + "result=success&pipelineCaseId="+pipelineInstanceId+"&nodeCaseId="+runningId;
    getHookResult(passUrl);
    $(this).attr("disabled","disabled").removeClass("btn-primary").addClass("btn-success");
    $(this).parents().find(".btn-fail").attr("disabled","disabled");
});

$("#btns").delegate('.btn-fail', 'click', function(){
    var failUrl = btnTriggerUrl + "result=fail&pipelineCaseId="+pipelineInstanceId+"&nodeCaseId="+runningId;
    getHookResult(failUrl);
    $(this).attr("disabled","disabled").removeClass("btn-primary").addClass("btn-danger");
    $(this).parents().find(".btn-pass").attr("disabled","disabled");
});
