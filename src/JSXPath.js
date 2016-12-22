var JSXProcessor = require("./Processor/JSXProcessor");
const DEBUG = require("./JSXDebugConfig").debugOn;

/**
 * JSXPath
 * =======
 * JSXPath is an adaptation of XPath, a querying language for XML documents, to query JSON document.
 * If you are already familiar with the construct of [XPath], using this should be a simple.
 * ### TODO list
 * [ ] Date Time functions
 * [ ] Incorporate Date Time durations into existing operators: -, +, =, != , >, >=, <, <=
 *
 * ## Contents
 * - Home
 *	- [Why JSXPath?](#why-jsx-path)
 *	- [Installation](#installation)
 *	- [Differences & Limitations](#differences-amp-limitations)
 *	- [Features](#features)
 *		- [Predicate Expressions](#predicate-expressions)
 *		- [Variables](#variables)
 *		- [Custom Functions](#custom-functions)
 *		- [Object Comparison](#object-comparison)
 * - [Axis](md/AXIS.html)
 * - [Functions](md/FUNCTIONS.html)
 * - [Node Selection](md/NODESELECTION.html)
 * - [Operators](md/OPERATORS.html)
 *
 * ## Why JSXPath?
 * IF you only require a simple retrieval of a value in an object without the need of interrigating it, eg with the json = { a: 1, b: 2}, to get the value of a, then `json.a` is enough. But if you require a more complex conditioning, sure you can write your own functions to handle it, or why not let JSXPath do that?
 * 
 * Example return the value of json.c if the sum of values json.a and json.b is equal to 3;
 * ```js
 * let js = {a:1, b:2, c: "pass"}
 * //without JSXPath
 * function sum(pa, pb) {
 * if (!isNumber(pa) || isNumber(pb)) {
 *	throw new Error("an argument is not a number");
 * }
 * 	return pa + pb;
 * }
 * 
 * function isNumber(num) {
 * 	return !isNaN(num) && isFinite(num);
 * }
 * 
 * let result = sum(js.a, js.b) === 3 ? js.c : null;
 * ----------
 * // result => 'pass'
 *
 * // with JSXPath
 * let JSXPath = require("JSXPath");
 * let jsxpath = new JSXPath(json);
 *
 * let path = '/c[sum(/a, /b) = 3]';
 * let result = jsxpath.process(path);
 * ----------
 * // result => 'pass';
 * ```
 *
 * ## Installation
 *
 * ## Differences & Limitations
 * There are some notable differences and limiations between xml and json that the query langauge do not support.
 * - The '@' symbol is not used in JSXPath expression since JSON only consists of key value pair. '@' in XML denotes an attribute.
 * - The axis 'preceding', 'preceding-sibling', 'following', and 'following-sibling' is currently not supported. JSON is a hash map, the keys are not always returned in a particular order. (although future implentations may involve sorting the the node set and returns the relevant siblings and nodes based on this order). 
 * - The operator token keywords are reserved. This means that the keys in the json cannot contain the following symbols (|,/,+, -, %, *, =, >, <) and spaces (future implemenation may cater for this using quotes to denote a key)
 * 
 * ## Features
 *
 * #### Node Selections, Operators, and Axes
 * JSXPath supports most of the expressions found in xpath.
 * 
 * | Node Selection | Operators | Axes 				|
 * | -------------- | --------  | ----------------- |
 * | key  			| &#124; (todo)| self 		|
 * | . 	 		 	| + 		| ancestor 			|
 * | .. 	 		| - 		| ancestor-or-self	|
 * | / 		 	 	| * 		| child				|
 * | // 			| div 		| descendant 		|
 * | *				| = 		| descendant-or-self|
 * | 				| != 		| parent			|
 * | 				| < 		|					|
 * | 				| <= 		|					|
 * | 				| > 		|					|
 * | 				| >= 		|					|
 * | 				| or 		|					|
 * | 				| and 		|					|
 * | 				| mod 		|					|
 *
 * #### Predicate Expressions
 * Predicate expressions are used to filter out node sets based on conditions within '[' ']'.
 * ```js
 * let JSXPath = require("JSXPath");
 * 
 * let js = {
 * 	tic: 1,
 * 	tac: 10,
 * 	toe: 100,
 * 	foo: {
 * 		tic: 2,
 * 		tac: 20,
 * 		toe: 200
 * 	}
 * };
 * let path = '/toe[/tic = 1 and /tac > 9]';
 * 
 * let jsxpath = new JSXPath(js);
 * let result = jsxpath.process(path);
 * ----------
 * // result => 100
 *
 * let path = '//tac[.>1]'
 * let result = jsxpath.process(path)
 * ----------
 * // result => [10, 20];
 *
 * let path = '/toe[/tac = 3]'
 * let result = jsxpath.process(path);
 * ----------
 * // result => [];
 * ```
 * + If the predicate expression resolved to be true, and the result is a single value, then that is returned.
 * + If the predicate expression resolved to be true, and the result contains multiple values, then the returned value will be an array of values.
 * + If the predicate expression resolved to false, then the returned result will be an empty array.
 *
 * #### Variables
 * JSXPath supports variables denoted by the '$' sign.
 * The process function accepts a varible object as a second argument.
 * ```js
 * let JSXPath = require("JSXPath");
 *
 * let js = { a: 18 };
 * let path = '/a + $v1 - $v2';
 * let vars = { $v1: 19, $v2: 20 };
 *
 * let jsxpath = new JSXPath(js);
 * let result = jsxpath.process(path, vars);
 * ----------
 * // result => 17
 * ```
 * #### Custom Functions
 * Along with predefined JSXPath functions, JSXPath can also support custom functions.
 * The new JSXPath constructor accepts a custom function object as a second argument.
 *
 * `note` the custom function will overwrite the predefined functions if they both share the same function name.
 * ```js
 * let JSXPath = require("JSXPath");
 * let customFunctions = {
 *     max: (args, validator) => {
 * 		let max = validator.validateNumber(args[0], "max()", true);
 * 		for (let i = 1; i < args.length; i++) {
 * 			let n = validator.validateNumber(args[i], "max()", true);
 *			if (n > max) {
 *			  max = n;
 *			}
 *		}
 *		return max;
 *     }
 * };
 * let js = {
 * 	a: 1,
 * 	b: 2,
 * 	c: 3
 * };
 * 
 * let jsxpath = new JSXPath(js, customFunctions);
 * let path = 'max(/a, /b, /c)';
 * let result = jsxpath.process(path);
 * ----------
 * // result => 3
 * ```
 * *__Note:__ the arguments passed in the function can be a number of values:*
 * - a primitive data type (number, string, boolean, undefined, null) value,
 * - a node object in the form of {parent:.., name:..., children:[...], value:...},
 * - an array or a node that has a value of an array of values. TODO: relook at above and this current point.
 *
 * JSXPath provides a number of handy validate helper that can check if an argument is a certain dataType. If it is a valid type then it will return the value otherwise returns null. This can be accessed via the second argument in the custom function.
 *
 * - `validateString( val, caller, throwError )`
 * 	- returns the value string if valid otherwise returns null or throw an error if throwError is set to true
 * - `validateNumber( val, caller, throwError )`
 *	- returns the number value if valid otherwise returns null or throw an error if throwError is set to true
 * - `validateNode( val, caller, throwError )`
 *	- returns the node object if valid otherwise returns null or throw an error if throwError is set to true
 * - `validateBoolean( val, caller, throwError )`
 * 	- returns the boolean value if valid otherwise returns null or throw an error if throwError is set to true
 * - `validateObject( val, caller, throwError )`
 * 	- returns the object value if valid otherwise returns null or throw an error if throwError is set to true
 * - `isArray( val, caller, throwError )`
 * 	- returns the array value if valid otherwise returns null or throw an error if throwError is set to true
 * 
 * The `val` argument can either be a primitive, array or a node object value. If it's a node object, it will look for and check against val.value in order to determine if it is a valid data type.
 * 
 * #### Object Comparison
 * JSXPath has the ability to compare pure JSON objects in the path expression.
 * ```js
 * let JSXPath = require("JSXPath");
 * let js = {
 * 	a: 1,
 * 	b: {c: 2}
 * };
 * let jsxpath = new JSXPath(js);
 * let path = '/b = {"c": 2}';
 * let result = jsxpath.process(path);
 * ----------
 * // result => true
 * ```
 * //or by using varibles to store the object;
 * 
 * ```js
 * let vars = { $c: {c:2} };
 * let path = '/b = $c';
 * let result = jsxpath.process(path, vars);
 * ----------
 * // result => true
 * ```
 * *__Note:__  The json expression must be a valid json format. Only equal (=) and not equal (!=) can be used for object comparison.
 *
 * 
 * @module JSXPath
 * @class JSXPath 
 * 
 */
