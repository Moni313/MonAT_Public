// gv = global variables


var dqControllers = angular.module('dqControllers', ['ui.bootstrap'])

    .controller('dataQualityController', function($scope, $rootScope){
        $scope.$on('refresh', function(){
            $rootScope.gv.inDeptContent = [];
            $rootScope.gv.varsCompletenessInDeptPresent = [];
            $rootScope.gv.varsCompletenessInDeptMissing = [];

            $rootScope.gv.tableCompleteness = [];

            $rootScope.gv.stpPathCompleteness = []; //{key: "", label: "", index: 0};


            $scope.$broadcast('ptsChart');
            $scope.$broadcast('stpChart');
        });
        $rootScope.firstRun = false;
    })

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
            isFirstOpen: true,
            isSecondOpen:false
        }
    })

    .controller('fileCtrl', ['$scope', '$rootScope', '$log',   function ($scope, $rootScope, $log) {
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
                //store selected variables in the chart
                varsCompletenessInDeptMissing:[],
                varsCompletenessInDeptPresent:[],

                stpPathCompleteness: [],

                //Select then plot
                stpX: [],
                stpY: [],
                stpAll: [],
                areStpAllChecked: false,
                chartStpVars : 0,

                //Plot then Select
                ptsX: [],
                ptsY: [],
                ptsAll: [],
                arePtsAllChecked: false,
                chartStpPlot: 0

            };

            angular.forEach(variables, function(v){
                $rootScope.vars.push({Name: v, Selected: false});
                $rootScope.gv.varsCompleteness.push(
                    {Name: v, Selected: false, countVarMissing: 0, countVarPresent: 0, min: 0, max: 0, mean: 0}
                );

            });

        }
    }])


    //Select then plot menu
    .controller('xCtrl', ['$scope', '$rootScope',  function($scope, $rootScope){
        $scope.$on('resetVarX', function(){
            $rootScope.gv.stpX = "";
        });
    }])
    .controller('yCtrl', ['$scope', '$rootScope', function($scope, $rootScope){
        $scope.$on('resetVarY', function(){
            $rootScope.gv.stpY = "";
        });
    }])
    .controller('allVarsCtrl', ['$scope', '$rootScope', function($scope, $rootScope){

        //start function completeness
        $scope.checkStpAllCompleteness = function () {
            if ($rootScope.gv.areStpAllCheckedCompleteness) {
                $rootScope.gv.areStpAllCheckedCompleteness = true;
            } else {
                $rootScope.gv.areStpAllCheckedCompleteness = false;
            }
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
        };
        //end functions completeness

        //start functions duplication
        $scope.checkStpAllDuplication = function () {
            if ($rootScope.gv.areStpAllCheckedDuplication) {
                $rootScope.gv.areStpAllCheckedDuplication = true;
            } else {
                $rootScope.gv.areStpAllCheckedDuplication = false;
            }
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
    //end Select then plot



    // Plot then Select menu
    .controller('xPtsCtrl', ['$scope', '$rootScope',  function($scope, $rootScope){
        $scope.$on('resetVarX', function(){
            $rootScope.gv.ptsX = "";
        });
    }])
    .controller('yPtsCtrl', ['$scope', '$rootScope', function($scope, $rootScope){
        $scope.$on('resetVarY', function(){
            $rootScope.gv.ptsY = "";
        });
    }])
    .controller('allVarsPtsCtrl', ['$scope', '$rootScope', function($scope, $rootScope){

        //TODO probably areStpAllChecked needs to be $rootScope
        $scope.checkStpAll = function () {
            if ($scope.arePtsAllChecked) {
                $scope.arePtsAllChecked = true;
            } else {
                $scope.arePtsAllChecked = false;
            }
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

    .controller('TabsDemoCtrl', ['$scope', '$rootScope', '$timeout', '$log', function ($scope, $rootScope, $timeout, $log) {

        $scope.tabs = [
        { title:'Select then plot',
            templateUrl: "/static/templates/views/components/middleStp.html",
            active: true,
            shortTitle: 'stpChart',
            //myStyle: "'background-color': 'red'",
        },
        { title:'Plot then select',
            content:'Insert here directive',
            templateUrl:"/static/templates/views/components/middlePts.html",
            active: false,
            shortTitle: 'ptsChart',
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

    }])

    .controller('showStpCompleteness', ['$scope', '$rootScope', '$log', function($scope, $rootScope, $log) {

        $scope.title = "Completeness";
        $scope.dataSunburstCompleteness = [{
            name: "Growth",
            children : []
        }];

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
                        showMaxMin: false,
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

                                    //updating path to track sunburst keys
                                    //$rootScope.gv.stpPathCompleteness.push({key: e.data.key, label: e.data.label})

                                    $scope.dataMultiBarHorizontalChartCompleteness = mbhcc();
                                    var keySunburst = e.data.label.concat(" ").concat(e.data.key);
                                    $scope.dataSunburstCompleteness = sbc(keySunburst);
                                });
                            }
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
                    height: 300,
                    color: d3.scale.category20c(),
                    duration: 350,
                    "sunburst": {
                        mode: "count"//"size"
                    }
                }
            };


            $scope.dataMultiBarHorizontalChartCompleteness = mbhcc();
            $scope.dataSunburstCompleteness = sbc("");

            ////////////////////////////////////////////

            //$scope.optionsBoxPlot = {};
            //$scope.dataBoxPlot = {};

            //////////////////////////////////////////

        });

        function tableCompleteness(){
            this.tableCompleteness = [];
            this.globalIndexForSunburst = 0;

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
                    //console.log(variable.Name);
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
                    this.tableCompleteness.push(table);
                }
            });
            return this.tableCompleteness;
        }

        function mbhcc(){
            var presentMissing = [];
            presentMissing.push({key: 'Present', values: []}); //presentMissing[0]
            presentMissing.push({key: 'Missing', values: []}); //presentMissing[1]
            angular.forEach($rootScope.gv.tableCompleteness, function(variable) {
                presentMissing[0].values.push({label: variable.variable, value: variable.present});
                presentMissing[1].values.push({label: variable.variable, value: variable.missing});
            });
            return presentMissing;
        }


        //i.e., keySunburst = "height_Missing" a selected variable of the horizontal multibarchart
        function sbc(keySunburst) {
            if (keySunburst === "") {
                //create first ring of the sunburst
                $scope.dataSunburstCompleteness = [{
                    name: "Growth",
                    children: []
                }];
                angular.forEach($rootScope.gv.tableCompleteness, function (entry) {
                    if (entry.present !== 0) {
                        $scope.dataSunburstCompleteness[0].children.push(
                            {name: entry.variable.concat(" Present"), size: entry.present}
                        );
                    }
                    if (entry.missing !== 0) {

                        $scope.dataSunburstCompleteness[0].children.push(
                            {name: entry.variable.concat(" Missing"), color: "orange", size: entry.missing}
                        );
                    }
                });
                return $scope.dataSunburstCompleteness;
            }
            else {
                //new ring,
                //scan($scope.dataSunburstCompleteness, $rootScope.gv.stpPathCompleteness, this.globalIndexForSunburst);
                var actualPath = angular.copy($rootScope.gv.stpPathCompleteness);
                scan($scope.dataSunburstCompleteness, actualPath, this.globalIndexForSunburst);
                return $scope.dataSunburstCompleteness;
            }
        }


        this.globalIndexForSunburst = 0;
        //adding rings to the sunburst chart
        function scan(sunburst, path, index) {
            $log.debug("\nsunburst:\n", JSON.stringify(sunburst), "\npath:\n", JSON.stringify(path));

            //take the path to reach the children to add the new ring
            //take the first element in stpPathCompleteness
            var first = path.shift();
            var actual = first.label.concat(" ").concat(first.key);
            $log.debug("actual in path: ", actual, "\npath: ", path, "\n\n");
            $log.debug("sunburst children: ", sunburst[index].children);


            angular.forEach(sunburst[index].children, function (child) {
                $log.debug("child:\n", child);
                $log.debug(child.name === actual);
                if (child.name === actual) {
                    child.children = [];
                    angular.forEach($rootScope.gv.tableCompleteness, function (entry) {
                        if (entry.present !== 0) {
                            if(entry.variable.concat(" Present") === actual ){}
                            else {
                                child.children.push(
                                    {name: entry.variable.concat(" Present"), size: entry.present}
                                );
                                $log.debug("{name:", entry.variable.concat(" Present"), "size:", entry.present, "}");
                            }
                        }
                        if (entry.missing !== 0) {
                            if(entry.variable.concat(" Missing") === actual ){}
                            else {
                                child.children.push(
                                    {name: entry.variable.concat(" Missing"), color: "orange", size: entry.missing}
                                );
                                $log.debug("{name:", entry.variable.concat(" Missing"), "color: orange, size:", entry.missing, "}");
                            }
                        }
                    });
                }
            });
            this.globalIndexForSunburst += 1;
        }


        //function scan(sunburst, path) {
        //    $log.debug("\n\nsunburst\n",JSON.stringify(sunburst), "\n\npath: \n", JSON.stringify(path), "\n\n\n");
        //    var actualName = path[0].label.concat(" ").concat(path[0].key);
        //
        //
        //    $log.debug("sunburst[0].name: ", sunburst[0].name, "\nactualName: ", actualName);
        //    $log.debug(sunburst[0].name == actualName);
        //
        //
        //
        //    angular.forEach(sunburst[0].children, function (child) {
        //        sunburst[0].children = [];
        //            if (sunburst[0].name == actualName) {
        //            }
        //            $log.debug("child:\n", child);
        //            $log.debug(child.name == actualName);
        //            if (child.name == actualName) {
        //            }
        //            else {
        //                child.children = [];
        //                angular.forEach($rootScope.gv.tableCompleteness, function (entry) {
        //                    if (entry.present !== 0) {
        //                        if (entry.variable.concat(" Present") === actualName) {
        //                        }
        //                        else {
        //                            child.children.push(
        //                                {name: entry.variable.concat(" Present"), size: entry.present}
        //                            );
        //                            $log.debug("{name:", entry.variable.concat(" Present"), "size:", entry.present, "}");
        //                        }
        //                    }
        //                    if (entry.missing !== 0) {
        //                        if (entry.variable.concat(" Missing") === actual) {
        //                        }
        //                        else {
        //                            child.children.push(
        //                                {name: entry.variable.concat(" Missing"), color: "orange", size: entry.missing}
        //                            );
        //                            $log.debug("{name:", entry.variable.concat(" Missing"), "color: orange, size:", entry.missing, "}");
        //                        }
        //                    }
        //                });
        //            }
        //        });
        //        $log.debug("before: ", path);
        //        var p = path.shift();
        //        $log.debug("after: ", path);
        //
        //
        //    else{
        //        if(path.length > 0)
        //            scan(sunburst[0].children, path);
        //    }
        //}


        function tableCompletenessInDept(key, label){
            var actualContent = [];
            if($rootScope.gv.inDeptContent.length === 0) {
                actualContent = $rootScope.content;
            }
            else actualContent = $rootScope.gv.inDeptContent;

            var newContent = [];

            //reset
            angular.forEach($rootScope.gv.varsCompleteness, function(vars){
                vars.countVarMissing = 0;
                vars.countVarPresent = 0;
                vars.min = 0;
                vars.max = 0;
                vars.mean = 0;
                vars.count = 0;
            })

            if(key === "Present"){

                $rootScope.gv.varsCompletenessInDeptPresent.push(label);
                $rootScope.gv.stpPathCompleteness.push(
                    {key: key, label: label, index: $rootScope.gv.stpPathCompleteness.length}
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
                        })
                        newContent.push(entry);
                    }
                })
            }
            else if(key === "Missing"){
                $rootScope.gv.varsCompletenessInDeptMissing.push(label);
                $rootScope.gv.stpPathCompleteness.push(
                    {key: key, label: label, index: $rootScope.gv.stpPathCompleteness.length}
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
                    table.minV = vars.min;
                    table.meanV = vars.count / vars.countVarPresent;
                    table.maxV = vars.max;
                    table.records = actualContent.length;

                    $rootScope.gv.tableCompleteness.push(table);

                }
            });

            $rootScope.gv.inDeptContent = []
            $rootScope.gv.inDeptContent = newContent;
        }

        function calculateCompletenessInDept(key, label){
            var actualContent = [];
            if($rootScope.gv.inDeptContent.length === 0) {
                actualContent = $rootScope.content;
            }
            else actualContent = $rootScope.gv.inDeptContent;

            var newContent = [];

            //reset
            angular.forEach($rootScope.gv.varsCompleteness, function(vars){
                vars.countVarMissing = 0;
                vars.countVarPresent = 0;
                vars.min = 0;
                vars.max = 0;
                vars.mean = 0;
                vars.count = 0;
            })

            if(key === "Present"){

                $rootScope.gv.varsCompletenessInDeptPresent.push(label);
                $rootScope.gv.stpPathCompleteness.push(
                    {key: key, label: label, index: $rootScope.gv.stpPathCompleteness.length}
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
                        })
                        newContent.push(entry);
                    }
                })
            }
            else if(key === "Missing"){
                $rootScope.gv.varsCompletenessInDeptMissing.push(label);
                $rootScope.gv.stpPathCompleteness.push(
                    {key: key, label: label, index: $rootScope.gv.stpPathCompleteness.length}
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
                        })
                        newContent.push(entry);
                    }
                })
            }


            var presentMissing = [];
            presentMissing.push({key: 'Present', values: []}); //presentMissing[0]
            presentMissing.push({key: 'Missing', values: []}); //presentMissing[1]


            $rootScope.gv.tableCompleteness = [];
            angular.forEach($rootScope.gv.varsCompleteness, function(vars) {
                if(vars.Selected) {
                    var table = {};
                    table.variable = vars.Name;
                    table.missing = vars.countVarMissing;
                    table.present = vars.countVarPresent;
                    table.minV = vars.min;
                    table.meanV = vars.count / vars.countVarPresent;
                    table.maxV = vars.max;
                    table.records = actualContent.length;

                    $rootScope.gv.tableCompleteness.push(table);

                    presentMissing[0].values.push({label: vars.Name, value: vars.countVarPresent});
                    presentMissing[1].values.push({label: vars.Name, value: vars.countVarMissing});
                }
            });

            $rootScope.gv.inDeptContent = []
            $rootScope.gv.inDeptContent = newContent;

            return presentMissing;
        }
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
                        showMaxMin: false,
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
            presentMissing.push({key: 'Present', values: []}); //presentMissing[0]
            presentMissing.push({key: 'Missing', values: []}); //presentMissing[1]
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
                    $rootScope.gv.tableCompleteness.push(table);

                }
            });
            presentMissing[0].values.push({label: this.label, value: countAllPresent});
            presentMissing[1].values.push({label: this.label, value: countAllMissing});

            return presentMissing;
        }
    }]);
