module.exports = {
    groupBy: function(list, fn) {
        var groups = {};
        for (var i = 0; i < list.length; i++) {
            var group = JSON.stringify(fn(list[i]));
            if (group in groups) {
                groups[group].push(list[i]);
            } else {
                groups[group] = [list[i]];
            }
        }
        return arrayFromObject(groups);
    }
}

function arrayFromObject(obj) {
    var arr = [];
    for (var i in obj) {
        arr.push(obj[i]);
    }
    return arr;
}