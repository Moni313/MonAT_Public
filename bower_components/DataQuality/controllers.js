/**
 * Created by Monica on 07/04/2016.
 */
var controllers = angular.module('controllers', ['ui.bootstrap', 'dqFactory'])

    .controller('dqCtrl', ['$scope', 'dqFactory', function($scope, dqFactory)   {

        $("#menu-toggle").click(function(e) {
            e.preventDefault();
            $("#wrapper").toggleClass("toggled");
        });

        $scope.menuReady = dqFactory.menuReady;


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
        });

        $scope.$on('startPlotVis', function () {
            console.log("broadcast plot");
            $scope.$broadcast('refreshPlot');
        });
        $scope.$on('resetPlot', function(){
            dqFactory.completeness.numericalPlot.showNumericalPlot = false;
            $scope.$broadcast('emptyPlot');
        });

        $scope.$on('refreshLayout', function(){
            $scope.$broadcast('layout');
        });

    }])


    //Menu controllers

    /**
     * input file controller
     * set content and calculate (first time) information table per each variable
    **/
    .controller('fileCtrl', ['$scope', 'dqFactory', function ($scope, dqFactory) {
        $scope.showContent = function ($fileContent) {

            dqFactory.content = JSON.parse($fileContent).entries; //TODO the .entries is due to the transformation of the csv to the json by python
            dqFactory.completeness.underInvestigation = true;
            dqFactory.nameFile = $scope.nameFile;

            dqFactory.sizeContent = dqFactory.content.length;
            var variables = Object.keys(dqFactory.content[0]); //array of string

            tableCompleteness(variables);

            $scope.$emit('contentUpdated');
        };


        //first instances of tableCompleteness
        //get variables and set the table with completeness information for each variable
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
                            isIndex: row.index
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
                else{
                    dqFactory.completeness.variables.push({
                        name: variable,
                        state: {
                            selected: false, //for vertical menu
                            show: false, //for content show plot/historicalBarChart/horizontalBarChart
                            isNumerical: row.numerical,
                            isCategorical: row.categorical,
                            isIndex: row.index
                        },
                        statistics: {
                            missing: row.missing,
                            missingTotal: row.missing,
                            present: row.present,
                            presentTotal: row.present
                        }
                    });
                }
            });
            //console.log("variables", dqFactory.completeness.variables);
        }
    }])

    .controller('revisionCtrl', function($scope, dqFactory, $log){
        $scope.ready = dqFactory.revision.ready;
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
        $scope.height = dqFactory.completeness.numericalPlot.height;


        $scope.showNumericalPlot = dqFactory.completeness.numericalPlot.showNumericalPlot;

        $scope.allSelected = dqFactory.completeness.allSelected;
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

            if(dqFactory.completeness.allSelected)
                $scope.start();
        };

        $scope.refreshChart = function(){
            $scope.start();
        }

        /**
         * Event: de-select all variables for completeness check
        **/
        $scope.completenessResetAll = function(){

            dqFactory.completeness.numericalPlot.nameX = "";
            dqFactory.completeness.numericalPlot.nameY = "";
            dqFactory.completeness.numericalPlot.show = false;
            dqFactory.completeness.historicalBarChart = [];
            dqFactory.completeness.horizontalBarChart = [];

            dqFactory.completeness.allSelected = false;
            $scope.allSelected = false; //Tho-way binding does not work?

            angular.forEach(dqFactory.completeness.variables, function (variable) {
                variable.state.selected = false;
                variable.state.show = false;
            });


            dqFactory.completeness.barChartShow = false;
            $scope.$emit('resetBarChart');

        };

        /**
         * Event: set color to default value and call the redraw event
        **/
        $scope.completenessResetColor = function(){
            dqFactory.completeness.color.present = "#980043"; //"#08306b"; //
            dqFactory.completeness.color.missing = "#d7b5d8"; //"#6baed6"; //"#d7b5d8";
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
            $scope.width = dqFactory.completeness.numericalPlot.width;
        }

        $scope.startPlot = function(){
            console.log("emit plot");
            dqFactory.completeness.numericalPlot.showNumericalPlot = true;
            $scope.$emit('startPlotVis');
        }

        $scope.$on('layout', function(){
            $scope.width = dqFactory.completeness.numericalPlot.width;
            $scope.height = dqFactory.completeness.numericalPlot.height;
        });

    }])

    .controller('xCtrl', ['$scope', 'dqFactory', function($scope, dqFactory){

        //plot variables
        $scope.variables = dqFactory.completeness.variables;

        $scope.nameX = dqFactory.completeness.numericalPlot.nameX;

        $scope.resetVarX =  function(){
            $scope.nameX = "";
            //console.log("Resetting nameX: ", dqFactory.completeness.numericalPlot.nameX);
            dqFactory.completeness.numericalPlot.nameX = "";
            dqFactory.completeness.numericalPlot.showNumericalPlot = false;
            $scope.$emit('resetPlot');
        };

        $scope.$watch('nameX', function(n){
            dqFactory.completeness.numericalPlot.nameX = n;
        });
    }])

    .controller('yCtrl', ['$scope', 'dqFactory',  function($scope, dqFactory){

        //plot variables
        $scope.variables = dqFactory.completeness.variables;
        $scope.nameY = dqFactory.completeness.numericalPlot.nameY;

        $scope.$watch('nameY', function(n){
            dqFactory.completeness.numericalPlot.nameY = n;
        });

        $scope.resetVarY = function(){
            $scope.nameY = "";
            dqFactory.completeness.numericalPlot.nameY = "",
            dqFactory.completeness.numericalPlot.showNumericalPlot = false;
            $scope.$emit('resetPlot');
        };
    }])



    //Components Controllers
    //contains all the plots:
    //(bar chart, sunburst, plot), (historical bar chart, horizontal bar chart)
    .controller('completenessCtrl', ['$scope', 'dqFactory', function($scope, dqFactory) {

        //$scope.title = "Completeness";

        $scope.sizeSubset = dqFactory.subsetContent.length;

        //set the table with completeness information for each variable
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

                    item.statistics.min = row.min;
                    item.statistics.max = row.max;
                    item.statistics.mean = row.mean;

                }
            });
            return dqFactory.completeness.variables;
        }

        //multiBarHorizontalChart
        //set present/missing data for bar chart
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


        //sunburst
        //state = [present | missing]
        //function sbc(variableSelected, state) {
        //    //create first ring of the sunburst with the selected variables
        //    console.log("dqFactory.completeness.sunburst.ring", dqFactory.completeness.sunburst.ring);
        //    if (dqFactory.completeness.sunburst.ring == 0) {
        //        var sunburstData = [];
        //        sunburstData = [{
        //            name: dqFactory.nameFile,
        //            color: "#aaaaaa",
        //            children: []
        //        }];
        //
        //        var color = 0;
        //        //add all the selected to the ring:0
        //        angular.forEach(dqFactory.completeness.variables, function (variable) {
        //            if(variable.state.selected) {
        //                var indexColorPresent = color % dqFactory.completeness.colorRange.present.length;
        //                var indexColorMissing = color % dqFactory.completeness.colorRange.missing.length;
        //                if (variable.statistics.present > 0) {
        //                    sunburstData[0].children.push({
        //                        name: variable.name.concat(" present"),
        //                        state: "present",
        //                        size: variable.statistics.present,
        //                        color: dqFactory.completeness.colorRange.present[indexColorPresent],
        //                        ring: 0,
        //                        children: []
        //                    })
        //                }
        //                if (variable.statistics.missing > 0) {
        //                    sunburstData[0].children.push({
        //                        name: variable.name.concat(" missing"),
        //                        state: "missing",
        //                        size: variable.statistics.missing,
        //                        color: dqFactory.completeness.colorRange.missing[indexColorMissing],
        //                        ring: 0,
        //                        children: []
        //                    })
        //                }
        //                color += 1;
        //            }
        //        });
        //        dqFactory.completeness.sunburst.ring = 1;
        //        console.log("should be called once: ", JSON.stringify(sunburstData));
        //        console.log("should be called once: ", sunburstData);
        //        return sunburstData;
        //    }
        //    else {
        //        //new ring, new path, update the sunburst
        //
        //        scanSunburst($scope.dataSunburstCompleteness[0].children, dqFactory.completeness.sunburst.ring, variableSelected, state);
        //
        //        return $scope.dataSunburstCompleteness;
        //    }
        //}

        /**
         * adding rings to the sunburst chart using a tail recursion
         * @param sunburst object to add a new ring
         * @param ring index of new ring to add
         * @param variableSelected name of variable to add
         * @param state [present|missing] of variable to add
         */
        //function scanSunburst(children, ring, variableSelected, state) {
        //    var found = false;
        //
        //
        //    angular.forEach(children, function(child){
        //        var nameVar = variableSelected.concat(" ").concat(state);
        //        if((child.name == nameVar) && (child.ring == ring-1)) {
        //            found = true;
        //
        //            var color = 0;
        //
        //            angular.forEach(dqFactory.completeness.variables, function (row) {
        //                if (row.state.selected) {
        //                    console.log("adding", row.name);
        //                    console.log("before children", child.children);
        //
        //                    var indexColorPresent = color % dqFactory.completeness.colorRange.present.length;
        //                    var indexColorMissing = color % dqFactory.completeness.colorRange.missing.length;
        //
        //                    if (row.statistics.present > 0) {
        //                        child.children.push({
        //                            name: row.name,
        //                            state: "present",
        //                            size: row.statistics.present,
        //                            color: dqFactory.completeness.colorRange.present[indexColorPresent],
        //                            ring: ring,
        //                            children: []
        //                        });
        //                    }
        //
        //                    if (row.statistics.missing > 0) {
        //                        child.children.push({
        //                            name: row.name,
        //                            state: "missing",
        //                            size: row.statistics.missing,
        //                            color: dqFactory.completeness.colorRange.missing[indexColorMissing],
        //                            ring: ring,
        //                            children: []
        //                        });
        //                    }
        //                    console.log("after", child.children);
        //                    dqFactory.completeness.sunburst.ring += 1;
        //                }
        //            });
        //
        //        }
        //        if((child.ring < ring-1)
        //            && !found
        //            && (child.hasOwnProperty("children"))){
        //            //going through the rings to find the correct position for the new ring
        //            angular.forEach(child.children, function(child){
        //                console.log("going in deep");
        //                scanSunburst(child.children, ring, variableSelected, state);
        //            })
        //        }
        //    });
        //    if(!found){
        //        console.log("not found");
        //        angular.forEach(children, function(child){
        //            //the function stops when the correct ring is found
        //            if(child.hasOwnProperty("children")) {
        //                console.log("children: ", child.children);
        //                scanSunburst(child.children, ring, variableSelected, state);
        //            }
        //            else{
        //                console.log("no more children");
        //            }
        //        });
        //    }
        //}
        //


        //calculate the sub set based on the user selection on the bar chart
        function selectSubset(key, variableSelected){
            key = key.toLowerCase();
            var actualContent = dqFactory.getActualContent();
            //var sunburstRing = dqFactory.completeness.sunburst.ring;
            var newContent = [];

            //filter the whole data set to keep only records with variableSelected present
            if(key === "present"){

                //add a new ring to the sunburst and set the number of ring
                dqFactory.completeness.interactions.actions.push(
                    {key: key, label: variableSelected}
                );
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
                dqFactory.completeness.interactions.actions.push(
                    //{key: key, label: variableSelected, index: sunburstRing}
                    {key: key, label: variableSelected}
                );
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
            console.log("content # rows: ", dqFactory.subsetContent.length);

            $scope.sizeSubset = dqFactory.subsetContent.length;
            tableCompletenessSelected();
        }



        $scope.optionsMultiBarHorizontalChartCompleteness = {
                chart: {
                    type: 'multiBarHorizontalChart',
                    height: 500,
                    //width: 400,
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

                                    //$scope.dataSunburstCompleteness = sbc((e.data.label).toLowerCase(), (e.data.key).toLowerCase());

                                    $scope.dataMultiBarHorizontalChartCompleteness = mbhcc();
                                    $scope.interactions = dqFactory.completeness.interactions;
                                    console.log("interactions:", $scope.interactios);
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
        $scope.optionsSunburstCompleteness = {
                chart: {
                    type: 'sunburstChart',
                    height: 200,
                    color: dqFactory.completeness.colorRange.present, //d3.scale.category20c(),
                    duration: 350,
                    "sunburst": {
                        mode: "count"
                        //mode: "size"
                    }
                }
            };

        $scope.$on('refreshChart', function() {

            $scope.sizeContent = dqFactory.content.length;
            $scope.sizeSubset = dqFactory.subsetContent.length;

            dqFactory.completeness.barChartShow = true;
            tableCompletenessSelected();
            $scope.variables = dqFactory.completeness.variables;

            //$scope.dataSunburstCompleteness = sbc();
            $scope.dataMultiBarHorizontalChartCompleteness = mbhcc();


            $scope.barChartShow = dqFactory.completeness.barChartShow;

            angular.forEach($scope.variables, function(variable){
                if(variable.state.selected){
                    dqFactory.completeness.interactions.initialSelection.push(variable.name);
                }
            })

            $scope.interactions = dqFactory.completeness.interactions;
            var width = document.getElementById("widthPlot").offsetWidth;
            dqFactory.completeness.numericalPlot.width = width;
        });

        $scope.$on('emptyBarChart', function(){
            $scope.barChartShow = dqFactory.completeness.barChartShow;
            dqFactory.sizeSubset = 0;
            dqFactory.subsetContent = [];
        });

        $scope.$on('refreshPMColor', function(){
            $scope.dataMultiBarHorizontalChartCompleteness = mbhcc();
        })

        //$scope.$on('redrawStpCharts', function(){
        //    $scope.dataMultiBarHorizontalChartCompleteness = mbhcc();
        //
        //    //redraw colors sunburst
        //    redrawSunburstColors($scope.dataSunburstCompleteness);
        //});

    }])



    //content
    .controller('plotCtrl', ['$scope', 'dqFactory', function($scope, dqFactory){

        $scope.presentImage = dqFactory.completeness.numericalPlot.markerImage.present;
        $scope.missingImage = dqFactory.completeness.numericalPlot.markerImage.missing;


        $scope.$on('refreshPlot', function() {
            $scope.variables = dqFactory.completeness.variables;
            $scope.nameX = dqFactory.completeness.numericalPlot.nameX;
            $scope.nameY = dqFactory.completeness.numericalPlot.nameY;

            $scope.showNumericalPlot = dqFactory.completeness.numericalPlot.showNumericalPlot;



            //console.log("x? ", dqFactory.completeness.numericalPlot.nameX);
            //console.log("y? ", $scope.nameY);

            ////for layout ---------------------------------------------------------------------------
            //$scope.height = dqFactory.completeness.numericalPlot.height;
            //
            //
            //var countSharingAxis = 1;
            //angular.forEach(dqFactory.completeness.variables, function(variable){
            //    if(variable.state.show) countSharingAxis += 1;
            //});
            //var spanWidth = "col-md-".concat(12 - countSharingAxis);
            //document.getElementById("widthPlot").className = spanWidth;
            //var actualWidth = document.getElementById("widthPlot").offsetWidth;
            //if(actualWidth != 0) dqFactory.completeness.numericalPlot.width = actualWidth;
            //
            //$scope.width = actualWidth;
            //console.log("actualWidth", actualWidth);
            //// end for layout ----------------------------------------------------------------------

            setLayout();


            //TODO legend is hardcoded for missing/present markers encode
            var title = $scope.nameX.concat(" vs ")
                .concat($scope.nameY);

            console.log(title);


            $scope.height = dqFactory.completeness.numericalPlot.height;
            $scope.width = dqFactory.completeness.numericalPlot.width;
            if($scope.width <= 0)
                $scope.width = null; //first time

            //title = dqFactory.completeness.numericalPlot.title
            $scope.optionPlot = {
                chart: {
                    type: 'scatterChart',
                    height: $scope.height,
                    //width: $scope.width,
                    color: dqFactory.completeness.colorRange.present, //d3.scale.category10().range(), //TODO
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
                }
            };

            //var now1 = new Date();
            $scope.dataPlot = settingData();


            $scope.sharingAxis();
            //$log.debug("listDataVariables ", $rootScope.listDataVariables);

        });

        function setLayout(){
            //for layout ---------------------------------------------------------------------------
            $scope.height = dqFactory.completeness.numericalPlot.height;
            $scope.width = dqFactory.completeness.numericalPlot.width;


            //count number of left column. Max left column=10
            //you can show 10 variables at time
            var countSharingAxis = 1;
            angular.forEach(dqFactory.completeness.variables, function(variable){
                if(variable.state.show) countSharingAxis += 1;
                if(countSharingAxis > 10) {
                    alert("you can open only 10 variables at time");
                    countSharingAxis = 10;
                }
            });

            var spanWidth = "col-md-".concat(12 - countSharingAxis);

            document.getElementById("onlyMainPlotAndBottom").className = spanWidth;

            var actualWidth = document.getElementById("onlyMainPlotAndBottom").offsetWidth;

            //if(actualWidth != 0)
              //  dqFactory.completeness.numericalPlot.width = actualWidth;

            console.log("actualWidth", actualWidth);
            $scope.$emit('refreshLayout');
            // end for layout ----------------------------------------------------------------------
        }

        //TODO check this
        $scope.$on('redrawBottomCharts', function(){
            $scope.sharingAxis();
        });

        $scope.$on('emptyPlot', function(){
            dqFactory.completeness.numericalPlot.showNumericalPlot = false;
            console.log(dqFactory.completeness.numericalPlot.showNumericalPlot);
            $scope.dataPlot = [];
            angular.forEach(dqFactory.completeness.variable, function(variable){
                console.log("emptyPlot dataSharingX: ", variable.dataSharingX);
                variable.dataSharingX = [];
                variable.dataSharingY = [];
                variable.dataCategorical = [];
            });
        });

        $scope.showSharingAxis = function(){
            setLayout();
        };

        $scope.$on('refreshPMColor', function(){
            angular.forEach($scope.variable, function(variable){
                if(variable.dataSharingX)
                    variable.optionSharingX.chart.color = dqFactory.completeness.color;
                if(variable.dataSharingY)
                    variable.optionSharingY.chart.color = dqFactory.completeness.color;
                if(variable.dataCategorical)
                    variable.optionCategorical.chart.color = dqFactory.completeness.color;
            });
        });

        function settingData() {
            var data = [];
            var allVariables = dqFactory.completeness.variables;
            $scope.nameX = dqFactory.completeness.numericalPlot.nameX;
            $scope.nameY = dqFactory.completeness.numericalPlot.nameY;
            //console.log("Variables: ", $scope.nameX, $scope.nameY);

            //data.push({key: 'XY', color: dqFactory.completeness.color.present, values: []});
            data.push({key: 'XY', values: []});

            angular.forEach(allVariables, function (variable) {
                if(variable.name != $scope.nameX
                    && variable.name != $scope.nameY) {

                    if(variable.state.selected)
                        data.push({key: variable.name, values: []});
                }
            });
            console.log("data ",data);

            var actualContent = dqFactory.getActualContent();

            console.log("actual content size: ", actualContent.length);


            $scope.optionPlot.chart.xDomain = getRange(actualContent, $scope.nameX);
            $scope.optionPlot.chart.yDomain = getRange(actualContent, $scope.nameY);


            angular.forEach(actualContent, function (entry) {
                if (entry[$scope.nameX] === null
                    || entry[$scope.nameX] === ""
                    || entry[$scope.nameX] === "NaN"
                    || entry[$scope.nameX] === ''
                    || entry[$scope.nameX] === undefined) {
                    // TODO array for horizontal bar chart
                }
                else if (entry[$scope.nameY] === null
                    || entry[$scope.nameY] === ""
                    || entry[$scope.nameY] === ''
                    || entry[$scope.nameY] === "NaN"
                    || entry[$scope.nameY] === undefined) {
                    // TODO array for the bottom bar chart
                }
                else {

                    data[0].values.push(
                        {
                            x: entry[$scope.nameX],
                            y: entry[$scope.nameY],
                            size: dqFactory.completeness.numericalPlot.sizeSinglePoint,
                            shape: dqFactory.completeness.numericalPlot.marker.present
                        }
                    );


                    var index = 1;
                    angular.forEach(dqFactory.completeness.variables, function (item) {
                        if (item.name != $scope.nameX
                            && item.name != $scope.nameY) {

                            if (item.state.selected) {
                                if (entry[item.name] === null
                                    || entry[item.name] === ""
                                    || entry[item.name] === "NaN"
                                    || entry[item.name] === ''
                                    || entry[item.name] === undefined) {
                                    data[index].values.push(
                                        {
                                            x: entry[$scope.nameX],
                                            y: entry[$scope.nameY],
                                            size: dqFactory.completeness.numericalPlot.sizeSinglePoint,
                                            shape: dqFactory.completeness.numericalPlot.marker.missing
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
                        }
                    });
                }
            });
            console.log("data complete: ", data);
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

        //for bottom and left charts $scope.showCompletenessTableVariable
        $scope.sharingAxis = function() {

            angular.forEach(dqFactory.completeness.variables, function (variable) {
                //$log.debug("Show variable? ", variable.Show);
                if(variable.state.selected) {
                    //$log.debug("Variable: ", variable.variable);

                    //historical bar chart, sharing x
                    var optionSharingX = {
                        chart: {
                            type: 'historicalBarChart',
                            height: 150,
                            width: dqFactory.completeness.numericalPlot.width,
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
                            useInteractiveGuideline: true,
                            tooltip: {
                                keyFormatter: function (d) {
                                    //$log.debug(d);
                                    return "(".concat(variable.name).concat(", # missing): ").concat(d);
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
                        }
                    };

                    //horizontal bar chart, sharing y
                    var optionSharingY = {
                        chart: {
                            type: 'multiBarHorizontalChart',
                            height: dqFactory.completeness.numericalPlot.height,
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
                            text: variable.name,
                            className: "h5"
                        }
                    };

                    var optionCategorical = {
                        chart: {
                            type: 'scatterChart',
                            height: dqFactory.completeness.numericalPlot.height,
                            width: dqFactory.completeness.numericalPlot.width,
                            color: dqFactory.completeness.colorRange.missing, //d3.scale.category10().range(), //TODO
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
                            text: variable.variable,
                            className: "h5"
                        }
                    };
                    optionCategorical.chart.xDomain = $scope.optionPlot.chart.xDomain;
                    optionCategorical.chart.yDomain = $scope.optionPlot.chart.yDomain;


                    var dataSharingX = completenessOfVariableRespectX(variable.name, $scope.nameX);
                    var dataSharingY = completenessOfVariableRespectY(variable.name, $scope.nameY);

                    var dataCategorical = [];
                    //if(variable.state.isCategorical)
                        dataCategorical = completenessCategorical(variable.name);

                    variable.optionSharingX = optionSharingX;
                    variable.dataSharingX = dataSharingX;

                    variable.optionSharingY = optionSharingY;
                    variable.dataSharingY = dataSharingY;

                    variable.optionCategorical = optionCategorical;
                    variable.dataCategorical = dataCategorical;
                };
                //console.log("check sharingX", variable);
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
                        resultData.push({key: index, count: 0})
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
                            data[index].key = "Null",
                            data[index].values.push({
                                x: i[$scope.nameX],
                                y: i[$scope.nameY],
                                size: dqFactory.completeness.numericalPlot.sizeSinglePoint,
                                shape: dqFactory.completeness.numericalPlot.marker.missing
                            })
                        }
                        else {
                            data[index].values.push({
                                x: i[$scope.nameX],
                                y: i[$scope.nameY],
                                size: dqFactory.completeness.numericalPlot.sizeSinglePoint,
                                shape: dqFactory.completeness.numericalPlot.marker.present
                            })
                        }
                    }
                });
                index +=1;
            });
            return data;
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