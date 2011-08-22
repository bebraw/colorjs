define(['utils'], function(utils) {
    var nameToHex = function(name) {
        // based on http://www.phpied.com/rgb-color-parser-in-javascript/
        var colors = {
            aliceblue: 'f0f8ff',
            antiquewhite: 'faebd7',
            aqua: '00ffff',
            aquamarine: '7fffd4',
            azure: 'f0ffff',
            beige: 'f5f5dc',
            bisque: 'ffe4c4',
            black: '000000',
            blanchedalmond: 'ffebcd',
            blue: '0000ff',
            blueviolet: '8a2be2',
            brown: 'a52a2a',
            burlywood: 'deb887',
            cadetblue: '5f9ea0',
            chartreuse: '7fff00',
            chocolate: 'd2691e',
            coral: 'ff7f50',
            cornflowerblue: '6495ed',
            cornsilk: 'fff8dc',
            crimson: 'dc143c',
            cyan: '00ffff',
            darkblue: '00008b',
            darkcyan: '008b8b',
            darkgoldenrod: 'b8860b',
            darkgray: 'a9a9a9',
            darkgreen: '006400',
            darkkhaki: 'bdb76b',
            darkmagenta: '8b008b',
            darkolivegreen: '556b2f',
            darkorange: 'ff8c00',
            darkorchid: '9932cc',
            darkred: '8b0000',
            darksalmon: 'e9967a',
            darkseagreen: '8fbc8f',
            darkslateblue: '483d8b',
            darkslategray: '2f4f4f',
            darkturquoise: '00ced1',
            darkviolet: '9400d3',
            deeppink: 'ff1493',
            deepskyblue: '00bfff',
            dimgray: '696969',
            dodgerblue: '1e90ff',
            feldspar: 'd19275',
            firebrick: 'b22222',
            floralwhite: 'fffaf0',
            forestgreen: '228b22',
            fuchsia: 'ff00ff',
            gainsboro: 'dcdcdc',
            ghostwhite: 'f8f8ff',
            gold: 'ffd700',
            goldenrod: 'daa520',
            gray: '808080',
            green: '008000',
            greenyellow: 'adff2f',
            honeydew: 'f0fff0',
            hotpink: 'ff69b4',
            indianred : 'cd5c5c',
            indigo : '4b0082',
            ivory: 'fffff0',
            khaki: 'f0e68c',
            lavender: 'e6e6fa',
            lavenderblush: 'fff0f5',
            lawngreen: '7cfc00',
            lemonchiffon: 'fffacd',
            lightblue: 'add8e6',
            lightcoral: 'f08080',
            lightcyan: 'e0ffff',
            lightgoldenrodyellow: 'fafad2',
            lightgrey: 'd3d3d3',
            lightgreen: '90ee90',
            lightpink: 'ffb6c1',
            lightsalmon: 'ffa07a',
            lightseagreen: '20b2aa',
            lightskyblue: '87cefa',
            lightslateblue: '8470ff',
            lightslategray: '778899',
            lightsteelblue: 'b0c4de',
            lightyellow: 'ffffe0',
            lime: '00ff00',
            limegreen: '32cd32',
            linen: 'faf0e6',
            magenta: 'ff00ff',
            maroon: '800000',
            mediumaquamarine: '66cdaa',
            mediumblue: '0000cd',
            mediumorchid: 'ba55d3',
            mediumpurple: '9370d8',
            mediumseagreen: '3cb371',
            mediumslateblue: '7b68ee',
            mediumspringgreen: '00fa9a',
            mediumturquoise: '48d1cc',
            mediumvioletred: 'c71585',
            midnightblue: '191970',
            mintcream: 'f5fffa',
            mistyrose: 'ffe4e1',
            moccasin: 'ffe4b5',
            navajowhite: 'ffdead',
            navy: '000080',
            oldlace: 'fdf5e6',
            olive: '808000',
            olivedrab: '6b8e23',
            orange: 'ffa500',
            orangered: 'ff4500',
            orchid: 'da70d6',
            palegoldenrod: 'eee8aa',
            palegreen: '98fb98',
            paleturquoise: 'afeeee',
            palevioletred: 'd87093',
            papayawhip: 'ffefd5',
            peachpuff: 'ffdab9',
            peru: 'cd853f',
            pink: 'ffc0cb',
            plum: 'dda0dd',
            powderblue: 'b0e0e6',
            purple: '800080',
            red: 'ff0000',
            rosybrown: 'bc8f8f',
            royalblue: '4169e1',
            saddlebrown: '8b4513',
            salmon: 'fa8072',
            sandybrown: 'f4a460',
            seagreen: '2e8b57',
            seashell: 'fff5ee',
            sienna: 'a0522d',
            silver: 'c0c0c0',
            skyblue: '87ceeb',
            slateblue: '6a5acd',
            slategray: '708090',
            snow: 'fffafa',
            springgreen: '00ff7f',
            steelblue: '4682b4',
            tan: 'd2b48c',
            teal: '008080',
            thistle: 'd8bfd8',
            tomato: 'ff6347',
            turquoise: '40e0d0',
            violet: 'ee82ee',
            violetred: 'd02090',
            wheat: 'f5deb3',
            white: 'ffffff',
            whitesmoke: 'f5f5f5',
            yellow: 'ffff00',
            yellowgreen: '9acd32'
        };

        return name in colors? colors[name]: undefined;
    };

    var HEX_RGB = function(hex) {
        hex = utils.lstrip(hex, '#');

        // based on http://www.phpied.com/rgb-color-parser-in-javascript/
        return {
            r: parseInt(hex.substring(0, 2), 16) / 255,
            g: parseInt(hex.substring(2, 4), 16) / 255,
            b: parseInt(hex.substring(4, 6), 16) / 255
        };
    };

    var HSV_RGB = function(hsv) {
        // http://www.colorjack.com/opensource/dhtml+color+picker.html
        // h, s, v e [0, 1]
        var H = hsv.h,
            S = hsv.s,
            V = hsv.v,
            R, G, B;
        var A, B, C, D;

        if (S == 0) {
            R = G = B = Math.round(V * 255);
        }
        else {
            if (H >= 1) H = 0;
            H = 6 * H;
            D = H - Math.floor(H);
            A = Math.round(255 * V * (1 - S));
            B = Math.round(255 * V * (1 - (S * D)));
            C = Math.round(255 * V * (1 - (S * (1 - D))));
            V = Math.round(255 * V);

            switch (Math.floor(H)) {
                case 0:
                    R = V;
                    G = C;
                    B = A;
                    break;
                case 1:
                    R = B;
                    G = V;
                    B = A;
                    break;
                case 2:
                    R = A;
                    G = V;
                    B = C;
                    break;
                case 3:
                    R = A;
                    G = B;
                    B = V;
                    break;
                case 4:
                    R = C;
                    G = A;
                    B = V;
                    break;
                case 5:
                    R = V;
                    G = A;
                    B = B;
                    break;
            }
        }

        return {
            r: R / 255,
            g: G / 255,
            b: B / 255
        };
    };

    var RGB_HSV = function(rgb) {
        // based on http://www.phpied.com/rgb-color-parser-in-javascript/
        var r = rgb.r * 255;
        var g = rgb.g * 255;
        var b = rgb.b * 255;
        var n = Math.min(Math.min(r, g), b);
        var v = Math.max(Math.max(r, g), b);
        var m = v - n;

        if(m == 0) {
            return {
                h: null,
                s: 0,
                v: v 
            };
        }

        var h = r==n ? 3 + (b - g) / m : (g == n ? 5 + (r - b) / m : 1 + (g - r) / m);
        h = (h == 6? 0: h) / 6;

        return {
            h: h,
            s: m / v,
            v: v / 255
        };
    };

    var HEX_HSV = function(hex) {
        return RGB_HSV(HEX_RGB(hex));
    };

    var RGB_HEX = function(rgb) {
        // http://blogs.x2line.com/al/articles/280.aspx
        // r, g, b e [0, 1]
        var decColor = rgb.b * 255 + 256 * rgb.g * 255 + 65536 * rgb.r * 255;

        return utils.leftFill(decColor.toString(16), 6, 0);
    };

    var HSV_HEX = function(hsv) {
        return RGB_HEX(HSV_RGB(hsv));
    };

    var colorTemplate = function(initialChannels, converters) {
        var parse = function(initial) {
            if(utils.isString(initial)) {
                var hex = nameToHex(initial);

                if(!hex) {
                    hex = initial;
                }

                return converters.hexToColor(hex);
            }

            if(utils.isObject(initial)) {
                if('toHex' in initial) {
                    var ret = converters.hexToColor(initial.toHex());

                    ret.a = initial.a();

                    return ret;
                }

                return utils.filter(function(k) {
                    return k in initialChannels;
                }, initial);
            }

            return null;
        };

        return function(initial) {
            var channels = utils.extend(initialChannels, parse(initial));

            channels = utils.map(function(k, v) {
                return utils.clamp(v, 0, 1);
            }, channels);

            var channel = function(name) {
                return function(v) {
                    if(v) {
                        channels[name] = utils.clamp(v, 0, 1);

                        return methods;
                    }

                    return channels[name];
                };
            };

            var methods = {
                toArray: function() {
                    return utils.values(channels);
                },
                toCSS: function() {
                    var rgb = converters.colorToRGB(channels);
                    var r = parseInt(rgb.r * 255);
                    var g = parseInt(rgb.g * 255);
                    var b = parseInt(rgb.b * 255);
                    var a = channels.a;

                    if(channels.a < 1) {
                        return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
                    }

                    return 'rgb(' + r + ',' + g + ',' + b + ')';
                },
                toHex: function() {
                    return converters.colorToHex(channels);
                }
            };

            utils.each(function(k) {
                methods[k] = channel(k);
            }, utils.keys(channels));

            return methods;
        };
    };

    var rgba = colorTemplate({r: 0, g: 0, b: 0, a: 1}, {
        hexToColor: HEX_RGB,
        colorToRGB: function(a) {return a;},
        colorToHex: RGB_HEX
    });
    var hsva = colorTemplate({h: 0, s: 0, v: 0, a: 1}, {
        hexToColor: HEX_HSV,
        colorToRGB: HSV_RGB,
        colorToHex: HSV_HEX
    });

    return {
        nameToHex: nameToHex,
        rgba: rgba,
        hsva: hsva
    };
});
