angular.module('dqFactory', [])
    .factory('dqFactory',function() {

        var data = {

            doShow: false,
            nameFile: "",
            menuReady: false,
            visualisationReady: false,

            content: [],
            subsetContent: [],
            sizeContent: 0,

            interactions: [],

            //store selected variables in the menu
            completeness: {
                underInvestigation: false,
                title: "Completeness",
                allSelected: false,
                logicEvaluation: 'AND',
                variables: [],
                //variables: [{
                //    name: item.name,
                //    state: {
                //            selected: false, //for vertical menu
                //            show: false, //for content show plot/historicalBarChart/horizontalBarChart
                //
                //            isNumerical: row.numerical,
                //            isCategorical: row.categorical,
                //            isIndex: row.index
                //    },
                //    statistics: {
                //            missing: row.missing,
                //            present: row.present,
                //            min: row.min,
                //            max: row.max,
                //            mean: row.mean
                //            minTotal: row.min,
                //            maxTotal: row.max,
                //            meanTotal: row.mean
                //    }
                //    dataSharingX : []
                //}],

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

                //table: [], //TODO is this used?
                barChartShow: false,

                groupBy: '',
                groupByShow: false,

                sql: {
                    select: "",
                    selectValue: "",
                    where: "",
                    whereValue: "",
                    compareCategorical: {
                        equal: "=",
                        notEqual: "!="
                    },
                    compareNumerical: {
                        equal: "=",
                        major: ">",
                        minor: "<",
                        notEqual: "!="
                    }
                },

                numericalPlot: {
                    nameX: "",
                    nameY: "",
                    title: "",
                    height: 450,
                    width: 0,
                    showNumericalPlot: false,
                    showAllSharingAxis: false,
                    logicEvaluation: 'AND',

                    sizeSinglePoint: 0.1,

                    //shapes : ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'], //[0,5]
                    marker: {
                        missing: 'triangle-down',
                        present: 'triangle-up',
                        circle: 'circle'
                    },

                    //data for plot of numerical variables XY
                    data: [],
                    //{
                    //    key: "",
                    //    color: "",
                    //    values: [{
                    //        x: "", //entry[$rootScope.gv.stpX],
                    //        y: "", //entry[$rootScope.gv.stpY],
                    //        size: this.sizeSinglePoint,
                    //        shape: ""
                    //    }]
                    //},
                },
                historicalBarChart: [{ //bottom chart
                    name: "",
                    show: false,
                    index: 0,
                    //data for historical bar chart (chart in the bottom of the plot, sharing x axis)
                    //{key: variable, bar: true, color: $rootScope.color.missing, values:[]}
                    data: {
                        key: "",
                        bar: true,
                        color: "",
                        values: [] //[key, value] [23, 2]
                    }
                }],
                horizontalBarChart: [ //left chart
                    {
                        name: "",
                        show: false,
                        index: 0,
                        //data for horizontal bar chart (chart in the left sharing y axis)
                        //key: 'Missing', color: $rootScope.color.missing, values:[]
                        data: {
                            key: "",
                            color: "",
                            //{label: label, value: d.count}
                            values:[{
                                label: "",
                                value: 0
                            }]
                        }
                    }
                ]
            },

            //calculate missing/present and statistical information for a given variable
            row4tableCompleteness: function (variable, content){
                //console.log(variable);

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

                //console.log("Is ", variable," a date? ", checkDate, " = ", data.isValidDate(checkDate));

                // categorical variables
                // $log.debug(typeof (sum/countPresent));
                //TODO review this inclusion ID and make it as requirement for the json file variables
                // console.log(variable);
                //TODO if there are encoding problems (e.g. gender is encoded with ['F', 'M'] and one value is encoded with ['1', '0'] categorical is not more recognised
                if(!variable.includes('ID') && (sum/countPresent)) {
                    //numerical variable
                    row4table.min = min.toFixed(2);
                    row4table.mean = (sum / countPresent).toFixed(2);
                    row4table.max = max.toFixed(2);
                    row4table.numerical = true;
                    row4table.categorical = false;
                    row4table.index = false;
                    row4table.date = false;
                }
                    //TODO uncomment to add date check, then check also the controllers
                else if(data.isValidDate(checkDate)){
                //date variable
                 row4table.date = true;
                 row4table.numerical = false;
                 row4table.categorical = false;
                 row4table.index = false;

                }
                else {
                    row4table.min = "";
                    row4table.mean = "";
                    row4table.max = "";

                    row4table.numerical = false;
                    row4table.date = false;

                    if (variable.includes('ID')) {
                        row4table.index = true;
                        row4table.categorical = false;
                    }
                    else {
                        row4table.categorical = true;
                        row4table.index = false;
                        row4table.categories = [];
                        var actualContent = data.getActualContent();
                        var groups = Enumerable.From(actualContent)
                            .GroupBy(function (item) {
                                return item[variable];
                            }).ToArray();
                        angular.forEach(groups, function (gr) {
                            if(gr.source[0][variable] == null)
                                row4table.categories.push("Null");
                            else if(gr.source[0][variable] != "")
                                row4table.categories.push(gr.source[0][variable]);
                        });
                        //console.log(row4table.categories);
                    }
                }
                row4table.present = countPresent;
                row4table.missing = countMissing;

                //TODO this is called each time you select a variable in the completeness list of variables. WHY??
                //console.log("categories for the ", variable, "variable:\n", row4table.categories);

                return row4table;
            },
            getActualContent: function (){
                    if(data.subsetContent.length <= 0) return data.content;
                    else return data.subsetContent;
                },
            hasMeaningValue: function(variable){
                if (variable === null
                    || variable === ""
                    || variable === "NaN"
                    || variable === ''
                    || variable === undefined) {
                    return false;
                }
                else return true;
            },

            addStepInteraction: function(){
                data.interactions.push({variables: []});
                var index = data.interactions.length-1;
                angular.forEach(data.completeness.variables, function(variable){
                   if(variable.state.selected)
                       data.interactions[index].variables.push(variable.name);
                });
            },

            isValidDate: function(obj) {
                return (Object.prototype.toString.call(obj) === "[object Date]");
            }

            // store: function(){
            //     data.interactions.push({
            //         step: data
            //     });
            // }

            // storeCompleteness: function(interaction, value){
            //
            //     switch(interaction){
            //         case "selection":
            //             console.log("Inserting selection");
            //
            //             if(!data.interactions.steps){
            //                 //initialisation
            //                 data.interactions.fileName = data.nameFile;
            //                 data.interactions.steps = [];
            //             }
            //
            //
            //             if(data.interactions.steps.length == 0){
            //                 //first interaction
            //                 data.interactions.steps.push({
            //                         index: 0,
            //                         completeness: {
            //                             varsSelected: [],
            //                             varsShown: [],
            //                             actions: []
            //                         }
            //                     }
            //                 );
            //
            //                 angular.forEach(data.completeness.variables, function(variable){
            //
            //                     if(variable.state.selected) {
            //                         data.interactions.steps[0].completeness.varsSelected.push(variable.name);
            //                     }
            //                     if(variable.state.show){
            //                         data.interactions.steps[0].completeness.varsShown.push(variable.name);
            //                     }
            //                 });
            //             }
            //
            //             else{
            //                 var lastInteraction = data.interactions.steps[data.interactions.steps.length - 1].index;
            //                 console.log(lastInteraction);
            //
            //                 data.interactions.steps.push({
            //                     index: lastInteraction + 1,
            //                     completeness: {
            //                         varsSelected: [],
            //                         varsShown: [],
            //                         actions: []
            //                     }
            //                 });
            //
            //                 angular.forEach(data.completeness.variables, function(variable) {
            //
            //                     data.interactions.steps[lastInteraction + 1].index = lastInteraction + 1;
            //                     if(variable.state.selected) {
            //                         data.interactions.steps[lastInteraction + 1].completeness.varsSelected.push(variable.name);
            //                     }
            //                     if(variable.state.show){
            //                         data.interactions.steps[lastInteraction + 1].completeness.varsShown.push(variable.name);
            //                     }
            //                 });
            //             }
            //
            //             console.log("Interactions ", data.interactions);
            //
            //             break;
            //         case "action":
            //             console.log("Inserting action");
            //             data.interactions.
            //                 steps[data.interactions.steps.length - 1].completeness.actions.push(value);
            //             break;
            //         default:
            //             console.log("Something went wrong while trying to store interaction");
            //             break;
            //     }
            //
            // }
        };

        return data;
    });

    // .factory('DataSet', ['$resource', 'dqFactory', function($resource, dqFactory){
    //     return $resource()
    // }]);
