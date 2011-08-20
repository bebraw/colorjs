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

tests('RGB getters', {
    getR: function() {},
    getG: function() {},
    getB: function() {}
    // TODO
});

tests('RGB setters', {
    setR: function() {},
    setG: function() {},
    setB: function() {}
    // TODO
});

tests('HSV getters', {
    getH: function() {},
    getS: function() {},
    getV: function() {}
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
