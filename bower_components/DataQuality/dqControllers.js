/**
 * Created by Monica on 07/04/2016.
 */
var dqControllers = angular.module('dqControllers', ['ui.bootstrap', 'dqFactory'])

    /** The controller handles the events (communication between controllers that have no scope) **/
    .controller('dqCtrl', ['$scope', '$http', 'dqFactory', function($scope, $http, dqFactory)   {

        $("#menu-toggle").click(function(e) {
            e.preventDefault();
            $("#wrapper").toggleClass("toggled");
        });

        $scope.menuReady = dqFactory.menuReady;
        $scope.doShow = dqFactory.doShow;


        /*
         recalculate the missing/present of the variable selected in the list
         see $on.(refresh) reset all the variables
         */
        $scope.reset = function () {
            angular.forEach(dqFactory.completeness.variables, function(variable){
                variable.state.selected = false;
                variable.state.show = false;
            });
            dqFactory.completeness.allSelected = false;


            //plot reset
            dqFactory.completeness.numericalPlot.show = false;
            dqFactory.completeness.numericalPlot.data = [];
        };


        $scope.$on('contentUpdated', function(){
            //console.log('content update before: ');
            //console.log(dqFactory.completeness.variables);

            dqFactory.menuReady = true;
            $scope.menuReady = dqFactory.menuReady;

            //console.log('content update after: ');
            //console.log(dqFactory.completeness.variables);

            $("#wrapper").toggleClass("toggled");
            //dqFactory.completeness.numericalPlot.width = document.getElementById("widthPlot").offsetWidth;
        });

        $scope.$on('startBarChart', function(){
            dqFactory.completeness.barChartShow = true;
            $scope.barChartShow = dqFactory.completeness.barChartShow;
            $scope.$broadcast('refreshChart');
        });
        $scope.$on('resetBarChart', function(){
            $scope.$broadcast('emptyBarChart');
        });
        $scope.$on('refreshPresentMissingColor', function(){
            $scope.$broadcast('refreshPMColor');
            $scope.$broadcast('refreshPlot');
        });

        $scope.$on('startPlotVis', function () {

            $("#wrapper").toggleClass("toggled");

            $scope.$broadcast('refreshPlot');
        });
        $scope.$on('resetPlot', function(){
            dqFactory.completeness.numericalPlot.showNumericalPlot = false;
            $scope.$broadcast('emptyPlot');
        });
        $scope.$on('resetVarPlot', function(){
            $scope.$broadcast('resetVar');
        });

        $scope.$on('interaction', function(){
            $scope.$broadcast('interactionRefresh');
        });

        $scope.$on('updateSelection', function(){
            $scope.$broadcast('updateVariableSelected');
        });

        $scope.$on('group', function(){
            $scope.$broadcast('groupByVar');
        });
        $scope.$on('emptyGroupBy', function(){
            $scope.$broadcast('resetGroupBy');
        });

        $scope.saveToPc = function () {

            var data = dqFactory.getActualContent();
            var filename = dqFactory.nameFile;

            if (!data) {
                console.error('No data');
                return;
            }

            if (!filename) {
                filename = 'MonAT_download.json';
            }
            else filename = "MonAT_".concat(filename);

            if (typeof data === 'object') {
                data = JSON.stringify(data, undefined, 2);
            }

            var blob = new Blob([data], {type: 'text/json'}),
            e = document.createEvent('MouseEvents'),
            a = document.createElement('a');

            a.download = filename;
            a.href = window.URL.createObjectURL(blob);
            a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
            e.initEvent('click', true, false); //window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(e);
        };
    }])


    //Menu controllers

    /**
     * input file controller
     * set content and calculate (first time) information table per each variable
    **/
    .controller('fileCtrl', ['$http', '$scope', 'dqFactory', function ($http, $scope, dqFactory) {
        $scope.showContent = function ($fileContent) {

            //dqFactory.content = JSON.parse($fileContent).entries; //TODO the .entries is due to the transformation of the csv to the json by python
            dqFactory.content = JSON.parse($fileContent); //TODO the .entries is due to the transformation of the csv to the json by python
            dqFactory.completeness.underInvestigation = true;
            dqFactory.nameFile = $scope.nameFile;


            dqFactory.sizeContent = dqFactory.content.length;
            var variables = Object.keys(dqFactory.content[0]); //array of string

            tableCompleteness(variables);

            $scope.$emit('contentUpdated');
        };


        //first instances of tableCompleteness
        /**
         * set completeness information for each variable (name, statistics, state)
         * @param variables array list
         */
        function tableCompleteness(variables) {
            angular.forEach(variables, function (variable) {

                var content = dqFactory.getActualContent();
                var row = dqFactory.row4tableCompleteness(variable, content);

                if(row.numerical) {
                    dqFactory.completeness.variables.push({
                        name: variable,
                        state: {
                            selected: false, //for vertical menu
                            show: false, //for content show plot/historicalBarChart/horizontalBarChart
                            isNumerical: row.numerical,
                            isCategorical: row.categorical,
                            isIndex: row.index,
                            isDate: row.date
                        },
                        statistics: {
                            missingTotal: row.missing,
                            missing: row.missing,
                            presentTotal: row.present,
                            present: row.present,

                            minTotal: row.min,
                            maxTotal: row.max,
                            meanTotal: row.mean,
                            min: row.min,
                            max: row.max,
                            mean: row.mean
                        }
                    });
                }
                else if(row.date){
                   dqFactory.completeness.variables.push({
                     name:variable,
                     state:{
                             selected: false,
                             show: false,
                             isNumerical: row.numerical,
                             isCategorical: row.categorical,
                             isIndex: row.index,
                             isDate: row.date
                     },
                     statistics: {
                         missing: row.missing,
                         missingTotal: row.missing,
                         present: row.present,
                         presentTotal: row.present
                     }
                 })
                }
                else{
                    dqFactory.completeness.variables.push({
                        name: variable,
                        state: {
                            selected: false, //for vertical menu
                            show: false, //for content show plot/historicalBarChart/horizontalBarChart
                            isNumerical: row.numerical,
                            isCategorical: row.categorical,
                            categories: row.categories,
                            isIndex: row.index,
                            isDate: row.date
                        },
                        statistics: {
                            missing: row.missing,
                            missingTotal: row.missing,
                            present: row.present,
                            presentTotal: row.present
                        }
                    });
                    //console.log("inserting ", row.categories);
                }
            });
            //console.log("variables", dqFactory.completeness.variables);
        }


    }])

    .controller('revisionCtrl', function($scope, dqFactory, $log){
        //$scope.ready = dqFactory.revision.ready;
        $scope.totalItems = 1;
        $scope.currentInteraction = 1;

        $scope.setInteraction = function (interactionNo) {
            $scope.currentInteraction = interactionNo;
        };

        $scope.interactionChanged = function() {
            $log.debug('Visualisation: ' + $scope.currentInteraction);
        };

        $scope.maxSize = 18;
        $scope.bigTotalItems = 4;//dqFactory.completeness.interactions.index;
        $scope.bigCurrentItem = 1;
    })

    //.controller('accordionCtrl', function($scope){
    //    $scope.oneAtATime = true;
    //    $scope.status = {
    //        open: {
    //            isFirstOpen: true,
    //            isSecondOpen: false
    //        }
    //    };
    //})

    .controller('varsCtrl', ['$scope', '$rootScope', 'dqFactory', function($scope, $rootScope, dqFactory){
        $scope.variables = dqFactory.completeness.variables;
        $scope.allSelected = dqFactory.completeness.allSelected;

        $scope.showNumericalPlot = dqFactory.completeness.numericalPlot.showNumericalPlot;

        $scope.colorPresent = dqFactory.completeness.color.present;
        $scope.colorMissing = dqFactory.completeness.color.missing;



        /**
         * Event: select all variables for completeness check
        **/
        $scope.completenessCheckAll = function () {
            dqFactory.completeness.allSelected = !dqFactory.completeness.allSelected;
            angular.forEach(dqFactory.completeness.variables, function (variable) {
                variable.state.selected = dqFactory.completeness.allSelected;
            });

            if(!dqFactory.completeness.allSelected)
                $scope.completenessResetAll();

            if(dqFactory.completeness.allSelected){
                $scope.start();
                //console.log("group from allSelected");
                $scope.$emit('group');
            }
        };

        $scope.refreshChart = function(){
            var count = 0;
            angular.forEach($scope.variables, function(variable){
                if(variable.state.selected) count += 1;
            });
            if(count == 0){
                $scope.completenessResetAll();
            }
            else {
                if(count <= $scope.variables.length)
                    $scope.allSelected = false;
                else if(count == $scope.variables.length)
                    $scope.allSelected = true;
                $scope.start();
                if(dqFactory.completeness.groupBy != ""){
                    $scope.$emit('group');
                }
            }
        };

        /**
         * Event: de-select all variables for completeness check
        **/
        $scope.completenessResetAll = function(){

            dqFactory.completeness.numericalPlot.nameX = "";
            dqFactory.completeness.numericalPlot.nameY = "";
            dqFactory.completeness.historicalBarChart = [];
            dqFactory.completeness.horizontalBarChart = [];

            dqFactory.completeness.allSelected = false;
            $scope.allSelected = false; //TODO Tho-way binding does not work?
            //console.log(dqFactory.completeness.allSelected);
            dqFactory.completeness.groupBy = "";

            angular.forEach(dqFactory.completeness.variables, function (variable) {
                variable.state.selected = false;
                variable.state.show = false;
            });

            dqFactory.completeness.interactions = [];

            dqFactory.completeness.barChartShow = false;

            dqFactory.addStepInteraction();
            $scope.$emit('resetBarChart');
            $scope.$emit('resetPlot');
            $scope.$emit('interaction');

            $scope.$emit('emptyGroupBy');
        };

        /**
         * Event: set color to default value and call the redraw event
        **/
        $scope.completenessResetColor = function(){
            dqFactory.completeness.color.present = "#d95f02";
            dqFactory.completeness.color.missing = "#000000",//"#7570b3";
            $scope.colorPresent = dqFactory.completeness.color.present;
            $scope.colorMissing = dqFactory.completeness.color.missing;
            $scope.$emit('refreshPresentMissingColor');
        };

        /**
         * Redraw all the charts
         */
        $scope.completenessRefreshColor =  function(){
            //console.log("reset present: ", dqFactory.completeness.color.present);
            //console.log("reset missing: ", dqFactory.completeness.color.missing);
            dqFactory.completeness.color.present = $scope.colorPresent;
            dqFactory.completeness.color.missing = $scope.colorMissing;
            $scope.$emit('refreshPresentMissingColor');
        };

        $scope.start = function(){
            $scope.$emit('startBarChart');
        };

        $scope.startPlot = function(){
            if($scope.nameX == "" || $scope.nameY == ""){
                $scope.$emit('resetPlot');
                return;
            }
            dqFactory.completeness.numericalPlot.height = $scope.height;
            dqFactory.completeness.numericalPlot.showNumericalPlot = true;
            $scope.$emit('startPlotVis');
        }

        $scope.$on('updateVariableSelected', function(){
            $scope.variables = dqFactory.completeness.variables;
            // angular.forEach($scope.variables, function(variable){
            //     if(variable.state.selected) console.log(variable.name);
            // });
            $scope.$emit('startBarChartUpdated');
        });

    }])

    // .controller('xCtrl', ['$scope', 'dqFactory', function($scope, dqFactory){
    //
    //     //plot variables
    //     $scope.variables = dqFactory.completeness.variables;
    //
    //     $scope.nameX = dqFactory.completeness.numericalPlot.nameX;
    //
    //     $scope.$on('resetVar', function(){
    //         $scope.nameX = "";
    //     });
    //
    //     $scope.resetVarX =  function(){
    //         $scope.nameX = "";
    //         //console.log("Resetting nameX: ", dqFactory.completeness.numericalPlot.nameX);
    //         dqFactory.completeness.numericalPlot.nameX = "";
    //         $scope.$emit('resetPlot');
    //     };
    //
    //     $scope.$watch('nameX', function(n){
    //         dqFactory.completeness.numericalPlot.nameX = n;
    //     });
    // }])

    // .controller('yCtrl', ['$scope', 'dqFactory',  function($scope, dqFactory){
    //
    //     //plot variables
    //     $scope.variables = dqFactory.completeness.variables;
    //     $scope.nameY = dqFactory.completeness.numericalPlot.nameY;
    //
    //     $scope.$watch('nameY', function(n){
    //         dqFactory.completeness.numericalPlot.nameY = n;
    //     });
    //
    //     $scope.resetVarY = function(){
    //         $scope.nameY = "";
    //         dqFactory.completeness.numericalPlot.nameY = ""; //TODO delete
    //         $scope.$emit('resetPlot');
    //     };
    //
    //     $scope.$on('resetVar', function(){
    //         $scope.nameY = "";
    //     });
    // }])

    .controller('xyCtrl', ['$scope', 'dqFactory', function($scope, dqFactory){

        $scope.variables = dqFactory.completeness.variables;

        $scope.nameX = dqFactory.completeness.numericalPlot.nameX;
        $scope.nameY = dqFactory.completeness.numericalPlot.nameY;
        $scope.height = dqFactory.completeness.numericalPlot.height;

        $scope.$on('resetVar', function(){
            $scope.nameX = "";
            $scope.nameY = "";
        });

        $scope.resetVarX =  function(){
            $scope.nameX = "";
            //console.log("Resetting nameX: ", dqFactory.completeness.numericalPlot.nameX);
            dqFactory.completeness.numericalPlot.nameX = "";
            $scope.$emit('resetPlot');
        };

        $scope.resetVarY = function(){
            $scope.nameY = "";
            dqFactory.completeness.numericalPlot.nameY = "";
            $scope.$emit('resetPlot');
        };

        $scope.$watch('nameX', function(n){
            dqFactory.completeness.numericalPlot.nameX = n;
            if($scope.nameY != "" && n != ""){
                dqFactory.completeness.numericalPlot.height = $scope.height;
                dqFactory.completeness.numericalPlot.showNumericalPlot = true;
                $scope.$emit('startPlotVis');
            }

        });
        
        $scope.$watch('nameY', function(n){
            dqFactory.completeness.numericalPlot.nameY = n;
            if($scope.nameX != "" && n != ""){
                dqFactory.completeness.numericalPlot.height = $scope.height;
                dqFactory.completeness.numericalPlot.showNumericalPlot = true;
                $scope.$emit('startPlotVis');
            }
        });

        $scope.startPlot = function(){
            if($scope.height != ""  && $scope.nameX != "" && $scope.nameY != ""){
                dqFactory.completeness.numericalPlot.height = $scope.height;
                $scope.$emit('startPlotVis');
            }
        };

    }])

    // .controller('sqlCtrl', ['$scope', 'dqFactory', function($scope, dqFactory){
    //     $scope.variables = dqFactory.completeness.variables;
    //     $scope.sqlSelect = dqFactory.completeness.sql.select;
    //     $scope.sqlSelectValue = dqFactory.completeness.sql.selectValue;
    //
    //     $scope.sqlWhere = dqFactory.completeness.sql.where;
    //     $scope.sqlWhereValue = dqFactory.completeness.sql.whereValue;
    //
    //     $scope.sqlCompareCategorical = dqFactory.completeness.sql.compareCategorical;
    //     $scope.sqlCompareNumerical = dqFactory.completeness.sql.compareNumerical;
    //     $scope.sqlCompareIndex = dqFactory.completeness.sql.sqlCompareNumerical;
    //     $scope.sqlCompareMethod = "";
    //
    //
    //     $scope.resetSqlSelect = function(){
    //         $scope.sqlSelect = "";
    //         $scope.sqlSelectValue = "";
    //     };
    //     $scope.resetSqlSelectValue = function () {
    //         $scope.sqlSelectValue = "";
    //     };
    //     $scope.$watch('sqlSelect', function(n){
    //         //$scope.sqlSelect = n;
    //         $scope.sqlSelectValue = "";
    //         angular.forEach($scope.variables, function(variable){
    //             if(variable.name === $scope.sqlSelect){
    //                 if(variable.state.isCategorical)
    //                     $scope.sqlSelectValues = variable.state.categories;
    //                 else
    //                     $scope.sqlSelectValues = "";
    //             }
    //         })
    //
    //         getType();
    //
    //     });
    //
    //     $scope.resetSqlCompare = function () {
    //         $scope.sqlCompareMethod = "";
    //     };
    //
    //
    //
    //     $scope.sqlVisualise = function(){
    //
    //     };
    //
    //     function getType(){
    //         angular.forEach($scope.variables, function(variable){
    //             if(variable.name === $scope.sqlSelect){
    //                 if(variable.state.isCategorical) $scope.typeOfSelected =  'c';
    //                 else if(variable.state.isNumerical) $scope.typeOfSelected =  'n';
    //                 else if(variable.state.isIndex) $scope.typeOfSelected =  'i';
    //                 else $scope.typeOfSelected =  'nt';
    //             }
    //         })
    //     }
    //
    //
    //     // $scope.resetSqlWhere = function () {
    //     //     $scope.sqlWhere = "";
    //     //     $scope.sqlWhereValue = "";
    //     // };
    //     // $scope.resetSqlWhereValue = function () {
    //     //     $scope.sqlWhereValue = "";
    //     // };
    //     // $scope.$watch('sqlWhere', function(n){
    //     //     $scope.sqlWhere = n;
    //     //     $scope.whereCategories = "";
    //     //     angular.forEach($scope.variables, function(variable){
    //     //         if(variable.name === $scope.sqlSelect){
    //     //             $scope.whereCategories = variable.state.categories;
    //     //         }
    //     //     })
    //     // });
    //
    //
    //
    // }])

    .controller('groupByCtrl', ['$scope', 'dqFactory', function($scope, dqFactory){

        $scope.groupBy = dqFactory.completeness.groupBy;

        $scope.$watch('groupBy', function(n){
            if(n!=""){
                dqFactory.completeness.groupBy = n;
                $scope.groupByVariable();
            }
        });

        $scope.$on('groupByVarMenu', function(){
            $scope.groupByVariable();
        });

        $scope.groupByVariable = function(){
            var count = 0;
            angular.forEach(dqFactory.completeness.variables, function(variable){
                if(variable.state.selected) count += 1;
            });
            if(count == 0){
                dqFactory.completeness.groupByShow = false;
                return;
            }
            dqFactory.completeness.groupByShow = true;
            dqFactory.completeness.groupBy = $scope.groupBy;
            $scope.$emit('group');
        };

        $scope.resetGroupBy = function(){
            $scope.groupBy = '';
            dqFactory.completeness.groupBy = "";
            dqFactory.completeness.groupByShow = false;
            $scope.$emit('group');
        };

        $scope.$on('resetGroupBy', function(){
            $scope.resetGroupBy();
        });
    }])

    .controller('changeTypeVariableCtrl', ['$scope', 'dqFactory', function($scope, dqFactory) {
        $scope.variables = dqFactory.completeness.variables;
        $scope.changeTypeVar = "";
        $scope.newTypeVar = "";
        $scope.types = ['index', 'date', 'categorical', 'numerical'];

        $scope.changeTypeOfVariable = function () {

            console.log($scope.changeTypeVar);
            console.log($scope.newTypeVar);

            angular.forEach(dqFactory.completeness.variables, function (variable) {
                if (variable.name == $scope.changeTypeVar) {
                    switch ($scope.newTypeVar) {
                        case 'index':
                            variable.state.isIndex = true;
                            variable.state.isDate = false;
                            variable.state.isCategorical = false;
                            variable.state.isNumerical = false;
                            break;
                        case 'date':
                            variable.state.isIndex = false;
                            variable.state.isDate = true;
                            variable.state.isCategorical = false;
                            variable.state.isNumerical = false;
                            break;
                        case 'categorical':
                            variable.state.isIndex = false;
                            variable.state.isDate = false;
                            variable.state.isCategorical = true;
                            variable.state.isNumerical = false;
                            break;
                        case 'numerical':
                            variable.state.isIndex = false;
                            variable.state.isDate = false;
                            variable.state.isCategorical = false;
                            variable.state.isNumerical = true;
                            break;
                        default:
                            console.log("no variable changed type");
                    }
                }
            });

            //TODO update tableselection
        };

        $scope.resetTypeVariable = function(){
            $scope.changeTypeVar = "";
            $scope.newTypeVar = "";
        }
    }])

    //Components Controllers
    //contains all the plots:
    //(bar chart, sunburst, plot), (historical bar chart, horizontal bar chart)
    .controller('completenessCtrl', ['$scope', 'dqFactory', function($scope, dqFactory) {

        //update the table with completeness information for each variable based on the actual content
        function tableCompletenessSelected() {
            //console.log(dqFactory.completeness.variables);

            var content = dqFactory.getActualContent();
            angular.forEach(dqFactory.completeness.variables, function (item) {
                if (item.state.selected) {
                    //console.log("item.name", item.name);

                    //update statistics
                    var row = dqFactory.row4tableCompleteness(item.name, content);
                    //console.log("row updated: ", row);
                    item.statistics.present = row.present;
                    item.statistics.missing = row.missing;

                    if(item.state.isNumerical) {
                        item.statistics.min = row.min;
                        item.statistics.max = row.max;
                        item.statistics.mean = row.mean;
                    }

                }
            });
            return dqFactory.completeness.variables;
        }

        /** multiBarHorizontalChart. Set present/missing data for bar chart **/
        function mbhcc(){
            tableCompletenessSelected();
            var completenessData = [];
            //console.log("mbhcc present: ", dqFactory.completeness.color.present);
            //console.log("mbhcc missing: ", dqFactory.completeness.color.missing);
            var colorPresent = dqFactory.completeness.color.present;
            var colorMissing = dqFactory.completeness.color.missing;
            completenessData.push({key: 'Present', color: colorPresent, values: []}); //completenessData[0]
            completenessData.push({key: 'Missing', color: colorMissing, values: []}); //completenessData[1]

            //console.log(dqFactory.completeness.variables);
            angular.forEach(dqFactory.completeness.variables, function(row) {
                if(row.state.selected) {
                    completenessData[0].values.push({label: row.name, value: row.statistics.present});
                    completenessData[1].values.push({label: row.name, value: row.statistics.missing});
                }
            });
            return completenessData;
        }

        function dataGroupByVarCompleteness(actualContent){

            var groupData = [];

            var variable = dqFactory.completeness.groupBy;

            //console.log(variable);
            var groupedActualContent = Enumerable.From(actualContent)
                .GroupBy(function(item) { return item[variable]; }).ToArray();


            var indexVariable = 0;
            angular.forEach(dqFactory.completeness.variables, function(vari) {
                if (vari.state.selected) {

                    var numbOfGroup = 0;
                    groupData.push({key: vari.name, values: []});

                    var count = [];
                    var present = 0;
                    angular.forEach(groupedActualContent, function (item) {

                        //console.log("Key: ", item.Key());
                        var missing = 0;
                        var runLoop = true;

                        while(runLoop) {
                            angular.forEach(item.source, function (i, index) {
                                //console.log(i);
                                //count number of missing values for variable in the group
                                if (!dqFactory.hasMeaningValue(i[vari.name])) {
                                    runLoop = false;
                                    missing += 1;
                                }
                                //console.log(index);
                                if(index == item.source.length-1) runLoop = false;

                            });
                        }
                        if(runLoop && missing == 0) present +=1;
                        count.push(missing);
                        //console.log("GroupBy: ", item.source[0][variable], " ", missing);
                    });
                    //count.push(present);
                    //console.log(count);
                    var result = {};
                    for(var i = 0; i < count.length; ++i) {
                        if (!result[count[i]])
                            result[count[i]] = 0;
                        ++result[count[i]];

                    }
                    //console.log("result: ", result);

                    var keys = Object.keys(result);
                    angular.forEach(keys, function(k){
                        //console.log("result: ", k, " ", result[k]);
                        numbOfGroup += result[k];
                        groupData[indexVariable].values.push({label: k, value:result[k]});
                    });

                    $scope.numbGroups = numbOfGroup;
                    indexVariable +=1;
                }
            });

            //groupData[0].values.push({label: item.source[0][variable], value: missing});
            //console.log(JSON.stringify(groupData));
            return groupData;
        }

        function selectGroupSubset(key, label){

        }

        //calculate the sub set based on the user selection on the bar chart
        function selectSubset(key, variableSelected){
            key = key.toLowerCase();
            var actualContent = dqFactory.getActualContent();
            //var sunburstRing = dqFactory.completeness.sunburst.ring;
            var newContent = [];

            //filter the whole data set to keep only records with variableSelected present
            if(key === "present"){

                //add a new ring to the sunburst and set the number of ring
                // dqFactory.interactions.completeness.actions.push(
                //     {key: key, label: variableSelected}
                // );
                //dqFactory.completeness.sunburst.ring = sunburstRing + 1;

                //calculate the new subset
                angular.forEach(actualContent, function(entry){
                    if(entry[variableSelected] === null
                        || entry[variableSelected] === ""
                        || entry[variableSelected] === "NaN"
                        || entry[variableSelected] === ''
                        || entry[variableSelected] === undefined) {}
                    else{
                        newContent.push(entry);
                    }
                });
                //update global variable
            }

            else if(key === "missing"){
                //add a new ring to the sunburst and set the number of ring
                //dqFactory.storeCompleteness("action", {key: key, label: variableSelected});
                //dqFactory.store();
                //dqFactory.completeness.sunburst.ring = sunburstRing + 1;


                //calculate the new subset
                angular.forEach(actualContent, function(entry){
                    if(entry[variableSelected] === null
                        || entry[variableSelected] === ""
                        || entry[variableSelected] === "NaN"
                        || entry[variableSelected] === ''
                        || entry[variableSelected] === undefined) {
                        newContent.push(entry);
                    }
                });
                //update global variable
            }
            dqFactory.subsetContent = newContent;
            //console.log("content # rows: ", dqFactory.subsetContent.length);

            $scope.sizeSubset = dqFactory.subsetContent.length;
            tableCompletenessSelected();
        }

        $scope.restart = function(){
            dqFactory.subsetContent = dqFactory.content;
            $scope.$broadcast('refreshChart');
            $scope.$broadcast('groupByVar');
        };

        $scope.$on('refreshChart', function() {
            dqFactory.completeness.barChartShow = true;
            tableCompletenessSelected();
            $scope.variables = dqFactory.completeness.variables;
            var count = 0;
            angular.forEach($scope.variables, function(variable){
                if(variable.state.selected) count += 1;
            });
            if(count == 0){
                //no variables are selected
                $scope.$broadcast('emptyBarChart');
                $scope.$broadcast('resetGroupBy');
                $scope.$emit('resetPlot');
                return;
            }
            if(count < $scope.variables.length)
                dqFactory.completeness.allSelected = false;

            $scope.sizeContent = dqFactory.content.length;
            $scope.sizeSubset = dqFactory.subsetContent.length;
            $scope.barChartShow = dqFactory.completeness.barChartShow;


            var height = (count * 30) + 100;

            $scope.optionsMultiBarHorizontalChartCompleteness = {
            chart: {
                type: 'multiBarHorizontalChart',
                height: height,
                color:  dqFactory.completeness.colorRange.present,//d3.scale.category10().range(),
                x: function (d) {
                    return d.label;
                },
                y: function (d) {
                    return d.value;
                },
                showControls: true,
                showValues: true,
                duration: 500,

                useInteractiveGuideline: false,
                tooltip: {
                    contentGenerator: function (e) {
                        var series = e.series[0];
                        var rows =
                            "<tr>" +
                            "<td class='key'>" + series.key + "</td>" +
                            "<td class='key'>" + d3.format(',.0f')(series.value) + "</td>" +
                            "</tr>";

                        var header =
                            "<thead>" +
                            "<tr>" +
                            "<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
                            "<td class='key'><strong>" + e.value + "</strong></td>" +
                            "</tr>" +
                            "</thead>";

                        return "<table>" +
                            header +
                            "<tbody>" +
                            rows +
                            "</tbody>" +
                            "</table>";
                    }
                },


                xAxis: {
                    showMaxMin: false
                },
                yAxis: {
                    axisLabel: 'Values',
                    tickFormat: function (d) {
                        return d3.format(',.0f')(d);
                    }
                },
                multibar: {
                    stacked: false,

                    dispatch: {
                        //[
                        // {key: 'Present', values: [{label: "All", value: countAllPresent}]}
                        // {key: 'Missing', values: [{label: "All", value: countAllMissing}]}
                        //]
                        elementClick: function (e) {
                            $scope.$apply(function () {
                                selectSubset(e.data.key, e.data.label);
                                $scope.dataMultiBarHorizontalChartCompleteness = mbhcc();
                                $scope.$emit('group');
                            });
                        }
                    },

                    valueFormat: function (d) {
                        return d3.format(',.0f')(d);
                    }
                }
            },
            title: {
                enable: true,
                text: "Missing and Present values for the selected variable(s)",
                className: "h5"
            }
        };
            $scope.dataMultiBarHorizontalChartCompleteness = mbhcc();


            //dqFactory.storeCompleteness("selection");
            //dqFactory.store();



            dqFactory.addStepInteraction();
            $scope.$emit('interaction');

        });

        $scope.$on('emptyBarChart', function(){
            $scope.barChartShow = dqFactory.completeness.barChartShow;
            dqFactory.sizeSubset = 0;
            dqFactory.subsetContent = [];
        });

        $scope.$on('refreshPMColor', function(){
            $scope.dataMultiBarHorizontalChartCompleteness = mbhcc();
        });

        $scope.$on('groupByVar', function(){
            //dqFactory.completeness.groupByShow = dqFactory.completeness.groupBy != '';
            // //

            $scope.groupByShow = dqFactory.completeness.groupByShow;
            if(dqFactory.completeness.groupBy == "") {
                dqFactory.completeness.groupByShow = false;
                return;
            }

            dqFactory.completeness.groupByShow = true;


            $scope.variables = dqFactory.completeness.variables;
            var countSelected = 0;
            angular.forEach(dqFactory.completeness.variables, function(variable){
                if(variable.state.selected) countSelected+=1;
            });

            var actualContent = dqFactory.getActualContent();
            $scope.dataGroupBy = dataGroupByVarCompleteness(actualContent);


            var keys = 0;
            //console.log(JSON.stringify($scope.dataGroupBy, null, 2));
            angular.forEach($scope.dataGroupBy, function(group){
                angular.forEach(group, function(g){
                    keys += g.length;
                });
            });

            console.log("countSelected ", countSelected);
            console.log("keys length: ", keys);
            //var height = (10 * $scope.numbGroups) + (3 * keys) + 100;
            var height = (15 * countSelected) + (5 * keys) + 100;

            //console.log(height);
            $scope.optionGroupBy = {
            chart: {
                type: 'multiBarHorizontalChart',
                height: height,
                color: dqFactory.completeness.colorRange.present,
                x: function (d) {
                        return d.label;
                    },
                y: function (d) {
                    return d.value;
                },
                showControls: true,
                showValues: false,
                duration: 500,

                useInteractiveGuideline: false,
                tooltip: {
                    contentGenerator: function (e) {
                        var series = e.series[0];

                        //console.log("e: ------> ", JSON.stringify(e));
                        var rows =
                            "<tr>" +
                            "<td class='key'>" + d3.format(',.0f')(series.value) + "</td>" +
                            //"<td class='key'>" + e.data.cat + "</td>" +
                            "<td class='key'>group(s)</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td class='x-value'>with</td>" +
                            "<td class='x-value'><strong>" + e.value + " missing value</strong></td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td class='x-value'>for</td>" +
                            "<td class='x-value'><strong>" + series.key + "</strong></td>" +
                            "</tr>";

                        var header =
                            "<thead>" +
                            "<tr>" +
                            "<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
                            "<td class='key'><strong>Group by " + dqFactory.completeness.groupBy + "</strong></td>" +
                            "</tr>" +
                            "</thead>";

                        return "<table>" +
                            header +
                            "<tbody>" +
                            rows +
                            "</tbody>" +
                            "</table>";
                    }
                },


                xAxis: {
                    axisLabel: "# of missing",
                    showMaxMin: false
                },
                yAxis: {
                    axisLabel: '# of '.concat(dqFactory.completeness.groupBy),
                    tickFormat: function (d) {
                        return d3.format(',.0f')(d);
                    }
                },
                multibar: {
                    stacked: false,

                    dispatch: {
                        //[
                        // {key: 'Present', values: [{label: "All", value: countAllPresent}]}
                        // {key: 'Missing', values: [{label: "All", value: countAllMissing}]}
                        //]
                        elementClick: function (e) {
                            $scope.$apply(function () {
                                selectGroupSubset(e.data.key, e.data.label);
                                $scope.dataGroupByVarCompleteness = mbhccGroupByVar();
                            });
                        }
                    },

                    valueFormat: function (d) {
                        return d3.format(',.0f')(d);
                    }
                }
            },
            title: {
                enable: true,
                text: 'Group by '
                    .concat(dqFactory.completeness.groupBy)
                    .concat(" (")
                    .concat($scope.numbGroups)
                    .concat(" groups over ")
                    .concat((actualContent.length).toString())
                    .concat(" records)"),
                className: "h5"
            }
        };

        });

        $scope.$on('resetGroupBy', function(){
            //$scope.groupByShow = false;
            dqFactory.completeness.groupByShow = false;
            dqFactory.completeness.groupBy = "";
            $scope.$emit('emptyGroupBy');
        });

        $scope.$on('interactionRefresh', function() {
            $scope.interactions = dqFactory.interactions;
        });

        $scope.deleteInteraction = function($index){

            if($index == dqFactory.interactions.length-1) {
                var lastIndex = dqFactory.interactions.length - 2;
                if (lastIndex < 0) {
                    //reset everything
                    angular.forEach(dqFactory.completeness.variables, function (variable) {
                        variable.state.selected = false;
                    });

                    dqFactory.completeness.numericalPlot.nameX = "";
                    dqFactory.completeness.numericalPlot.nameY = "";
                    dqFactory.completeness.historicalBarChart = [];
                    dqFactory.completeness.horizontalBarChart = [];

                    dqFactory.completeness.allSelected = false;
                    $scope.allSelected = false; //Tho-way binding does not work?

                    angular.forEach(dqFactory.completeness.variables, function (variable) {
                        variable.state.selected = false;
                        variable.state.show = false;
                    });


                    dqFactory.interactions = [];

                    dqFactory.completeness.barChartShow = false;
                    dqFactory.addStepInteraction();
                    $scope.$emit('resetBarChart');
                    $scope.$emit('resetPlot');
                    $scope.$emit('resetVarPlot');
                }
                else {
                    var actualVariables = dqFactory.interactions[lastIndex].variables;
                    angular.forEach(dqFactory.completeness.variables, function(variable){
                        if(contains(actualVariables, variable.name))
                            variable.state.selected = true;
                        else variable.state.selected = false;
                    });



                    //console.log("actualVariables: ", dqFactory.completeness.variables);
                }
            }

            dqFactory.interactions.splice($index, 1);
            $scope.interactions = dqFactory.interactions;


            tableCompletenessSelected();
            $scope.variables = dqFactory.completeness.variables;
            $scope.dataMultiBarHorizontalChartCompleteness = mbhcc();




            //b is the value, a is the array
            function contains(a,b){
                //console.log("a, b: ", a, b);
                return !!~a.indexOf(b);
            }
        };

        $scope.deleteForward = function($index){

        };

    }])

    //content
    .controller('plotCtrl', ['$scope', 'dqFactory', function($scope, dqFactory){

        $scope.logicEvaluation = dqFactory.completeness.logicEvaluation;

        var xWidth = setSharingWidth();
        //console.log("first width: ", xWidth);

        $scope.logicEval = function(){
            dqFactory.completeness.numericalPlot.logicEvaluation = $scope.logicEvaluation;
            $scope.$emit('refreshPlot');
            // console.log("logicEvaluation: ", $scope.logicEvaluation);
        };

        $scope.showSharingAxis = function(){
            xWidth = setSharingWidth();
            $scope.$broadcast('refreshPlot');
            // sharingAxis();
        };

        $scope.toggleAllSharingAxis = function () {
            dqFactory.completeness.numericalPlot.showAllSharingAxis = !dqFactory.completeness.numericalPlot.showAllSharingAxis;
            xWidth = setSharingWidth();
            $scope.$broadcast("refreshPlot");
        };

        $scope.$on('refreshPlot', function() {

            $scope.showAllSharingAxis = dqFactory.completeness.numericalPlot.showAllSharingAxis;
            $scope.variables = dqFactory.completeness.variables;
            $scope.nameX = dqFactory.completeness.numericalPlot.nameX;
            $scope.nameY = dqFactory.completeness.numericalPlot.nameY;

            $scope.showNumericalPlot = dqFactory.completeness.numericalPlot.showNumericalPlot;



            var title = $scope.nameX.concat(" vs ").concat($scope.nameY);

            //console.log(title);


            $scope.height = dqFactory.completeness.numericalPlot.height;

            var countShow = 0;
            angular.forEach($scope.variables, function(variable){
                if(variable.state.show) countShow += 1;
            });

            var text = "";
            if(countShow > 1) text = "Logic ".concat($scope.logicEvaluation).concat(" for missing values");
            else text = "Missing values";

            $scope.optionPlot = {
                chart: {
                    type: 'scatterChart',
                    height: $scope.height,
                    width: xWidth,
                    color: dqFactory.completeness.colorRange.present, //d3.scale.category10().range(), //TODO
                    scatter: {
                        onlyCircles: false
                    },
                    showDistX: false,
                    showDistY: false,
                    showLegend: true,

                    useInteractiveGuideline: false,
                    tooltip: {
                        contentGenerator: function (e) {
                            var series = e.series[0];

                            var rows =
                                "<tr>" +
                                "<td class='key'>" + $scope.nameX + "</td>" +
                                "<td class='x-value'>" + e.value + "</td>" +
                                "</tr>" +
                                "<tr>" +
                                "<td class='key'>" + $scope.nameY + "</td>" +
                                "<td class='x-value'><strong>" + d3.format(',.2f')(series.value) + "</strong></td>" +
                                "</tr>";

                            var header =
                                "<thead>" +
                                "<tr>" +
                                "<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
                                "<td class='key'><strong>" + series.key + "</strong></td>" +
                                "</tr>" +
                                "</thead>";

                            return "<table>" +
                                header +
                                "<tbody>" +
                                rows +
                                "</tbody>" +
                                "</table>";
                        }
                    },

                    xAxis: {
                        axisLabel: $scope.nameX,
                        tickFormat: function (d) {
                            return d3.format('.0f')(d);
                        },
                        ticks: 8
                    },
                    yAxis: {
                        axisLabel: $scope.nameY,
                        tickFormat: function (d) {
                            return d3.format(',.2f')(d);
                        },
                        axisLabelDistance: -5
                    },
                    zoom: {
                        //NOTE: All attributes below are optional
                        enabled: false,
                        scaleExtent: [1, 10],
                        useFixedDomain: false,
                        useNiceScale: false,
                        horizontalOff: false,
                        verticalOff: false
                        //unzoomEventType: 'dblclick.zoom'
                    }
                },
                title: {
                    enable: true,
                    text: title,
                    className: "h5"
                },
                subtitle: {
                    enable: true,
                    text: text,
                    class: {
                        textAlign: "center"
                    }
                }
            };


            //console.log("refresh plot, xWidth ", xWidth);

            $scope.dataPlot = missingLogicEvaluation();
            //console.log("data plot chart missing: ", $scope.dataPlot[0].values.length);
            //console.log("data plot chart missing: ", $scope.dataPlot[1].values.length);
            $scope.optionPlot.subtitle.text = $scope.optionPlot.subtitle.text.concat(" ( present: ").concat($scope.dataPlot[0].values.length)
                .concat(", missing: ").concat($scope.dataPlot[1].values.length).concat(" )");

            sharingAxis();
        });

        $scope.$on('emptyPlot', function(){
            $scope.showNumericalPlot = false;
            $scope.dataPlot = [];
            angular.forEach(dqFactory.completeness.variable, function(variable){
                //console.log("emptyPlot dataSharingX: ", variable.dataSharingX);
                //variable.dataSharingX = [];
                //variable.dataSharingY = [];
                //variable.dataCategorical = [];
                variable.state.show = false;
            });
            //$scope.$emit('resetVarPlotXY');
        });


        function setSharingWidth(){
            //console.log("call set sharing width");

            //count number of left column. Max left column=10
            //you can show 10 variables at time
            var countSharingAxis = 0;
            if(dqFactory.completeness.numericalPlot.showAllSharingAxis) {
                angular.forEach(dqFactory.completeness.variables, function (variable) {
                    if (variable.state.show
                        && variable.name != dqFactory.completeness.variables.nameY) //y variable is not considered
                        countSharingAxis += 1;
                    if (countSharingAxis > 10) {
                        alert("you can open only 10 variables at time");
                        countSharingAxis = 10;
                    }
                });
            }

            document.getElementById("onlyMainPlotAndBottom").className = "col-md-".concat(12 - countSharingAxis);
            if(countSharingAxis == 0)
                return "100%";
            else{
                //console.log("offset: ", document.getElementById("onlyMainPlotAndBottom").offsetWidth);
                return document.getElementById("onlyMainPlotAndBottom").offsetWidth;
            }
        }

        // for each record all the selected variables have to miss the value
        // if all the variables have missing value, we push in data[1] which represents missingness
        // else we push in data[0] which satisfy completeness
        function missingLogicEvaluation(){
            $scope.logicEvaluation = dqFactory.completeness.numericalPlot.logicEvaluation;
            var data = [];
            $scope.nameX = dqFactory.completeness.numericalPlot.nameX;
            $scope.nameY = dqFactory.completeness.numericalPlot.nameY;

            var actualContent = dqFactory.getActualContent();

            $scope.optionPlot.chart.xDomain = getRange(actualContent, $scope.nameX);
            $scope.optionPlot.chart.yDomain = getRange(actualContent, $scope.nameY);
            // console.log("olit range: ", $scope.optionPlot.chart.xDomain);

            data.push({key: "Present", color: dqFactory.completeness.color.present, values: []});
            data.push({key: "Missing", color: dqFactory.completeness.color.missing, values: []});


            //checking variable.show
            var noneShow = 0;
            var show = [];
            angular.forEach(dqFactory.completeness.variables, function (variable) {
                if(variable.state.show) {
                    noneShow +=1;
                    show.push(variable.name);
                }
            });


            if(noneShow == 0){ //none is shown, plot only x, y (not missing) variable
                //console.log("No variable shown");
                angular.forEach(actualContent, function (entry) {
                    if (dqFactory.hasMeaningValue(entry[$scope.nameX]) //not null
                        && dqFactory.hasMeaningValue(entry[$scope.nameY]) //not null
                    ) {
                        data[0].values.push({
                            x: entry[$scope.nameX],
                            y: entry[$scope.nameY],
                            size: dqFactory.completeness.numericalPlot.sizeSinglePoint,
                            shape: dqFactory.completeness.numericalPlot.marker.circle
                        });
                    }
                });
            }

            else if(noneShow == 1) {
                //console.log("Shown only one variable");
                angular.forEach(actualContent, function (entry) {
                    if (dqFactory.hasMeaningValue(entry[$scope.nameX]) //not null
                        && dqFactory.hasMeaningValue(entry[$scope.nameY]) //not null
                    ) {

                        angular.forEach(dqFactory.completeness.variables, function (variable) {
                            if (variable.state.selected
                                && variable.state.show
                                && variable.name != $scope.nameX
                                && variable.name != $scope.nameY) {
                                if (dqFactory.hasMeaningValue(entry[variable.name])) { //variable value is not null
                                    data[0].values.push({
                                        x: entry[$scope.nameX],
                                        y: entry[$scope.nameY],
                                        size: dqFactory.completeness.numericalPlot.sizeSinglePoint,
                                        shape: dqFactory.completeness.numericalPlot.marker.circle
                                    });
                                }
                                else{ //variable value is null
                                    data[1].values.push({
                                    x: entry[$scope.nameX],
                                    y: entry[$scope.nameY],
                                    size: dqFactory.completeness.numericalPlot.sizeSinglePoint,
                                    shape: dqFactory.completeness.numericalPlot.marker.circle
                                });
                                }
                            }
                        });
                    }
                });
            }

            else { //more than one, we need to make AND/OR visualisation

                //console.log("show: ", show);

                angular.forEach($scope.variables, function(variable){
                    if(variable.state.show){
                        //console.log("else");
                        variable.optionSharingX.chart.xDomain = $scope.optionPlot.chart.xDomain;
                        variable.optionSharingX.chart.width = $scope.optionPlot.chart.width;
                    }
                });




                if($scope.logicEvaluation === "AND") {
                    //console.log("Data in AND");

                    angular.forEach(actualContent, function (entry) {

                        //calculate only if x an y are not missing
                        if (dqFactory.hasMeaningValue(entry[$scope.nameX])
                            && dqFactory.hasMeaningValue(entry[$scope.nameY])) {

                            var inAnd = true;
                            var control = true; //for breaking the loop: we need only one variable that is not true
                            var controlIndex = 0;



                            angular.forEach(show, function (variable) {
                                //console.log("xDomain: ", $scope.optionPlot.chart.width);



                                //console.log(variable);
                                if (dqFactory.hasMeaningValue(entry[variable])) { // if not null break the check
                                    inAnd = false;
                                    control = false; //necessary to stop like break because if the last is true but in the middle we have a false we lost it
                                }
                                if (controlIndex == show.length) {
                                    //console.log("end forEach ", controlIndex);
                                    control = false;
                                }
                                controlIndex += 1;


                            });



                            if (inAnd) { // all values of shown variable are missing
                                data[1].values.push({
                                    x: entry[$scope.nameX],
                                    y: entry[$scope.nameY],
                                    size: dqFactory.completeness.numericalPlot.sizeSinglePoint,
                                    shape: dqFactory.completeness.numericalPlot.marker.circle
                                })
                            }
                            else { // at least one value is present
                                data[0].values.push({
                                    x: entry[$scope.nameX],
                                    y: entry[$scope.nameY],
                                    size: dqFactory.completeness.numericalPlot.sizeSinglePoint,
                                    shape: dqFactory.completeness.numericalPlot.marker.circle
                                })
                            }
                        }
                    })
                }
                else if($scope.logicEvaluation === "OR") {
                    //console.log("Data in OR");
                    angular.forEach(actualContent, function (entry) {

                        //calculate only if x an y are not missing
                        if (dqFactory.hasMeaningValue(entry[$scope.nameX])
                            && dqFactory.hasMeaningValue(entry[$scope.nameY])) {

                            var inOr = true;
                            var control = true; //for breaking the loop: we need only one variable that is not true
                            var controlIndex = 0;


                            angular.forEach(show, function (variable) {
                                //console.log(variable);
                                if (!dqFactory.hasMeaningValue(entry[variable])) { // if not null break the check
                                    inOr = false;
                                    control = false; //necessary to stop like break because if the last is true but in the middle we have a false we lost it
                                }
                                if (controlIndex == show.length) {
                                    //console.log("end forEach");
                                    control = false;
                                }
                                controlIndex += 1;
                            });



                            if (inOr) { // all values of shown variable are missing
                                data[0].values.push({
                                    x: entry[$scope.nameX],
                                    y: entry[$scope.nameY],
                                    size: dqFactory.completeness.numericalPlot.sizeSinglePoint,
                                    shape: dqFactory.completeness.numericalPlot.marker.circle
                                })
                            }
                            else { // at least one value is present
                                data[1].values.push({
                                    x: entry[$scope.nameX],
                                    y: entry[$scope.nameY],
                                    size: dqFactory.completeness.numericalPlot.sizeSinglePoint,
                                    shape: dqFactory.completeness.numericalPlot.marker.circle
                                })
                            }
                        }
                    })
                }
            }


            //console.log("data missing/present: ", data);

            $scope.noneShow = noneShow;

            return data;
        }

        // function missingLogicOR(){
        //
        //     //TODO check if it return the correct data!
        //
        //     var data = [];
        //     $scope.nameX = dqFactory.completeness.numericalPlot.nameX;
        //     $scope.nameY = dqFactory.completeness.numericalPlot.nameY;
        //
        //     var actualContent = dqFactory.getActualContent();
        //
        //     $scope.optionPlot.chart.xDomain = getRange(actualContent, $scope.nameX);
        //     $scope.optionPlot.chart.yDomain = getRange(actualContent, $scope.nameY);
        //
        //     data.push({key: "Present", color: dqFactory.completeness.color.present, values: []});
        //     data.push({key: "Missing", color: dqFactory.completeness.color.missing, values: []});
        //
        //
        //     //checking variable.show
        //     var noneShow = true;
        //     angular.forEach(dqFactory.completeness.variables, function (item) {
        //         if(item.state.show) noneShow = false;
        //     });
        //
        //
        //
        //     angular.forEach(actualContent, function (entry) {
        //
        //         if (dqFactory.hasMeaningValue(entry[$scope.nameX]) &&
        //             dqFactory.hasMeaningValue(entry[$scope.nameY])) {
        //
        //             var presentInAnd = true;
        //
        //             angular.forEach(dqFactory.completeness.variables, function (item) {
        //                     //skip x and y
        //                 if (item.name != $scope.nameX
        //                     && item.name != $scope.nameY) {
        //                     //check missing value in the actual record
        //                     if (item.state.selected && item.state.show) {
        //                         //console.log("checking value for ", item.name);
        //                         if (!dqFactory.hasMeaningValue(entry[item.name])) {
        //                             presentInAnd = false;
        //                         }
        //                     }
        //                 }
        //             });
        //
        //
        //             //case: the selected variables are not checked to be shown
        //             if(noneShow){
        //                 data[0].values.push({
        //                     x: entry[$scope.nameX],
        //                     y: entry[$scope.nameY],
        //                     size: dqFactory.completeness.numericalPlot.sizeSinglePoint,
        //                     shape: dqFactory.completeness.numericalPlot.marker.circle
        //                 });
        //             }
        //             //case: some of the selected variables are checked to be shown
        //             else if(presentInAnd){
        //                 data[1].values.push({
        //                     x: entry[$scope.nameX],
        //                     y: entry[$scope.nameY],
        //                     size: dqFactory.completeness.numericalPlot.sizeSinglePoint,
        //                     shape: dqFactory.completeness.numericalPlot.marker.circle
        //                 });
        //             }
        //             else {
        //                 data[0].values.push({
        //                     x: entry[$scope.nameX],
        //                     y: entry[$scope.nameY],
        //                     size: dqFactory.completeness.numericalPlot.sizeSinglePoint,
        //                     shape: dqFactory.completeness.numericalPlot.marker.circle
        //                 })
        //             }
        //         }
        //     });
        //     //console.log("data missing/present: ", data);
        //     console.log("data in OR condition");
        //     return data;
        // }

        //function settingData() {
        //    var data = [];
        //    var allVariables = dqFactory.completeness.variables;
        //    $scope.nameX = dqFactory.completeness.numericalPlot.nameX;
        //    $scope.nameY = dqFactory.completeness.numericalPlot.nameY;
        //    //console.log("Variables: ", $scope.nameX, $scope.nameY);
        //
        //    //data.push({key: 'XY', color: dqFactory.completeness.color.present, values: []});
        //    data.push({key: 'XY', values: []});
        //
        //    angular.forEach(allVariables, function (variable) {
        //        if(variable.name != $scope.nameX
        //            && variable.name != $scope.nameY) {
        //
        //            if(variable.state.selected)
        //                data.push({key: variable.name, values: []});
        //        }
        //    });
        //    console.log("data ",data);
        //
        //    var actualContent = dqFactory.getActualContent();
        //
        //    console.log("actual content size: ", actualContent.length);
        //
        //
        //    $scope.optionPlot.chart.xDomain = getRange(actualContent, $scope.nameX);
        //    $scope.optionPlot.chart.yDomain = getRange(actualContent, $scope.nameY);
        //
        //
        //    angular.forEach(actualContent, function (entry) {
        //        if (entry[$scope.nameX] === null
        //            || entry[$scope.nameX] === ""
        //            || entry[$scope.nameX] === "NaN"
        //            || entry[$scope.nameX] === ''
        //            || entry[$scope.nameX] === undefined) {
        //            // TODO array for horizontal bar chart
        //        }
        //        else if (entry[$scope.nameY] === null
        //            || entry[$scope.nameY] === ""
        //            || entry[$scope.nameY] === ''
        //            || entry[$scope.nameY] === "NaN"
        //            || entry[$scope.nameY] === undefined) {
        //            // TODO array for the bottom bar chart
        //        }
        //        else {
        //
        //            data[0].values.push(
        //                {
        //                    x: entry[$scope.nameX],
        //                    y: entry[$scope.nameY],
        //                    size: dqFactory.completeness.numericalPlot.sizeSinglePoint,
        //                    shape: "circle"
        //                }
        //            );
        //
        //
        //            var index = 1;
        //            angular.forEach(dqFactory.completeness.variables, function (item) {
        //                if (item.name != $scope.nameX
        //                    && item.name != $scope.nameY) {
        //
        //                    if (item.state.selected) {
        //                        if (entry[item.name] === null
        //                            || entry[item.name] === ""
        //                            || entry[item.name] === "NaN"
        //                            || entry[item.name] === ''
        //                            || entry[item.name] === undefined) {
        //                            data[index].values.push(
        //                                {
        //                                    x: entry[$scope.nameX],
        //                                    y: entry[$scope.nameY],
        //                                    size: dqFactory.completeness.numericalPlot.sizeSinglePoint,
        //                                    shape: "circle"
        //                                }
        //                            )
        //                        }
        //                        //else {
        //                        //    data[index].values.push(
        //                        //        {
        //                        //            x: entry[$rootScope.gv.stpX],
        //                        //            y: entry[$rootScope.gv.stpY],
        //                        //            size: size,
        //                        //            shape: shapes[0]
        //                        //        }
        //                        //    )
        //                        //}
        //                        index += 1;
        //                    }
        //                }
        //            });
        //        }
        //    });
        //    console.log("data complete: ", data);
        //    return data;
        //}

        /**
         *
         * @param content dataset to loop on
         * @param variable that you want to calculate min and max
         * @returns {*[]} min and max of the variable
         */
        function getRange(content, variable) {
            var min = 0;
            var max = 0;
            angular.forEach(content, function (entry) {
                if (entry[variable] === null
                    || entry[variable] === ""
                    || entry[variable] === "NaN"
                    || entry[variable] === ''
                    || entry[variable] === undefined) {
                }
                else {
                    //$log.debug("variable  ", variable, ": ", entry[variable]);
                    if (parseFloat(entry[variable]) < min) min = parseFloat(entry[variable]);
                    else if (parseFloat(entry[variable]) > max) {
                        max = parseFloat(entry[variable]);
                        //$log.debug("new max for  ", variable, ": ", max);
                    }
                }
            });
            //$log.debug("Range of ", variable, ": [", min, ", ", max, "]");
            return [min, max];
        }

        //for bottom and left charts $scope.showCompletenessTableVariable
        function sharingAxis() {


            angular.forEach(dqFactory.completeness.variables, function (variable) {
                if(variable.state.selected) {

                    //console.log("sharingAxis: ", xWidth);

                    //historical bar chart, sharing x
                    var optionSharingX = {
                        chart: {
                            type: 'historicalBarChart',
                            height: 150,
                            width: xWidth,
                            margin: {
                                //top: 20,
                                right: 20,
                                bottom: 65,
                                left: 75
                            },
                            x: function (d) {
                                return d[0];
                            },
                            y: function (d) {
                                //return d[1] / 100000;
                                return d[1]
                            },
                            showValues: true,
                            valueFormat: function (d) {
                                return d3.format(',.0f')(d);
                            },
                            duration: 100,

                            useInteractiveGuideline: false,
                            tooltip: {
                                contentGenerator: function (e) {
                                    var series = e.series[0];

                                    var rows =
                                        "<tr>" +
                                        "<td class='key'>" + $scope.nameX + "</td>" +
                                        "<td class='x-value'>" + series.key + "</td>" +
                                        "</tr>" +
                                        "<tr>" +
                                        "<td class='key'>Missing: </td>" +
                                        "<td class='x-value'><strong>" + d3.format(',.0f')(series.value) + "</strong></td>" +
                                        "</tr>";

                                    var header =
                                        "<thead>" +
                                        "<tr>" +
                                        "<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
                                        "<td class='key'><strong>" + variable.name + "</strong></td>" +
                                        "</tr>" +
                                        "</thead>";

                                    return "<table>" +
                                        header +
                                        "<tbody>" +
                                        rows +
                                        "</tbody>" +
                                        "</table>";
                                }
                            },




                            //xAxis: {
                            //    axisLabel: $rootScope.gv.stpX,
                            //    tickFormat: function (d) {
                            //        return d3.format('.0f')(d);
                            //        //return d3.time.format('%x')(new Date(d))
                            //    },
                            //    ticks: 8,
                            //    rotateLabels: 30,
                            //    showMaxMin: true
                            //},
                            xDomain: $scope.optionPlot.chart.xDomain,
                            xAxis: $scope.optionPlot.chart.xAxis,
                            yAxis: {
                                axisLabel: variable.name,
                                axisLabelDistance: -10,
                                tickFormat: function (d) {
                                    return d3.format(',.0f')(d);
                                }
                            },
                            multibar: {
                                height: 1
                            },
                            // useInteractiveGuideline: true,
                            // tooltip: {
                            //     keyFormatter: function (d) {
                            //         //$log.debug(d);
                            //         return "(".concat(variable.name).concat(", # missing): ").concat(d);
                            //         //return d3.time.format('%x')(new Date(d));
                            //     }
                            // },
                            zoom: {
                                enabled: false,
                                scaleExtent: [1, 10],
                                useFixedDomain: false,
                                useNiceScale: false,
                                horizontalOff: false,
                                verticalOff: false,
                                unzoomEventType: 'dblclick.zoom'
                            }
                        }
                    };
                    //console.log("xDomain: ", $scope.optionPlot.chart.xDomain);
                    //optionSharingX.chart.xDomain = $scope.optionPlot.chart.xDomain;
                    //optionSharingX.chart.width = xWidth;
                    //console.log(variable.name, " width: ", optionSharingX.chart.width);

                    //optionSharingX.chart.width = document.getElementById("onlyMainPlotAndBottom").offsetWidth;//$scope.optionPlot.chart.width;

                    //optionSharingX.chart.yDomain = $scope.optionPlot.chart.yDomain;
                    //console.log("plot width: ", $scope.optionPlot.chart.width);
                    //optionSharingX.chart.width = $scope.optionPlot.chart.width;

                    //horizontal bar chart, sharing y
                    var optionSharingY = {
                        chart: {
                            type: 'multiBarHorizontalChart',
                            height: $scope.optionPlot.chart.height,
                            width: 80,
                            margin: {
                                left: 0
                            },
                            x: function (d) {
                                return d.label;
                            },
                            y: function (d) {
                                return d.value;
                            },
                            showControls: false,
                            showValues: false,
                            showLegend: false,
                            showXAxis: false,
                            duration: 500,
                            xAxis: {showMaxMin: false},
                            yAxis: {
                                //axisLabel: 'Values',
                                tickFormat: function (d) {
                                    return d3.format(',.0f')(d);
                                }
                            },
                            useInteractiveGuideline: false,
                            tooltip: {
                                contentGenerator: function (e) {
                                    var series = e.series[0];

                                    var rows =
                                        "<tr>" +
                                        "<td class='key'>" + $scope.nameY + "</td>" +
                                        "<td class='x-value'>" + e.value + "</td>" +
                                        "</tr>" +
                                        "<tr>" +
                                        "<td class='key'>Missing: </td>" +
                                        "<td class='x-value'><strong>" + d3.format(',.0f')(series.value) + "</strong></td>" +
                                        "</tr>";

                                    var header =
                                        "<thead>" +
                                        "<tr>" +
                                        "<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
                                        "<td class='key'><strong>" + variable.name + "</strong></td>" +
                                        "</tr>" +
                                        "</thead>";

                                    return "<table>" +
                                        header +
                                        "<tbody>" +
                                        rows +
                                        "</tbody>" +
                                        "</table>";
                                }
                            },
                            multibar: {
                                stacked: false
                            }
                        },
                        title: {
                            enable: true,
                            text: variable.name,
                            className: "h5"
                        },
                        subtitle: {
                            enable: true,
                            text: "#missing",
                            class: {
                                textAlign: "center"
                            }
                        }
                    };

                    var optionCategorical = {
                        chart: {
                            type: 'scatterChart',
                            height: $scope.optionPlot.chart.height,
                            color: dqFactory.completeness.colorRange.present, //d3.scale.category10().range(), //TODO
                            scatter: {
                                onlyCircles: false
                            },
                            showDistX: false,
                            showDistY: false,
                            showLegend: true,

                            useInteractiveGuideline: false,
                            tooltip: {
                                contentGenerator: function (e) {
                                    var series = e.series[0];

                                    var rows =
                                        "<tr>" +
                                        "<td class='key'>" + $scope.nameX + "</td>" +
                                        "<td class='x-value'>" + e.value + "</td>" +
                                        "</tr>" +
                                        "<tr>" +
                                        "<td class='key'>" + $scope.nameY + "</td>" +
                                        "<td class='x-value'><strong>" + d3.format(',.2f')(series.value) + "</strong></td>" +
                                        "</tr>";

                                    var header =
                                        "<thead>" +
                                        "<tr>" +
                                        "<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
                                        "<td class='key'><strong>" + series.key + "</strong></td>" +
                                        "</tr>" +
                                        "</thead>";

                                    return "<table>" +
                                        header +
                                        "<tbody>" +
                                        rows +
                                        "</tbody>" +
                                        "</table>";
                                }

                            },

                            xAxis: {
                                axisLabel: $scope.nameX,
                                tickFormat: function (d) {
                                    return d3.format('.0f')(d);
                                },
                                ticks: 8
                            },
                            yAxis: {
                                axisLabel: $scope.nameY,
                                tickFormat: function (d) {
                                    return d3.format(',.2f')(d);
                                },
                                axisLabelDistance: -5
                            },
                            zoom: {
                                //NOTE: All attributes below are optional
                                enabled: false,
                                scaleExtent: [1, 10],
                                useFixedDomain: false,
                                useNiceScale: false,
                                horizontalOff: false,
                                verticalOff: false
                                //unzoomEventType: 'dblclick.zoom'
                            }
                        },
                        title: {
                            enable: true,
                            text: variable.name,
                            className: "h5"
                        },
                        subtitle: {
                            enable: true,
                            text: "Categories for the "
                                .concat(variable.name)
                                .concat(" variable, related to the ")
                                .concat(dqFactory.completeness.numericalPlot.nameX)
                                .concat(" vs ")
                                .concat(dqFactory.completeness.numericalPlot.nameY)
                                .concat(" plot"),
                            class: {
                                textAlign: "left"
                            },
                            className: "h5"
                        }
                    };
                    optionCategorical.chart.xDomain = $scope.optionPlot.chart.xDomain;
                    //console.log("categorical range: ", optionCategorical.chart.xDomain);
                    optionCategorical.chart.yDomain = $scope.optionPlot.chart.yDomain;


                    var dataSharingX = completenessOfVariableRespectX(variable.name, $scope.nameX);
                    var dataSharingY = completenessOfVariableRespectY(variable.name, $scope.nameY);

                    //var dataCategorical = [];
                    //if(variable.state.isCategorical)
                    var dataCategorical = completenessCategorical(variable.name);

                    variable.optionSharingX = optionSharingX;
                    variable.dataSharingX = dataSharingX;

                    variable.optionSharingY = optionSharingY;
                    variable.dataSharingY = dataSharingY;

                    variable.optionCategorical = optionCategorical;
                    variable.dataCategorical = dataCategorical;

                }
            });


        };

        /**
         *
         * @param variable
         * @param respectToVar
         * @returns {Array}
         */
        function completenessOfVariable(variable, respectToVar){
            if(variable == respectToVar) return null;

            // set the content: whole data or subset
            var actualContent = dqFactory.getActualContent();


            var resultData = [];
            //if non is missing fill count with 0
            // Optimisation
            angular.forEach(dqFactory.completeness.variables, function(item){
                if(item.name == variable && item.statistics.missing == 0){
                    var range = getRange(actualContent, respectToVar);
                    var index = 0;
                    for(index; index < range.max; index = index+0.01){
                        resultData.push({
                            key: index,
                            color: dqFactory.completeness.color.present,
                            count: 0})
                    }
                    return resultData;
                }
            });


            ////////////////////////////////////////////////////

            // initialising the resultData with keys
            angular.forEach(actualContent, function (entry) {
                //$log.debug("adding: ", entry[respectToVar], " count: 0");
                //var label = (entry[respectToVar]).toFixed(2);
                resultData.push({key: entry[respectToVar], count: 0})
            });


            //sorting
            resultData.sort(function(a, b) {
                return a.key - b.key;
            });
            //removing duplicate
            var removeDuplicatesFromObjArray = function(arr, field) {
                var u = [];
                arr.reduce(function (a, b) {
                    if (a[field] !== b[field]) u.push(b);
                    return b;
                }, []);
                return u;
            };
            resultData = removeDuplicatesFromObjArray(resultData, "key");
            //$log.debug(resultData);



            angular.forEach(actualContent, function (entry) {
                if(entry[variable]=== null
                    || entry[variable] === ""
                    || entry[variable] === "NaN"
                    || entry[variable] === ''
                    || entry[variable] === undefined){

                    var actualKey = entry[respectToVar];
                    angular.forEach(resultData, function(item){
                        if(item.key == actualKey){
                            item.count += 1;
                        }
                        //else{
                        //    $log.debug("Skipping ", item.key);
                        //}
                    });
                }
            });
            //$log.debug("resultdata");
            //$log.debug(resultData);
            //$log.debug(JSON.stringify(resultData));
            return resultData;
        }


        /**
         * data for historical bar chart (chart in the bottom of the plot, sharing x axis)
         * @param variable that you want to count the missingness
         * @param respectToVar variable in the x axis of the main plot
         * @returns {*[]}
         */
        function completenessOfVariableRespectX(variable, respectToVar){
            var data = completenessOfVariable(variable, respectToVar);
            // $log.debug("data:\n", data);

            // {"key":"Quantity" , "bar":true, "values": [[1136005200000, 1271000.0], [], []] }
            var result = [{key: variable, bar: true, color: dqFactory.completeness.color.missing, values:[]}];
            angular.forEach(data, function(d){
                result[0].values.push([d.key, d.count]);
            });
            //$log.debug(result);
            return result;
        }

        /**
         * data for horizontal bar chart (chart in the left sharing y axis)
         * @param variable
         * @param respectToVar variable in the y axis of the main plot
         */
        function completenessOfVariableRespectY(variable, respectToVar){
            //$log.debug("Calculating completeness for ", variable, " respect to ", respectToVar);
            var data = completenessOfVariable(variable, respectToVar);
            // {key: 'Missing', values:[{label: variable, value: countMissing}]}
            var result = [];
            result.push({key: 'Missing', color: dqFactory.completeness.color.missing, values:[]});
            var startRange = 0.00;
            angular.forEach(data, function(d){
                var label = parseFloat(d.key).toFixed(2);
                //$log.debug(label, typeof(label), "\nstartRange: ", startRange);
                for(startRange; startRange<label; startRange = startRange + 0.01){
                    result[0].values.unshift({label: startRange, value: 0});
                }
                //unshift is used to prepare the array for vertical display
                result[0].values.unshift({label: label, value: d.count});
            });
            //$log.debug(JSON.stringify(result));
            return result;
        }

        //TODO calculate only for categorical variable!
        //se presenti sono 0 ?
        function completenessCategorical(variable){
            var data = [];
            var actualContent = dqFactory.getActualContent();

            var groupedActualContent = Enumerable.From(actualContent)
                .GroupBy(function(item) { return item[variable]; }).ToArray();

            //$log.debug("grouped: ", groupedActualContent);
            var index = 0;
            angular.forEach(groupedActualContent, function(item){
                //$log.debug("sortedItem ", item);

                data.push({key: item.source[0][variable], values: []});
                angular.forEach(item.source, function(i){
                    if (i[$scope.nameX] === null
                    || i[$scope.nameX] === ""
                    || i[$scope.nameX] === "NaN"
                    || i[$scope.nameX] === ''
                    || i[$scope.nameX] === undefined) {
                        // TODO array for horizontal bar chart
                    }
                    else if (i[$scope.nameY] === null
                        || i[$scope.nameY] === ""
                        || i[$scope.nameY] === ''
                        || i[$scope.nameY] === "NaN"
                        || i[$scope.nameY] === undefined) {
                        // TODO array for the bottom bar chart
                    }
                    else {
                        if (i[variable] === null
                            || i[variable] === ""
                            || i[variable] === ''
                            || i[variable] === "NaN"
                            || i[variable] === undefined) {
                            data[index].key = "Null";
                            data[index].color = dqFactory.completeness.color.missing;
                            data[index].values.push({
                                x: i[$scope.nameX],
                                y: i[$scope.nameY],
                                size: dqFactory.completeness.numericalPlot.sizeSinglePoint,
                                shape: "circle"
                            })
                        }
                        else {
                            data[index].values.push({
                                x: i[$scope.nameX],
                                y: i[$scope.nameY],
                                size: dqFactory.completeness.numericalPlot.sizeSinglePoint,
                                shape: "circle"
                            })
                        }
                    }
                });
                index +=1;
            });
            return data;
        }

    }])

    .controller('parallelCoordinateCtrl', ['$scope','dqFactory', function($scope, dqFactory){

        $scope.variablesList = [];
        angular.forEach(dqFactory.completeness.variables, function(variable){
            $scope.variablesList.push(variable.name);
        });

        $scope.optionParallelCoordinate = {
            chart: {
                type: "parallelCoordinates",
                height: 450,
                margin: {
                    top: 30,
                    right: 0,
                    bottom: 10,
                    left: 0
                },
                dimensions: $scope.variablesList
            }
        }

        $scope.dataParallelCoordinate = getDataParallelCoordinate();
        
        function getDataParallelCoordinate(){
            var data = dqFactory.getActualContent();
            return data; //TODO delete return

            var completeness = [];
            angular.forEach(data, function(item){
                angular.forEach(dqFactory.completeness.variables, function(variable){
                    if(dqFactory.hasMeaningValue(item[variable.name])) {
                        if(variable.state.isNumerical){

                        }
                    }
                })
                completeness.push();
            });

        }
    }]);


//sunburst
//[{"name":"GrowthData_Raw.json","color":"#aaaaaa",
//    "children":[
//        {
//            "name":"ethgrp4 present",
//            "state":"present",
//            "size":73441,
//            "color":"#3f007d",
//            "ring":0,
//            "children":[]
//        },{
//            "name":"ethgrp4 missing",
//            "state":"missing",
//            "size":154,
//            "color":"#08306b",
//            "ring":0,
//            "children":[]
//        },{
//            "name":"weight present",
//            "state":"present",
//            "size":73110,
//            "color":"#54278f",
//            "ring":0,"children":[]
//        },{
//            "name":"weight missing",
//            "state":"missing",
//            "size":485,
//            "color":"#08519c",
//            "ring":0,"children":[]}
//    ]}]



