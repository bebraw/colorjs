require({paths: {color: '../src/color'}}, ['tests', 'runner'], function(tests, runner) {
    require.ready(function() {
        var outputArea = document.createElement('div');

        document.body.appendChild(runner.playbackUI());
        document.body.appendChild(outputArea)

        runner.tests().run({
            output: runner.HTMLOutput(outputArea),
            refresh: 2000
        });
    });
});
