/**
 * Created by Monica on 01/07/2016.
 */
var controllers = angular.module('controllers', ['ui.bootstrap', 'factory']).

controller('dqCtrl', ['$scope', 'factory', function($scope, factory){
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
    $scope.menuReady = factory.menuReady;
    $scope.contentReady = factory.contentReady;


    $scope.$on('barChart', function(){
        //console.log("barChart");
        factory.contentReady = true;
        factory.showTable = true;
        factory.showChart = true;
        $scope.$broadcast('showChartTable');
    });
    $scope.$on('group', function(){
        factory.showGroup = true;
        $scope.$broadcast('showGroup');
    });

    $scope.$on('noShowChartTable', function(){
        factory.contentReady = false;
        factory.showChart = false;
        factory.showTable = false;
        factory.variables.allSelected = false;
        factory.variables.numSelected = 0;
        console.log("noShowChartTable");
        $scope.$broadcast('noShowChart');
        $scope.$broadcast('noShowTable');
    });
    $scope.$on('noShowGroup', function(){
        factory.showGroup = false;
        factory.variables.groupBy = '';
        $scope.$broadcast('showGroup');
    });

    $scope.$on('refreshCompletenessColor', function(){
        $scope.$broadcast('showChartTable');
    });

    $scope.$on('scatterPlot', function(){
        console.log('on scatterplot\nnameX: ', factory.completeness.scatterPlot.nameX,
        "\nnameY", factory.completeness.scatterPlot.nameY,
        "\nheight: ", factory.completeness.scatterPlot.height,
        "\nlongitudinal: ", factory.completeness.scatterPlot.longitudinal);


        if(factory.completeness.scatterPlot.nameX != ""
            && factory.completeness.scatterPlot.nameY != ""
            && factory.completeness.scatterPlot.height != ""){
            if(factory.completeness.scatterPlot.longitudinal != ""
                && factory.completeness.scatterPlot.longitudinal != undefined){
                console.log("showScatterPlotLongitudinal")
                factory.showScatterPlotLongitudinal = true;
                factory.showScatterplot = false;
                $scope.$broadcast('showScatterPlotLongitudinal');
            }
            else {
                console.log("showScatterPlot");
                factory.showScatterPlotLongitudinal = false;
                factory.showScatterplot = true;
                $scope.$broadcast('showScatterPlot');
            }
        }
        else {
            factory.showScatterplot = false;
            factory.showScatterPlotLongitudinal = false;
            $scope.$broadcast('showScatterPlot');
        }
    })

}]).

controller('fileCtrl', ['$scope', 'factory', function($scope, factory){
    $scope.showContent = function ($fileContent) {
        factory.content = [];
        factory.nameFile = "";

        factory.content = JSON.parse($fileContent);
        factory.nameFile = $scope.nameFile;

        factory.sizeContent = factory.content.length;
        var variables = Object.keys(factory.content[0]); //array of string

        factory.tableCompleteness(variables);
        $("#wrapper").toggleClass("toggled");
    };
}]).

