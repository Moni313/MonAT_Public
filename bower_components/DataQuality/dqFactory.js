angular.module('dqFactory', [])
.factory('content',function(){
    var data = {
        body: [],
        nameFile: "",
        variables: [],
    }
    return {
        getData: function () {
            return data.body
        },
        getVariables: function(){
            return data.variables
        },
    }

            //ptsAll: [],
            //ptsVars: [],
            //ptsX : "",
            //ptsY : "",
            //ptsCompleteness: false,
            //ptsDuplication: false,
            //
            //stpAll: [],
            //stpVars: [],
            //stpX : "",
            //stpY : "",
            //stpCompleteness: false,
            //stpDuplication: false,
            //ready:false

});