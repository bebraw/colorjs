define(function() {
    var tests = function(setName, newTests) {
        var scope = this;

        if(!('testsToRun' in this)) {
            this.testsToRun = [];
        }

        if(setName && newTests) {
            this.testsToRun.push({name: setName, tests: newTests});
        }

        var clone = function(o) {
            // http://www.andrewsellick.com/93/javascript-clone-object-function
            if(typeof(o) != 'object' || !o) {
                return o;
            }

            var newO = new Object();

            for(var i in o) {
                newO[i] = clone(o[i]);
            }

            return newO;
        }

        return {
            run: function(opts) {
                var passedTests = 0;
                var testTotal = 0;

                var output = 'output' in opts? opts.output: function() {};
                var refresh = 'refresh' in opts? opts.refresh: 0;

                if(refresh) {
                    tests._refresh = refresh;
                    play();
                }

                for(var i = 0; i < scope.testsToRun.length; i++) {
                    var model = scope.testsToRun[i];
                    var testSet = model.tests;

                    var attrs = testSet._ || {};
                    delete testSet._;

                    output({state: 'started', text: 'Running "' + model.name + '" tests'});

                    for(var testName in testSet) {
                        var test = testSet[testName];

                        try {
                            test.apply(clone(attrs));

                            output({state: 'passed', text: 'PASSED: ' + testName});

                            passedTests++;
                        }
                        catch(e) {
                            output({state: 'failed', text: 'FAILED: ' + testName});
                            output({state: 'error', text: e});
                        }

                        testTotal++;
                    }
                }

                output({state: 'finished', text: passedTests + '/' + testTotal + ' tests passed'});
            }
        };
    };

    // playback
    var stop = function() {
        clearTimeout(tests._timerId);
    };

    var play = function() {
        var refresh = '_refresh' in tests? tests._refresh: 1000;
        var reload = function() {
            location.reload(true);
        };

        tests._timerId = setTimeout(reload, refresh);
    };

    var playbackUI = function() {
        var elem = document.createElement('div');
        var stopped = false;

        elem.id = 'playback';
        elem.innerHTML = 'Stop tests';

        elem.onclick = function() {
            if(stopped) {
                play();
                elem.innerHTML = 'Stop tests';
                stopped = false;
            }
            else {
                stop();
                elem.innerHTML = 'Play tests';
                stopped = true;
            }
        };

        return elem;
    }

    // output
    var consoleOutput = function(report) {
        console.log(report.text);
    };

    var HTMLOutput = function(target) {
        return function(report) {
            target.innerHTML += '<div class="' + report.state + '">' + report.text + '</div>';
        }
    }

    return {
        tests: tests,
        play: play,
        stop: stop,
        playbackUI: playbackUI,
        consoleOutput: consoleOutput,
        HTMLOutput: HTMLOutput
    };
});
