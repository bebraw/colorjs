define(function() {
    var suite = function(setName, newTests) {
        if(!('testsToRun' in run)) {
            run.testsToRun = [];
        }

        if(setName && newTests) {
            run.testsToRun.push({name: setName, tests: newTests});
        }
    };

    // XXX: move to utils
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
    };

    // XXX: move to utils
    var isArray = function(o) {
        return Object.prototype.toString.call(o) === '[object Array]';
    };

    // XXX: move to utils
    var equals = function(a, b) {
        if(isArray(a)) {
            for(var k in a) {
                if(a[k] !== b[k]) {
                    return false;
                }
            }

            for(k in b) {
                if(a[k] !== b[k]) {
                    return false;
                }
            }

            return true;
        }

        return a === b;
    };

    var run = function(opts) {
        var passedTests = 0;
        var testTotal = 0;
        var out = [];

        if(!('output' in opts)) {
            console.log('bunit.run is missing output sink!');

            return;
        }

        var refresh = 'refresh' in opts? opts.refresh: 0;

        if(refresh) {
            run._refresh = refresh;
            play();
        }

        for(var i = 0; i < run.testsToRun.length; i++) {
            var model = run.testsToRun[i];
            var testSet = model.tests;

            var attrs = testSet._ || {};
            delete testSet._;

            out.push({state: 'started', text: 'Running "' + model.name + '" tests'});

            for(var testName in testSet) {
                var test = testSet[testName];

                try {
                    test.apply(clone(attrs));

                    out.push({state: 'passed', text: 'PASSED: ' + testName});

                    passedTests++;
                }
                catch(e) {
                    out.push({state: 'failed', text: 'FAILED: ' + testName});
                    out.push({state: 'error', text: e});
                }

                testTotal++;
            }
        }

        var finished = {state: 'finished', text: passedTests + '/' + testTotal + ' tests passed'};
        out.unshift(finished);
        out.push(finished);

        var output = opts.output;

        for(i = 0; i < out.length; i++) {
            var line = out[i];

            output(line);
        }
    };

    // playback
    var stop = function() {
        clearTimeout(run._timerId);
    };

    var play = function() {
        var refresh = '_refresh' in run? run._refresh: 1000;
        var reload = function() {
            location.reload(true);
        };

        run._timerId = setTimeout(reload, refresh);
    };

    var playbackUI = function() {
        var elem = document.createElement('div');
        var stopped = !('_timerId' in run);

        var setText = function() {
            elem.innerHTML = stopped? 'Stop tests': 'Play tests';
        };

        var setState = function() {
            stopped = !stopped;
            setText();
            stopped? play(): stop();
        };

        elem.id = 'playback';
        elem.onclick = setState;

        setText();

        return elem;
    };

    // output
    var consoleOutput = function(report) {
        console.log(report.text);
    };

    var HTMLOutput = function(target) {
        return function(report) {
            target.innerHTML += '<div class="' + report.state + '">' + report.text + '</div>';
        }
    }

    // assert
    var assert = function(stmt) {
        var argumentsError = function() {
            // slow! http://bonsaiden.github.com/JavaScript-Garden/#function.arguments
            var args = Array.prototype.slice.call(arguments);

            if(args.length == 1) {
                return stmt + ' is not ' + args[0] + '!';
            }

            return stmt + ' not in: ' + args.join(', ');        
        };

        var checkArguments = function(args, cb) {
            for(var i = 0; i < args.length; i++) {
                var value = args[i];

                if(cb(value)) {
                    return true;
                }
            }

            return false;
        };

        var methods = {
            equals: {
                error: function(val) {
                    return val + ' did not equal ' + stmt + '!'
                },
                method: function(val) {
                    return equals(val, stmt);
                }
            },
            is: {
                error: argumentsError,
                method: function() {
                    // borrowed from RightJS
                    var to_s = Object.prototype.toString;

                    var typeChecks = {
                        'function': function(val) {
                            return typeof(val) === 'function';
                        },
                        string: function(val) {
                            return typeof(val) === 'string';
                        },
                        number: function(val) {
                            return typeof(val) === 'number';
                        },
                        object: function(val) {
                            return to_s.call(val) === '[object Object]';
                        },
                        array: isArray
                    };

                    return checkArguments(arguments,
                        function(value) {
                            if(value in typeChecks) {
                                var matched = typeChecks[value](stmt);

                                if(matched) {
                                    return true;
                                }
                            }

                            return false;
                        }
                    );
                }
            },
            within: {
                error: argumentsError,
                method: function() {
                    return checkArguments(arguments,
                        function(value) {
                            return value == stmt;
                        }
                    );

                    return false;
                }
            },
            isDefined: {
                error: function() {
                    return 'Expected a defined value, got undefined instead!';
                },
                method: function() {
                    // borrowed from RightJS
                    return typeof(stmt) !== 'undefined';
                }
            },
            between: {
                error: function(a, b) {
                    // TODO: improve msgs for null cases
                    return stmt + ' was not between ' + a + ' and ' + b + '!'
                },
                method: function(a, b) {
                    if(a == null) {
                        return stmt <= b;
                    }

                    if(b == null) {
                        return a <= stmt;
                    }

                    return a <= stmt && stmt <= b;
                }
            },
            not: {
                error: function() {},
                method: function() {
                    invertNext = !invertNext;

                    return true;
                }
            }
        };
        var ret = {};
        var invertNext = false;

        var insertMethod = function(name, data) {
            ret[name] = function() {
                var success = data.method.apply(this, arguments);

                if(name != 'not' && invertNext) {
                    success = !success;
                    invertNext = false;
                }

                if(success) {
                    return ret;
                }

                // http://aymanh.com/9-javascript-tips-you-may-not-know#assertion
                function AssertionError(message) {
                    this.message = message;
                }
                AssertionError.prototype.toString = function () {
                    return 'AssertionError: ' + this.message;
                }

                var errorText = data.error.apply(this, arguments);
                throw new AssertionError(errorText);
            }
        }

        for(var methodName in methods) {
            var methodData = methods[methodName];

            insertMethod(methodName, methodData);
        }

        return ret;
    }

    var defaultUI = function(tests) {
        var outputArea = document.createElement('div');

        document.body.appendChild(playbackUI());
        document.body.appendChild(outputArea);

        run({
            tests: tests,
            output: HTMLOutput(outputArea),
            refresh: 2000
        });
    };

    return {
        suite: suite,
        run: run,
        play: play,
        stop: stop,
        playbackUI: playbackUI,
        consoleOutput: consoleOutput,
        HTMLOutput: HTMLOutput,
        assert: assert,
        defaultUI: defaultUI
    };
});
