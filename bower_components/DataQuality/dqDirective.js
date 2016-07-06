angular.module('dqDirective', [])
    .directive('ngVariablesPanel', function(){
        return {
            restrict: 'E',
            templateUrl: '/static/templates/variablePanel.html'
        }
    })

    .directive('ngHorizontalMenu', function(){
        return {
            restrict: 'E',
            templateUrl: '/static/templates/menu/HorizontalMenu.html'
        }
    })

    .directive('ngMain', function(){
        return {
            restrict: 'E',
            templateUrl: '/static/templates/components/main.html'
        }
    })

    .directive('ngListVariables', function(){
        return {
            restrict: 'E',
            templateUrl: '/static/templates/menu/variables/listVariables.html'
        }
    })

    .directive('ngGroupBy', function(){
        return {
            restrict: 'E',
            templateUrl: '/static/templates/menu/variables/groupBy.html'
        }
    })

    .directive('ngChangeTypeVariables', function () {
        return {
            restrict: 'E',
            templateUrl: "/static/templates/menu/variables/changeTypeVariables.html"
        }
    })

    .directive('ngColorCompleteness', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/components/completeness/colorCompleteness.html"
        }
    })

    .directive('ngNumericalPlot', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/components/completeness/numericalPlot.html"
        }
    })

    .directive('ngContextualMenu', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/components/completeness/contextualMenu.html"
        }
    })


























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

    // .directive('ngXYSelectionPlot', function(){
    //     return {
    //         restrict: 'E',
    //         templateUrl: "/static/templates/menu/completeness/xySelectionPlot.html"
    //     }
    // })

    // .directive('ngYSelectionPlot', function(){
    //     return {
    //         restrict: 'E',
    //         templateUrl: "/static/templates/menu/completeness/ySelectionPlot.html"
    //     }
    // })



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

    .directive('ngParallelCoordinateCtrl', function(){
        return {
            restrict: 'E',
            templateUrl: '/static/templates/menu/completeness/parallelCoordinate.html'
        }
    })



    .directive('ngDuplication', function(){
        return {
            restrict: 'E',
            templateUrl: '/static/templates/menu/correctness.html'
        }
    })






    // Elements








    .directive('ngListJsonVariables', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/menu/completeness/listJsonVariables.html"
        }
    })



    .directive('ngSqlCompleteness', function () {
        return {
            restrict: 'E',
            templateUrl: "/static/templates/menu/completeness/sqlQuery.html"
        }
    })

    .directive('ngRefreshBarChart', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/menu/completeness/refreshBarChart.html"
        }
    })






    .directive('ngInteraction', function() {
        return {
            restrict: 'E',
            templateUrl: "/static/templates/components/completeness/interaction.html"
        }
    })




    .directive('ngCompleteness', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/components/completeness.html"
        }
    })

    //numericalChart - Completeness
    .directive('ngTableCompleteness', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/components/completeness/numericalChart/table.html"
        }
    })





    .directive('ngLeft', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/components/completeness/numericalChart/left.html"
        }
    })

    .directive('ngBottom', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/components/completeness/numericalChart/bottom.html"
        }
    })

    .directive('ngSharingPlot', function(){
        return {
            restrict: 'E',
            templateUrl: "/static/templates/components/completeness/numericalChart/sharingPlot.html"
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
                    scope.variables = [];
                    scope.variables =
                    reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
                });
            }
        };
    });