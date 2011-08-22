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

            assert(result).equals([0, 0, 0, 1]);
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

    tests('toArray', {
        initial: function() {
            assert(hsva().toArray()).equals([0, 0, 0, 1]);
        },
        blue: function() {
            assert(rgba('blue').toArray()).equals([0, 0, 1, 1]);
        }
    });

    tests('toHex', {
        initial: function() {
            assert(hsva().toHex()).equals('000000');
        },
        redRGBA: function() {
            assert(rgba('red').toHex()).equals('ff0000');
        },
        redHSVA: function() {
            assert(hsva('red').toHex()).equals('ff0000');
        }
    });

    tests('toCSS', {
        initial: function() {
            assert(hsva().toCSS()).equals('rgb(0,0,0)');
        },
        blue: function() {
            assert(rgba('blue').toCSS()).equals('rgb(0,0,255)');
        },
        blueWithAlpha: function() {
            assert(hsva('blue').a(0.5).toCSS()).equals('rgba(0,0,255,0.5)')
        }
    });

    tests('chaining', {
        simpleChain: function() {
            assert(rgba().r(1).g(0.7).b(0.5).a(0.3).toArray()).equals([1, 0.7, 0.5, 0.3]);
        }
    });

    tests('bounds', {
        lowerBound: function() {
            assert(rgba().r(-5).r()).equals(0);
        },
        upperBound: function() {
            assert(rgba().r(10).r()).equals(1);
        },
        initialBounds: function() {
            assert(rgba({r: -4, g: 10, b: -4, a: 10}).toArray()).equals([0, 1, 0, 1]);
        }
    });

    tests('type conversions', {
        hsva_rgba: function() {
            assert(rgba(hsva('red')).toArray()).equals([1, 0, 0, 1]);
        },
        rgba_hsva: function() {
            assert(rgba(hsva(rgba('red'))).toArray()).equals([1, 0, 0, 1]);
        },
        alpha: function() {
            assert(hsva(rgba({a: 0.5})).a()).equals(0.5);
        }
    });
}());
