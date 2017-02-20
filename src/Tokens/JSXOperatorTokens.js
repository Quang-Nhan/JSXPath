var JSXValidator = require("../Utils/JSXValidator");
var _ = require("lodash");
var JSXDebugConfig = require("../JSXDebugConfig");
/**
 * JSXPath
 * =======
 * - [Home](../README.html)
 * - [Axis](AXIS.html)
 * - [Functions](FUNCTIONS.html)
 * - [Node Selection](NODESELECTION.html)
 * - Operators
 * 
 * # Operators 
 * ##### [+](#+) , [-](#-2) , [*](#-3) , [div](#div) , [mod](#mod) , [=](#-4) , [!=](#-5) , [>](#gt) , [<](#lt) , [>=](#gt-2) , [<=](#lt-2) , [and](#and) , [or](#or) , [|](#-6)
 * Operators are symbols used to perform operation/tests on its left and right values.
 *
 * The following operator examples will use the JSXPath constructor below as the initial setup.
 * ```js
 * var JSXPath = require("JSXPath");
 * var js = {
 *	a: 1,
 *	b: 2,
 *	c: [3, 4]
 * };
 * var jsxpath = new JSXPath(js); 
 * ```
 *
 * @module Tokens
 * @class JSXOperatorTokens
 * @constructor
 */