controller('variablesCtrl', ['$scope', 'factory', function($scope, factory){
    $scope.variables = factory.variables.list;
    $scope.allSelected = factory.variables.allSelected;
    $scope.groupBy = factory.variables.groupBy;

    $scope.changeTypeVar = "";
    $scope.newTypeVar = "";
    $scope.types = ['index', 'date', 'categorical', 'numerical'];


    $scope.variablesCheckAll = function () {
        factory.variables.allSelected = !factory.variables.allSelected;
        angular.forEach(factory.variables.list, function (variable) {
            variable.state.selected = factory.variables.allSelected;
        });
        if(!factory.variables.allSelected) {
            $scope.variablesResetAll();
            $scope.$emit('noShowChartTable');
        }
        else {
            factory.variables.numSelected = factory.variables.list.length;
            $scope.allSelected = true;
            factory.variables.allSelected = true;

            $scope.start();
        }
    };

    $scope.variablesResetAll = function(){
        $scope.allSelected = false;
        // factory.variables.allSelected = $scope.allSelected;
        // factory.variables.numSelected = 0;
        angular.forEach(factory.variables.list, function (variable) {
            variable.state.selected = false;
            variable.state.show = false;
        });

        $scope.$emit('noShowChartTable');

    };

    $scope.refreshVariables = function(){
        var count = 0;
        angular.forEach(factory.variables.list, function(variable){
            if(variable.state.selected) count += 1;
        });
        //console.log("Selected: ", count);
        if(count == 0){
            $scope.variablesResetAll();
        }
        else {
            if(count < factory.variables.list.length) {
                factory.variables.numSelected = count;
                factory.variables.allSelected = false;
                $scope.allSelected = false;
            }
            else if(count == factory.variables.list.length) {
                $scope.variablesCheckAll();
            }
            $scope.start();
        }
    };

    $scope.start = function(){
        $scope.$emit('barChart');
        if($scope.groupBy != ""){
            $scope.$emit('group');
        }
    };

    //group
    $scope.resetGroupBy = function(){
        $scope.groupBy = '';
        //factory.variables.groupBy = '';
        //console.log($scope.groupBy);
        //console.log(factory.variables.groupBy);
        //console.log($scope.groupBy == factory.variables.groupBy);
        $scope.$emit('noShowGroup');
    };

    $scope.$watch('groupBy', function(n){
        if(n!="") {
            factory.variables.groupBy = n;
            var count = factory.variables.numSelected;
            if (count == 0) {
                $scope.$emit('noShowGroup');
                return;
            }
            factory.variables.groupBy = $scope.groupBy;
            $scope.$emit('group');
        }
    });



    //change type variable
    $scope.resetTypeVariable = function(){
            $scope.changeTypeVar = "";
            $scope.newTypeVar = "";
        };

    $scope.changeTypeOfVariable = function () {
            angular.forEach(factory.variables.list, function (variable) {
                if (variable.name == $scope.changeTypeVar) {
                    switch ($scope.newTypeVar) {
                        case 'index':
                            variable.state.isIndex = true;
                            variable.state.isDate = false;
                            variable.state.isCategorical = false;
                            variable.state.isNumerical = false;
                            variable.type = 'index';
                            break;
                        case 'date':
                            variable.state.isIndex = false;
                            variable.state.isDate = true;
                            variable.state.isCategorical = false;
                            variable.state.isNumerical = false;
                            variable.type = 'date';
                            break;
                        case 'categorical':
                            variable.state.isIndex = false;
                            variable.state.isDate = false;
                            variable.state.isCategorical = true;
                            variable.state.isNumerical = false;
                            variable.type = 'categorical';
                            break;
                        case 'numerical':
                            variable.state.isIndex = false;
                            variable.state.isDate = false;
                            variable.state.isCategorical = false;
                            variable.state.isNumerical = true;
                            variable.type = 'numerical';
                            break;
                        default:
                            console.log("no variable changed type");
                    }
                }
            });
        };
}]).


//main visualisation
controller('tableCtrl', ['$scope', 'factory', function($scope, factory){
    $scope.showTable = factory.showTable;

    $scope.$on('showChartTable', function(){
        $scope.showTable = factory.showTable;
        $scope.variables = factory.variables.list;
    });

    $scope.$on('noShowTable', function(){
        console.log("show table? ", factory.showTable);
        $scope.showTable = false;
    })
}]).

