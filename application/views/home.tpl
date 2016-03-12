<!DOCTYPE html>
    <html lang="en" ng-app="configurationApp">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
    <head>
        <meta charset="UTF-8">
        <title>全配置管理平台</title>
        <link rel="shortcut icon" href="<%$baseUrl%>images/favicon.ico"/>
        <link rel="stylesheet" href="<%$baseUrl%>css/bootstrap.min.css">        
        <link rel="stylesheet" href="<%$baseUrl%>css/bootstrap-additions.min.css">

        <link rel="stylesheet" href="<%$baseUrl%>css/angular-motion.min.css">
        
        <link rel="stylesheet" href="<%$baseUrl%>css/bootstrap-dialog.min.css">
        <link rel="stylesheet" href="<%$baseUrl%>css/angular-xeditable.css">
        <link rel="stylesheet" href="<%$baseUrl%>css/ngDialog.min.css">
        <link rel="stylesheet" href="<%$baseUrl%>css/ngDialog-theme-default.min.css">
        <link rel="stylesheet" href="<%$baseUrl%>css/configuration.css">
        <link rel="stylesheet" href="<%$baseUrl%>css/angular-chart.css">
    </head>
    <body ng-controller="defaultCtrl">

        <nav class="navbar navbar-inverse navbar-static-top" role="navigation">
            <div class="container-fluid">
                <div class="navbar-header">
                    <a id="logo" class="navbar-brand" href="javascript:void(0);"><img width='120px' src="<%$baseUrl%>images/logo.png" /></a>
                </div>
                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul class="nav navbar-nav">
                        <li><a class="navbar-brand" href="#" ng-click="clearSideMenu()"><span class="glyphicon glyphicon-home" aria-hidden="true"></span>&nbsp;&nbsp;首页&nbsp;&nbsp;</a></li>
                        <li><a class="navbar-brand" ui-sref="allprojectlist" ng-click="clearSideMenu()"><span class="glyphicon glyphicon-th-large" aria-hidden="true"></span>&nbsp;&nbsp;项目发布与回滚&nbsp;&nbsp;</a></li>
                        <li class="dropdown">
                            <a href="" class="dropdown-toggle navbar-brand" data-toggle="dropdown" role="button" aria-expanded="false"><span class="glyphicon glyphicon-stats" aria-hidden="true"></span>&nbsp;&nbsp;信息统计&nbsp;&nbsp;</a>
                            <ul class="dropdown-menu" role="menu">
                                <li><a ui-sref="moduleversion" ng-click="clearSideMenu()">所有模块当前线上版本</a></li>
                                <li><a ui-sref="moduleversion" ng-click="clearSideMenu()">其它</a></li>
                            </ul>
                        </li>
                        <li><a class="navbar-brand" ui-sref="information" ng-click="clearSideMenu()"><span class="glyphicon glyphicon-cog" aria-hidden="true"></span>&nbsp;&nbsp;信息维护&nbsp;&nbsp;</a></li>
                    </ul>
                    <ul class="nav navbar-nav navbar-right">
                        <li class="dropdown">
                            <a href="" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><span class="glyphicon glyphicon-user" aria-hidden="true"></span>&nbsp;&nbsp;<%$userName%><span class="caret"></span></a>
                            <ul class="dropdown-menu" role="menu">
                                <li><a href=""><span class="glyphicon glyphicon-book" aria-hidden="true"></span>&nbsp;&nbsp;我的发布</a></li>
                                <li><a href=""><span class="glyphicon glyphicon-paperclip" aria-hidden="true"></span>&nbsp;&nbsp;与我相关</a></li>
                                <li><a href="http://login.intra.weibo.com/logout.php?url=http://scm.intra.weibo.com"><span class="glyphicon glyphicon-log-out" aria-hidden="true"></span>&nbsp;&nbsp;退出</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <hr style="filter:alpha(opacity=0,finishopacity=50,style=1);background-color:#FF0000;height:3px" />

        <div class="col-md-2">
            <div class="list-group" id="menu">
                <div class="panel panel-danger">
                    <div class="panel-heading">
                        <h3 class="panel-title">SCM全配置管理平台</h3>
                    </div>
                    <a ng-repeat="item in menuList" ng-click="selectMenu(item)" ng-class="getSelectedMenu(item)" ui-sref="{{item.url}}" class="list-group-item" ng-cloak><span class="glyphicon {{item.icon}}" aria-hidden="true"></span>&nbsp;&nbsp;&nbsp;&nbsp;{{item.name}}</a>
                </div>
            </div>
            <div class="row col-md-2" ng-if="menuSpinner">
                <div spinner-loading></div>
            </div>
        </div>
        <div class="col-md-10">
            <div ui-view></div>
        </div>
