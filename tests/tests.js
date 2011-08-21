(function() {
    var nameToHexTests = function() {
        var pairs = {
            blue: '0000ff',
            green: '008000',
            red: 'ff0000',
            yellow: 'ffff00'
        };

        return map(function(k, v) {
            return function() {
                assert(nameToHex(k)).equals(v);
            };
        }, pairs);
    };

    tests('Name to hex', nameToHexTests());

    var initializers = function(opts) {
        var pairs = {
            colorName: 'red',
            hexWithHash: '#FF0000',
            hexWithoutHash: 'FF0000',
            namedParameter: opts.namedParameter
        };
        var testRed = function(param) {
            return function() {
                context(opts.ob(param), opts.isRed);
            }
        };
        var ret = map(function(k, v) {
            return testRed(v);
        }, pairs);

        ret.noParameters = function() {
            var c = opts.ob();
            var result = c.toArray();

            each(function(k, i) {
                assert(result[i]).equals(k);
            }, [0, 0, 0, 1]);
        };

        return ret;
    };

    tests('RGBA initializers', initializers({
        ob: rgba,
        namedParameter: {r: 1},
        isRed: function(c) {
            each(function(k, v) {
                assert(c[k]()).equals(v);
            }, {r: 1, g: 0, b: 0, a: 1});
        }
    }));
    tests('HSVA initializers', initializers({
        ob: hsva,
        namedParameter: {s: 1, v: 1},
        isRed: function(c) {
            each(function(k, v) {
                assert(c[k]()).equals(v);
            }, {h: 0, s: 1, v: 1, a: 1});
        }
    }));

    // API: rgba, hsva
    // <color channel getter/setter>, toCSS, toArray, type conversions (hsva(col))

    var getters = function() {
        var getter = function(k, v) {
            return function() {
                var c = rgba({k: v});

                assert(c[k]()).equals(v);
            };
        }
        
        return toObject(map(function(k) {
            return ['get' + k.toUpperCase(), getter(k, 0.5)]
        },
            ['r', 'g', 'b', 'h', 's', 'v', 'a']
        ));
    };

    // TODO: separate (RGBA, HSVA)
    //tests('Getters', getters());

    tests('RGBA setters', {
        setR: function() {},
        setG: function() {},
        setB: function() {}
        // TODO
    });

    tests('HSVA setters', {
        setH: function() {},
        setS: function() {},
        setV: function() {}
        // TODO
    });

    // TODO: tests invalid sets (neg, too high, wrong type)
    // TODO: test chaining
}());
