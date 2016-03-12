angular.module("configurationApp")
.directive('flowMap', [function () {
    return {
        restrict: 'AE',
        templateUrl: baseUrl + '/js/pages/flow.html',
        controller: "pipelineDetailCtrl"
    };
}])
.directive('alertBox', [function () {
    return {
        restrict: 'AE',
        templateUrl: baseUrl + 'js/pages/alert.html',
        link: function (scope, iElement, iAttrs) {
            scope.alertBox.type = iAttrs["alertBox"];
            scope.alertBox.message = scope.alertMessage[iAttrs['message']];
        },
        controller: "pipelineDetailCtrl"
    };
}])
.directive('spinnerLoading', [function () {
    return {
        restrict: 'AE',
        templateUrl: baseUrl + 'js/pages/spinner.html',
    };
}])
.directive('showSlide', function() {
    return {
        restrict: 'A',
        link: function(scope, elem, attr) {
            scope.$watch(attr.showSlide, function(v) {
                if(v && !elem.is(':visible')) {
                    elem.slideDown();
                }else {
                    elem.slideUp();
                }
            });
        }
    }
});