var color = function() {
    return {
        rgba: function(v) {
            return [0, 0, 0, 1];
        },
        r: function(v) {
            return 1;
        },
        g: function(v) {
            return 0;
        },
        b: function(v) {
            return 0;
        },
        hsva: function(v) {
            return;
        },
        h: function(v) {
            return 0.5;
        },
        s: function(v) {
            return 0.5;
        },
        v: function(v) {
            return 0.5;
        },
        a: function(v) {
            return 1;
        }
        // TODO: extras
    };
};
