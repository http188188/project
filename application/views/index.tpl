<!DOCTYPE html>
<html lang="en" ng-app="configurationApp">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!-- Meta, title, CSS, favicons, etc. -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>全配置管理平台 - 新浪微博</title>

    <!-- Bootstrap core CSS -->

    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/bootstrap-datetimepicker.css" rel="stylesheet">

    <link href="fonts/css/font-awesome.min.css" rel="stylesheet">
    <link href="css/animate.min.css" rel="stylesheet">

    <!-- Custom styling plus plugins -->
    <link href="css/custom.css" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="css/maps/jquery-jvectormap-2.0.1.css" />
    <link href="css/icheck/flat/green.css" rel="stylesheet" />
    <link href="css/floatexamples.css" rel="stylesheet" type="text/css" />

    <script src="js/jquery.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/bootstrap-datetimepicker.fr.js"></script>
    <script src="js/bootstrap-datetimepicker.js"></script>
    <script src="js/bootstrap-datetimepicker.min.js"></script>
    
    <link rel="stylesheet" href="css/bootstrap-additions.min.css">

    <link rel="stylesheet" href="css/angular-motion.min.css">
    
    <link rel="stylesheet" href="css/bootstrap-dialog.min.css">
    <link rel="stylesheet" href="css/angular-xeditable.css">
    <link rel="stylesheet" href="css/ngDialog.min.css">
    <link rel="stylesheet" href="css/ngDialog-theme-default.min.css">
    <link rel="stylesheet" href="css/configuration.css">
    <link rel="stylesheet" href="css/angular-chart.css">

    <script src="js/nprogress.js"></script>
    <script>
        NProgress.start();
    </script>
    
    <!--[if lt IE 9]>
        <script src="../assets/js/ie8-responsive-file-warning.js"></script>
        <![endif]-->

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
          <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
          <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
        <![endif]-->

</head>


