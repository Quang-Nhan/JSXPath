var JSXValidator = require("../Utils/JSXValidator");
var JSXError = require("../Utils/JSXError");
var JSXDebugConfig = require("../JSXDebugConfig");
var moment = require("moment");

/**
 * JSXPath 
 * =======
 * - [Home](../README.html)
 * - [Axis](AXIS.html)
 * - Functions
 * - [Node Selection](NODESELECTION.html)
 * - [Operators](OPERATORS.html)
 *
 * # Functions
 * [node]() , 
 * [nodeValue]() , 
 * [text]()
 * 
 * 
 * Function expression are used to refine queries or add programming capabilities. JSXPath allows user to add their own custom functions (see TODO)
 *
 * The following function examples will use the JSXPath constructor below as the initial setup.
 * ##### constructor
 * ```js
 * var js = {
 * 	int: {
 * 		a: 1,
 * 		b: 2
 * 	},
 * 	dec: {
 * 		a: 1.5,
 * 		b: 1.4
 * 	}
 * 	str: {
 * 		st1: "abc",
 * 		st2: "DE",
 * 		st3: "efg",
 * 		tok: "q,u,a,n,g",
 * 		num: "-10"
 * 	}
 * }
 * var jsxpath = new JSXPath(js);
 * ```
 * @class JSXPathFunctions
 * @constructor
 */
