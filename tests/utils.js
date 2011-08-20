var context = function(i, func) {
    func(i);
};

var isArray = function(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
};

var isObject = function(o) {
    return Object.prototype.toString.call(o) === '[object Object]';
};

var each = function(o, cb) {
    if(isArray(o)) {
        for(var i = 0, l = o.length; i < l; i++) {
            cb(o[i], i);
        }
    }

    if(isObject(o)) {
        var j = 0;

        for(var k in o) {
            cb(k, o[k], j);

            j++;
        }
    }
};
