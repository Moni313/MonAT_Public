angular.module('dqFactory', [])
    .factory('dqFactory',function() {

        //console.log("factory is called");


        var data = {

            nameFile: "",
            menuReady: false,
            visualisationReady: false,

            content: [],
            subsetContent: [],
            sizeContent: 0,

            revision: {
                ready : true,
                index: 0
            },

            //store selected variables in the menu
            completeness: {
                underInvestigation: false,
                //TODO height and width

                title: "Completeness",
                allSelected: false,
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
                    missing: "#9ecae1", // "#a1dab4", //"#d7b5d8", //"#6baed6", // "#d7b5d8", //
                    present: "#3f007d" //"#3182bd" //"#253494" //"#980043" //"#08306b" // "#980043" //
                },
                colorRange: {
                    missing: [
                        "#08306b",
                        "#9ecae1",
                        "#08519c",
                        "#6baed6",
                        "#2171b5",
                        "#4292c6"
                    ],
                    present: [
                        "#3f007d",
                        "#bcbddc",
                        "#54278f",
                        "#9e9ac8",
                        "#6a51a3",
                        "#807dba"
                    ]
                },

                table: [], //TODO is this used?
                barChartShow: false, //chartStpVars TODO delete comment

                numericalPlot: {
                    nameX: "",
                    nameY: "",
                    title: "",
                    height: 350,
                    width: 0,
                    showNumericalPlot: false, //stpPlotReady TODO delete comment

                    sizeSinglePoint: 0.1,

                    //shapes : ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'], //[0,5]
                    marker: {
                        missing: 'triangle-down',
                        present: 'triangle-up'
                    },
                    markerImage: {
                        present: "/static/myImg/triangle-up.png",
                        missing: "/static/myImg/triangle-down.png"
                        //circleMarker: "/static/myImg/circle.png",
                    },


                    //data for plot of numerical variables XY
                    //{key: 'XY', color: $rootScope.colorRange.present[0], values: []}
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
                ],


                interactions: {
                    index: 0,
                    initialSelection: [],
                    actions: []
                }

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
                        countPresent += 1;
                        sum = sum + parseFloat(entry[variable]);
                        if (parseFloat(entry[variable]) < min)
                            min = parseFloat(entry[variable]);
                        else if (parseFloat(entry[variable]) > max)
                            max = parseFloat(entry[variable]);
                    }
                });


                // categorical variables
                // $log.debug(typeof (sum/countPresent));
                //TODO review this inclusion ID and make it as requirement for the json file variables
                // console.log(variable);
                //TODO if there are encoding problems (e.g. gender is encoded with ['F', 'M'] and one value is encoded with ['1', '0'] categorical is not more recognised
                if(!variable.includes('ID') && (sum/countPresent)) {
                    row4table.min = min.toFixed(2);
                    row4table.mean = (sum / countPresent).toFixed(2);
                    row4table.max = max.toFixed(2);
                    row4table.numerical = true;
                    row4table.categorical = false;
                    row4table.index = false;
                }
                // numerical variables
                else {
                    row4table.min = "";
                    row4table.mean = "";
                    row4table.max = "";

                    row4table.numerical = false;

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
                            if(gr.source[0][variable] != "")
                                row4table.categories.push(gr.source[0][variable]);
                        });
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
                }
        };
        return data;
    });
