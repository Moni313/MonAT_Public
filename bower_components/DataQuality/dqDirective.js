angular.module('dqDirective', [])

    // Elements
    .directive('ngHorizontalMenu', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/views/menu/HorizontalMenu.html"
        }
    })

    .directive('ngStpMenu', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/views/menu/StpMenu.html"
        }
    })

    .directive('ngPtsMenu', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/views/menu/PtsMenu.html"
        }
    })

    .directive('ngListJsonVariables', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/views/menu/listJsonVariables.html"
        }
    })

    .directive('ngRefreshChartStpVars', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/views/menu/refreshChartStpVars.html"
        }
    })

    .directive('ngRefreshPlotStp', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/views/menu/refreshPlotStp.html"
        }
    })

    .directive('ngXSelectionPlot', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/views/menu/xSelectionPlot.html"
        }
    })

    .directive('ngYSelectionPlot', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/views/menu/ySelectionPlot.html"
        }
    })

    .directive('ngMain', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/views/components/main.html"
        }
    })

    .directive('ngTableCompleteness', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/views/components/tableCompleteness.html"
        }
    })

    .directive('ngLeft', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/views/components/left.html"
        }
    })

    .directive('ngBottom', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/views/components/bottom.html"
        }
    })

    // Attributes
    .directive('onReadFile', function ($parse) {
        return {
            restrict: 'A',
            scope: false,
            link: function(scope, element, attrs) {

                var fn = $parse(attrs.onReadFile);

                // TODO check here the type of the file so you can parse it correctly
                element.on('change', function(onChangeEvent) {
                    var reader = new FileReader();

                    reader.onload = function(onLoadEvent) {
                        scope.$apply(function() {
                            fn(scope, {$fileContent:onLoadEvent.target.result});
                        });
                    };
                    scope.nameFile = (onChangeEvent.srcElement || onChangeEvent.target).files[0].name;
                    scope.variables =
                    reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
                });
            }
        };
    });