</body>
<script type="text/javascript">
    var baseUrl = "<%$baseUrl%>";
    var userName = "<%$userName%>";
    var requestIp  = "<%$requestIp%>";
</script>

<script type="text/javascript" src="<%$baseUrl%>js/jquery.min.js"></script>
<script type="text/javascript" src="<%$baseUrl%>js/bootstrap.min.js"></script>
<script src="<%$baseUrl%>js/angular/angular.js"></script>
<script src="<%$baseUrl%>js/angular/angular-ui-router.js"></script>
<script src="<%$baseUrl%>js/angular/angular-xeditable.js"></script>
<script src="<%$baseUrl%>js/angular/angular-animate.js"></script>
<script src="<%$baseUrl%>js/angular/angular-strap.min.js"></script>
<script src="<%$baseUrl%>js/angular/angular-strap.tpl.min.js"></script>
<script src="<%$baseUrl%>js/ngjs/app.js"></script>
<script src="<%$baseUrl%>js/ngjs/controller-home.js"></script>
<script src="<%$baseUrl%>js/ngjs/controller.js"></script>
<script src="<%$baseUrl%>js/ngjs/controller-pipeline.js"></script>
<script src="<%$baseUrl%>js/ngjs/controller-admin.js"></script>
<script src="<%$baseUrl%>js/ngjs/controller-wiki.js"></script>
<script src="<%$baseUrl%>js/ngjs/controller-contact.js"></script>
<script src="<%$baseUrl%>js/ngjs/filter.js"></script>
<script src="<%$baseUrl%>js/ngjs/directive.js"></script>
<script src="<%$baseUrl%>js/bootstrap-dialog.min.js"></script>
<script src="<%$baseUrl%>js/ngjs/controller-mypipeline.js"></script>
<script src="<%$baseUrl%>js/ngjs/controller-pipelinedetail.js"></script>
<script src="<%$baseUrl%>js/ngjs/controller-information.js"></script>
<script src="<%$baseUrl%>js/ngjs/controller-history.js"></script>
<script src="<%$baseUrl%>js/ngjs/controller-historydetail.js"></script>
<script src="<%$baseUrl%>js/ngjs/controller-moduleversion.js"></script>
<script src="<%$baseUrl%>js/ngjs/controller-modulepermission.js"></script>
<script src="<%$baseUrl%>js/ngjs/controller-moduleinfo.js"></script>
<script src="<%$baseUrl%>js/ngjs/controller-createmodule.js"></script>
<script src="<%$baseUrl%>js/ngDialog.min.js"></script>
<script src="<%$baseUrl%>js/Chart.js"></script>
<script src="<%$baseUrl%>js/angular-chart.min.js"></script>

<script type="text/javascript">
    $(function () {
    var ie6 = document.all;
    var dv = $('#menu'), st;
    dv.attr('otop', dv.offset().top);
    $(window).scroll(function () {
        st = Math.max(document.body.scrollTop || document.documentElement.scrollTop);
        if (st > parseInt(dv.attr('otop'))) {
            if (ie6) {
                dv.css({ position: 'absolute', top: st });
            }
            else if (dv.css('position') != 'fixed') dv.css({ 'position': 'fixed', top: 0 });
            } else if (dv.css('position') != 'static') dv.css({ 'position': 'static' });
        });
    });
</script>

</html>
<script type="text/javascript" src="js/custom.js"></script>