class JSXPath {
	constructor(poJSON, poCustomFunctions) {
		this.processor = new JSXProcessor(poCustomFunctions);
		this.json = poJSON || {};
		this.variables = null;
		this.result = null;
		this.history = [];
	}

	/**
	 * 
	 * 
	 * process the variable
	 * @param  {string} psPath - the path to be parsed
	 * @param  {object} poVars - the variable object
	 * @return {array}        an array
	 */
	process(psPath, poVars) {
		this.variables = poVars;
		// istanbul ignore if 
		if (DEBUG) {
			console.log(new Date(), "JSXPath:psPath", psPath);
			console.log(new Date(), "JSXPath:poVars", poVars);
		}
		try {
			this.result = this.processor.process(psPath, this.json, poVars);
			this.history.push({
				at: new Date(),
				node: this.result,
				path: psPath,
				variables: poVars && poVars || null
			});

			// istanbul ignore if 
			if (DEBUG) console.log(new Date(), "JSXPath:result", this.history[this.history.length-1]);
			
			if (!this.result) {
				return [];
			} else if (this.result !== {}) {
				if (Array.isArray(this.result) && this.result[0] && this.result[0].name) {
					this.result.sort((nodeA, nodeB) => {
						if (nodeA.name === nodeB.name)
							return nodeA.parent > nodeB.parent;
						else 
							return nodeA.name > nodeB.name;
					});
					var result = [];
					for (let i = 0; i < this.result.length; ++i) {
						result.push(this.result[i].value);
					}
					return result;
				} else if (Array.isArray(this.result.value) && this.result.value.length && this.result.value[0].name) {
					var result = [];
					for (let i = 0; i < this.result.value.length; ++i) {
						result.push(this.result.value[i].value);
					}
					return result;
				}
					
				return (typeof this.result === "object" && this.result.hasOwnProperty("value")) ? this.result.value : this.result;
			} else {
				return [];
			}
		} catch(e) {
			this.history.push({
				at: new Date(),
				err: e,
				path: psPath,
				variables: poVars && poVars || null
			});
			console.error(this.history);
		}
	}

	clearHistory() {
		this.history.lenght = 0;
	}

	getLastHistory() {
		return this.history[this.history.length-1];
	}

	getFullHistory() {
		return this.history;
	}
}

module.exports = JSXPath;