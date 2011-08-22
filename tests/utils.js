var context = function(i, func) {
    func(i);
};

var isArray = function(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
};

var isObject = function(o) {
    return Object.prototype.toString.call(o) === '[object Object]';
};

var isString = function(o) {
    return typeof(o) === 'string';
};

var lstrip = function(s, c) {
    var ret = '';
    var seeking = true;

    each(function(chr) {
        if(seeking) {
            if(chr != c) {
                seeking = false;
                ret += chr;
            }
        }
        else {
            ret += chr;
        }
    }, s);

    return ret;
}

var each = function(cb, o) {
    if(isArray(o) || isString(o)) {
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

        var j = 0; // XXX: enumerate
        for(var k in seq) {
            var v = seq[k];

            ret[k] = cb(k, v, j);
            j++;
        }
    }

    return ret;
};

var filter = function(cb, seq) {
    var ret;

    // TODO: array

    if(isObject(seq)) {
        ret = {};

        var j = 0; // XXX: enumerate
        for(var k in seq) {
            var v = seq[k];

            if(cb(k, v, j)) {
                ret[k] = v;
            }

            j++;
        }
    }

    return ret;
};

// XXX: make work with args generally
// XXX: make work with arrays too? 
var extend = function(a, b) {
    var ret = {};

    var assign = function(k, v) {
        ret[k] = v;
    };

    each(assign, a);
    each(assign, b);

    return ret;
};

var toObject = function(zip) {
    // converts zip to an object
    var ret = {};

    each(function(k) {
        // XXX: this could fail!
        ret[k[0]] = k[1];
    }, zip);

    return ret;
};

var zip = function(a, b) {
    // XXX: might want to spec this better (min etc.)
    var ret = [];

    for(var i = 0; i < a.length; i++) {
        ret.push([a[i], b[i]]);
    }

    return ret;
};

var keys = function(o) {
    var ret = [];

    each(function(k) {
        ret.push(k);
    }, o);

    return ret;    
};

var values = function(o) {
    var ret = [];

    each(function(k, v) {
        ret.push(v);
    }, o);

    return ret;
};