controller('completenessCtrl', ['$scope', 'factory', '$linq', function($scope, factory, $linq){

    $scope.$on('noShowChart', function(){
        console.log("show chart? ", factory.showChart);
        $scope.showChart = false;
    });

    $scope.$on('showChartTable', function(){

        tableCompletenessSelected();
        $scope.showChart = factory.showChart;
        $scope.variables = factory.variables.list;

        var count = factory.variables.numSelected;

        $scope.sizeContent = factory.content.length;
        $scope.sizeSubset = factory.subsetContent.length;

        var height = (count * 30) + 100;
        var width = document.getElementById("barChartShow").offsetWidth;
        //console.log("width: ", width);

        $scope.optionsMultiBarHorizontalChartCompleteness = {
            chart: {
                height: height,
                width: width,
                type: 'multiBarHorizontalChart',
                color:  factory.colorRange.present,//d3.scale.category10().range(),
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
                                $scope.variables = factory.variables.list;
                                $scope.dataMultiBarHorizontalChartCompleteness = mbhcc();
                                $scope.$emit('barChart');
                                //console.log("groupBy ", factory.variables.groupBy);
                                if(factory.variables.groupBy != "" && factory.variables.groupBy != undefined)
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
    });


    function mbhcc(){
        tableCompletenessSelected();
        var completenessData = [];
        var colorPresent = factory.color.present;
        var colorMissing = factory.color.missing;
        completenessData.push({key: 'Present', color: colorPresent, values: []}); //completenessData[0]
        completenessData.push({key: 'Missing', color: colorMissing, values: []}); //completenessData[1]

        //console.log(dqFactory.completeness.variables);
        angular.forEach($scope.variables, function(row) {
            if(row.state.selected) {
                completenessData[0].values.push({label: row.name, value: row.statistics.present});
                completenessData[1].values.push({label: row.name, value: row.statistics.missing});
            }
        });
        return completenessData;
    }
    function selectSubset(key, variableSelected){
        key = key.toLowerCase();
        var actualContent = factory.getActualContent();
        var newContent = [];

        if(key === "present"){
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
        }

        else if(key === "missing"){
            angular.forEach(actualContent, function(entry){
                if(entry[variableSelected] === null
                    || entry[variableSelected] === ""
                    || entry[variableSelected] === "NaN"
                    || entry[variableSelected] === ''
                    || entry[variableSelected] === undefined) {
                        newContent.push(entry);
                    }
            });
        }
        factory.subsetContent = newContent;
        $scope.sizeSubset = factory.subsetContent.length;
    }
    //update the table with completeness information for each variable based on the actual content
    function tableCompletenessSelected() {
        //console.log(dqFactory.completeness.variables);

        var content = factory.getActualContent();
        angular.forEach(factory.variables.list, function (item) {
            if (item.state.selected) {
                //console.log("item.name", item.name);

                //update statistics
                var row = factory.row4tableCompleteness(item.name, content);
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
        return factory.variables.list;
    }
    $scope.restart = function(){
        console.log("reset data set");
        factory.subsetContent = [];
        $scope.$emit('barChart');
        $scope.$emit('group');
    };


    //group
    $scope.groupBy = factory.variables.groupBy;
    $scope.$on('showGroup', function(){
        $scope.showGroup = factory.showGroup;

        if(!factory.showGroup) return;

        var countSelected = factory.variables.numSelected;

        $scope.dataGroupBy = dataGroupByVarCompleteness();

        var keys = 0;
        angular.forEach($scope.dataGroupBy, function(group){
            angular.forEach(group, function(g){
                keys += g.length;
            });
        });

        //console.log("countSelected ", countSelected);
        //console.log("keys length: ", keys);
        //var height = (10 * $scope.numbGroups) + (3 * keys) + 100;
        var height = (15 * countSelected) + (5 * keys) + 100;
        var width = document.getElementById("barChartShow").offsetWidth;

        //console.log(height);
        $scope.optionGroupBy = {
            chart: {
                type: 'multiBarHorizontalChart',
                height: height,
                width: width,
                color: factory.colorRange.present,
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
                            "<td class='key'><strong>Group by " + factory.variables.groupBy + "</strong></td>" +
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
                    axisLabel: '# of '.concat(factory.variables.groupBy),
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
                                //selectGroupSubset(e.data.key, e.data.label);
                                //$scope.dataGroupByVarCompleteness = mbhccGroupByVar();
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
                    .concat(factory.variables.groupBy)
                    .concat(" (")
                    .concat($scope.numbGroups)
                    .concat(" groups over ")
                    .concat((factory.getActualContent().length).toString())
                    .concat(" records)"),
                className: "h5"
            }
        };

    });

    function dataGroupByVarCompleteness(){
        var actualContent = factory.getActualContent();
        var groupData = [];
        var variable = factory.variables.groupBy;
        var groupedActualContent = $linq.Enumerable().From(actualContent)
            .GroupBy(function(item) { return item[variable]; }).ToArray();

        var indexVariable = 0;
        angular.forEach(factory.variables.list, function(vari) {
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
                            if (!factory.hasMeaningValue(i[vari.name])) {
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

    //scatterplot
    $scope.height = factory.completeness.scatterPlot.height;
    // $scope.$watch('nameX', function(n){
    //     factory.completeness.scatterPlot.nameX = n;
    //     if($scope.nameY != "" && n != ""){
    //         $scope.$emit('scatterplot');
    //     }
    //     //console.log("nameX: ", $scope.nameX);
    // });
    //
    // $scope.$watch('nameY', function(n){
    //     factory.completeness.scatterPlot.nameY = n;
    //     if($scope.nameX != "" && n != ""){
    //         $scope.$emit('scatterplot');
    //     }
    //     //console.log("nameY: ", $scope.nameY);
    // });
    // $scope.$watch('longitudinal', function(n){
    //     factory.completeness.scatterPlot.longitudinal = n;
    //     if($scope.nameX != "" && $scope.nameY != ""){
    //         $scope.$emit('scatterplot');
    //     }
    //     //console.log("longitudinal: ", $scope.longitudinal);
    // });

    $scope.resetVarX =  function(){
        $scope.nameX = "";
        factory.completeness.scatterPlot.nameX = $scope.nameX;
        console.log("nameX: ", factory.completeness.scatterPlot.nameX);
        $scope.$emit('scatterPlot');
    };

    $scope.resetVarY =  function(){
        $scope.nameY = "";
        factory.completeness.scatterPlot.nameY = $scope.nameY;
        console.log("nameY: ", factory.completeness.scatterPlot.nameY);
        $scope.$emit('scatterPlot');
    };

    $scope.longitudinalReset = function(){
        $scope.longitudinal = "";
        factory.completeness.scatterPlot.longitudinal = $scope.longitudinalReset;
        $scope.$emit('scatterPlot');
    };

    $scope.startPlot = function(){
        factory.completeness.scatterPlot.height = $scope.height;
        factory.completeness.scatterPlot.nameX = $scope.nameX;
        factory.completeness.scatterPlot.nameY = $scope.nameY;
        factory.completeness.scatterPlot.longitudinal = $scope.longitudinal;
        $scope.$emit('scatterPlot');
    };

    $scope.toggleDistributionX = function(){};
    $scope.toggleDistributionY = function(){};
    $scope.logicEval = function(){};
    $scope.showDistribution = function(){
        $scope.$broadcast('showScatterPlot');
    };
    $scope.toggleCategoricalInPlot = function(){};

    //table
    $scope.tabsCompleteness = [
        { title:'Overview', template:"/static/templates/components/completeness/overview.html" },
        { title:'Scatterplot', template:"/static/templates/components/completeness/numericalChart/scatterplot.html"},
    ];

}]).

controller('scatterplotCtrl', ['$scope', 'factory', '$linq', function($scope, factory, $linq){
    //scatterPlot
    $scope.$on('showScatterPlot', function() {
        $scope.showScatterplot = factory.showScatterplot;
        $scope.showScatterPlotLongitudinal = factory.showScatterPlotLongitudinal;

        if(factory.showScatterplot || factory.showScatterPlotLongitudinal) {
            $scope.height = factory.completeness.scatterPlot.height;
            $scope.nameX = factory.completeness.scatterPlot.nameX;
            $scope.nameY = factory.completeness.scatterPlot.nameY;
            $scope.longitudinal = factory.completeness.scatterPlot.longitudinal;
            $scope.showDistributionX = factory.completeness.scatterPlot.showDistributionX;
            $scope.showDistributionY = factory.completeness.scatterPlot.showDistributionY;
            $scope.showCategoricalInPlot = factory.completeness.scatterPlot.showCategoricalInPlot;
            $scope.logicEvaluation = factory.completeness.scatterPlot.logicEvaluation;

            var title = $scope.nameX.concat(" vs ").concat($scope.nameY);
            console.log("title scatterplot", title);

            var width = document.getElementById("barChartShow").offsetWidth - 20;

            var text = "";
            // if(countShow > 1) text = "Logic ".concat($scope.logicEvaluation).concat(" for missing values");
            // else text = "Missing values";

            $scope.optionPlot = {
                chart: {
                    type: 'scatterChart',
                    height: $scope.height,
                    width: width,
                    color: factory.colorRange.present, //d3.scale.category10().range(), //TODO
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
            $scope.dataPlot = missingLogicEvaluation();

            $scope.optionPlot.subtitle.text = $scope.optionPlot.subtitle.text
                .concat(" ( present: ")
                .concat($scope.dataPlot[0].values.length)
                .concat(", missing: ")
                .concat($scope.dataPlot[1].values.length)
                .concat(" )");
        }
    });

    function setSharingWidth() {
        var countSharingAxis = 0;
        if ($scope.showDistributionY) {
            angular.forEach(factory.variables.list, function (variable) {
                if (variable.state.showDistributionY
                    && variable.name != dqFactory.completeness.variables.nameY) //y variable is not considered
                    countSharingAxis += 1;
                if (countSharingAxis > 10) {
                    alert("you can show only 10 distributions at time");
                    countSharingAxis = 10;
                }
            });
        }

        document.getElementById("onlyMainPlotAndBottom").className = "col-md-".concat(12 - countSharingAxis);
        if (countSharingAxis == 0)
            return "100%";
        else {
            //console.log("offset: ", document.getElementById("onlyMainPlotAndBottom").offsetWidth);
            return document.getElementById("onlyMainPlotAndBottom").offsetWidth;
        }
    };

    function missingLogicEvaluation(){

        var data = [];
        var actualContent = factory.getActualContent();

        $scope.optionPlot.chart.xDomain = getRange(actualContent, $scope.nameX);
        $scope.optionPlot.chart.yDomain = getRange(actualContent, $scope.nameY);

        data.push({key: "Present", color: factory.color.present, values: []});
        data.push({key: "Missing", color: factory.color.missing, values: []});


        //checking variable.show
        var noneShow = 0;
        var show = [];
        angular.forEach(factory.variables.list, function (variable) {
            if(variable.state.showDistribution) {
                noneShow +=1;
                show.push(variable.name);
            }
        });

        console.log("# distribution: ", show.length);

        var nameX = $scope.nameX;
        var nameY = $scope.nameY;
        var strPresent = "($." + nameX + " != null && $." + nameY + " != null)";
        var strMissing = "($." + nameX + " != null && $." + nameY + " != null)";

        if(noneShow > 0){
            if($scope.logicEvaluation === "AND") {
                angular.forEach(show, function (name) {
                    strPresent += " || $."+name+" != null";
                    strMissing += " && $."+name+" == null";
                });
            }
            else if($scope.logicEvaluation === "OR"){
                angular.forEach(show, function (name) {
                    strPresent += " || $."+name+" != null";
                    strMissing += " || $."+name+" == null";
                });
            }
        }

        console.log("Query present: ", strPresent);
        var query = $linq.Enumerable().From(actualContent)
            .Where(strPresent)
            .Select(function (x) {
                return +x[nameX] + ':' + x[nameY]
            })
            .ToArray();

        angular.forEach(query, function (q) {
           var split = q.split(":");
           data[0].values.push({
                x: split[0],
                y: split[1],
                size: factory.completeness.scatterPlot.sizeSinglePoint,
                shape: factory.completeness.scatterPlot.marker.circle
            });
        });

        if(noneShow > 0) {
            console.log("Query missing: ", strMissing);
            var query = $linq.Enumerable().From(actualContent)
                .Where(strMissing)
                .Select(function (x) {
                    return +x[nameX] + ':' + x[nameY]
                })
                .ToArray();

            angular.forEach(query, function (q) {
                var split = q.split(":");
                data[1].values.push({
                    x: split[0],
                    y: split[1],
                    size: factory.completeness.scatterPlot.sizeSinglePoint,
                    shape: factory.completeness.scatterPlot.marker.circle
                });
            });
        }

        $scope.noneShow = noneShow;
        return data;
    }

    function getRange(content, variable) {
        console.log("range -> variable ", variable);

        var min = $linq.Enumerable().From(content)
            .Where("$."+variable+" != null")
            .OrderBy("$."+variable)
            .Skip("$."+variable+" == null")
            .Min("$."+variable);
        var max = $linq.Enumerable().From(content)
            .Where("$."+variable+" != null")
            .OrderBy("$."+variable)
            .Skip("$."+variable+" == null")
            .Max("$."+variable);

        console.log("Range of ", variable, ": [", min, ", ", max, "]");
        return [min, max];
    }
}]).

controller('correctness', ['$scope', 'factory', function ($scope, factory) {
    $scope.$on('showChart', function(){

    });

    $scope.$on('showGroup', function(){

    });
}]).

controller('colorCompletenessCtrl', ['$scope', 'factory', function ($scope, factory){

    $scope.colorPresent = factory.color.present;
    $scope.colorMissing = factory.color.missing;

    $scope.completenessRefreshColor =  function(){
        factory.color.present = $scope.colorPresent;
        factory.color.missing = $scope.colorMissing;
        $scope.$emit('refreshCompletenessColor');
    };

    $scope.completenessResetColor = function(){
        factory.color.present = "#d95f02";
        factory.color.missing = "#000000"; //"#7570b3";
        $scope.colorPresent = factory.color.present;
        $scope.colorMissing = factory.color.missing;
        $scope.$emit('refreshCompletenessColor');
    };
}]).

controller('tabsCtrl', ['$scope', function($scope){
    $scope.tabs = [
        { title:'Completeness', template:"/static/templates/components/completeness.html" },
        { title:'Correctness', template:"/static/templates/components/correctness.html"},
        { title:'Tables', template:"/static/templates/components/table.html"},
        { title:'Interaction', template:"/static/templates/components/interaction.html"}
    ];

    // $scope.model = {
    //     name: 'Tabs'
    // };
}]);


