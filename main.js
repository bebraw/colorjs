require(
    {
        paths: {
            bunit: 'lib/bunit',
            utils: 'lib/utils'
        }
    },
    ['bunit', 'tests/tests'],
    function(bunit, tests) {
        require.ready(function() {
            bunit.defaultUI(tests);
        });
    }
);
