// gv = global variables


var dqControllers = angular.module('dqControllers', ['ui.bootstrap'])


    /*
     */
    .controller('dataQualityController', ['$scope', '$rootScope', '$log', function($scope, $rootScope, $log){
        /*
        recalculate the missing/present of the variable selected in the list
         */
        $scope.$on('refresh', function(){

            $rootScope.gv.tableCompleteness = [];
            //sunburst variables
            $rootScope.gv.inDeptContent = [];
            $rootScope.gv.varsCompletenessInDeptPresent = [];
            $rootScope.gv.varsCompletenessInDeptMissing = [];
            $rootScope.gv.stpPathCompleteness = []; //{key: "", label: "", index: 0};
            $rootScope.gv.SunburstIndex = 0;

            //reset plot
            $rootScope.stpPlotReady = false;
            $rootScope.gv.stpX = "";
            $rootScope.gv.stpY = "";


            $scope.$broadcast('ptsChart');
            $scope.$broadcast('stpChart');
        });

        $scope.$on('refreshPlot'), function(){
            $rootScope.$broadcast('refreshPlot');
        };

        //Global variables
        $rootScope.firstRun = false;
        $rootScope.stpPlotReady = false;


        //http://colorbrewer2.org/
        $rootScope.color = {
            missing: "#6baed6", //"#d7b5d8", // "#9ecae1", // "#a1dab4", //"#d7b5d8",
            present: "#08306b" //"#980043" // "#3182bd" //"#253494" //"#980043"
        };

        $rootScope.colorRange = {
            missing: [
                "#08306b",
                "#08519c",
                "#2171b5",
                "#4292c6",
                "#6baed6",
                "#9ecae1"
            ],
            present: [
                "#3f007d",
                "#54278f",
                "#6a51a3",
                "#807dba",
                "#9e9ac8",
                "#bcbddc"
            ]
            //missing: [
            //    "#66c2a4"
            //    , "#fdd49e"
            //    , "#6a51a3"
            //    , "#d0d1e6"
            //    , "#d4b9da"
            //    , "#c7e9b4"
            //    , "#fee391"
            //    , "#d9d9d9"
            //    , "#fc8d59"
            //    , "#74a9cf"
            //    , "#f768a1"
            //    , "#41b6c4"
            //    , "#fd8d3c"
            //    , "#969696"
            //    , "#ccece6"
            //
            //
            //],
            //present: [
            //    "#00441b"
            //    , "#d7301f"
            //    , "#dadaeb"
            //    , "#0570b0"
            //    , "#e7298a"
            //    , "#1d91c0"
            //    , "#ec7014"
            //    , "#525252"
            //    , "#7f0000"
            //    , "#023858"
            //    , "#49006a"
            //    , "#081d58"
            //    , "#800026"
            //    , "#000000"
            //    , "#238b45"
            //]

            ////darker
            //missing: [
            //    "#006d2c", //1
            //    "#810f7c", //2
            //    "#0868ac", //3
            //    "#b30000", //4
            //    "#016c59", //5
            //    "#7a0177", //6
            //    "#253494", //7
            //    "#bd0026", //8
            //    "#2ca25f", //9
            //    "#8856a7", //10
            //    "#43a2ca", //11
            //    "#dd1c77", //12
            //    "#2b8cbe", //13
            //    "#f03b20", //14
            //    "#1c9099"  //15
            //],
            ////lighter
            //present : [
            //    "#66c2a4", //1
            //    "#8c96c6", //2
            //    "#7bccc4", //3
            //    "#fc8d59", //4
            //    "#67a9cf", //5
            //    "#f768a1", //6
            //    "#41b6c4", //7
            //    "#fd8d3c", //8
            //    "#b2e2e2", //9
            //    "#b3cde3", //10
            //    "#bae4bc", //11
            //    "#d7b5d8", //12
            //    "#bdc9e1", //13
            //    "#fecc5c", //14
            //    "#bdc9e1"  //15
            //]
        };

        $rootScope.marker = {
            circleMarker: "/static/myImg/circle.png",
            "triangleUp": "/static/myImg/triangle-up.png",
            triangleDown: "/static/myImg/triangle-down.png"
        };

        $rootScope.stp = {
            plotHeight : 500,
            plotWidth : 0
        }


        $rootScope.history = {
            file: "", //name of the file uploaded
            steps: {
                index : 0,
                firstRun: false,
                stpPlotReady: false,


                tableCompleteness: [],
                inDeptContent: [],
                stpX : "",
                stpY: "",
            }
        }

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
        };
    })

    /*

    */
    .controller('fileCtrl', ['$scope', '$rootScope', '$log',  function ($scope, $rootScope, $log) {
        $scope.showContent = function ($fileContent) {

            $rootScope.content = JSON.parse($fileContent).entries; //TODO the .entries is due to the transformation of the csv to the json by python
            $rootScope.ready = true;

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
                stpX: "",
                stpY: "",
                stpAll: [],
                areStpAllChecked: false,
                areStpAllShowCheckedCompleteness: false,
                chartStpVars : 0,

                //Plot then Select
                ptsX: "",
                ptsY: "",
                ptsAll: [],
                arePtsAllChecked: false,
                chartStpPlot: 0

            };

            var variables = Object.keys($rootScope.content[0]);
            angular.forEach(variables, function(v){
                $rootScope.vars.push({Name: v, Selected: false, Show: false});
                $rootScope.gv.varsCompleteness.push(
                    {
                        Name: v,
                        Selected: false,
                        countVarMissing: 0,
                        countVarPresent: 0,
                        min: 0,
                        max: 0,
                        mean: 0
                    }
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
            $rootScope.listDataVariables = [];
        });
    }])
    .controller('yCtrl', ['$scope', '$rootScope', function($scope, $rootScope){
        $scope.$on('resetVarY', function(){
            $rootScope.gv.stpY = "";
            $rootScope.stpPlotReady = false;
            $rootScope.listDataVariables = [];
        });
    }])
    .controller('allVarsCtrl', ['$scope', '$rootScope', '$log', function($scope, $rootScope, $log){

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

        $scope.resetColorCompleteness = function(){
            $rootScope.color.present = "#980043";
            $rootScope.color.missing = "#d7b5d8";
            $scope.stpRefreshColor();
        };

        $scope.stpRefreshColor =  function(){

            //refresh charts (horizontal bar chart and sunburst)
            //$rootScope.$broadcast('ptsChart');
            $rootScope.$broadcast('redrawStpCharts');

            //refresh plot
            //if($rootScope.gv.stpX && $rootScope.gv.stpY){
            //    $log.debug('changing color in the plot', $rootScope.gv.stpX, $rootScope.gv.stpY);
            //    $rootScope.$broadcast('refreshPlot');
            //}

            $rootScope.$broadcast('redrawStpBottomCharts');
        };

    }])

    .controller('stpPlotCtrl', ['$scope', '$rootScope', '$log', function($scope, $rootScope, $log){
        $rootScope.stpPlotReady = false;
        //$scope.addVarToPlot = false;

        $rootScope.stp.plotWidth = document.getElementById("widthPlot").offsetWidth;
        $log.debug($rootScope.stp.plotWidth);


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
            result.push({key: 'Missing', color: $rootScope.color.missing, values:[]});
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
            //$log.debug(resultData);
            return resultData;
        }

        function completenessCategorical(variable){
            var data = [];
            var actualContent = [];
            var size = 0.1; //TODO size and shapes is alwasy the same make it global
            var shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'];

            if ($rootScope.gv.inDeptContent.length <= 0) {
                actualContent = $rootScope.content;
            }
            else actualContent = $rootScope.gv.inDeptContent;

            var groupedActualContent = Enumerable.From(actualContent)
                .GroupBy(function(item) { return item[variable]; }).ToArray();

            $log.debug("grouped: ", groupedActualContent);
            var index = 0;
            angular.forEach(groupedActualContent, function(item){
                $log.debug("sortedItem ", item);
                data.push({key: item.source[0][variable], values: []});
                angular.forEach(item.source, function(i){
                    if (i[$rootScope.gv.stpX] === null
                    || i[$rootScope.gv.stpX] === ""
                    || i[$rootScope.gv.stpX] === "NaN"
                    || i[$rootScope.gv.stpX] === ''
                    || i[$rootScope.gv.stpX] === undefined) {
                        // TODO array for horizontal bar chart
                    }
                    else if (i[$rootScope.gv.stpY] === null
                        || i[$rootScope.gv.stpY] === ""
                        || i[$rootScope.gv.stpY] === ''
                        || i[$rootScope.gv.stpY] === "NaN"
                        || i[$rootScope.gv.stpY] === undefined) {
                        // TODO array for the bottom bar chart
                    }
                    else {
                        if (i[variable] === null
                            || i[variable] === ""
                            || i[variable] === ''
                            || i[variable] === "NaN"
                            || i[variable] === undefined) {
                            data[index].values.push(
                                {
                                    x: i[$rootScope.gv.stpX],
                                    y: i[$rootScope.gv.stpY],
                                    size: size,
                                    shape: shapes[3]
                                })
                        }
                        else {
                            data[index].values.push(
                                {
                                    x: i[$rootScope.gv.stpX],
                                    y: i[$rootScope.gv.stpY],
                                    size: size,
                                    shape: shapes[2]
                                })
                        }
                    }
                });
                index +=1;
            });
            return data;
        }

        /**
         *
         * @returns {Array}
         */
        function settingData() {
            var data = [];
            var shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'];
            data.push({key: 'XY', color: $rootScope.colorRange.present[0], values: []});
            angular.forEach($rootScope.gv.tableCompleteness, function (item) {
                if(item.variable != $rootScope.gv.stpX && item.variable != $rootScope.gv.stpY)
                    data.push({key: item.variable, values: []});
            });

            //data.push({key: 'Present', color: $rootScope.color.present, values: []});
            //data.push({key: 'Missing', color: $rootScope.color.missing, values: []});
            var size = 0.1;


            // TODO take only 100 data points
            //var keepGoing = true;
            //var i = 0;

            var actualContent = [];
            if ($rootScope.gv.inDeptContent.length <= 0) {
                actualContent = $rootScope.content;
            }
            else actualContent = $rootScope.gv.inDeptContent;


            $scope.optionStpPlot.chart.xDomain = getRange(actualContent, $rootScope.gv.stpX);
            $scope.optionStpPlot.chart.yDomain = getRange(actualContent, $rootScope.gv.stpY);

            angular.forEach(actualContent, function (entry) {
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

                    data[0].values.push(
                        {
                            x: entry[$rootScope.gv.stpX],
                            y: entry[$rootScope.gv.stpY],
                            size: size,
                            shape: shapes[2],
                        }
                    );


                    var index = 1;
                    angular.forEach($rootScope.gv.tableCompleteness, function (item) {
                        if(item.variable != $rootScope.gv.stpX && item.variable != $rootScope.gv.stpY) {
                            if (entry[item.variable] === null
                                || entry[item.variable] === ""
                                || entry[item.variable] === "NaN"
                                || entry[item.variable] === ''
                                || entry[item.variable] === undefined) {
                                data[index].values.push(
                                    {
                                        x: entry[$rootScope.gv.stpX],
                                        y: entry[$rootScope.gv.stpY],
                                        size: size,
                                        shape: shapes[3] //TODO delete shapes and use $root.marker
                                    }
                                )
                            }
                            //else {
                            //    data[index].values.push(
                            //        {
                            //            x: entry[$rootScope.gv.stpX],
                            //            y: entry[$rootScope.gv.stpY],
                            //            size: size,
                            //            shape: shapes[0]
                            //        }
                            //    )
                            //}
                            index += 1;
                        }
                    });
                }
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


            //for layout
            var countSharingAxis = 1;
            angular.forEach($rootScope.listDataVariables, function(item){
                if(item.variable.Show) countSharingAxis += 1;
            });
            var spanWidth = "col-md-".concat(12 - countSharingAxis);
            document.getElementById("stpPlotAndBottom").className = spanWidth;
            //document.getElementsByClassName("stpPlotAndBottom").className = spanWidth;
            var actualWidth = document.getElementById("stpPlotAndBottom").offsetWidth;
            if(actualWidth != 0) $rootScope.stp.plotWidth = actualWidth;



            //TODO legend is hardcoded for missing/present markers encode
            var title = $rootScope.gv.stpX.concat(" vs ").concat($rootScope.gv.stpY);

            $scope.optionStpPlot = {
                chart: {
                    type: 'scatterChart',
                    height: $rootScope.stp.plotHeight,
                    width: $rootScope.stp.plotWidth,
                    color: $rootScope.colorRange.missing, //d3.scale.category10().range(), //TODO
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
                }
            };


            var now1 = new Date();
            $scope.dataStpPlot = settingData();

            //TODO is this necessary?
            //$scope.api.update();

            var now2 = new Date();
            var tTime = now2 - now1;
            //document.getElementById("timeExe").textContent = tTime.toString();

            //refresh
            //$rootScope.listDataVariables = $rootScope.listDataVariables;


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

            $scope.showCompletenessTableVariable();
            $log.debug("listDataVariables ", $rootScope.listDataVariables);

        });


        //for bottom and left charts
        $scope.showCompletenessTableVariable = function() {

            /**
             * for each variable in the tableCompleteness it creates dynamically options and data (for missingness)
             * @type {Array}
             */
            $rootScope.listDataVariables = [];

            angular.forEach($rootScope.gv.tableCompleteness, function (variable) {
                //$log.debug("Show variable? ", variable.Show);
                if(variable.Show) {
                    //$log.debug("Variable: ", variable.variable);

                    //historical bar chart, sharing x
                    var optionSharingX = {
                        chart: {
                            type: 'historicalBarChart',
                            height: 150,
                            width: $scope.optionStpPlot.chart.width,
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
                            xDomain: $scope.optionStpPlot.chart.xDomain,
                            xAxis: $scope.optionStpPlot.chart.xAxis,
                            yAxis: {
                                axisLabel: variable.variable.concat(' missing'),
                                axisLabelDistance: -10,
                                tickFormat: function (d) {
                                    return d3.format(',.0f')(d);
                                }
                            },
                            multibar: {
                                height: 1
                            },
                            useInteractiveGuideline: true,
                            tooltip: {
                                keyFormatter: function (d) {
                                    //$log.debug(d);
                                    return "(".concat(variable.variable).concat(", # missing): ").concat(d);
                                    //return d3.time.format('%x')(new Date(d));
                                }
                            },
                            zoom: {
                                enabled: false,
                                scaleExtent: [1, 10],
                                useFixedDomain: false,
                                useNiceScale: false,
                                horizontalOff: false,
                                verticalOff: true,
                                unzoomEventType: 'dblclick.zoom'
                            }
                        },
                    };

                    //horizontal bar chart, sharing y
                    var optionSharingY = {
                        chart: {
                            type: 'multiBarHorizontalChart',
                            height: $rootScope.stp.plotHeight,
                            width: 80,
                            color: d3.scale.category10().range(),
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
                            useInteractiveGuideline: true,
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

                    var optionCategorical = {
                        chart: {
                            type: 'scatterChart',
                            height: $rootScope.stp.plotHeight,
                            width: $rootScope.stp.plotWidth,
                            color: $rootScope.colorRange.missing, //d3.scale.category10().range(), //TODO
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
                            text: variable.variable,
                            className: "h5"
                        }
                    };
                    optionCategorical.chart.xDomain = $scope.optionStpPlot.chart.xDomain;
                    optionCategorical.chart.yDomain = $scope.optionStpPlot.chart.yDomain;


                    var dataSharingX = completenessOfVariableRespectX(variable.variable, $rootScope.gv.stpX);
                    var dataSharingY = completenessOfVariableRespectY(variable.variable, $rootScope.gv.stpY);

                    //TODO only if categorical!
                    var dataCategorical = completenessCategorical(variable.variable);

                    $rootScope.listDataVariables.push(
                        {
                            variable: variable,
                            optionSharingX: optionSharingX,
                            optionSharingY: optionSharingY,
                            optionCategorical: optionCategorical,
                            dataSharingX: dataSharingX,
                            dataSharingY: dataSharingY,
                            dataCategorical: dataCategorical
                        }
                    );
                }
            });
            //$log.debug("list data variables\n", $rootScope.listDataVariables, "\n\n\n");

            //LOOP!! if($rootScope.stpPlotReady) $rootScope.$broadcast('refreshPlot');
        };

        $scope.$on('redrawStpBottomCharts', function(){
            $scope.showCompletenessTableVariable();
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
                    color:  $rootScope.colorRange.present,//d3.scale.category10().range(),
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
                    height: 200,
                    color: $rootScope.colorRange.present, //d3.scale.category20c(),
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

        $scope.$on('redrawStpCharts', function(){
            $scope.dataMultiBarHorizontalChartCompleteness = mbhcc();

            //redraw colors sunburst
            redrawSunburstColors($scope.dataSunburstCompleteness);
        });

        //redraw colors
        function redrawSunburstColors(sunburst){
            //$log.debug("sunburst", JSON.stringify(sunburst));
            angular.forEach(sunburst, function(item) {
                if (item.name.includes('Missing')) item.color = $rootScope.color.missing;
                else if (item.name.includes('Present')) item.color = $rootScope.color.present;
                if (item.hasOwnProperty("children")) {
                    redrawSunburstColors(item.children);
                }
            });
        }

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
            templateUrl: "/static/templates/components/middleStp.html",
            active: true,
            shortTitle: 'stpChart'
            //myStyle: "'background-color': 'red'",
        },
        { title:'Global',
            content:'Insert here directive',
            templateUrl:"/static/templates/components/middlePts.html",
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
