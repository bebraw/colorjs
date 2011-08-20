(function() {
    var isRed = function(c) {
        each({r: 1, g: 0, b: 0, a: 1}, function(k, v) {
            assert(c[k]()).equals(v);
        });
    };

    var testRed = function(param) {
        return function() {
            context(color(param), isRed);
        }
    };

    tests('Initializers', {
        noParameters: function() {
            var c = color();
            var rgba = c.rgba();

            each([0, 0, 0, 1], function(k, i) {
                assert(rgba[i]).equals(k);
            });
        },
        colorName: testRed('red'),
        hexWithHash: testRed('#FF0000'),
        hexWithoutHash: testRed('FF0000'),
        miniHexWithHash: testRed('#F00'),
        miniHexWithoutHash: testRed('F00'),
        namedParameter: testRed({r: 1}),
        _testRed: function() {
            return true;
        }
    });

    var getters = function() {
        var getter = function(k, v) {
            return function() {
                var c = color({k: v});

                assert(c[k]()).equals(v);
            };
        }
        
        return toObject(map(function(k) {
            return ['get' + k.toUpperCase(), getter(k, 0.5)]
        },
            ['r', 'g', 'b', 'h', 's', 'v', 'a']
        ));
    };

    tests('Getters', getters());

    tests('RGB setters', {
        setR: function() {},
        setG: function() {},
        setB: function() {}
        // TODO
    });

    tests('HSV setters', {
        setH: function() {},
        setS: function() {},
        setV: function() {}
        // TODO
    });

    // TODO: tests invalid sets (neg, too high, wrong type)
    // TODO: test chaining
}());
