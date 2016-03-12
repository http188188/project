angular.module("configurationApp")
.controller('homeCtrl', function ($scope, $http, 
    dataSourceUrl, dataServiceInterface, jsonpCallback){

    $scope.showSpinner = true;
    $scope.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    $scope.seriesOnline = ['2014 Online', '2015 Online'];
    $scope.seriesRollback = ['2014 Rollback', '2015 Rollback'];

    $scope.getStatistics = function (){
        var getStatisticUrl = requestIp + dataSourceUrl + dataServiceInterface +
    "releaseAndRollBackNum?" + jsonpCallback;
        $http.jsonp(getStatisticUrl)
        .success(function(data){
            $scope.showSpinner = false;
            $scope.dataNew = data[0];
            $scope.dataOld = data[1];
            // $scope.dataNewOnline = data[0].month_release;
            // $scope.dataNewRollback = data[0].month_rollback;
            // $scope.dataOldOnline = data[1].month_release;
            // $scope.dataOldRollback = data[1].month_rollback;
            $scope.dataChartOnline = [data[1].month_release, data[0].month_release];
            $scope.dataChartRollback = [data[1].month_rollback, data[0].month_rollback];
            // $scope.dataNewChart = [$scope.dataNewOnline, $scope.dataNewRollback];
            // $scope.dataOldChart = [$scope.dataOldOnline, $scope.dataOldRollback];

            var barChartData1 = {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                datasets: [
                    {
                        fillColor: "#26B99A", //rgba(220,220,220,0.5)
                        strokeColor: "#26B99A", //rgba(220,220,220,0.8)
                        highlightFill: "#36CAAB", //rgba(220,220,220,0.75)
                        highlightStroke: "#36CAAB", //rgba(220,220,220,1)
                        data: data[1].month_release
                    },
                    {
                        fillColor: "#03586A", //rgba(151,187,205,0.5)
                        strokeColor: "#03586A", //rgba(151,187,205,0.8)
                        highlightFill: "#066477", //rgba(151,187,205,0.75)
                        highlightStroke: "#066477", //rgba(151,187,205,1)
                        data: data[0].month_release
                    }
                ],
            }

            var barChartData2 = {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                datasets: [
                    {
                        fillColor: "#26B99A", //rgba(220,220,220,0.5)
                        strokeColor: "#26B99A", //rgba(220,220,220,0.8)
                        highlightFill: "#36CAAB", //rgba(220,220,220,0.75)
                        highlightStroke: "#36CAAB", //rgba(220,220,220,1)
                        data: data[1].month_rollback
                    },
                    {
                        fillColor: "#03586A", //rgba(151,187,205,0.5)
                        strokeColor: "#03586A", //rgba(151,187,205,0.8)
                        highlightFill: "#066477", //rgba(151,187,205,0.75)
                        highlightStroke: "#066477", //rgba(151,187,205,1)
                        data: data[0].month_rollback
                    }
                ],
            }

            new Chart($("#canvas_bar").get(0).getContext("2d")).Bar(barChartData1, {
                    tooltipFillColor: "rgba(51, 51, 51, 0.55)",
                    responsive: true,
                    barDatasetSpacing: 6,
                    barValueSpacing: 5
                });
            new Chart($("#canvas_bar_roll").get(0).getContext("2d")).Bar(barChartData2, {
                    tooltipFillColor: "rgba(51, 51, 51, 0.55)",
                    responsive: true,
                    barDatasetSpacing: 6,
                    barValueSpacing: 5
                });

        }).error(function(){
            $scope.showSpinner = false;
            BootstrapDialog.show({
                    type   : BootstrapDialog.TYPE_DANGER,
                    title  : 'Notice',
                    message: '获取统计数据错误!'
                });
        });
    };

});