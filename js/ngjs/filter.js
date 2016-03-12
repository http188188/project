angular.module("configurationApp")
.filter("testBox", function() {
    return function (value){
        var testBoxNode = [];
        for (var i = 0; i < value.length; i++) {
            if((value[i].type.substring(0,4) == 'test' || value[i].type.substring(0,7) == 'compare') && value[i].test_type == "manual"){
                testBoxNode.push(value[i]);
            }
        };
        return testBoxNode;
    };
})
.filter("operationBox", function() {
    return function (value){
        var operateBoxNode = [];
        for (var i = 0; i < value.length; i++) {
            if( value[i].start_next_node == 'manual'){
                value[i].nextName = value[i+1].name;
                operateBoxNode.push(value[i]);
            }
        }
        return operateBoxNode;
    };
})
.filter("range", function (){
    return function (value, index, size){
        var selected = [];
        var startIndex = index * size;
        for (var i = 0; i < size; i++) {
            if(angular.isUndefined(value[startIndex + i])) break;
            selected.push(value[startIndex + i]);
        };
        return selected;
    }
});