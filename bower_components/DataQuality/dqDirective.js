angular.module('dqDirective', [])

    // Elements
    .directive('ngHorizontalMenu', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/menu/HorizontalMenu.html"
        }
    })

    .directive('ngStpMenu', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/menu/StpMenu.html"
        }
    })

    .directive('ngStpCompleteness', function(){
        return {
            restrict: 'E',
            templateUrl: '/static/templates/menu/stpCompleteness.html'
        }
    })

    .directive('ngStpDuplication', function(){
        return {
            restrict: 'E',
            templateUrl: '/static/templates/menu/stpDuplication.html'
        }
    })

    .directive('ngStpPlotInput', function(){
        return {
            restrict: 'E',
            templateUrl: '/static/templates/menu/stpPlotInput.html'
        }
    })

    .directive('ngPtsMenu', function(){
        return {
            restrict: 'E',
            templateUrl: '/static/templates/menu/PtsMenu.html'
        }
    })

    .directive('ngListJsonVariables', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/menu/listJsonVariables.html"
        }
    })

    .directive('ngStpRefreshChartVars', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/menu/stpRefreshChartVars.html"
        }
    })

    .directive('ngStpRefreshPlot', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/menu/stpRefreshPlot.html"
        }
    })

    .directive('ngColorCompleteness', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/menu/colorCompleteness.html"
        }
    })

    .directive('ngXSelectionPlot', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/menu/xSelectionPlot.html"
        }
    })

    .directive('ngYSelectionPlot', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/menu/ySelectionPlot.html"
        }
    })

    .directive('ngMain', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/components/main.html"
        }
    })

    .directive('ngTableCompleteness', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/components/tableCompleteness.html"
        }
    })

    .directive('ngLeft', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/components/left.html"
        }
    })

    .directive('ngBottom', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/components/bottom.html"
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