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

var map = function(cb, seq) {
    var ret;

    if(isArray(seq)) {
        ret = [];

        for(var i = 0, len = seq.length; i < len; i++) {
            ret.push(cb(seq[i], i));
        }
    }

    if(isObject(seq)) {
        ret = {};

        for(var k in seq) {
            var v = seq[k];

            ret[k] = cb(k, v, i);
        }
    }

    return ret;
}

var toObject = function(zip) {
    // converts zip to an object
    var ret = {};

    each(zip, function(k) {
        // XXX: this could fail!
        ret[k[0]] = k[1];
    });

    return ret;
}
