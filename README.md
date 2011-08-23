colorjs
=======

colorjs provides simple API that may be used to create colors (RGBA, HSVA, HSLA) and perform various color related operations (conversions and such).

Examples
--------

### Making red (#FF0000)

```javascript
color.rgba('red');
color.rgba('#FF0000');
color.rgba('FF0000');

color.hsva('red');
color.hsva('#FF0000');
color.hsva('FF0000');

color.hsla('red');
color.hsla('#FF0000');
color.hsla('FF0000');

color.rgba({r: 1});
color.hsva({s: 1, v: 1});

color.rgba().r(1);
color.hsva().s(1).v(1);
```

### Getter/setter notation

```javascript
var c = color.rgba('red');

c.r(0.5);

c.r(); // should return 0.5
```

### toArray

```javascript
var c = color.rgba('red');

c.toArray(); // [1, 0, 0, 1]
```

### toHex

```javascript
var c = color.rgba('red');

c.toHex(); // 'ff0000'
```

### toCSS

```javascript
var c = color.rgba('red');
c.toCSS(); // 'rgb(255,0,0)'

c.a(0.5);
c.toCSS(); // 'rgba(255,0,0,0.5)'
```

### Chaining

```javascript
var c = color.rgba('red');

c.r(0.5).b(0.5); // chains

c.toArray(); // [0.5, 0.5, 0, 1]
```

### Bounds

```javascript
var c = color.hsva({h: 10, s: -10, v: 5, a: -2});

c.toArray(); // [1, 0, 1, 0]
```

### Type conversions

```javascript
var c1 = color.rgba('red');
var c2 = color.hsva(c1);

c2.toArray(); // [0, 1, 1, 1]
```

Other libraries
---------------

See https://github.com/bebraw/jswiki/wiki/Color-libraries .

License
-------

colorjs is available under MIT license. See LICENSE for more details.

