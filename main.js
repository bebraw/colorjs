require(
    {
        paths: {
            bunit: 'lib/bunit',
            utils: 'lib/utils',
            assert: 'lib/assert'
        }
    },
    ['bunit', 'tests/tests'],
    function(bunit, tests) {
        require.ready(function() {
            var r = bunit.runner();

            r.defaultUI();
            r.run();
        });
    }
);