<body class="nav-md" ng-controller="defaultCtrl">

    <div class="container body">

        <div class="main_container">

            <div class="col-md-3 left_col">
                <div class="left_col scroll-view">

                    <div class="navbar nav_title" style="border: 0;">
                        <a href="<%$baseUrl%>" class="site_title">
                            <img src="images/weibo.png" width='30px'>
                            <span align="center">全配置管理平台</span>
                        </a>
                    </div>
                    <div class="clearfix"></div>                        

                    <!-- menu prile quick info -->
                    <div class="profile">
                        <div class="profile_pic">
                            <img src="images/user.png" alt="..." class="img-circle profile_img">
                        </div>
                        <div class="profile_info">
                            <span>Welcome,</span>
                            <h2><%$userName%></h2>
                        </div>
                    </div>
                    <!-- /menu prile quick info -->

                    <br />

                    <!-- sidebar menu -->
                    <div id="sidebar-menu" class="main_menu_side hidden-print main_menu">

                        <div class="menu_section">
                            <h3>&nbsp;</h3>
                            <ul class="nav side-menu">
                                <li><a href="<%$baseUrl%>"><i class="fa fa-home"></i>首页</a></li>
                                <li><a><i class="fa fa-windows"></i>项目发布<span class="fa fa-chevron-down"></span></a>
                                    <ul class="nav child_menu" style="display: none">
                                        <li><a ui-sref="mypipeline">所有发布</a>
                                        </li>
                                        <li><a ui-sref="ongoingpipeline">进行中的发布</a>
                                        </li>
                                    </ul>
                                </li>
                                <li><a><i class="fa fa-bar-chart-o"></i> 信息系统 <span class="fa fa-chevron-down"></span></a>
                                    <ul class="nav child_menu" style="display: none">
                                        <li><a a ui-sref="moduleversion">信息统计</a>
                                        </li>
                                        <li><a href="js/page/statistic-code.html">图表信息</a>
                                        </li>
                                        <li><a href="tables_dynamic.html">信息维护</a>
                                        </li>
                                    </ul>
                                </li>
                                <li><a><i class="fa fa-edit"></i> SCM WIKI <span class="fa fa-chevron-down"></span></a>
                                    <ul class="nav child_menu" style="display: none">
                                        <li><a href="form.html">Git</a>
                                        </li>
                                        <li><a href="form_advanced.html">SVN</a>
                                        </li>
                                        <li><a href="form_validation.html">QuickBuild</a>
                                        </li>
                                    </ul>
                                </li>
                                <li><a><i class="fa fa-table"></i> 其它 <span class="fa fa-chevron-down"></span></a>
                                    <ul class="nav child_menu" style="display: none">
                                        <li><a href="echarts.html"> 管理 </a>
                                        </li>
                                        <li><a href="other_charts.html"> 设置 </a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!-- /sidebar menu -->

                    <!-- /menu footer buttons -->
                    <div class="sidebar-footer hidden-small">
                        <a data-toggle="tooltip" data-placement="top" title="退出" href="http://login.intra.weibo.com/logout.php?url=http://scm.intra.weibo.com">
                            <span class="glyphicon glyphicon-off" aria-hidden="true"></span>
                        </a>
                    </div>
                    <!-- /menu footer buttons -->
                </div>
            </div>

            <!-- top navigation -->
            <div class="top_nav">

                <div class="nav_menu">
                    <nav class="" role="navigation">
                        <div class="nav toggle">
                            <a id="menu_toggle"><i class="fa fa-bars"></i></a>
                        </div>

                        <ul class="nav navbar-nav navbar-right">
                            <li class="">
                                <a href="javascript:;" class="user-profile dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                    <img src="images/user.png" alt=""><%$userName%>
                                    <span class=" fa fa-angle-down"></span>
                                </a>
                                <ul class="dropdown-menu dropdown-usermenu animated fadeInDown pull-right">
                                    <li>
                                        <a href="javascript:void(0);">帮助</a>
                                    </li>
                                    <li><a href="http://login.intra.weibo.com/logout.php?url=http://scm.intra.weibo.com"><i class="fa fa-sign-out pull-right"></i>退出</a>
                                    </li>
                                </ul>
                            </li>
                            <!--
                            <li role="presentation" class="dropdown">
                                <a href="javascript:;" class="dropdown-toggle info-number" data-toggle="dropdown" aria-expanded="false">
                                    <i class="fa fa-envelope-o"></i>
                                    <span class="badge bg-green">6</span>
                                </a>
                                <ul id="menu1" class="dropdown-menu list-unstyled msg_list animated fadeInDown" role="menu">
                                    <li>
                                        <a>
                                            <span class="image">
                                        <img src="images/user.png" alt="Profile Image" />
                                    </span>
                                            <span>
                                        <span>John Smith</span>
                                            <span class="time">3 mins ago</span>
                                            </span>
                                            <span class="message">
                                        Film festivals used to be do-or-die moments for movie makers. They were where... 
                                    </span>
                                        </a>
                                    </li>
                                    <li>
                                        <a>
                                            <span class="image">
                                        <img src="images/user.png" alt="Profile Image" />
                                    </span>
                                            <span>
                                        <span>John Smith</span>
                                            <span class="time">3 mins ago</span>
                                            </span>
                                            <span class="message">
                                        Film festivals used to be do-or-die moments for movie makers. They were where... 
                                    </span>
                                        </a>
                                    </li>
                                    <li>
                                        <a>
                                            <span class="image">
                                        <img src="images/user.png" alt="Profile Image" />
                                    </span>
                                            <span>
                                        <span>John Smith</span>
                                            <span class="time">3 mins ago</span>
                                            </span>
                                            <span class="message">
                                        Film festivals used to be do-or-die moments for movie makers. They were where... 
                                    </span>
                                        </a>
                                    </li>
                                    <li>
                                        <a>
                                            <span class="image">
                                        <img src="images/user.png" alt="Profile Image" />
                                    </span>
                                            <span>
                                        <span>John Smith</span>
                                            <span class="time">3 mins ago</span>
                                            </span>
                                            <span class="message">
                                        Film festivals used to be do-or-die moments for movie makers. They were where... 
                                    </span>
                                        </a>
                                    </li>
                                    <li>
                                        <div class="text-center">
                                            <a>
                                                <strong><a href="inbox.html">See All Alerts</strong>
                                                <i class="fa fa-angle-right"></i>
                                            </a>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                            -->

                        </ul>
                    </nav>
                </div>

            </div>
            <!-- /top navigation -->


            <!-- page content -->
            <div class="right_col" role="main">
                <div ui-view></div>
            </div>
            <!-- /page content -->

        </div>

    </div>
    
    <script type="text/javascript">
        var baseUrl = "<%$baseUrl%>";
        var userName = "<%$userName%>";
        var requestIp  = "<%$requestIp%>";
    </script>

    

    <script src="js/bootstrap.min.js"></script>
    <script src="js/angular/angular.js"></script>
    <script src="js/angular/angular-ui-router.js"></script>
    <script src="js/angular/angular-xeditable.js"></script>
    <script src="js/angular/angular-animate.js"></script>
    <script src="js/angular/angular-strap.min.js"></script>
    <script src="js/angular/angular-strap.tpl.min.js"></script>
    <script src="js/ngjs/app.js"></script>
    <script src="js/ngjs/controller-home.js"></script>
    <script src="js/ngjs/controller.js"></script>
    <script src="js/ngjs/controller-pipeline.js"></script>
    <script src="js/ngjs/controller-admin.js"></script>
    <script src="js/ngjs/controller-wiki.js"></script>
    <script src="js/ngjs/controller-contact.js"></script>
    <script src="js/ngjs/filter.js"></script>
    <script src="js/ngjs/directive.js"></script>
    <script src="js/bootstrap-dialog.min.js"></script>
    <script src="js/ngjs/controller-mypipeline.js"></script>
    <script src="js/ngjs/controller-pipelinedetail.js"></script>
    <script src="js/ngjs/controller-information.js"></script>
    <script src="js/ngjs/controller-history.js"></script>
    <script src="js/ngjs/controller-historydetail.js"></script>
    <script src="js/ngjs/controller-moduleversion.js"></script>
    <script src="js/ngjs/controller-modulepermission.js"></script>
    <script src="js/ngjs/controller-moduleinfo.js"></script>

    <script src="js/ngjs/controller-createmodule.js"></script>
    <script src="js/ngDialog.min.js"></script>
    <script src="js/Chart.js"></script>
    <script src="js/angular-chart.min.js"></script>

    <!-- chart js -->
    <script src="js/chartjs/chart.min.js"></script>
    <!-- bootstrap progress js -->
    <script src="js/nicescroll/jquery.nicescroll.min.js"></script>
    <!-- icheck -->
    <script src="js/icheck/icheck.min.js"></script>
    <!-- daterangepicker -->
    <script type="text/javascript" src="js/moment.min.js"></script>

    <!-- flot js -->
    <!--[if lte IE 8]><script type="text/javascript" src="js/excanvas.min.js"></script><![endif]-->
    <script type="text/javascript" src="js/flot/jquery.flot.js"></script>
    <script type="text/javascript" src="js/flot/jquery.flot.pie.js"></script>
    <script type="text/javascript" src="js/flot/jquery.flot.orderBars.js"></script>
    <script type="text/javascript" src="js/flot/jquery.flot.time.min.js"></script>
    <script type="text/javascript" src="js/flot/date.js"></script>
    <script type="text/javascript" src="js/flot/jquery.flot.spline.js"></script>
    <script type="text/javascript" src="js/flot/jquery.flot.stack.js"></script>
    <script type="text/javascript" src="js/flot/curvedLines.js"></script>
    <script type="text/javascript" src="js/flot/jquery.flot.resize.js"></script>

    <!-- /footer content -->

    <script>
        NProgress.done();
    </script>
    
</body>
<script src="js/custom.js"></script>
</html>
