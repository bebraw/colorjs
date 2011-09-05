define(function() {
    // XXX: move to toolbox
    var isArray = function(o) {
        return Object.prototype.toString.call(o) === '[object Array]';
    };

    // XXX: move to toolbox
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

    return function(stmt) {
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
    };
});