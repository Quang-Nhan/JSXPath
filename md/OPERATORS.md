JSXPath
=======
- [Home](../README.html)
- [Axis](AXIS.html)
- [Functions](FUNCTIONS.html)
- [Node Selection](NODESELECTION.html)
> Operators

# Operators 
##### [+](#+) , [-](#-2) , [*](#-3) , [div](#div) , [mod](#mod) , [=](#-4) , [!=](#-5) , [>](#gt) , [<](#lt) , [>=](#gt-2) , [<=](#lt-2) , [and](#and) , [or](#or) , [|](#-6)
Operators are symbols used to perform operation/tests on its left and right values.

The following operator examples will use the JSXPath constructor below as the initial setup.
```js
var JSXPath = require("JSXPath");
var js = {
	a: 1,
	b: 2,
	c: [3, 4]
};
var jsxpath = new JSXPath(js); 
```




## ++
summation

```js
let path = '9 + /a';
let result = jsxpath.process(path);
----------
// result => 10
```


## -
subtraction

```js
let path = '/a - /b';
let result = jsxpath.process(path);
----------
// result => -1
```


## *
multiply

```js
let path = '/c[2] * /b';
let result = jsxpath.process(path);
---------
// result => 8
```


## div
division

```js
let path = '20 div /b';
let result = jsxpth.process(path);
---------
// result => 10
```


## mod
modulus

```js
let path = '1 mod /b';
let result = jsxpth.process(path);
---------
// result => 1
```


## =
equality

```js
let path = '/a = /b';
let result = jsxpath.process(path);
----------
// result => false
```

## !=
not equal

```js
let path = '/a != /b'
let result = jsxpath.process(path);
----------
// result => true
```


## >
greater than

```js
let path = '/a > 1';
let result = jaxpath.process(path);
----------
// result => false
```


## <
less than

```js
let path = '/a < 1';
let result = jsxpath.process(path);
----------
// result => false
```


## >=
greater than or equal to

```js
let path = '/a >= 1';
let result = jsxpath.process(path);
----------
// result => true
```


## <=
less than or equal to

```js
let path = '/a <= 1';
let result = jsxpath.process(path)
----------
// result => true
```


## and
logical and

```js
let path = '/a and /b'
let result = jsxpath.process(path)
----------
// result => [1, 2]
```


## or
logical or

```js
let path = '/a or /b';
let result = jsxpath.process(path);
----------
// result => [1]
```


## |
union

```js
let path = '/a|/c';
let result = jsxpath.process(path);
----------
// result => [1, [3,  4]]
```


