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

    var getters = function(ob, channels) {
        var names = map(function(k) {
            return 'get' + k.toUpperCase();
        }, channels);
        var methods = map(function(k) {
            return function() {
                var params = {};
                params[k] = 0.5;

                var c = ob(params);

                assert(c[k]()).equals(0.5);
            };
        }, channels);

        return toObject(zip(names, methods));
    };

    tests('RGBA getters', getters(rgba, ['r', 'g', 'b', 'a']));
    tests('HSVA getters', getters(hsva, ['h', 's', 'v', 'a']));

    var setters = function(ob, channels) {
        var names = map(function(k) {
            return 'set' + k.toUpperCase();
        }, channels);
        var methods = map(function(k) {
            return function() {
                var c = ob();

                c[k](0.5);

                assert(c[k]()).equals(0.5);
            };
        }, channels);

        return toObject(zip(names, methods));
    };

    tests('RGBA setters', setters(rgba, ['r', 'g', 'b', 'a']));
    tests('HSVA setters', setters(hsva, ['h', 's', 'v', 'a']));

    // TODO: tests invalid sets (neg, too high, wrong type)
    // TODO: test chaining
}());
