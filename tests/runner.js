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
                tests.play();
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
tests.stop = function() {
    clearTimeout(tests._timerId);
};

tests.play = function() {
    var refresh = '_refresh' in tests? tests._refresh: 1000;
    var reload = function() {
        location.reload(true);
    };

    tests._timerId = setTimeout(reload, refresh);
};

tests.playbackUI = function() {
    var elem = document.createElement('div');
    var stopped = false;

    elem.id = 'playback';
    elem.innerHTML = 'Stop tests';

    elem.onclick = function() {
        if(stopped) {
            tests.play();
            elem.innerHTML = 'Stop tests';
            stopped = false;
        }
        else {
            tests.stop();
            elem.innerHTML = 'Play tests';
            stopped = true;
        }
    };

    return elem;
}

// output
tests.consoleOutput = function(report) {
    console.log(report.text);
};

tests.HTMLOutput = function(target) {
    return function(report) {
        target.innerHTML += '<div class="' + report.state + '">' + report.text + '</div>';
    }
}
