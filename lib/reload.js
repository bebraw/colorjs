define(function() {
    return function(i) {
        var scope = this;

        var ui = function(playLabel, stopLabel) {
            playLabel = playLabel || 'Play';
            stopLabel = stopLabel || 'Stop';

            var elem = document.createElement('div');
            var running = '_timerId' in scope;

            var setText = function() {
                elem.innerHTML = running? playLabel: stopLabel;
            };

            var setState = function() {
                running = !running;
                setText();
                running? stop(): play();
            };

            elem.id = 'playback';
            elem.onclick = setState;

            setText();

            return elem;
        };

        var interval = function(i) {
            if(i) {
                scope._interval = i;
            }

            return scope._interval;
        };
        interval(i);

        var play = function() {
            var reload = function() {
                location.reload(true);
            };

            scope._timerId = setTimeout(reload, Math.max(interval(), 500)); // min 500 ms
        };

        var stop = function() {
            clearTimeout(scope._timerId);
        };

        return {
            ui: ui,
            play: play,
            stop: stop,
            interval: interval
        };
    };
});