class JSXPathFunctions {
	constructor(exploded, poCustomFunctions) {
		this.DEBUG = JSXDebugConfig.debugOn;
		this.SHOW_PATH_FUNCTIONS = JSXDebugConfig.showPathFunctions;
		this.exploded = exploded;
		this.Validator = new JSXValidator();
		this.ErrorHandler = new JSXError();
		this.customs = poCustomFunctions;
		this.tokens = {
			/**
			 * ## node //TODO: jasmine
			 * retrieve the current node object containing the following properties { name, value, parent, children }
			 *
			 * [constructor](#constructor)
			 * ```js
			 * let path = '/int/*[node() = ';
			 * let result = jsxpath.process(path);
			 * ==========
			 * // result => { name: "a", value: 1, parent: "int", children: [] }
			 * ```
			 *
			 * @deprecated
			 * @method node
			 * @return {object} current node object
			 */
			"node": () => {
				return this.exploded["."];
			  }
			  /**
			   * ## nodeValue //TODO: jasmine
			   * retrieves the value/s of nodes. If no nodes are passed in, then the current node value is returned
			   *
			   * [constructor](#constructor)
			   * ```js
			   * let path = '/int/*[nodeValue() = 1]';
			   * let result = jsxpath.process(path);
			   * ==========
			   * // result => [1]
			   * ```
			   * 
			   * @method nodeValue
			   * @param  {Array} [args]
			   * @return {any|Array<any>} the value of the current node or an array of node values
			   */
			, "nodeValue": (args) => {
				// this.ErrorHandler.test("ArgumentLength", {name: "node-value()", data: args.length === 0, at: "JSXPathFunctions:node-value()"});

				if (args.length === 0) {
					return this.exploded["."].value;
				}

				var result;
				if (Array.isArray(args[0])) {
					result = this.Validator.validateNode(args[0][0], "nodeValue()", true);
				} else {
					result = this.Validator.validateNode(args[0], "nodeValue()", true);
				}
				return result;
			  }
			/**
			 * ## text //TODO:jasmine
			 * retrieves the string formatted of nodes value/s. If no nodes are passed in, then the current node value text is returned
			 *
			 * [constructor](#constructor)
			 * ```js
			 * let path = '';
			 * let result = jsxpath.process(path);
			 * ==========
			 * // result => 
			 * ```
			 * 
			 * @method text
			 * @param  {Array} [args]
			 * @return {any|Array<any>} the value of the current node or an array of node values
			 */
			, "text": (args) => {
				if (args.length === 0)
					return JSON.stringify(this.exploded["."].value);
				var result;
				if (Array.isArray(args[0])) {
					result = JSON.stringify(this.Validator.validateNode(args[0][0], "nodeValue()", true));
				} else {
					result = JSON.stringify(this.Validator.validateNode(args[0], "nodeValue()", true));
				}
				return result;
			  }
			/**
			 * ## contains
			 * validates that the source string contains the search string
			 *
			 * [constructor](#constructor)
			 * ```js
			 * let path = 'contains(/str/st2, "E")';
			 * let result = jsxpath.process(path);
			 * ==========
		 	 * // result => true
			 * ``` 
			 * 
			 * ```js
			 * let path = 'contains(/str/st2, "e")';
			 * let result = jsxpath.process(path);
			 * ==========
		 	 * // result => false
			 * ```
			 * 
			 * @method contains
			 * @param  {Array<String>} args - two arguments: [0] source string, [1] search string
			 * @return {Boolean} true of the source string contains the search string
			 */
			, "contains": (args) => {
				this.ErrorHandler.test("ArgumentLength", {name: "contains()", data: args.length !== 2, at: "JSXPathFunctions:contains()"});

				let source = this.Validator.validateString(args[0], "contains()", true);
				let search = this.Validator.validateString(args[1], "contains()", true);
				return source.indexOf(search) > -1;
			  }
			/**
			 * ## concat
			 * combines a set of strings and return the resulting string.
			 *
			 * [constructor](#constructor)
			 * ```js
		  	 * let path = 'concat(/str/st1, /str/st2, /str/st3, " ZYW")';
			 * let result = jsxpath.process(path);
		  	 * ==========
			 * // result => "abcDEfgh ZYW"
			 * ```
			 * 
			 * @method concat
			 * @param  {Array<String>} args
			 * @return {String} the combined string
			 */
			, "concat": (args) => {
				this.ErrorHandler.test("ArgumentLength", {name: "concat()", data: args.length === 0, at: "JSXPathFunctions:concat()"});

				let sVal = "", self = this;
				for (let i = 0; i < args.length; i++) {
					sVal += this.Validator.validateString(args[i], "concat()", true);
				}
				return sVal;
			  }
			/**
			 * ## substring
			 * returns the substring of the source string given the starting index and optional substring length.
			 *
			 * [constructor](#constructor)
			 * ```js
			 * let path = 'substring(/str/st1, 1)';
			 * let result = jsxpath.process(path);
			 * ==========
			 * // result => bc
			 * ``` 
			 * 
			 * ```js
			 * let path = 'substring(/str/st1, 1, 1)';
			 * let result = jsxpath.process(path);
			 * ==========
			 * // result => b
			 * ```
			 * 
			 * @method substring
			 * @param  {Array} args - two or three arguments: [0] source string, [1] start index number, [2] substring length number (optional)
			 * @return {String} the combined string
			 */
			, "substring": (args) => {
				this.ErrorHandler.test("ArgumentLength",{name: "substring()", data: args.length < 2 || args.length > 3, at: "JSXPathFunctions:substring()"});

				let source = this.Validator.validateString(args[0], "substring()", true);
				let start = this.Validator.validateNumber(args[1], "substring()", true);
				let length = args[2] ? this.Validator.validateNumber(args[2], "substring()", true) : null;
				let aArgs = [start];
				if (length) {
					aArgs.push(length + start);
				}
				return source.substring.apply(source, aArgs);
			  }
			/**
			 * ## substring-before
			 * returns the substring-before of the source string before the start of the search string.
			 *
			 * [constructor](#constructor)
			 * ```js
			 * let path = 'substring-before(/str/st3, "f")';
			 * let result = jsxpath.process(path);
			 * ==========
			 * // result => "e"
			 * ```
			 * 
			 * @method substringBefore
			 * @param  {Array} args - two arguments: [0] source string, [1] search string
			 * @return {String} the substring before the start of the search string
			 */
			, "substringBefore": (args) => {
				this.ErrorHandler.test("ArgumentLength", {name: "substring-before()", data: args.length !== 2, at: "JSXPathFunctions:substring-before()"});

				let source = this.Validator.validateString(args[0], "substring-after()", true);
				let search = this.Validator.validateString(args[1], "substring-after()", true);
				let index = source.search(search);
				return source.substring(0, index); 
			  }
			/**
			 * ## substring-after
			 * returns the substring-after of the source string after the end of the search string.
			 *
			 * [constructor](#constructor)
			 * ```js
			 * let path = 'substring-after(/str/st3, "f")';
			 * let result = jsxpath.process(path);
			 * ==========
			 * // result => "g"
			 * ```
			 * 
			 * @method substringAfter
			 * @param  {Array} args - two arguments: [0] source string, [1] search string
			 * @return {String} the substring after the end of the search string
			 */
			, "substringAfter": (args) => {
				this.ErrorHandler.test("ArgumentLength", {name: "substring-after()", data: args.length !== 2, at: "JSXPathFunctions:substring-after()"});

				let source = this.Validator.validateString(args[0], "substring-after()", true);
				let search = this.Validator.validateString(args[1], "substring-after()", true);
				let index = source.search(search) + search.length;
				return source.substring(index);
			  }
			/**
			 * ## translate //TODO: jasmine
			 * returned the tranformed string given a 'from' list of characters to the 'to' list of characters.
			 *
			 * [constructor](#constructor)
			 * ```js
			 * let path = 'translate("abDE EDfg", "DE", "de")';
			 * let result = jsxpath.process(path);
			 * ==========
			 * // result => "abde edfg"
			 * ```
			 * 
			 * @method translate
			 * @param  {Array} args - three arguments: [0] source string, [1] from string of characters, [2] to string of characters
			 * @return {String} the translated string
			 */
			, "translate": (args) => {
				this.ErrorHandler.test("ArgumentLength", {name: "translate()", data: args.length !== 3, at: "JSXPathFunctions:translate()"});

				let source = this.Validator.validateString(args[0], "translate()", true);
				let from = this.Validator.validateString(args[1], "translate()", true);
				let to = this.Validator.validateString(args[2], "translate()", true);
				if (from.length < to.length) {
					to = to.substring(0, from.length);
				} else if (from.length > to.length) {
					from = from.substring(0, to.length);
				}

				var result = source;
				for (let i = 0; i < from.length; ++i) {
					result = result.replace(new RegExp(from[i], "g"), to[i]);
				}
				return result;
			  }
			/**
			 * ## string-length
			 * returns the length of a given string.
			 *  
			 * ```js
			 * let path = 'string-length(/str/st2)';
			 * let result = jsxpath.process(path);
			 * ==========
			 * // result => 2
			 * ```
			 * 
			 * @method stringLength
			 * @param  {Array} args - one argument: [0] source string
			 * @return {Number} the length of the string
			 */
			, "stringLength": (args) => {
				this.ErrorHandler.test("ArgumentLength", {name: "string-length()", data: args.length !== 1, at: "JSXPathFunctions:string-length()"});

				let source = this.Validator.validateString(args[0], "string-length()", true);
				return source.length;
			  }
			/**
			 * ## matches
			 * returns true if the source string matches a string/regex pattern.
			 *
			 * [constructor](#constructor)
			 * ```js
			 * let path = 'matches(/str/st2, "^D")';
			 * let result = jsxpath.process(path);
			 * ==========
			 * // result => true
			 * ```
			 * 
			 * @method matches
			 * @param  {Array} args - two arguments: [0] source string, [1] pattern string/regex
			 * @return {Boolean} a list of matched substring
			 */
			, "matches": (args) => {
				this.ErrorHandler.test("ArgumentLength", {name: "matches()", data: args.length !== 2, at: "JSXPathFunctions:matches()"});

				let source = this.Validator.validateString(args[0], "matches()", true);
				let pattern = this.Validator.validateString(args[1], "matches()", true);
				let match = source.match(new RegExp(pattern));

				return Array.isArray(match);
			  }
			/**
			 * ## replace
			 * Replaces substring matching a string/pattern with the replacement string and returns the result.
			 *  
			 * ```js
			 * let path = 'replace(/str/st3, "[\w]g", "F")';
			 * let result = jsxpath.process(path);
			 * ==========
			 * // result => "eF"
			 * ```
			 * 
			 * @method replace
			 * @param  {Array} args - three arguments: [0] source string, [1] pattern string/regex, [2] replacement string
			 * @return {String} the transformed string
			 */
			, "replace": (args) => {
				this.ErrorHandler.test("ArgumentLength", {name: "replace()", data: args.length !== 3, at: "JSXPathFunctions:replace()"});

				let source = this.Validator.validateString(args[0], "replace()", true);
				let pattern = this.Validator.validateString(args[1], "replace()", true);
				let replacement = this.Validator.validateString(args[2], "replace()", true);
				return source.replace(new RegExp(pattern, "g"), replacement); 
			  }
			/**
			 * ## tokenize
			 * Splits the string based on the token pattern specified
			 *
			 * [constructor](#constructor)
			 * ```js
			 * let path = 'tokenize(/str/tok, ",")';
			 * let result = jsxpath.process(path);
			 * ==========
			 * // result => ["q", "u", "a", "n", "g"]
			 * ```
			 * 
			 * @method tokenize
			 * @param  {Array} args - two arguments: [0] source string, [1] pattern string/regex
			 * @return {Array<String>} a list of splitted strings
			 */
			, "tokenize": (args) => {
				this.ErrorHandler.test("ArgumentLength", {name: "tokenize()", data: args.length !== 2, at: "JSXPathFunctions:tokenize()"});

				let source = this.Validator.validateString(args[0], "tokenize()", true);
				let pattern = this.Validator.validateString(args[1], "tokenize()", true);
				let result =  source.split(new RegExp(pattern));
				for (var i = 0; i < result.length; ++i) {
					if (result[i] !== "")
						return result;
				}
				throw new Error ("thrown in function tokenize(), pattern matches zero-length string."); 
			  }
			/**
			 * ## round
			 * Round a decimal number to it's nearest integer. If the decimal is greater than or equal to x.5, it will round up otherwise round down
			 *
			 * [constructor](#constructor)
			 * ```js
			 * let path = 'round(/dec/a)';
			 * let result = jsxpath.process(path);
			 * ==========
			 * // result => 2
			 * ```
			 * 
			 * ```js
			 * let path = 'round(/dec/b)';
			 * let result = jsxpath.process(path);
			 * ==========
			 * // result => 1
			 * ```
			 * 
			 * @method round
			 * @param  {Array} args - one arguments: [0] source number
			 * @return {Number} the rounded integer value
			 */
			, "round": (args) => {
				this.ErrorHandler.test("ArgumentLength", {name: "round()", data: args.length !== 1, at: "JSXPathFunctions:round()"});

				let source = this.Validator.validateNumber(args[0], "round()", true);
				return Math.round(source);
			  }
			/**
			 * ## floor
			 * Floor a decimal number to it's largest integer less than or equal to a given number.
			 *
			 * [constructor](#constructor)
			 * ```js
			 * let path = 'floor(/dec/b)';
			 * let result = jsxpath.process(path);
			 * ==========
			 * // result => 1
			 * ```
			 * 
			 * @method floor
			 * @param  {Array} args - one arguments: [0] source number
			 * @return {Number} the floored integer value
			 */
			, "floor": (args) => {
				this.ErrorHandler.test("ArgumentLength", {name: "floor()", data: args.length !== 1, at: "JSXPathFunctions:floor()"});

				let source = this.Validator.validateNumber(args[0], "floor()", true);
				return Math.floor(source);
			  }
			/**
			 * ## ceiling
		  	 * Ceiling a decimal number to it's smallest integer greater than or equal to a given number.
			 *
			 * [constructor](#constructor)
			 * ```js
			 * let path = 'ceiling(/dec/a)';
			 * let result = jsxpath.process(path);
			 * ==========
			 * // result => 2
			 * ```
			 * 
			 * @method ceiling
			 * @param  {Array} args - one arguments: [0] source number
			 * @return {Number} the ceiling integer value
			 */
			, "ceiling": (args) => {
				this.ErrorHandler.test("ArgumentLength", {name: "ceiling()", data: args.length !== 1, at: "JSXPathFunctions:ceiling()"});

				let source = this.Validator.validateNumber(args[0], "ceiling()", true);
				return Math.ceil(source);
			  }
			  /**
			   * ## count
			   * Returns the number of nodes in a node set.
			   *
			   * [constructor](#constructor)
			   * ```js
			   * let path = '';
			   * let result = jsxpath.process(path);
			   * ==========
			   * // result => 
			   * ```
			   * 
			   * @method count
			   * @param  {Array} args - one arguments: [0] source number
			   * @return {Number} the number of nodes
			   */
			, "count": (args) => {
				//TODO write test cases
				this.ErrorHandler.test("ArgumentLength", {name: "count()", data: args.length !== 1, at: "JSXPathFunctions:count()"});
				if (!args[0] || args[0] === []) return Number(0);
				let source = this.Validator.isArray(args[0], "");

				return source ? source.length : 1;
			  }
			/**
			 * ## sum //TODO: jasmine
			 * Returns the sum of numbers and/or nodes that contains number value.
			 *
			 * [constructor](#constructor)
			 * ```js
			 * let path = 'sum(/int/a, /int/b)';
			 * let result = jsxpath.process(path);
			 * ==========
			 * // result => 3
			 * ```
			 * 
			 * @method sum
			 * @param  {Array<Number|Object>} [args]
			 * @return {Number} the summation result
			 */
			, "sum": (args) => { //TODO! duration with time/date
				/* istanbul ignore if */
				if (this.DEBUG && this.SHOW_PATH_FUNCTIONS) console.log(new Date(), "JSXPathFunctions:sum:args", args);
				// this.ErrorHandler.test("ArgumentLength", {name: "sum()", data: args.length === 0, at: "JSXPathFunctions:sum()"});

				let aNums = [];
				for (let i = 0; i < args.length; ++i) {
					let arg = this.Validator.isArray(args[i], "sum()");
					if (!arg) {
						arg = this.Validator.validateNumber(args[i], "sum()");
					}
					Array.isArray(arg) ? aNums = aNums.concat(arg) : aNums.push(arg);
				}

				let sum = 0;
				for (let j = 0; j < aNums.length; ++j) {
					// this.ErrorHandler.test("DefinedAndValidType", {name:"aNums["+j+"]" ,data: aNums[j], expectedType: "number", type: !isNaN(aNums[j]) && typeof(aNums[j]) === "number" ? "number": "NaN", at: "JSXPathFunctions:sum"})
					if (aNums[j] === null || isNaN(aNums[j])) {
						sum = NaN;
						break;
					}
					sum += aNums[j];
				}

				// istanbul ignore if
				if (this.DEBUG && this.SHOW_PATH_FUNCTIONS) console.log(new Date(), "JSXPathFunctions:sum:result", sum);
				return sum;
			  }
			  /**
			   * ## name
			   * the name of the node or the name of the current node if no argument is passed.
			   *
			   * [constructor](#constructor)
			   * ```js
			   * let path = '';
			   * let result = jsxpath.process(path);
			   * ==========
			   * // result => 
			   * ```
			   * 
			   * @method name
			   * @param  {Array} args - one arguments: [0] source number
			   * @return {String} the name of the node
			   */
			, "name": (args) => {
				// this.ErrorHandler.test("ArgumentLength", {name: "name()", data: args.length > 1, at: "JSXPathFunctions:name()"});
				if (args.length === 0) {
					return this.exploded["."].name;
				}

				var node;
				if (Array.isArray(args[0])) {
					if (!args[0].length) {
						return "";
					}
					node = this.Validator.validateNode(args[0][0], "name()", true);
				} else {
					node = this.Validator.validateNode(args[0], "name()", true);
				}
				return node.name;
			  }
			/**
			 * ## local-name //TODO: jasmine
			 * Returns the current node name.
			 *
			 * [constructor](#constructor)
			 * ```js
			 * let path = '/int/*[local-name() = "a"]';
			 * let result = jsxpath.process(path);
			 * ==========
			 * // result => 1
			 * ```
			 * 
			 * @method localName
			 * @return {String} the current node name.
			 */
			, "localName": () => {
				if (this.exploded["."].name === "@")
					return "root";
				return this.exploded["."].name;
			  }
			, last: () => {
				//if array, returns the last on the list
				//otherwise returns the last child object according to the sorted children list
			  }
			, first: () => {
				//if array, returns the first on the list
				//otherwise returns the first object according to sorted children list
			  }
			/**
			 * ## number //TODO: jasmine
			 * Converts the value of a node or primitive value to a number. If no arguments is given, the value of the current node is converted to a number if valid.
			 *
			 * [constructor](#constructor)
			 * ```js
			 * let path = 'number(/str/num)';
			 * let result = jsxpath.process(path);
			 * ==========
			 * // result => -10
			 * ```
			 * 
			 * @method number
			 * @param  {Array} [args]
			 * @return {Number}
			 */
			, "number": (args) => {
				//converts to number. if not a type number, converts to 0;
				this.ErrorHandler.test("ArgumentLength", {name: "number()", data: args.length > 1, at: "JSXPathFunctions:number()"});

				if (args.length === 0) {
					return Number(this.exploded["."].value);
				}
				if (args[0] && args[0].value) {
					return Number(args[0].value);
				}
				return Number(args[0]);
			  }
			/**
			 * ## string
			 * Converts the value of a node or primitive value to a string. If no argument is given, the value of the current node is converted to a string.
			 *
			 * [constructor](#constructor)
			 * ```js
			 * let path = 'string(/int/b)';
			 * let result = jsxpath.process(path);
			 * ==========
			 * // result => "2"
			 * ```
			 * 
			 * @method string
		  	 * @param  {Array} [args]
			 * @return {String}
			 */
			, "string": (args) => {
				this.ErrorHandler.test("ArgumentLength", {name: "string()", data: args.length > 1, at: "JSXPathFunctions:string()"});

				if (args.length === 0){
					if (this.exploded["."].value)
						return this.exploded["."].value.toString();
					return "";
				}
				if (args[0] && args[0].value) {
					return args[0].value.toString();
				}
				if ("object" !== typeof args[0]) {
					return args[0].toString();
				}
				return "";
			  }
			/**
			 * ## boolean //TODO code and jasmine
			 * Converts the value of a node or primitive value to a boolean. If no argument is given, the value of the current node is converted to a boolean.
		  	 *
			 * [constructor](#constructor)
		  	 * ```js
			 * let path = 'boolean(/notExists)';
			 * let result = jsxpath.process(path);
			 * ==========
			 * // result => false
			 * ```
			 * 
		  	 * ```js
			 * let path = 'boolean(';
			 * let result = jsxpath.process(path);
			 * ==========
			 * // result => 
			 * ```
			 * 
			 * @method boolean
			 * @param  {Array} [args]
			 * @return {Boolean}
			 */
			, "boolean": (args) => {

			  }
			, "castable-as": (Value) => {

			  }
			, "instance-of": () => {

			  }
			, "cast-to": () => {

			  }
			, "true": () =>{

			  }
			, "false": () => {

			  }
			, "position": (args) => {
				let current = this.exploded["."];
				let result = [];
				if (Array.isArray(current.value) && current.value.length) {
					let num = isNaN(args[0]) ? args[2] : args[0];
					switch(args[1]) {
						case "=":
							if (num > 0 && num <= current.value.length) {
								result.push(current.value[num-1]);
							}
							break;
						case "≠":
							for (let i = 0; i < current.value.length; ++i) {
								if (i !== num-1) {
									result.push(current.value[i]);
								}
							}
							break;
						case ">":
							args[1] = "<";
						case "≥":
							// swap
							let tmp = args[0];
							args[0] = args[2];
							args[2] = tmp;
							if (args[1] === "≥")
								args[1] = "≤";
						case "<":
						case "≤":
							result = current.value.filter((e, i) => {
								if (args[0] === num) {
									return args[1] === "≤" ? num <= i+1 : num < i+1
								} else {
									return args[1] === "≤" ? i+1 <= num : i+1 < num;
								}
							});
							break;
					}
				}
				return result;
			}
			, "distinct-values": () => {

			 }
			, "now": (args) => {
				return new moment();
			}
			, "years" : (args) => {

			}
			/**
			 * ## not
			 * Negates the boolean value.
			 *
			 * [constructor](#constructor)
			 * ```js
			 * let path = 'not(/a = /b)';
			 * let result = jsxpath.process(path);
			 * ==========
			 * // result => true
			 * ```
			 * 
			 * @method not
			 * @param  {Array} args - one arguments: [0] node set or boolean value
			 * @return {Boolean} 
			 */
			, "not": (args) => {
				this.ErrorHandler.test("ArgumentLength", {name: "not()", data: args.length !== 1, at: "JSXPathFunctions:not()"});
				let result = this.Validator.validateNode(args[0], "not()");
				if (!result)
					result = this.Validator.validateBoolean(args[0], "not()", true);
				return !result;
			}
			, "min": (args) => {
		  		let min = this.Validator.validateNumber(args[0], "min()", true);
		  		for (let i = 1; i < args.length; i++) {
		  			let n = this.Validator.validateNumber(args[i], "min()", true);
		 			if (n < min) {
		 			  min = n;
		 			}
		 		}
		 		return min;
			}
			, "max": () => {

			}
			, "avg": () => {

			}
			, "currentDate": () => {

			}
			, "currentDateTime": () => {

			}
			, "formatDate": () => {

			}
			, "formatDateTime": () => {

			}
			, "formatTime": () => {

			}
			, "dayFromDate": () => {

			}
			, "dayFromDateTime": () => {

			}
			, "hoursFromDateTime": () => {
				
			}
			, "minutesFromDateTime": () => {

			}
			, "secondsFromDatTime": () => {

			}
			, "timezoneFromDateTime": () => {

			}
			, "yearFromDate": () => {

			}
			, "monthFromDate": () => {

			}
			, "dayFromDate": () => {

			}
			, "timezoneFromDate": () => {

			}
			, "hoursFromTime": () => {

			}
			, "minutesFromTime": () => {

			}
			, "secondsFromTime": () => {

			}
			, "timezoneFromTime": () => {

			}
		}
	}

	tokens() {
		return this.tokens;
	}

	customs() {
		return this.customs
	}

	_outputDebug(mode, where, prev, next, result) {
		/* istanbul ignore next */
		if (this.DEBUG && this.SHOW_PATH_FUNCTIONS) {
			let args = [new Date(), where, mode === "init" ? "prev" : "prevValue", prev, mode === "init" ? "next" : "nextValue", next];
			if (mode !== "init") {
				args = args.concat(["result", result]);
			}
			console.log.apply(this, args);
		}
	}
}

module.exports = JSXPathFunctions;