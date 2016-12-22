JSXPath 
=======
- [Home](../README.html)
- Axis
- [Functions](FUNCTIONS.html)
- [Node Selection](NODESELECTION.html)
- [Operators](OPERATORS.html)

# Axis
#### [*](#) , [..](#) , [siblings](#) , [descendant](#) , [descendant-or-self](#) , [ancestor](#) , [ancestor-or-self](#) , [//](#) , [self](#) , [parent](#)
Axis expressions are used to navigate around the node tree to retrieve a node set relative to the current node


## *
retrieve the children of the current node

```js
let path = '';
let result = jsxpath.process(path);
----------
// result => 
```


## ..
retrieves the parent node

alias: [parent](#)

```js
let path = '';
let result = jsxpath.process(path);
----------
// result => 
```


## siblings
retrieve all siblings of the current node

```js
let path = '';
let result = jsxpath.process(path);
----------
// result => 
```


## descendant
retrieves all descendants of current node excluding self

```js
let path = '';
let result = jsxpath.process(path);
----------
// result => 
```


## descendant-or-self
retrieves all descendants of current node including self

alias: [//](#)

```js
let path = '';
let result = jsxpath.process(path);
----------
// result => 
```


## ancestor
retrieves all ancestors of current node excluding self


## ancestor-or-self
retrieves the ancestors of current node including self


## //
retrieves the parent node
alias: [descendant-or-self](#)


## self
current node
alias: [descendant-or-self](#)


## parent
retrieves the parent node
alias: [..](#)
