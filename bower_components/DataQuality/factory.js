/**
 * Created by Monica on 01/07/2016.
 */
angular.module('factory', [])
    .factory('factory',function($linq) {
        var data = {
            menuReady: false,
            contentReady: false,
            showTable: false,
            showChart: false,
            showGroup: false,
            showScatterplot: false,
            showScatterPlotLongitudinal: false,

            content: [],
            subsetContent: [],

            variables: {
                allSelected: false,
                numSelected: 0,
                groupBy: "",
                list: []
            },

            color: {
                    missing: "#000000", //"#7570b3",
                    present: "#d95f02"
                },
            colorRange: {
                    //missing: [
                    //    "#08306b",
                    //    "#9ecae1",
                    //    "#08519c",
                    //    "#6baed6",
                    //    "#2171b5",
                    //    "#4292c6"
                    //],
                    present: [
                        "#a6cee3",
                        "#1f78b4",
                        "#b2df8a",
                        "#33a02c",
                        "#993404",
                        "#252525",
                        "#fe9929",
                        "#969696",
                        "#ffeda0",
                        "#d9d9d9",
                        "#7a0177",
                        "#f768a1",
                        "#fde0dd",
                        "#084081",
                        "#4eb3d3",
                        "#e0f3db"
                    ]
                },

            completeness : {
                scatterPlot: {
                    height: 450,
                    nameX: "",
                    nameY: "",
                    longitudinal: "",
                    showDistributionX: false,
                    showDistributionY: false,
                    showCategoricalInPlot: false,
                    logicEvaluation: 'AND',
                    sizeSinglePoint: 0.1,
                    marker: {
                        missing: 'triangle-down',
                        present: 'triangle-up',
                        circle: 'circle'
                    }
                }
            },

            getActualContent: function (){
                if(data.subsetContent.length <= 0) return data.content;
                else return data.subsetContent;
            },

            hasMeaningValue: function(variable){
                return !(variable === null
                || variable === ""
                || variable === "NaN"
                || variable === ''
                || variable === undefined);
            },

            isValidDate: function(obj) {
                return (Object.prototype.toString.call(obj) === "[object Date]");
            },

            row4tableCompleteness: function (variable, content){
                //console.log("row4: ", content.length);
                var row4table = [];
                var countPresent = 0;
                var countMissing = 0;
                var min = 0;
                var max = 0;
                var sum = 0;
                var checkDate = '';
                angular.forEach(content, function (entry) {
                    if (entry[variable] === null
                        || entry[variable] === ""
                        || entry[variable] === "NaN"
                        || entry[variable] === ''
                        || entry[variable] === undefined) {
                        // TODO array for horizontal bar chart
                        countMissing += 1;
                    }
                    else {
                        checkDate = entry[variable];
                        countPresent += 1;
                        sum = sum + parseFloat(entry[variable]);
                        if (parseFloat(entry[variable]) < min)
                            min = parseFloat(entry[variable]);
                        else if (parseFloat(entry[variable]) > max)
                            max = parseFloat(entry[variable]);
                    }
                });
                //console.log("Missing: ", countMissing, " - Present: ", countPresent, " - sum/pres: ", (sum/countPresent));
                //console.log("Variable: ", variable, "type:", typeof (sum/countPresent));
                //TODO review this inclusion ID and make it as requirement for the json file variables
                //TODO if there are encoding problems (e.g. gender is encoded with ['F', 'M'] and one value is encoded with ['1', '0'] categorical is not more recognised
                if(!variable.includes('ID') && (sum/countPresent)) {
                    //console.log("numerical: ", variable);
                    row4table.type = 'numerical';
                    row4table.min = min.toFixed(2);
                    row4table.mean = (sum / countPresent).toFixed(2);
                    row4table.max = max.toFixed(2);
                    //console.log(min, max);
                }
                else if(data.isValidDate(checkDate)){
                    row4table.type = 'date';
                }
                else {
                    if (variable.includes('ID')) {
                        row4table.type = 'index';
                    }
                    else {
                        row4table.type = 'categorical';
                        row4table.categories = [];
                        var groups = $linq.Enumerable().From(content)
                            .GroupBy(function (item) {
                                return item[variable];
                            }).ToArray();
                        angular.forEach(groups, function (gr) {
                            if(gr.source[0][variable] == null)
                                row4table.categories.push("Null");
                            else if(gr.source[0][variable] != "")
                                row4table.categories.push(gr.source[0][variable]);
                        });
                        //console.log("Categories: ", row4table.categories);
                    }
                }
                row4table.present = countPresent;
                row4table.missing = countMissing;

                return row4table;
            },

            tableCompleteness: function(variables) {
                var content = data.getActualContent();
                //console.log("table ", content.length);
                angular.forEach(variables, function (variable) {
                    var row = data.row4tableCompleteness(variable, content);

                    if(row.type == 'numerical') {
                        data.variables.list.push({
                            type: row.type,
                            name: variable,
                            state: {
                                selected: false, //for vertical menu
                                show: false //for content show plot/historicalBarChart/horizontalBarChart
                            },
                            statistics: {
                                missingTotal: row.missing,
                                missing: row.missing,
                                presentTotal: row.present,
                                present: row.present,

                                min: row.min,
                                max: row.max,
                                mean: row.mean
                            }
                        });
                    }
                    else if(row.type == 'categorical'){
                        data.variables.list.push({
                            type: row.type,
                            name: variable,
                            state: {
                                selected: false, //for vertical menu
                                show: false, //for content show plot/historicalBarChart/horizontalBarChart
                                categories: row.categories
                            },
                            statistics: {
                                missing: row.missing,
                                missingTotal: row.missing,
                                present: row.present,
                                presentTotal: row.present
                            }
                        });
                    }
                    else{
                        data.variables.list.push({
                            type: row.type,
                            name: variable,
                            state: {
                                selected: false, //for vertical menu
                                show: false, //for content show plot/historicalBarChart/horizontalBarChart
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
            }
        };
        return data
    });