class JSXOperatorTokens {
	/**
	 * @method constructor - Creates operator tokens
	 */
	constructor() {
		this.DEBUG = JSXDebugConfig.debugOn;
		this.SHOW_OPERATOR_TOKENS = JSXDebugConfig.showOperatorTokens;
		this.Validator = new JSXValidator();
		this.tokens = {
			/**
			 * ## ++
			 * summation
			 * 
			 * ```js
			 * let path = '9 + /a';
			 * let result = jsxpath.process(path);
			 * ----------
			 * // result => 10
			 * ```
			 * 
			 * @function +
			 * @param  {object|number} prev - the previous parsed value before `+`
			 * @return {function} A function that accepts the next parsed value argument
			 */
			"+": (prev) => {
				return (next) => {
					this._outputDebug("init", "JSXOperatorTokens:+", prev, next);

					let prevValue = this.Validator.validateNumber(prev, "+");
					let nextValue = this.Validator.validateNumber(next, "+");

					if (null === prevValue) {
						prevValue = this.Validator.validateString(prev, "+", true);
					}
					if (null === nextValue) {
						nextValue = this.Validator.validateString(next, "+", true);
					}

					let result = prevValue + nextValue;
					// istanbul ignore next
					this._outputDebug("result", "JSXOperatorTokens:+", prevValue, nextValue, result);
					return result;
				} 
			},
			/**
			 * ## -
			 * subtraction
			 * 
			 * ```js
			 * let path = '/a - /b';
			 * let result = jsxpath.process(path);
			 * ----------
			 * // result => -1
			 * ```
			 * 
			 * @function ¬
			 * @param  {object|number} prev - the previous parsed value before `+`
			 * @return {function} A function that accepts the next parsed value argument
			 */
			"¬": (prev) => {
				return (next) => {
					this._outputDebug("init", "JSXOperatorTokens:-", prev, next);

					let prevValue = this.Validator.validateNumber(prev, "-", true);
					let nextValue = this.Validator.validateNumber(next, "-", true);

					let result = prevValue - nextValue;
					// istanbul ignore next
					this._outputDebug("result", "JSXOperatorTokens:-", prevValue, nextValue, result);
					return result;
				}
			},
			/**
			 * ## *
			 * multiply
			 * 
			 * ```js
			 * let path = '/c[2] * /b';
			 * let result = jsxpath.process(path);
			 * ---------
			 * // result => 8
			 * ```
			 * 
			 * @function ~
			 * @param  {object|number} prev - the previous parsed value before `+`
			 * @return {function} A function that accepts the next parsed value argument
			 */
			"~": (prev) => {
				return (next) => {
					this._outputDebug("init", "JSXOperatorTokens:*", prev, next);

					let prevValue = this.Validator.validateNumber(prev, "*", true);
					let nextValue = this.Validator.validateNumber(next, "*", true);
					let result = prevValue * nextValue;
					// istanbul ignore next
					this._outputDebug("result", "JSXOperatorTokens:*", prevValue, nextValue, result);
					return result;
				}
			},
			/**
			 * ## div
			 * division
			 * 
			 * ```js
			 * let path = '20 div /b';
			 * let result = jsxpth.process(path);
			 * ---------
			 * // result => 10
			 * ```
			 * 
			 * @function ÷
			 * @param  {object|number} prev - the previous parsed value before `+`
			 * @return {function} A function that accepts the next parsed value argument
			 */
			"÷": (prev) => {
				return (next) => {
					this._outputDebug("init", "JSXOperatorTokens:div", prev, next);

					let prevValue = this.Validator.validateNumber(prev, "div", true);
					let nextValue = this.Validator.validateNumber(next, "div", true);
					let result = prevValue / nextValue;
					// istanbul ignore next
					this._outputDebug("result", "JSXOperatorTokens:div", prevValue, nextValue, result);
					return result;
				}
			},
			/**
			 * ## mod
			 * modulus
			 * 
			 * ```js
			 * let path = '1 mod /b';
			 * let result = jsxpth.process(path);
			 * ---------
			 * // result => 1
			 * ```
			 * 
			 * @function %
			 * @param  {object|number} prev - the previous parsed value before `+`
			 * @return {function} A function that accepts the next parsed value argument
			 */
			"%": (prev) => {
				return (next) => {
					this._outputDebug("init", "JSXOperatorTokens:mod", prev, next);

					let prevValue = this.Validator.validateNumber(prev, "mod", true);
					let nextValue = this.Validator.validateNumber(next, "mod", true);
					let result = prevValue % nextValue;
					// istanbul ignore next
					this._outputDebug("result", "JSXOperatorTokens:mod", prevValue, nextValue, result);
					return result;
				}
			},
			/**
			 * ## =
			 * equality
			 * 
			 * ```js
			 * let path = '/a = /b';
			 * let result = jsxpath.process(path);
			 * ----------
			 * // result => false
			 * ```
			 * @function =
			 * @param  {object|number} prev - the previous parsed value before `+`
			 * @return {function} A function that accepts the next parsed value argument
			 */
			"=": (prev) => {
				return (next) => {
					this._outputDebug("init", "JSXOperatorTokens:=", prev, next);
					
					let prevValue = this.Validator.validateNumber(prev, "=");
					let nextValue = this.Validator.validateNumber(next, "=");
					let result;

					if (prevValue === null) {
						prevValue = this.Validator.validateString(prev, "=");
					}
					if (nextValue === null) {
						nextValue = this.Validator.validateString(next, "=");
					}
					if (prevValue === null) {
						prevValue = this.Validator.isArray(prev, "=");
					}
					if (nextValue === null) {
						nextValue = this.Validator.isArray(next, "=");
					}
					if (prevValue === null) {
						prevValue = this.Validator.validateObject(prev, "=");
					}
					if (nextValue === null) {
						nextValue = this.Validator.validateObject(next, "=");
					}
					if (prevValue === null) {
						prevValue = this.Validator.validateNode(prev, "=");
					}
					if (nextValue === null) {
						nextValue = this.Validator.validateNode(next, "=");
					}

					if (prevValue && prevValue.value){
						result = _.isEqual(prevValue.value, nextValue);
					} else if (nextValue && nextValue.value) {
						result = _.isEqual(prevValue, nextValue.value);
					} else if (Array.isArray(prevValue) && Array.isArray(nextValue)) {
						result = _.isEqual(prevValue, nextValue)
					} else if (Array.isArray(prevValue)) {
						result = _.filter(prevValue, {value: nextValue});
					} else if (Array.isArray(nextValue)) {
						result = _.filter(nextValue, {value: prevValue});
					} else {
						result = _.isEqual(prevValue, nextValue);
					}

					// istanbul ignore next
					this._outputDebug("result", "JSXOperatorTokens:=", prevValue, nextValue, result);
					return result;
				}
			},
			/**
			 * ## !=
			 * not equal
			 * 
			 * ```js
			 * let path = '/a != /b'
			 * let result = jsxpath.process(path);
			 * ----------
			 * // result => true
			 * ```
			 * 
			 * @function ≠
			 * @param  {object|number} prev - the previous parsed value before `+`
			 * @return {function} A function that accepts the next parsed value argument
			 */
			"≠": (prev) => {
				return (next) => {
					this._outputDebug("init", "JSXOperatorTokens:≠", prev, next);

					let prevValue = this.Validator.validateNumber(prev, "=");
					let nextValue = this.Validator.validateNumber(next, "=");

					if (prevValue === null) {
						prevValue = this.Validator.validateString(prev, "=");
					}
					if (nextValue === null) {
						nextValue = this.Validator.validateString(next, "=");
					}
					if (prevValue === null) {
						prevValue = this.Validator.isArray(prev, "=");
					}
					if (nextValue === null) {
						nextValue = this.Validator.isArray(next, "=");
					}
					if (prevValue === null) {
						prevValue = this.Validator.validateNode(prev, "=");
					}
					if (nextValue === null) {
						nextValue = this.Validator.validateNode(next, "=");
					}

					let result = !_.isEqual(prevValue, nextValue);
					// istanbul ignore next
					this._outputDebug("result", "JSXOperatorTokens:≠", prevValue, nextValue, result);
					return result;
				}
			},
			/**
			 * ## >
			 * greater than
			 * 
			 * ```js
			 * let path = '/a > 1';
			 * let result = jaxpath.process(path);
			 * ----------
			 * // result => false
			 * ```
			 * 
			 * @function >
			 * @param  {object|number} prev - the previous parsed value before `+`
			 * @return {function} A function that accepts the next parsed value argument
			 */
			">": (prev) => {
				return (next) => {
					this._outputDebug("init", "JSXOperatorTokens:>", prev, next);

					let prevValue = this.Validator.validateNumber(prev, ">", true);
					let nextValue = this.Validator.validateNumber(next, ">", true);
					let result = [];
					if (Array.isArray(prevValue) && Array.isArray(nextValue)) {
						// istanbul ignore next
						this._outputDebug("result", "JSXOperatorTokens:>", prevValue, nextValue, result);
						return result;
					} 

					if (Array.isArray(prevValue)) {
						result = prevValue.filter((e) => e.value > nextValue);
						// istanbul ignore next
						this._outputDebug("result", "JSXOperatorTokens:>", prevValue, nextValue, result);
						return result;
					} else if (Array.isArray(nextValue)) {
						result = nextValue.filter((e) => prevValue > e.value);
						// istanbul ignore next
						this._outputDebug("result", "JSXOperatorTokens:>", prevValue, nextValue, result);
						return result;
					}

					result = prevValue > nextValue;
					// istanbul ignore next
					this._outputDebug("result", "JSXOperatorTokens:>", prevValue, nextValue, result);
					return result;
				}
			},
			/**
			 * ## <
			 * less than
			 * 
			 * ```js
			 * let path = '/a < 1';
			 * let result = jsxpath.process(path);
			 * ----------
			 * // result => false
			 * ```
			 * 
			 * @function <
			 * @param  {object|number} prev - the previous parsed value before `+`
			 * @return {function} A function that accepts the next parsed value argument
			 */
			"<": (prev) => {
				return (next) => {
					this._outputDebug("init", "JSXOperatorTokens:<", prev, next);

					let prevValue = this.Validator.validateNumber(prev, "<", true);
					let nextValue = this.Validator.validateNumber(next, "<", true);
					let result;
					if (Array.isArray(prevValue) && Array.isArray(nextValue)) {
						// istanbul ignore next
						this._outputDebug("result", "JSXOperatorTokens:<", prevValue, nextValue, []);
						return [];
					} 

					if (Array.isArray(prevValue)) {
						result = prevValue.filter((e) => e.value < nextValue);
						// istanbul ignore next
						this._outputDebug("result", "JSXOperatorTokens:<", prevValue, nextValue, result);
						return result;
					} else if (Array.isArray(nextValue)) {
						result = nextValue.filter((e) => prevValue < e.value);
						// istanbul ignore next
						this._outputDebug("result", "JSXOperatorTokens:<", prevValue, nextValue, result);
						return result;
					}

					result = prevValue < nextValue;
					// istanbul ignore next
					this._outputDebug("result", "JSXOperatorTokens:<", prevValue, nextValue, result);
					return result;
				}
			},
			/**
			 * ## >=
			 * greater than or equal to
			 * 
			 * ```js
			 * let path = '/a >= 1';
			 * let result = jsxpath.process(path);
			 * ----------
			 * // result => true
			 * ```
			 * 
			 * @function ≥
			 * @param  {object|number} prev - the previous parsed value before `+`
			 * @return {function} A function that accepts the next parsed value argument
			 */
			"≥": (prev) => {
				return (next) => {
					this._outputDebug("init", "JSXOperatorTokens:≥", prev, next);

					let prevValue = this.Validator.validateNumber(prev, ">=", true);
					let nextValue = this.Validator.validateNumber(next, ">=", true);
					let result = [];
					if (Array.isArray(prevValue) && Array.isArray(nextValue)) {
						// istanbul ignore next
						this._outputDebug("result", "JSXOperatorTokens:≥", prevValue, nextValue, result);
						return result;
					} 

					if (Array.isArray(prevValue)) {
						result = prevValue.filter((e) => e.value >= nextValue);
						// istanbul ignore next
						this._outputDebug("result", "JSXOperatorTokens:≥", prevValue, nextValue, result);
						return result;
					} else if (Array.isArray(nextValue)) {
						result = nextValue.filter((e) => prevValue >= e.value);
						// istanbul ignore next
						this._outputDebug("result", "JSXOperatorTokens:≥", prevValue, nextValue, result);
						return result;
					}

					result = prevValue >= nextValue;
					// istanbul ignore next
					this._outputDebug("result", "JSXOperatorTokens:≥", prevValue, nextValue, result);
					return result;
				}
			},
			/**
			 * ## <=
			 * less than or equal to
			 * 
			 * ```js
			 * let path = '/a <= 1';
			 * let result = jsxpath.process(path)
			 * ----------
			 * // result => true
			 * ```
			 * 
			 * @function ≤
			 * @param  {object|number} prev - the previous parsed value before `+`
			 * @return {function} A function that accepts the next parsed value argument
			 */
			"≤": (prev) => {
				return (next) => {
					// istanbul ignore next
					this._outputDebug("init", "JSXOperatorTokens:≤", prev, next);

					let prevValue = this.Validator.validateNumber(prev, "<=", true);
					let nextValue = this.Validator.validateNumber(next, "<=", true);
					let result = [];
					if (Array.isArray(prevValue) && Array.isArray(nextValue)) {
						// istanbul ignore next
						this._outputDebug("result", "JSXOperatorTokens:≤", prevValue, nextValue, result);
						return result;
					} 

					if (Array.isArray(prevValue)) {
						result = prevValue.filter((e) => e.value <= nextValue);
						// istanbul ignore next
						this._outputDebug("result", "JSXOperatorTokens:≤", prevValue, nextValue, result);
						return result;
					} else if (Array.isArray(nextValue)) {
						result = nextValue.filter((e) => prevValue <= e.value);
						// istanbul ignore next
						this._outputDebug("result", "JSXOperatorTokens:≤", prevValue, nextValue, result);
						return result;
					}

					result = prevValue <= nextValue;
					// istanbul ignore next
					this._outputDebug("result", "JSXOperatorTokens:≤", prevValue, nextValue, result);
					return result;
				}
			},
			/**
			 * ## and
			 * logical and
			 * 
			 * ```js
			 * let path = '/a and /b'
			 * let result = jsxpath.process(path)
			 * ----------
			 * // result => [1, 2]
			 * ```
			 * 
			 * @function &
			 * @param  {object|number} prev - the previous parsed value before `+`
			 * @return {function} A function that accepts the next parsed value argument
			 */
			"&": (prev) => {
				return (next) => {
					// istanbul ignore next
					this._outputDebug("init", "JSXOperatorTokens:and", prev, next);

					let prevValue = this.Validator.isArray(prev, "and");
					let nextValue = this.Validator.isArray(next, "and");
					let result;
					
					if (prevValue && nextValue) { // Node Array check
						result = _.intersection(prevValue, nextValue);
					} else if (prevValue && !nextValue) {
						nextValue = this.Validator.validateBoolean(next, "and", true);
						if (nextValue === true) {
							result = prevValue;
						}
					} else if (!prevValue && nextValue) {
						prevValue = this.Validator.validateBoolean(prev, "and", true);
						if (prevValue === true) {
							result = nextValue;
						}
					} else {
						nextValue = this.Validator.validateBoolean(next, "and", true);
						prevValue = this.Validator.validateBoolean(prev, "and", true);
						result = prevValue && nextValue;
					}

					// istanbul ignore next
					this._outputDebug("result", "JSXOperatorTokens:and", prevValue, nextValue, result);
					return result;
				}
			},
			/**
			 * ## or
			 * logical or
			 * 
			 * ```js
			 * let path = '/a or /b';
			 * let result = jsxpath.process(path);
			 * ----------
			 * // result => [1]
			 * ```
			 * 
			 * @function Ø
			 * @param  {object|number} prev - the previous parsed value before `+`
			 * @return {function} A function that accepts the next parsed value argument
			 */
			"Ø": (prev) => {
				return (next) => {
					// istanbul ignore next
					this._outputDebug("init", "JSXOperatorTokens:or", prev, next);

					let prevValue = this.Validator.validateBoolean(prev, "or", true);
					let nextValue = this.Validator.validateBoolean(next, "or", true);
					let result = prevValue || nextValue;
					// istanbul ignore next
					this._outputDebug("result", "JSXOperatorTokens:or", prevValue, nextValue, result);
					return result;
				}
			},
			/**
			 * ## |
			 * union
			 * 
			 * ```js
			 * let path = '/a|/c';
			 * let result = jsxpath.process(path);
			 * ----------
			 * // result => [1, [3,  4]]
			 * ```
			 * 
			 * @function |
			 * @param  {object|number} prev - the previous parsed value before `+`
			 * @return {function} A function that accepts the next parsed value argument
			 */
			"|": (prev) => {
				return (next) => {
					// istanbul ignore next
					this._outputDebug("init", "JSXOPeratorTokens:|", prev, next);
					let prevValue = this.Validator.validateNode(prev, "|");
					let nextValue = this.Validator.validateNode(next, "|");
					let result = [];
					if (Array.isArray(prevValue) && Array.isArray(nextValue)) {
						result = prevValue.concat(nextValue);
					} else if (Array.isArray(prevValue)) {
						result = prevValue;
					} else if (Array.isArray(nextValue)) {
						result = nextValue;
					}

					if (prevValue && !Array.isArray(prevValue)) {
						result.push(prevValue);
					}

					if (nextValue && !Array.isArray(nextValue)) {
						result.push(nextValue);
					}
					// istanbul ignore next
					this._outputDebug("result", "JSXOPeratorTokens:|", prev, next, result);
					return result;
				}
			}
		}
	}

	keys() {
		return Object.keys(this.tokens);
	}

	/**
	 * @private console log events for debugging purposes
	 * @description console log events for debugging purposes
	 * 
	 * @function _outputDebug 
	 * @param  {string} mode - one of "init" or any
	 * @param  {string} where - the calling location
	 * @param  {object|number} prev - the previous parsed value
	 * @param  {object|number} next - the next parsed value
	 * @param  {any} result the result of the operation
	 * 
	 */
	_outputDebug(mode, where, prev, next, result) {
		// istanbul ignore next
		if (this.DEBUG && this.SHOW_OPERATOR_TOKENS) {
			let args = [new Date(), where, mode === "init" ? "prev" : "prevValue", prev, mode === "init" ? "next" : "nextValue", next];
			if (mode !== "init") {
				args = args.concat(["result", result]);
			}
			console.log.apply(this, args);
		}
	}
}

module.exports = JSXOperatorTokens