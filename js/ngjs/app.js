angular.module("configurationApp",["ngDialog","ngAnimate","ui.router","xeditable","mgcrea.ngStrap","chart.js"])
.constant('dataSourceUrl', '/scm_plat_data/services/')
.constant('pipelineInterface', 'scmPlatPiplineService/')
.constant('releaseInterface', 'scmPlatReleaseService/')
.constant('rollbackInterface', 'scmPlatRollBackService/')
.constant('adminInterface', 'scmPlatAdminService/')
.constant('dataServiceInterface', 'scmPlatDataService/')
.constant('jsonpCallback', 'callback=JSON_CALLBACK')
.constant('timeInterval', 2000)
.config(['ChartJsProvider', function (ChartJsProvider) {
    ChartJsProvider.setOptions({
      colours: ['#9F0A80', '#18AF0', '#983570', '#809358']
    });
}])
.config(function ($stateProvider, $urlRouterProvider){

    $urlRouterProvider.otherwise('/home');

    $stateProvider.state('home',{
        url: '/home',
        templateUrl: baseUrl + 'js/page/home.html'
    }).state('allprojectlist', {
        url: '/allprojectlist',
        templateUrl: baseUrl + 'js/pages/allprojectlist.html'
    }).state('moduleversion', {
        url: '/moduleversion',
        templateUrl: baseUrl + 'js/page/statistic-moduleversion.html'
    }).state('statistic-code', {
        url: '/statistic-code',
        templateUrl: baseUrl + 'js/page/statistic-code.html'
    }).state('information', {
        url: '/information',
        templateUrl: baseUrl + 'js/pages/information.html'
    }).state('pipeline', {
        url: '/pipeline',
        templateUrl: baseUrl + 'js/pages/pipeline.html'
    }).state('wiki', {
        url: '/adminwiki',
        templateUrl: baseUrl + 'js/pages/wiki.html'
    }).state('mypipeline', {
        url: '/mypipeline',
        templateUrl: baseUrl + 'js/page/mypipeline.html'
    }).state('ongoingpipeline', {
        url: '/ongoingpipeline',
        templateUrl: baseUrl + 'js/page/ongoingpipeline.html'
    }).state('contact', {
        url: '/contact',
        templateUrl: baseUrl + 'js/pages/contact.html'
    }).state('pipelinedetail', {
        url: '/pipelinedetail/{state}/{name}/{id}/{package_type}/{moduleId}/{moduleVersion}/{rollbackVersion}/{release_package_url}',
        templateUrl: baseUrl + 'js/page/pipelinedetail.html'
    }).state('pipelinedetail.ongoing', {
        url: '/ongoing',
        templateUrl: baseUrl + 'js/pages/pipelinedetail-ongoing.html'
    }).state('pipelinedetail.history', {
        url: '/history',
        templateUrl: baseUrl + 'js/pages/pipelinedetail-history.html'
    }).state('pipelinedetail.historydetail', {
        url: '/historydetail/{pipelineCaseId}',
        templateUrl: baseUrl + 'js/pages/historydetail.html'
    }).state('admin', {
        url: '/admin',
        templateUrl: baseUrl + 'js/pages/admin.html'
    }).state('admin.permission',{
        url: '/permission',
        templateUrl: baseUrl + 'js/pages/permission.html'
    }).state('admin.adminwiki',{
        url: '/adminwiki',
        templateUrl: baseUrl + 'js/pages/adminwiki.html'
    }).state('admin.quickbuild', {
        url: '/quickbuild',
        templateUrl: baseUrl + 'js/pages/quickbuild.html'
    });
})
.animation('.slide', function() {
    var NG_HIDE_CLASS = 'ng-hide';
    return {
        beforeAddClass: function(element, className, done) {
            if(className === NG_HIDE_CLASS) {
                element.slideUp(done);
            }
        },
        removeClass: function(element, className, done) {
            if(className === NG_HIDE_CLASS) {
                element.hide().slideDown(done);
            }
        }
    }
});
