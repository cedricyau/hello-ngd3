angular.module('myApp', []).
   //camel cased directive name
   //in your HTML, this will be named as bars-chart
   directive('barsChart', function ($parse) {
     //explicitly creating a directive definition variable
     //this may look verbose but is good for clarification purposes
     //in real life you'd want to simply return the object {...}
     return {
         //We restrict its use to an element
         //as usually  <bars-chart> is semantically
         //more understandable
         restrict: 'E',
         //this is important,
         //we don't want to overwrite our directive declaration
         //in the HTML mark-up
         replace: true,
         //our data source would be an array
         //passed thru chart-data attribute
         scope: {data: '=chartData'},
         link: function (scope, element, attrs) {
             scope.render = function(data) {
               //in D3, any selection[0] contains the group
               //selection[0][0] is the DOM node
               //but we won't need that this time
               var chart = d3.select(element[0]);
               chart.selectAll('div').remove();
               //to our original directive markup bars-chart
               //we add a div with out chart stling and bind each
               //data entry to the chart
                chart.append("div").attr("class", "chart")
                 .selectAll('div')
                 .data(data).enter().append("div")
                 .transition().ease("elastic")
                 .style("width", function(d) { return d + "%"; })
                 .text(function(d) { return d + "%"; });
               //a little of magic: setting it's width based
               //on the data value (d) 
               //and text all with a smooth transition
             };

            scope.$watch('data', function() {
                console.log('data has changed');
                console.log(scope.data);
                scope.render(scope.data);
            });

         } 
      };
      
   }).
    controller('Ctrl', ['$scope', '$http', function($scope, $http) {
        $scope.initialize = function () {
            $scope.chartData = [10,20,30,40,60];
            $scope.$watch('symbol', function() {
                $scope.loadData();
            });
        };

        $scope.onSymbolChange = function() {$scope.loadData();};

        $scope.loadData = function() {
            var httpRequest = $http.jsonp('https://sly.01phi.com:53850/echo?callback=JSON_CALLBACK',
                {params: {"key1": "value1", "key2": "value2", "symbol": $scope.symbol}}).
            success(function(data, status, headers, config) {
                $scope.chartData = data;
                console.log(data);
            }).
            error(function(data, status, headers, config) {
                console.log('Error');
                console.log(status);
                console.log(data);
            });
        };

        $scope.initialize();
    }]);

