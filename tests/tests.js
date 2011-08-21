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

    var isRed = function(c) {
        each(function(k, v) {
            assert(c[k]()).equals(v);
        }, {r: 1, g: 0, b: 0, a: 1});
    };

    var testRed = function(param) {
        return function() {
            context(rgba(param), isRed);
        }
    };

    // API: rgba, hsva
    // to<target>, <color channel getter/setter>, toCSS, toArray

    var initializerVariants = function() {
        var pairs = {
            colorName: 'red',
            hexWithHash: '#FF0000',
            hexWithoutHash: 'FF0000',
            namedParameter: {r: 1}
        };

        return map(function(k, v) {
            return testRed(v);
        }, pairs);
    };

    tests('RGBA initializers', extend({
        noParameters: function() {
            var c = rgba();
            var result = c.toArray();

            each(function(k, i) {
                assert(result[i]).equals(k);
            }, [0, 0, 0, 1]);
        }}, initializerVariants())
    );

    // TODO: test HSVA initializers too

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
    tests('Getters', getters());

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
