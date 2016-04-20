angular.module('dqDirective', [])

    //TODO reshuffle elements and attributes as in directory
    //templates.components
    //templates.menu
    //templates.components.completeness
    //templates.components.duplication
    //...
    //TODO rename some of them (delete stp substring)



    //template.menu
    .directive('ngMenuCompleteness', function(){
        return {
            restrict: 'E',
            templateUrl: '/static/templates/menu/completeness.html'
        }
    })

    .directive('ngMenuCorrectness', function(){
        return {
            restrict: 'E',
            templateUrl: '/static/templates/menu/correctness.html'
        }
    })

    .directive('ngMenuConsistency', function(){
        return {
            restrict: 'E',
            templateUrl: '/static/templates/menu/consistency.html'
        }
    })

    .directive('ngMenuCurrency', function(){
        return {
            restrict: 'E',
            templateUrl: '/static/templates/menu/currency.html'
        }
    })

    .directive('ngPlotInput', function(){
        return {
            restrict: 'E',
            templateUrl: '/static/templates/menu/completeness/plotInput.html'
        }
    })
    .directive('ngRefreshPlot', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/menu/completeness/refreshPlot.html"
        }
    })

    .directive('ngXSelectionPlot', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/menu/completeness/xSelectionPlot.html"
        }
    })

    .directive('ngYSelectionPlot', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/menu/completeness/ySelectionPlot.html"
        }
    })

    .directive('ngNumericalPlot', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/menu/completeness/numericalPlot.html"
        }
    })

    .directive('ngCategoricalPlot', function () {
        return {
            restrict: 'E',
            templateUrl: "/static/templates/menu/completeness/categoricalPlot.html"
        }
    })

    .directive('ngHybridPlot', function () {
        return {
            restrict: 'E',
            templateUrl: "/static/templates/menu/completeness/hybridPlot.html"
        }
    })



    .directive('ngDuplication', function(){
        return {
            restrict: 'E',
            templateUrl: '/static/templates/menu/correctness.html'
        }
    })






    // Elements
    .directive('ngHorizontalMenu', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/menu/HorizontalMenu.html"
        }
    })










    .directive('ngListJsonVariables', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/menu/completeness/listJsonVariables.html"
        }
    })

    .directive('ngRefreshBarChart', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/menu/completeness/refreshBarChart.html"
        }
    })



    .directive('ngColorCompleteness', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/menu/completeness/colorCompleteness.html"
        }
    })



    .directive('ngMain', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/components/main.html"
        }
    })

    .directive('ngCompleteness', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/components/completeness.html"
        }
    })

    .directive('ngTableCompleteness', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/components/completeness/tableCompleteness.html"
        }
    })

    .directive('ngContextualMenu', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/components/completeness/contextualMenu.html"
        }
    })

    .directive('ngLeft', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/components/completeness/left.html"
        }
    })

    .directive('ngBottom', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/components/completeness/bottom.html"
        }
    })

    .directive('ngSharingPlot', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/components/completeness/sharingPlot.html"
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