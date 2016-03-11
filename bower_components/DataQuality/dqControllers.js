// gv = global variables


var dqControllers = angular.module('dqControllers', ['ui.bootstrap'])

    .controller('dataQualityController', ['$scope', '$rootScope', '$log', function($scope, $rootScope, $log){
        $scope.$on('refresh', function(){
            $rootScope.gv.inDeptContent = [];
            $rootScope.gv.varsCompletenessInDeptPresent = [];
            $rootScope.gv.varsCompletenessInDeptMissing = [];

            $rootScope.gv.tableCompleteness = [];

            $rootScope.gv.stpPathCompleteness = []; //{key: "", label: "", index: 0};
            $rootScope.gv.SunburstIndex = 0;


            $scope.$broadcast('ptsChart');
            $scope.$broadcast('stpChart');
        });

        //Global variables
        $rootScope.firstRun = false;
        $rootScope.stpPlotReady = false;


        //http://colorbrewer2.org/
        $rootScope.color = {
            missing: "#d7b5d8", // "#9ecae1", // "#a1dab4", //"#d7b5d8",
            present: "#980043" // "#3182bd" //"#253494" //"#980043"
        };

        $rootScope.colorRange = {
            //darker
            missing: [
                "#006d2c", "#810f7c", "#0868ac", "#b30000", "#016c59",
                "#7a0177", "#253494", "#bd0026", "#2ca25f", "#8856a7",
                "#43a2ca", "#dd1c77", "#2b8cbe", "#f03b20", "#1c9099"
            ],
            //lighter
            present : [
                "#66c2a4", "#8c96c6", "#7bccc4", "#fc8d59", "#67a9cf",
                "#f768a1", "#41b6c4", "#fd8d3c", "#b2e2e2", "#b3cde3",
                "#bae4bc", "#d7b5d8", "#bdc9e1", "#fecc5c", "#bdc9e1"
            ]
        };

        $rootScope.marker = {}
    }])

    .controller('RevisionCtrl', function($scope, $log){
    // TODO fetch data from json file
        $scope.totalItems = 64;
        $scope.currentItem = 4;

        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.pageChanged = function() {
            $log.debug('Visualisation: ' + $scope.currentItem);
        };

        $scope.maxSize = 3;
        $scope.bigTotalItems = 175;
        $scope.bigCurrentItem = 1;
    })

    .controller('AccordionCtrl', function($scope){
        $scope.oneAtATime = true;
        $scope.status = {
            open: {
                isFirstOpen: true,
                isSecondOpen: false
            }
        }
    })

    .controller('fileCtrl', ['$scope', '$rootScope',   function ($scope, $rootScope) {
        $scope.showContent = function ($fileContent) {
            $rootScope.content = JSON.parse($fileContent).entries; //TODO the .entries is due to the transformation of the csv to the json by python
            $rootScope.ready = true;
            var variables = Object.keys($rootScope.content[0]);

            $rootScope.vars = [];  // {Name: "", Selected: false}

            $rootScope.gv = {

                tableCompleteness: [],

                inDeptContent: [],

                areStpAllCheckedCompleteness: false,
                areStpAllCheckedDuplication: false,

                //store selected variables in the menu
                varsCompleteness: [],
                varsDuplication: [],
                //store selected variables in the chart
                varsCompletenessInDeptMissing:[],
                varsCompletenessInDeptPresent:[],

                stpPathCompleteness: [],
                SunburstIndex: 1, //use to loop the sunburst

                //Select then plot
                stpX: [],
                stpY: [],
                stpAll: [],
                areStpAllChecked: false,
                areStpAllShowCheckedCompleteness: false,
                chartStpVars : 0,

                //Plot then Select
                ptsX: [],
                ptsY: [],
                ptsAll: [],
                arePtsAllChecked: false,
                chartStpPlot: 0

            };

            angular.forEach(variables, function(v){
                $rootScope.vars.push({Name: v, Selected: false, Show: false});
                $rootScope.gv.varsCompleteness.push(
                    {Name: v, Selected: false, countVarMissing: 0, countVarPresent: 0, min: 0, max: 0, mean: 0}
                );

            });

        }
    }])


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Select then plot menu
    .controller('xCtrl', ['$scope', '$rootScope',  function($scope, $rootScope){
        $scope.$on('resetVarX', function(){
            $rootScope.gv.stpX = "";
            $rootScope.stpPlotReady = false;
        });
    }])
    .controller('yCtrl', ['$scope', '$rootScope', function($scope, $rootScope){
        $scope.$on('resetVarY', function(){
            $rootScope.gv.stpY = "";
            $rootScope.stpPlotReady = false;
        });
    }])
    .controller('allVarsCtrl', ['$scope', '$rootScope', function($scope, $rootScope){

        //start function completeness
        $scope.checkStpAllCompleteness = function () {
            $rootScope.gv.areStpAllCheckedCompleteness = !!$rootScope.gv.areStpAllCheckedCompleteness;
            angular.forEach($rootScope.gv.varsCompleteness, function (item) {
                item.Selected = $rootScope.gv.areStpAllCheckedCompleteness;
            });
        };

        $scope.resetStpAllCompleteness = function(){
            angular.forEach($rootScope.gv.varsCompleteness, function (item) {
                item.Selected = false;
            });
            $rootScope.gv.areStpAllCheckedCompleteness = false;
            $rootScope.gv.chartStpVars = 0;
            $rootScope.gv.tableCompleteness = [];
            $rootScope.gv.inDeptContent = [];
            $rootScope.gv.stpX = "";
            $rootScope.gv.stpY = "";
            $rootScope.stpPlotReady = false;
        };
        //end functions completeness

        //start functions duplication
        $scope.checkStpAllDuplication = function () {
            $rootScope.gv.areStpAllCheckedDuplication = !!$rootScope.gv.areStpAllCheckedDuplication;
            angular.forEach($rootScope.gv.varsDuplication, function (item) {
                item.Selected = $rootScope.gv.areStpAllCheckedDuplication;
            });
        };
        $scope.resetStpAllDuplication = function(){
            angular.forEach($rootScope.gv.varsDuplication, function (item) {
                item.Selected = false;
            });
            $rootScope.gv.areStpAllCheckedDuplication = false;
        };
        //end functions duplication


        //$rootScope.$on('refresh', function(){
        //    $scope.$broadcast('ptsChart');
        //    $scope.$broadcast('stpChart');
        //})
    }])

    .controller('stpPlotCtrl', ['$scope', '$rootScope', '$log', function($scope, $rootScope, $log){

        $rootScope.stpPlotReady = false;
        $scope.addVarToPlot = false;



        /**
         * data for historical bar chart (chart in the bottom of the plot, sharing x axis)
         * @param variable that you want to count the missingness
         * @param respectToVar variable in the x axis of the main plot
         * @returns {*[]}
         */
        function completenessOfVariableRespectX(variable, respectToVar){
            //$log.debug("Calculating completeness for ", variable, " respect to ", respectToVar);
            var data = completenessOfVariable(variable, respectToVar);
            // $log.debug("data:\n", data);
            // {"key":"Quantity" , "bar":true, "values": [[1136005200000, 1271000.0], [], []] }
            var result = [{key: variable, bar: true, color: $rootScope.color.missing, values:[]}];
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
            result.push({key: 'Missing', values:[]});
            angular.forEach(data, function(d){
                result[0].values.push(d.key, d.count);
            });
            return result;
        }

        /**
         *
         * @param variable
         * @param respectToVar
         * @returns {Array}
         */
        function completenessOfVariable(variable, respectToVar){
            if(variable == respectToVar) return null;

            //////////////////////////////////////////////////////
            // set the content
            var actualContent = [];
            if($rootScope.gv.inDeptContent.length <= 0) {
                //$log.debug("Looking over all records");
                actualContent = $rootScope.content;
            }
            else {
                //$log.debug("Looking in dept");
                actualContent = $rootScope.gv.inDeptContent;
            }

            ////////////////////////////////////////////////////
            // initialising the result
            var resultData = [];
            angular.forEach(actualContent, function (entry) {
                //$log.debug("adding: ", entry[respectToVar], " count: 0");
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
            //$log.debug(resultData);
            return resultData;
        }

        /**
         *
         * @returns {Array}
         */
        function settingData() {
            var data = [];
            var shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'];
            data.push({key: 'Present', color: $rootScope.color.present, values: []});
            data.push({key: 'Missing', color: $rootScope.color.missing, values: []});
            var size = 0.1;


            // TODO take only 100 data points
            //var keepGoing = true;
            //var i = 0;

            var actualContent = [];
            if($rootScope.gv.inDeptContent.length <= 0) {
                actualContent = $rootScope.content;
            }
            else actualContent = $rootScope.gv.inDeptContent;

            $scope.optionStpPlot.chart.xDomain = getRange(actualContent, $rootScope.gv.stpX);
            $scope.optionStpPlot.chart.yDomain = getRange(actualContent, $rootScope.gv.stpY);



            angular.forEach(actualContent, function (entry) {
                //  if (keepGoing) {
                // TODO make an array with missing for the charts
                if (entry[$rootScope.gv.stpX] === null
                    || entry[$rootScope.gv.stpX] === ""
                    || entry[$rootScope.gv.stpX] === "NaN"
                    || entry[$rootScope.gv.stpX] === ''
                    || entry[$rootScope.gv.stpX] === undefined) {
                    // TODO array for horizontal bar chart
                }
                else if (entry[$rootScope.gv.stpY] === null
                    || entry[$rootScope.gv.stpY] === ""
                    || entry[$rootScope.gv.stpY] === ''
                    || entry[$rootScope.gv.stpY] === "NaN"
                    || entry[$rootScope.gv.stpY] === undefined) {
                    // TODO array for the bottom bar chart
                }
                else {
                    //x and y have values
                    data[0].values.push(
                        {
                            x: entry[$rootScope.gv.stpX],
                            y: entry[$rootScope.gv.stpY],
                            size: size,
                            shape: shapes[0],
                            color: $rootScope.color.present
                        }
                    );
                }
                //TODO delete to evaluate all the entries
                // i = i + 1;
                // if (i == 50000) {
                //    console.log("i == ", i);
                //   keepGoing = false;
                //}
                //}
            });

            return data;
        }

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

        $scope.checkStpAllShowCompleteness = function(){
            $rootScope.gv.areStpAllShowCheckedCompleteness = !!$rootScope.gv.areStpAllShowCheckedCompleteness;
            angular.forEach($rootScope.gv.tableCompleteness, function (item) {
                item.Show = $rootScope.gv.areStpAllShowCheckedCompleteness;
            });
        }

        $scope.resetStpAllShowCompleteness = function(){
            angular.forEach($rootScope.gv.tableCompleteness, function (item) {
                item.Show = false;
            });
        }


        $scope.$on('refreshPlot', function() {
            $rootScope.stpPlotReady = true;

            var title = $rootScope.gv.stpX.concat(" vs ").concat($rootScope.gv.stpY);
            $scope.optionStpPlot = {
                chart: {
                    type: 'scatterChart',
                    height: 450,
                    //width: 600,
                    color: d3.scale.category10().range(),
                    scatter: {
                        onlyCircles: false
                    },
                    showDistX: true,
                    showDistY: true,
                    showLegend: true,
                    //tooltipContent: function(d) {
                    //    return d.series && '<h3>' + d.series[0].key + '</h3>';
                    //},
                    // duration: 350,

                    xAxis: {
                        axisLabel: $rootScope.gv.stpX,
                        tickFormat: function (d) {
                            return d3.format('.0f')(d);
                        },
                        ticks: 8
                    },
                    yAxis: {
                        axisLabel: $rootScope.gv.stpY,
                        tickFormat: function (d) {
                            return d3.format(',.0f')(d);
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
                }
            };


            var now1 = new Date();
            $scope.dataStpPlot = settingData();

            $scope.api.update();

            var now2 = new Date();
            var tTime = now2 - now1;
            //document.getElementById("timeExe").textContent = tTime.toString();

            ///**
            // * nvd3 option for missing values y sharing X (historical bar chart)
            // * @type JSON
            // */
            //$scope.optionStpYSharingX = {
            //    chart: {
            //        type: 'historicalBarChart',
            //        height: 450,
            //        margin: {
            //            top: 20,
            //            right: 20,
            //            bottom: 65,
            //            left: 50
            //        },
            //        x: function (d) {
            //            return d[0];
            //        },
            //        y: function (d) {
            //            //return d[1] / 100000;
            //            return d[1]
            //        },
            //        showValues: true,
            //        valueFormat: function (d) {
            //            return d3.format(',.1f')(d);
            //        },
            //        duration: 100,
            //        xAxis: {
            //            axisLabel: $rootScope.gv.stpX,
            //            tickFormat: function (d) {
            //                return d3.time.format('%x')(new Date(d))
            //            },
            //            rotateLabels: 30,
            //            showMaxMin: false
            //        },
            //        yAxis: {
            //            axisLabel: $rootScope.gv.stpY,
            //            axisLabelDistance: -10,
            //            tickFormat: function (d) {
            //                return d3.format(',.1f')(d);
            //            }
            //        },
            //        tooltip: {
            //            keyFormatter: function (d) {
            //                return d3.time.format('%x')(new Date(d));
            //            }
            //        },
            //        zoom: {
            //            enabled: false,
            //            //scaleExtent: [1, 10],
            //            useFixedDomain: false,
            //            useNiceScale: true,
            //            horizontalOff: false,
            //            verticalOff: true,
            //            //unzoomEventType: 'dblclick.zoom'
            //        }
            //    }
            //};
            //$scope.dataStpYSharingX = completenessOfVariableRespectX($rootScope.gv.stpY, $rootScope.gv.stpX);
            //
            ///**
            // * nvd3 option for missing values x sharing Y (horizontal bar chart)
            // * @type JSON
            // */
            //$scope.optionStpXSharingY = {
            //    chart: {
            //        type: 'multiBarHorizontalChart',
            //        height: 200,
            //        width: 400,
            //        color: d3.scale.category10().range(),
            //        x: function (d) {
            //            return d.label;
            //        },
            //        y: function (d) {
            //            return d.value;
            //        },
            //        showControls: true,
            //        showValues: true,
            //        duration: 500,
            //        xAxis: {showMaxMin: false},
            //        yAxis: {
            //            axisLabel: 'Values',
            //            tickFormat: function (d) {
            //                return d3.format(',.0f')(d);
            //            }
            //        },
            //        multibar: {
            //            stacked: false
            //        }
            //    },
            //    title: {
            //        enable: true,
            //        text: title,
            //        className: "h5"
            //    }
            //};
            //$scope.dataStpXSharingY = completenessOfVariableRespectY($rootScope.gv.stpX, $rootScope.gv.stpY);

        });

        $scope.$on('showCompletenessTableVariable', function() {

            /**
             * for each variable in the tableCompleteness it creates dynamically options and data (for missingness)
             * @type {Array}
             */
            $scope.listDataVariables = [];

            angular.forEach($rootScope.gv.tableCompleteness, function (variable) {
                //$log.debug("Show variable? ", variable.Show);
                if(variable.Show) {
                    //$log.debug("Variable: ", variable.variable);

                    //historical bar chart, sharing x
                    var optionSharingX = {
                        chart: {
                            type: 'historicalBarChart',
                            height: 150,
                            width: null,
                            margin: {
                                top: 20,
                                //right: 20,
                                bottom: 65,
                                //left: 50
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
                            xAxis: {
                                axisLabel: $rootScope.gv.stpX,
                                tickFormat: function (d) {
                                    return d3.format('.0f')(d);
                                    //return d3.time.format('%x')(new Date(d))
                                },
                                ticks: 8,
                                rotateLabels: 30,
                                showMaxMin: true
                            },
                            yAxis: {
                                axisLabel: '# of missing',
                                axisLabelDistance: -10,
                                tickFormat: function (d) {
                                    return d3.format(',.0f')(d);
                                }
                            },
                            tooltip: {
                                keyFormatter: function (d) {
                                    //$log.debug(d);
                                    return "(".concat(variable.variable).concat(", # missing): ").concat(d);
                                    //return d3.time.format('%x')(new Date(d));
                                }
                            },
                            zoom: {
                                enabled: true,
                                scaleExtent: [1, 10],
                                useFixedDomain: false,
                                useNiceScale: false,
                                horizontalOff: false,
                                verticalOff: true,
                                unzoomEventType: 'dblclick.zoom'
                            }
                        }
                    };

                    optionSharingX.chart.xDomain = $scope.optionStpPlot.chart.xDomain;
                    optionSharingX.chart.width = $scope.optionStpPlot.chart.width;
                    optionSharingX.chart.xAxis = $scope.optionStpPlot.chart.xAxis;


                    optionSharingX.chart.zoom.enable = true;

                    //horizontal bar chart, sharing y
                    var optionSharingY = {
                        chart: {
                            type: 'multiBarHorizontalChart',
                            width: 200,
                            color: d3.scale.category10().range(),
                            x: function (d) {
                                return d.label;
                            },
                            y: function (d) {
                                return d.value;
                            },
                            showControls: true,
                            showValues: true,
                            duration: 500,
                            xAxis: {showMaxMin: false},
                            yAxis: {
                                axisLabel: 'Values',
                                tickFormat: function (d) {
                                    return d3.format(',.0f')(d);
                                }
                            },
                            multibar: {
                                stacked: false
                            }
                        },
                        title: {
                            enable: true,
                            text: variable.variable,
                            className: "h5"
                        }
                    };

                    optionSharingY.chart.yDomain = $scope.optionStpPlot.chart.yDomain;
                    optionSharingY.chart.height = $scope.optionStpPlot.chart.height;

                    var dataSharingX = completenessOfVariableRespectX(variable.variable, $rootScope.gv.stpX);
                    var dataSharingY = completenessOfVariableRespectY(variable.variable, $rootScope.gv.stpY);

                    $scope.listDataVariables.push(
                        {
                            variable: variable,
                            optionSharingX: optionSharingX,
                            optionSharingY: optionSharingY,
                            dataSharingX: dataSharingX,
                            dataSharingY: dataSharingY
                        }
                    );
                    //$scope.listDataVariables.optionSharingX.chart.xDomain = $scope.optionStpPlot.chart.xDomain;

                    //$scope.listDataVariables.optionSharingY.chart.yDomain = $scope.optionStpPlot.chart.yDomain;
                    //$scope.listDataVariables.optionSharingY.chart.height = $scope.optionStpPlot.chart.height;
                }
            });
            $log.debug("list data variables\n", $scope.listDataVariables, "\n\n\n");
        });

        $scope.$on('addTableVariablesToPlot', function() {
            $log.debug("add?", $scope.addVarToPlot);
            if ($scope.addVarToPlot) {
                //////////////////////////////////////////////////////
                // set the content
                var actualContent = [];
                if ($rootScope.gv.inDeptContent.length <= 0) {
                    //$log.debug("Looking over all records");
                    actualContent = $rootScope.content;
                }
                else {
                    //$log.debug("Looking in dept");
                    actualContent = $rootScope.gv.inDeptContent;
                }

                angular.forEach($rootScope.gv.tableCompleteness, function (item) {
                    $log.debug("variable? ", item.Show);
                    if (item.Show) {
                        angular.forEach(actualContent, function (entry) {
                            //TODO review the conditions: x and y have to be defined
                            if ((entry[$rootScope.gv.stpX] !== null
                                && entry[$rootScope.gv.stpX] !== ""
                                && entry[$rootScope.gv.stpX] !== "NaN"
                                && entry[$rootScope.gv.stpX] !== ''
                                && entry[$rootScope.gv.stpX] !== undefined)
                                &&
                                (entry[$rootScope.gv.stpY] !== null
                                && entry[$rootScope.gv.stpY] !== ""
                                && entry[$rootScope.gv.stpY] !== "NaN"
                                && entry[$rootScope.gv.stpY] !== ''
                                && entry[$rootScope.gv.stpY] !== undefined)
                                &&
                                (entry[item.variable] === null
                                    || entry[item.variable] === ""
                                    || entry[item.variable] === "NaN"
                                    || entry[item.variable] === ''
                                    || entry[item.variable] === undefined)) {
                                $log.debug();
                                $scope.dataStpPlot[1].values.push(
                                    {
                                        x: entry[$rootScope.gv.stpX],
                                        y: entry[$rootScope.gv.stpY],
                                        size: 0.3,
                                        shape: 'diamond',
                                        color: $rootScope.color.missing
                                    }
                                )
                            }

                        });
                    }
                });
                $log.debug(JSON.stringify($scope.dataStpPlot));
                $rootScope.$broadcast("refreshPlot");
            }
            else{
                $scope.$apply(function(){
                    $scope.dataStpPlot = settingData();
                });
            }
        });

    }])

    .controller('showStpCompleteness', ['$scope', '$rootScope', '$log', function($scope, $rootScope, $log) {

        $scope.title = "Completeness";
        //$scope.dataSunburstCompleteness = [{
        //    name: "Growth",
        //    children : []
        //}];

        $scope.$on('stpChart', function() {

            $rootScope.firstRun = true;
            $rootScope.gv.chartStpVars = 1;
            $rootScope.gv.chartPtsVars = 1;

            $rootScope.gv.tableCompleteness = tableCompleteness();

            $scope.optionsMultiBarHorizontalChartCompleteness = {
                chart: {
                    type: 'multiBarHorizontalChart',
                    height: 500,
                    //width: 400,
                    color:  d3.scale.category10().range(),
                    x: function (d) {
                        return d.label;
                    },
                    y: function (d) {
                        return d.value;
                    },
                    showControls: true,
                    showValues: true,
                    duration: 500,
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
                                    tableCompletenessInDept(e.data.key, e.data.label);

                                    $scope.dataMultiBarHorizontalChartCompleteness = mbhcc();
                                    var keySunburst = e.data.label.concat(" ").concat(e.data.key);
                                    $scope.dataSunburstCompleteness = sbc(keySunburst);

                                    $rootScope.gv.SunburstIndex += 1;
                                    //$log.debug("size of SunburstIndex: ", $rootScope.gv.SunburstIndex);
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
                    text: $scope.title,
                    className: "h5"
                }
            };

            $scope.dataMultiBarHorizontalChartCompleteness = mbhcc();

            $scope.optionsSunburstCompleteness = {
                chart: {
                    type: 'sunburstChart',
                    height: 300,
                    color: d3.scale.category20c(),
                    duration: 350,
                    "sunburst": {
                        mode: "count"
                        //mode: "size"
                    }
                }
            };
            $scope.dataSunburstCompleteness = sbc("");

            ////////////////////////////////////////////

            //$scope.optionsBoxPlot = {};
            //$scope.dataBoxPlot = {};

            //////////////////////////////////////////

        });

        function tableCompleteness(){
            var tableCompleteness = [];
            //var globalIndexForSunburst = 0;

            angular.forEach($rootScope.gv.varsCompleteness, function(variable){

                if(variable.Selected) {
                    var countPresent = 0;
                    var countMissing = 0;
                    var min = 0;
                    var max = 0;
                    var sum = 0;
                    angular.forEach($rootScope.content, function (entry) {
                        if (entry[variable.Name] === null
                            || entry[variable.Name] === ""
                            || entry[variable.Name] === "NaN"
                            || entry[variable.Name] === ''
                            || entry[variable.Name] === undefined) {
                            // TODO array for horizontal bar chart
                            countMissing += 1;
                        }
                        else {
                            countPresent += 1;
                            sum = sum + parseFloat(entry[variable.Name]);
                            if (parseFloat(entry[variable.Name]) < min) min = parseFloat(entry[variable.Name]);
                            else if (parseFloat(entry[variable.Name]) > max) max = parseFloat(entry[variable.Name]);
                        }
                    });

                    var table = {
                        variable: "",
                        missing: 0,
                        present: 0,
                        total: 0,
                        min: 0,
                        mean: 0,
                        max: 0
                    };
                    table.variable = variable.Name;
                    table.missing = countMissing;
                    table.present = countPresent;

                    // categorical variables
                    // $log.debug(typeof (sum/countPresent));
                    //TODO review this inclusion ID and make it as requirement for the json file variables
                    if(!variable.Name.includes('ID') && (sum/countPresent)) {
                        table.minV = min.toFixed(2);
                        table.meanV = (sum / countPresent).toFixed(2);
                        table.maxV = max.toFixed(2);
                    }
                    // numerical variables
                    else {
                        table.minV = "";
                        table.meanV = "";
                        table.maxV = "";
                    }
                    table.records = $rootScope.content.length;
                    table.Show = false;

                    tableCompleteness.push(table);
                }
            });
            return tableCompleteness;
        }

        function mbhcc(){
            var presentMissing = [];
            presentMissing.push({key: 'Present', color: $rootScope.color.present, values: []}); //presentMissing[0]
            presentMissing.push({key: 'Missing', color: $rootScope.color.missing, values: []}); //presentMissing[1]
            angular.forEach($rootScope.gv.tableCompleteness, function(variable) {
                presentMissing[0].values.push({label: variable.variable, value: variable.present });
                presentMissing[1].values.push({label: variable.variable, value: variable.missing});
            });
            return presentMissing;
        }


        //i.e., keySunburst = "height_Missing" a selected variable of the horizontal multibarchart
        function sbc(keySunburst) {

            //create first ring of the sunburst
            if (keySunburst === "") {
                $scope.dataSunburstCompleteness = [{
                    name: "Growth",
                    color: "white",
                    children: [],
                    position: 0
                }];
                angular.forEach($rootScope.gv.tableCompleteness, function (entry) {
                    if (entry.present !== 0) {
                        $scope.dataSunburstCompleteness[0].children.push(
                            {name: entry.variable.concat(" Present"),
                                size: entry.present,
                                position: $rootScope.gv.SunburstIndex,
                                color: $rootScope.color.present
                            }
                        );
                    }
                    if (entry.missing !== 0) {

                        $scope.dataSunburstCompleteness[0].children.push(
                            {name: entry.variable.concat(" Missing"),
                                size: entry.missing,
                                position: $rootScope.gv.SunburstIndex,
                                color: $rootScope.color.missing
                            }
                        );
                    }
                });

                return $scope.dataSunburstCompleteness;
            }
            else {
                //new ring,
                //scan($scope.dataSunburstCompleteness, actualPath, globalIndexForSunburst);
                scanForSunburst($scope.dataSunburstCompleteness, $rootScope.gv.SunburstIndex);
                return $scope.dataSunburstCompleteness;
            }
        }

        /**
         * adding rings to the sunburst chart using a tail recursion
         * @param sunburst object to add a new ring
         * @param index dept of the ring
         */
        function scanForSunburst(sunburst, index) {
            var found = false;

            var actualInPath = $rootScope.gv.stpPathCompleteness[index];
            var labelKey = actualInPath.label.concat(" ").concat(actualInPath.key);
            //$log.debug("\n\n\n========Looking for: ", labelKey, "\n\n\ inside\nsunburst:\n",sunburst,
            //    "\n\n\nstpPathCompleteness:\n", $rootScope.gv.stpPathCompleteness, "\n=======\n\n\n");


            angular.forEach(sunburst, function(obj){
                //$log.debug("obj", obj);
                if(obj.hasOwnProperty("children")){
                    //going through the rings to find the correct position for the new ring
                    angular.forEach(obj.children, function(child){

                        //$log.debug("deep: ", $rootScope.gv.SunburstIndex,
                        //    "\n\nPosition == index? ", child.position, " == ", actualInPath.index, child.position == actualInPath.index);


                        //if position and name are found than add the new ring based on the actual table
                        //else continue to the other child
                        //if none child is the one looked for
                        // found stay at false and the function is called recursively to the children
                        if (child.name == labelKey && child.position == actualInPath.index) {
                            child.children = [];
                            var name = labelKey.split(" ");
                            angular.forEach($rootScope.gv.tableCompleteness, function (entry) {
                                //skipping the labelKey variable to avoid insert it into his children
                                if (entry.variable == name[0]) {
                                }
                                else {
                                    if (entry.present !== 0) {
                                        //avoid to duplicate parent in the child ring
                                        if (entry.variable.concat(" Present") === labelKey && entry.position === actualInPath.index) {
                                        }
                                        else {
                                            child.children.push(
                                                {
                                                    name: entry.variable.concat(" Present"),
                                                    size: entry.present,
                                                    position: $rootScope.gv.SunburstIndex+1,
                                                    color: $rootScope.color.present
                                                }
                                            );
                                            //$log.debug(
                                            //    "{name:", entry.variable.concat(" Present"),
                                            //    "size:", entry.present,
                                            //    ", position: ", $rootScope.gv.SunburstIndex+1, "}");
                                            found = true;
                                           // $log.debug("Found present");
                                        }
                                    }

                                    if (entry.missing !== 0) {
                                        //avoid to duplicate parent in the child ring
                                        if (entry.variable.concat(" Missing") === labelKey && entry.position === actualInPath.index) {
                                        }
                                        else {
                                            child.children.push(
                                                {
                                                    name: entry.variable.concat(" Missing"),
                                                    size: entry.missing,
                                                    position: $rootScope.gv.SunburstIndex+1,
                                                    color: $rootScope.color.missing
                                                }
                                            );
                                            //$log.debug(
                                            //    "{name:", entry.variable.concat(" Missing"),
                                            //    "color: orange, size:", entry.missing,
                                            //    ", position: ", $rootScope.gv.SunburstIndex+1, "}");
                                            found = true;
                                            //$log.debug("Found missing");
                                        }
                                    }
                                }
                            });
                        }

                    });
                }
            });
            if(!found){
                angular.forEach(sunburst, function(child){
                    //the function stops when the correct ring is found
                    if(child.hasOwnProperty("children"))
                        scanForSunburst(child.children, index);
                });
            }
        }

        // update the stpPathCompleteness
        function tableCompletenessInDept(key, label){
            var actualContent = [];
            if($rootScope.gv.inDeptContent.length === 0) {
                actualContent = $rootScope.content;
            }
            else actualContent = $rootScope.gv.inDeptContent;

            var newContent = [];

            //reset
            //TODO why reset variables in VarsCompleteness and not in tableCompleteness???
            angular.forEach($rootScope.gv.varsCompleteness, function(vars){
                vars.countVarMissing = 0;
                vars.countVarPresent = 0;
                vars.minV = 0;
                vars.maxV = 0;
                vars.meanV = 0;
                vars.count = 0;
            });

            if(key === "Present"){

                $rootScope.gv.varsCompletenessInDeptPresent.push(label);
                $rootScope.gv.stpPathCompleteness.push(
                    {key: key, label: label, index: $rootScope.gv.SunburstIndex}
                );


                angular.forEach(actualContent, function(entry){
                    if(entry[label] === null
                        || entry[label] === ""
                        || entry[label] === "NaN"
                        || entry[label] === ''
                        || entry[label] === undefined) {}
                    else{
                        angular.forEach($rootScope.gv.varsCompleteness, function(vars){
                            if(entry[vars.Name] === null
                                || entry[vars.Name] === ""
                                || entry[vars.Name] === "NaN"
                                || entry[vars.Name] === ''
                                || entry[vars.Name] === undefined){
                                vars.countVarMissing += 1;
                            }
                            else{
                                vars.countVarPresent += 1;
                                vars.count = vars.count + parseFloat(entry[vars.Name]);
                                if (parseFloat(entry[vars.Name]) < vars.min) vars.min = parseFloat(entry[vars.Name]);
                                else if (parseFloat(entry[vars.Name]) > vars.max) vars.max = parseFloat(entry[vars.Name]);
                            }
                        });
                        newContent.push(entry);
                    }
                })
            }
            else if(key === "Missing"){
                $rootScope.gv.varsCompletenessInDeptMissing.push(label);
                $rootScope.gv.stpPathCompleteness.push(
                    {key: key, label: label, index: $rootScope.gv.SunburstIndex}
                );

                angular.forEach(actualContent, function(entry){
                    if(entry[label] === null
                        || entry[label] === ""
                        || entry[label] === "NaN"
                        || entry[label] === ''
                        || entry[label] === undefined) {
                        angular.forEach($rootScope.gv.varsCompleteness, function(vars) {
                            if (entry[vars.Name] === null
                                || entry[vars.Name] === ""
                                || entry[vars.Name] === "NaN"
                                || entry[vars.Name] === ''
                                || entry[vars.Name] === undefined) {
                                vars.countVarMissing += 1;
                            }
                            else {
                                vars.countVarPresent += 1;
                                vars.count = vars.count + parseFloat(entry[vars.Name]);
                                if (parseFloat(entry[vars.Name]) < vars.min) vars.min = parseFloat(entry[vars.Name]);
                                else if (parseFloat(entry[vars.Name]) > vars.max) vars.max = parseFloat(entry[vars.Name]);
                            }
                        });
                        newContent.push(entry);
                    }
                })
            }

            $rootScope.gv.tableCompleteness = [];
            angular.forEach($rootScope.gv.varsCompleteness, function(vars) {
                if(vars.Selected) {
                    var table = {};
                    table.variable = vars.Name;
                    table.missing = vars.countVarMissing;
                    table.present = vars.countVarPresent;
                    // categorical variables
                    // $log.debug(typeof (sum/countPresent));
                    //TODO duplicated code
                    //TODO review this inclusion ID and make it as requirement for the json file variables
                    if(!vars.Name.includes('ID') && ((vars.count) / (vars.countVarPresent))) {
                        table.minV = (vars.min).toFixed(2);
                        table.meanV = ((vars.count) / (vars.countVarPresent)).toFixed(2);
                        table.maxV = (vars.max).toFixed(2);
                    }
                    // numerical variables
                    else {
                        table.minV = "";
                        table.meanV = "";
                        table.maxV = "";
                    }
                    table.records = actualContent.length;
                    table.Show = false;

                    $rootScope.gv.tableCompleteness.push(table);

                }
            });

            //$log.debug("\n\nstpPathCompleteness\n",$rootScope.gv.stpPathCompleteness);
            $rootScope.gv.inDeptContent = [];
            $rootScope.gv.inDeptContent = newContent;
        }

    }])
    //end Select then plot menu
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Plot then Select menu
    .controller('xPtsCtrl', ['$scope', '$rootScope',  function($scope, $rootScope){
        $scope.$on('resetVarX', function(){
            $rootScope.gv.ptsX = "";
            $rootScope.gv.stpPlotReady = false;
        });
    }])
    .controller('yPtsCtrl', ['$scope', '$rootScope', function($scope, $rootScope){
        $scope.$on('resetVarY', function(){
            $rootScope.gv.ptsY = "";
            $rootScope.gv.stpPlotReady = false;
        });
    }])
    .controller('allVarsPtsCtrl', ['$scope', '$rootScope', function($scope, $rootScope){

        //TODO probably areStpAllChecked needs to be $rootScope
        $scope.checkStpAll = function () {
            $scope.arePtsAllChecked = !!$scope.arePtsAllChecked;
            angular.forEach($rootScope.gv.vars, function (item) {
                item.Selected = $scope.arePtsAllChecked;
            });

        };

        $scope.$on('resetPtsAll', function(){
            angular.forEach($rootScope.gv.vars, function (item) {
                item.Selected = false;
            });
            $scope.arePtsAllChecked = false;
        });

        $rootScope.chartPtsVars = 0;
        $rootScope.chartPtsPlot = 0;
    }])

    .controller('showPtsCompleteness', ['$scope', '$rootScope', '$log', function($scope, $rootScope, $log) {
        $scope.$on('ptsChart', function () {

            $rootScope.firstRun = true;

            this.label = "Selected";

            $log.debug("Refreshing pts chart");

            $rootScope.gv.chartPtsVars = 1;
            $rootScope.gv.chartStpVars = 1;

            //$scope.$broadcast('stpChart DO NOT USE: GOES IN LOOP');

            $scope.options = {
                chart: {
                    type: 'multiBarHorizontalChart',
                    height: 500,
                    //width: 400,
                    color: d3.scale.category10().range(),
                    x: function (d) {
                        return d.label;
                    },
                    y: function (d) {
                        return d.value;
                    },
                    showControls: true,
                    showValues: true,
                    duration: 500,
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
                            //elementClick: function(e) {
                            //    console.log(
                            //        "Variables: ", e.data.key,
                            //        "\nlabel: ", e.data.label,
                            //        "\nvalue: ", e.data.value,
                            //        "\ndata: ", e.data
                            //    );


                        }
                    }
                },
                title: {
                    enable: true,
                    text: "Completeness",
                    className: "h5"
                }
            };
            $scope.dataCompleteness = calculateCompleteness();


            $scope.optionDuplication = {};
            $scope.dataDuplication = {};
        });

        function calculateCompleteness() {
            $rootScope.gv.tableCompleteness = [];
            var presentMissing = [];
            presentMissing.push({key: 'Present', color: $rootScope.color.present, values: []}); //presentMissing[0]
            presentMissing.push({key: 'Missing', color: $rootScope.color.missing, values: []}); //presentMissing[1]
            var countAllPresent = 0;
            var countAllMissing = 0;
            angular.forEach($rootScope.gv.varsCompleteness, function(variable){

                if(variable.Selected) {
                    var countPresent = 0;
                    var countMissing = 0;
                    var min = 0;
                    var max = 0;
                    var sum = 0;
                    angular.forEach($rootScope.content, function (entry) {
                        if (entry[variable.Name] === null
                            || entry[variable.Name] === ""
                            || entry[variable.Name] === "NaN"
                            || entry[variable.Name] === ''
                            || entry[variable.Name] === undefined) {
                            // TODO array for horizontal bar chart
                            countMissing += 1;
                            countAllMissing += 1;
                        }
                        else {
                            countPresent += 1;
                            countAllPresent += 1;
                            sum = sum + parseFloat(entry[variable.Name]);
                            if (parseFloat(entry[variable.Name]) < min) min = parseFloat(entry[variable.Name]);
                            else if (parseFloat(entry[variable.Name]) > max) max = parseFloat(entry[variable.Name]);
                        }
                    });
                    console.log(variable.Name);
                    var table = {
                        variable: "",
                        missing: 0,
                        present: 0,
                        total: 0,
                        min: 0,
                        mean: 0,
                        max: 0
                    };
                    table.variable = variable.Name;
                    table.missing = countMissing;
                    table.present = countPresent;
                    table.minV = min;
                    table.meanV = sum / countPresent;
                    table.maxV = max;
                    table.records = $rootScope.content.length;
                    table.Show = false;

                    $rootScope.gv.tableCompleteness.push(table);

                }
            });
            presentMissing[0].values.push({label: this.label, value: countAllPresent});
            presentMissing[1].values.push({label: this.label, value: countAllMissing});

            return presentMissing;
        }
    }])
    // end Plot then Select menu
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    .controller('TabsDemoCtrl', ['$scope', '$rootScope', '$timeout', '$log', function ($scope, $rootScope, $timeout, $log) {

        $scope.tabs = [
        { title:'Selection',
            templateUrl: "/static/templates/views/components/middleStp.html",
            active: true,
            shortTitle: 'stpChart'
            //myStyle: "'background-color': 'red'",
        },
        { title:'Global',
            content:'Insert here directive',
            templateUrl:"/static/templates/views/components/middlePts.html",
            active: false,
            shortTitle: 'ptsChart'
            //myStyle: "'background-color' : 'blue'",
        }];

        $scope.refresh = function(name){
            if($rootScope.firstRun) {
                $timeout(function () {
                    $log.debug("Refreshing...");
                    $rootScope.$broadcast(name);
                }, 500);
            }
        };

    }]);



