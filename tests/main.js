require(['bunit', 'tests'],
    function(bunit, tests) {
        require.ready(function() {
            bunit.defaultUI(tests);
        });
    }
);
