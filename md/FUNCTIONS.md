JSXPath 
=======
- [Home](../README.html)
- [Axis](AXIS.html)
- Functions
- [Node Selection](NODESELECTION.html)
- [Operators](OPERATORS.html)

# Functions
[node]() , 
[nodeValue]() , 
[text]()


Function expression are used to refine queries or add programming capabilities. JSXPath allows user to add their own custom functions (see TODO)

The following function examples will use the JSXPath constructor below as the initial setup.
##### constructor
```js
var js = {
	int: {
		a: 1,
		b: 2
	},
	dec: {
		a: 1.5,
		b: 1.4
	}
	str: {
		st1: "abc",
		st2: "DE",
		st3: "efg",
		tok: "q,u,a,n,g",
		num: "-10"
	}
}
var jsxpath = new JSXPath(js);
```

## node //TODO: jasmine
retrieve the current node object containing the following properties { name, value, parent, children }

[constructor](#constructor)
```js
let path = '/int/*[node() = ';
let result = jsxpath.process(path);
==========
// result => { name: "a", value: 1, parent: "int", children: [] }
```


## nodeValue //TODO: jasmine
retrieves the value/s of nodes. If no nodes are passed in, then the current node value is returned

[constructor](#constructor)
```js
let path = '/int/*[nodeValue() = 1]';
let result = jsxpath.process(path);
==========
// result => [1]
```


## text //TODO:jasmine
retrieves the string formatted of nodes value/s. If no nodes are passed in, then the current node value text is returned

[constructor](#constructor)
```js
let path = '';
let result = jsxpath.process(path);
==========
// result => 
```


## contains
validates that the source string contains the search string

[constructor](#constructor)
```js
let path = 'contains(/str/st2, "E")';
let result = jsxpath.process(path);
==========
// result => true
``` 

```js
let path = 'contains(/str/st2, "e")';
let result = jsxpath.process(path);
==========
// result => false
```


## concat
combines a set of strings and return the resulting string.

[constructor](#constructor)
```js
let path = 'concat(/str/st1, /str/st2, /str/st3, " ZYW")';
let result = jsxpath.process(path);
==========
// result => "abcDEfgh ZYW"
```


## substring
returns the substring of the source string given the starting index and optional substring length.

[constructor](#constructor)
```js
let path = 'substring(/str/st1, 1)';
let result = jsxpath.process(path);
==========
// result => bc
``` 

```js
let path = 'substring(/str/st1, 1, 1)';
let result = jsxpath.process(path);
==========
// result => b
```


## substring-before
returns the substring-before of the source string before the start of the search string.

[constructor](#constructor)
```js
let path = 'substring-before(/str/st3, "f")';
let result = jsxpath.process(path);
==========
// result => "e"
```


## substring-after
returns the substring-after of the source string after the end of the search string.

[constructor](#constructor)
```js
let path = 'substring-after(/str/st3, "f")';
let result = jsxpath.process(path);
==========
// result => "g"
```


## translate //TODO: jasmine
returned the tranformed string given a 'from' list of characters to the 'to' list of characters.

[constructor](#constructor)
```js
let path = 'translate("abDE EDfg", "DE", "de")';
let result = jsxpath.process(path);
==========
// result => "abde edfg"
```


## string-length
returns the length of a given string.
 
```js
let path = 'string-length(/str/st2)';
let result = jsxpath.process(path);
==========
// result => 2
```


## matches
returns true if the source string matches a string/regex pattern.

[constructor](#constructor)
```js
let path = 'matches(/str/st2, "^D")';
let result = jsxpath.process(path);
==========
// result => true
```


## replace
Replaces substring matching a string/pattern with the replacement string and returns the result.
 
```js
let path = 'replace(/str/st3, "[\w]g", "F")';
let result = jsxpath.process(path);
==========
// result => "eF"
```


## tokenize
Splits the string based on the token pattern specified

[constructor](#constructor)
```js
let path = 'tokenize(/str/tok, ",")';
let result = jsxpath.process(path);
==========
// result => ["q", "u", "a", "n", "g"]
```


## round
Round a decimal number to it's nearest integer. If the decimal is greater than or equal to x.5, it will round up otherwise round down

[constructor](#constructor)
```js
let path = 'round(/dec/a)';
let result = jsxpath.process(path);
==========
// result => 2
```

```js
let path = 'round(/dec/b)';
let result = jsxpath.process(path);
==========
// result => 1
```


## floor
Floor a decimal number to it's largest integer less than or equal to a given number.

[constructor](#constructor)
```js
let path = 'floor(/dec/b)';
let result = jsxpath.process(path);
==========
// result => 1
```


## ceiling
Ceiling a decimal number to it's smallest integer greater than or equal to a given number.

[constructor](#constructor)
```js
let path = 'ceiling(/dec/a)';
let result = jsxpath.process(path);
==========
// result => 2
```


## count
Returns the number of nodes in a node set.

[constructor](#constructor)
```js
let path = '';
let result = jsxpath.process(path);
==========
// result => 
```


## sum //TODO: jasmine
Returns the sum of numbers and/or nodes that contains number value.

[constructor](#constructor)
```js
let path = 'sum(/int/a, /int/b)';
let result = jsxpath.process(path);
==========
// result => 3
```


## name
the name of the node or the name of the current node if no argument is passed.

[constructor](#constructor)
```js
let path = '';
let result = jsxpath.process(path);
==========
// result => 
```


## local-name //TODO: jasmine
Returns the current node name.

[constructor](#constructor)
```js
let path = '/int/*[local-name() = "a"]';
let result = jsxpath.process(path);
==========
// result => 1
```


## number //TODO: jasmine
Converts the value of a node or primitive value to a number. If no arguments is given, the value of the current node is converted to a number if valid.

[constructor](#constructor)
```js
let path = 'number(/str/num)';
let result = jsxpath.process(path);
==========
// result => -10
```


## string
Converts the value of a node or primitive value to a string. If no argument is given, the value of the current node is converted to a string.

[constructor](#constructor)
```js
let path = 'string(/int/b)';
let result = jsxpath.process(path);
==========
// result => "2"
```


## boolean //TODO code and jasmine
Converts the value of a node or primitive value to a boolean. If no argument is given, the value of the current node is converted to a boolean.

[constructor](#constructor)
```js
let path = 'boolean(/notExists)';
let result = jsxpath.process(path);
==========
// result => false
```

```js
let path = 'boolean(';
let result = jsxpath.process(path);
==========
// result => 
```


## not
Negates the boolean value.

[constructor](#constructor)
```js
let path = 'not(/a = /b)';
let result = jsxpath.process(path);
==========
// result => true
```
