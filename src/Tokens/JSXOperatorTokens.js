const _ = require("lodash");
const JSXValidator = require("../Utils/JSXValidator");
const JSXDebugConfig = require("../JSXDebugConfig");
const JSXUtils = require("../Utils/JSXUtils");

const Validator = new JSXValidator();
const Utils = new JSXUtils();

const preEvaluate = (prev, next, psToken) => {
	let prevValue = Validator.validateNode(prev, psToken);
	let nextValue = Validator.validateNode(next, psToken);
	let result;			
	
	const isPrevNode = prevValue ? true : false;
	const isNextNode = nextValue ? true : false;

	if (prevValue === null) {
		prevValue = Validator.validateNumber(prev, psToken) ||
					Validator.validateString(prev, psToken) ||
					Validator.isArray(prev, psToken) ||
					Validator.validateObject(prev, psToken) ||
					Validator.validateBoolean(prev, psToken);
	}

	if (nextValue === null) {
		nextValue = Validator.validateNumber(next, psToken) ||
					Validator.validateString(next, psToken) ||
					Validator.isArray(next, psToken) ||
					Validator.validateObject(next, psToken) ||
					Validator.validateBoolean(next, psToken);
	}
	return {
		prevValue,
		nextValue,
		isPrevNode,
		isNextNode
	}
}
/**
 * JSXPath
 * =======
 * - [Home](../README.html)
 * - [Axis](AXIS.html)
 * - [Functions](FUNCTIONS.html)
 * - [Node Selection](NODESELECTION.html)
 * - Operators
 * 
 * TODO: update all variables to work with arrays. Eg = operator
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
					if (Array.isArray(prev) && prev.length > 1 || Array.isArray(next) && next.length > 1) {
						return;
					}

					let prevValue = Array.isArray(prev) ? Validator.validateNumber(prev[0]) : Validator.validateNumber(prev, "+");
					let nextValue = Array.isArray(next) ? Validator.validateNumber(next[0]) : Validator.validateNumber(next, "+");

					if (null === prevValue) {
						prevValue = Array.isArray(prev) ? Validator.validateString(prev[0]) : Validator.validateString(prev, "+", true);
					}
					if (null === nextValue) {
						nextValue = Array.isArray(next) ? Validator.validateString(next[0]) : Validator.validateString(next, "+", true);
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

					let prevValue = Validator.validateNumber(prev, "-", true);
					let nextValue = Validator.validateNumber(next, "-", true);

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

					let prevValue = Validator.validateNumber(prev, "*", true);
					let nextValue = Validator.validateNumber(next, "*", true);
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

					let prevValue = Validator.validateNumber(prev, "div", true);
					let nextValue = Validator.validateNumber(next, "div", true);
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

					let prevValue = Validator.validateNumber(prev, "mod", true);
					let nextValue = Validator.validateNumber(next, "mod", true);
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
					
					const preEval = preEvaluate(prev, next, "=");
					let result;			
					
					if (preEval.isPrevNode && Array.isArray(preEval.prevValue) && preEval.isNextNode && Array.isArray(preEval.nextValue)) { // both node arrays
						result = this.intersect(preEval.prevValue, preEval.nextValue);

					} else if (preEval.isPrevNode && Array.isArray(preEval.prevValue) && preEval.isNextNode) { // prev is array nodes while next is node
						result = preEval.prevValue.filter(node => _.isEqual(node.value, preEval.nextValue.value));

					} else if (preEval.isPrevNode && preEval.isNextNode && Array.isArray(preEval.nextValue)) { // prev is a node while next is an array nodes
						result = preEval.nextValue.filter(node => _.isEqual(node.value, preEval.prevValue.value));

					} else if (preEval.isPrevNode && Array.isArray(preEval.prevValue) && !preEval.isNextNode) { // prev is an array nodes while next is any other value
						result = preEval.prevValue.filter(node => _.isEqual(node.value, preEval.nextValue));

					} else if (!preEval.isPrevNode && preEval.isNextNode && Array.isArray(preEval.nextValue)) {
						result = preEval.nextValue.filter(node => _.isEqual(node.value, preEval.prevValue));

					} else if (preEval.isPrevNode && preEval.isNextNode) {
						result = _.isEqual(preEval.prevValue, preEval.nextValue);

					} else if (preEval.isPrevNode && !preEval.isNextNode) {
						result = _.isEqual(preEval.prevValue.value, preEval.nextValue) ? preEval.prevValue : false;

					} else if (!preEval.isPrevNode && preEval.isNextNode) {
						result = _.isEqual(preEval.prevValue,preEval.nextValue.value) ? preEval.nextValue : false;
					
					} else if (!preEval.isPrevNode && !preEval.isNextNode) {
						result = _.isEqual(preEval.prevValue, preEval.nextValue);
					}

					if (Array.isArray(result) && !result.length) {
						result = false;
					}
					// istanbul ignore next
					this._outputDebug("result", "JSXOperatorTokens:=", preEval.prevValue, preEval.nextValue, result);
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

					let prevValue = Validator.validateNumber(prev, "≠");
					let nextValue = Validator.validateNumber(next, "≠");
					let result;

					if (prevValue === null) {
						prevValue = Validator.validateString(prev, "≠");
					}
					if (nextValue === null) {
						nextValue = Validator.validateString(next, "≠");
					}
					if (prevValue === null) {
						prevValue = Validator.isArray(prev, "≠");
					}
					if (nextValue === null) {
						nextValue = Validator.isArray(next, "≠");
					}
					if (prevValue === null) {
						prevValue = Validator.validateObject(prev, "≠");
					}
					if (nextValue === null) {
						nextValue = Validator.validateObject(next, "≠");
					}
					if (prevValue === null) {
						prevValue = Validator.validateNode(prev, "≠");
					}
					if (nextValue === null) {
						nextValue = Validator.validateNode(next, "≠");
					}
					if (prevValue === null) {
						prevValue = Validator.validateBoolean(prev, "≠");
					}
					if (nextValue === null) {
						nextValue = Validator.validateBoolean(next, "≠");
					}


					if (prevValue && prevValue.value){
						result = !_.isEqual(prevValue.value, nextValue);
					} else if (nextValue && nextValue.value) {
						result = !_.isEqual(prevValue, nextValue.value);
					} else if (Array.isArray(prevValue) && Array.isArray(nextValue)) {
						result = !_.isEqual(prevValue, nextValue)
					} else if (Array.isArray(prevValue) && prevValue.length === 1 && prevValue[0].hasOwnProperty('value') && !isNaN(nextValue)) {
						result = prevValue[0].value !== nextValue;
					} else if (Array.isArray(nextValue) && nextValue.length === 1 && nextValue[0].hasOwnProperty('value') && !isNaN(prevValue)) {
						result = prevValue !== nextValue[0].value;
					} else if (Array.isArray(prevValue)) {
						result = _.filter(prevValue, function(pv) {
							return pv.value !== nextValue;
						});
					} else if (Array.isArray(nextValue)) {
						result = _.filter(nextValue, function(nv) {
							return nv.value !== prevValue;
						});
					} else {
						result = !_.isEqual(prevValue, nextValue);
					}

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
					// throw error if not number
					Validator.validateNumber(prev, ">", true);
					Validator.validateNumber(next, ">", true);
					
					const preEval = preEvaluate(prev, next, ">");
					let result;

					if (preEval.isPrevNode && Array.isArray(preEval.prevValue) && preEval.isNextNode && Array.isArray(preEval.nextValue)) { // both node arrays
						result = this.intersect(preEval.prevValue, preEval.nextValue);

					} else if (preEval.isPrevNode && Array.isArray(preEval.prevValue) && preEval.isNextNode) { // prev is array nodes while next is node
						result = preEval.prevValue.filter(node => node.value > preEval.nextValue.value);

					} else if (preEval.isPrevNode && preEval.isNextNode && Array.isArray(preEval.nextValue)) { // prev is a node while next is an array nodes
						result = preEval.nextValue.filter(node => preEval.prevValue.value > node.value);

					} else if (preEval.isPrevNode && Array.isArray(preEval.prevValue) && !preEval.isNextNode) { // prev is an array nodes while next is any other value
						result = preEval.prevValue.filter(node => node.value > preEval.nextValue);

					} else if (!preEval.isPrevNode && preEval.isNextNode && Array.isArray(preEval.nextValue)) {
						result = preEval.nextValue.filter(node => node.value > preEval.prevValue);

					} else if (preEval.isPrevNode && preEval.isNextNode) {
						result = preEval.prevValue > preEval.nextValue ? preEval.prevValue : false;
					
					} else if (preEval.isPrevNode && !preEval.isNextNode) {
						result = preEval.prevValue.value > preEval.nextValue ? preEval.prevValue : false;

					} else if (!preEval.isPrevNode && preEval.isNextNode) {
						result = preEval.prevValue > preEval.nextValue.value ? preEval.nextValue : false;
					
					} else if (!preEval.isPrevNode && !preEval.isNextNode) {
						result = preEval.prevValue > preEval.nextValue;
					}

					if (Array.isArray(result) && !result.length) {
						result = false;
					}

					// istanbul ignore next
					this._outputDebug("result", "JSXOperatorTokens:>", preEval.prevValue, preEval.nextValue, result);
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

					if (Validator.validateNode(prev) && Array.isArray(prev) && prev.length > 1) {
						prev = prev.filter(node => Utils.isNumber(node.value));
					}
					if (Validator.validateNode(next) &&Array.isArray(next) && next.length > 1) {
						next = next.filter(node => Utils.isNumber(node.value));
					}

					Validator.validateNumber(prev, "<", true);
					Validator.validateNumber(next, "<", true);
					
					const preEval = preEvaluate(prev, next, "<");
					let result;

					if (preEval.isPrevNode && Array.isArray(preEval.prevValue) && preEval.isNextNode && Array.isArray(preEval.nextValue)) { // both node arrays
						result = this.intersect(preEval.prevValue, preEval.nextValue);

					} else if (preEval.isPrevNode && Array.isArray(preEval.prevValue) && preEval.isNextNode) { // prev is array nodes while next is node
						result = preEval.prevValue.filter(node => node.value < preEval.nextValue.value);

					} else if (preEval.isPrevNode && preEval.isNextNode && Array.isArray(preEval.nextValue)) { // prev is a node while next is an array nodes
						result = preEval.nextValue.filter(node => preEval.prevValue.value < node.value);

					} else if (preEval.isPrevNode && Array.isArray(preEval.prevValue) && !preEval.isNextNode) { // prev is an array nodes while next is any other value
						result = preEval.prevValue.filter(node => node.value < preEval.nextValue);

					} else if (!preEval.isPrevNode && preEval.isNextNode && Array.isArray(preEval.nextValue)) {
						result = preEval.nextValue.filter(node => node.value < preEval.prevValue);

					} else if (preEval.isPrevNode && preEval.isNextNode) {
						result = preEval.prevValue < preEval.nextValue ? preEval.prevValue : false;
					
					} else if (preEval.isPrevNode && !preEval.isNextNode) {
						result = preEval.prevValue.value < preEval.nextValue ? preEval.prevValue : false;

					} else if (!preEval.isPrevNode && preEval.isNextNode) {
						result = preEval.prevValue < preEval.nextValue.value ? preEval.nextValue : false;
					
					} else if (!preEval.isPrevNode && !preEval.isNextNode) {
						result = preEval.prevValue < preEval.nextValue;
					}

					if (Array.isArray(result) && !result.length) {
						result = false;
					}
					// istanbul ignore next
					this._outputDebug("result", "JSXOperatorTokens:<", preEval.prevValue, preEval.nextValue, result);
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

					// throw error if not number
					Validator.validateNumber(prev, ">=", true);
					Validator.validateNumber(next, ">=", true);
					
					const preEval = preEvaluate(prev, next, ">=");
					let result;

					if (preEval.isPrevNode && Array.isArray(preEval.prevValue) && preEval.isNextNode && Array.isArray(preEval.nextValue)) { // both node arrays
						result = this.intersect(preEval.prevValue, preEval.nextValue);

					} else if (preEval.isPrevNode && Array.isArray(preEval.prevValue) && preEval.isNextNode) { // prev is array nodes while next is node
						result = preEval.prevValue.filter(node => node.value >= preEval.nextValue.value);

					} else if (preEval.isPrevNode && preEval.isNextNode && Array.isArray(preEval.nextValue)) { // prev is a node while next is an array nodes
						result = preEval.nextValue.filter(node => preEval.prevValue.value >= node.value);

					} else if (preEval.isPrevNode && Array.isArray(preEval.prevValue) && !preEval.isNextNode) { // prev is an array nodes while next is any other value
						result = preEval.prevValue.filter(node => node.value >= preEval.nextValue);

					} else if (!preEval.isPrevNode && preEval.isNextNode && Array.isArray(preEval.nextValue)) {
						result = preEval.nextValue.filter(node => node.value >= preEval.prevValue);

					} else if (preEval.isPrevNode && preEval.isNextNode) {
						result = preEval.prevValue >= preEval.nextValue ? preEval.prevValue : false;
					
					} else if (preEval.isPrevNode && !preEval.isNextNode) {
						result = preEval.prevValue.value >= preEval.nextValue ? preEval.prevValue : false;

					} else if (!preEval.isPrevNode && preEval.isNextNode) {
						result = preEval.prevValue >= preEval.nextValue.value ? preEval.nextValue : false;
					
					} else if (!preEval.isPrevNode && !preEval.isNextNode) {
						result = preEval.prevValue >= preEval.nextValue;
					}

					if (Array.isArray(result) && !result.length) {
						result = false;
					}
					// istanbul ignore next
					this._outputDebug("result", "JSXOperatorTokens:≥", preEval.prevValue, preEval.nextValue, result);
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

					let prevValue = Validator.validateNumber(prev, "<=", true);
					let nextValue = Validator.validateNumber(next, "<=", true);
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

					const preEval = preEvaluate(prev, next, "and");
					const isDescendant = (primary, seondary) => {
						const descendants = primary.siblings.reduce((r, sibling) => {
							r = r.concat(r.descendants);
							return r;
						}, primary.descendants);
						return descendants.includes(secondary);
					};
					const isSiblings = (pr, ne) => {
						return pr.index === ne.index || pr.siblings.includes(ne) && ne.siblings.includes(pr);
					};
					const isFromSameBranch = (pr, ne) => {
						if (pr.depth === ne.depth) {
							return pr.parent.name === ne.parent.name && isSiblings(pr, ne);
						} else {
							return pr.depth < ne.depth ? isDescendant(pr, ne) : isDescendant(ne, pr);
						}
					};
					let result;

					if (preEval.isPrevNode && Array.isArray(preEval.prevValue) && preEval.isNextNode && Array.isArray(preEval.nextValue)) { // both node arrays
						result = this.intersect(preEval.prevValue, preEval.nextValue);

					} else if (preEval.isPrevNode && Array.isArray(preEval.prevValue) && preEval.isNextNode) { // prev is array nodes while next is node
						result = preEval.prevValue.filter(node => isFromSameBranch(node, preEval.nextValue));

					} else if (preEval.isPrevNode && preEval.isNextNode && Array.isArray(preEval.nextValue)) { // prev is a node while next is an array nodes
						result = preEval.nextValue.filter(node => isFromSameBranch(node, preEval.prevValue));

					} else if (preEval.isPrevNode && preEval.isNextNode) {
						result = isFromSameBranch(preEval.prevValue, preEval.nextValue) ? true : false;

					} else if (preEval.isPrevNode && !preEval.isNextNode) { // prev is an array nodes while next is any other value
						result = Boolean(preEval.nextValue) ? preEval.prevValue : false;

					} else if (!preEval.isPrevNode && preEval.isNextNode) {
						result = Boolean(preEval.prevValue) ? preEval.nextValue : false;

					} else if (!preEval.isPrevNode && !preEval.isNextNode) {
						result = Boolean(preEval.prevValue) && Boolean(preEval.nextValue);
					}

					// istanbul ignore next
					this._outputDebug("result", "JSXOperatorTokens:and", preEval.prevValue, preEval.nextValue, result);
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

					let prevValue = Validator.validateBoolean(prev, "or", true);
					let nextValue = Validator.validateBoolean(next, "or", true);
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
					let prevValue = Validator.validateNode(prev, "|");
					let nextValue = Validator.validateNode(next, "|");
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
	 * Checks to see if the operator is of type comparision
	 * 
	 * @param {any} operator 
	 * @returns 
	 * 
	 * @memberOf JSXOperatorTokens
	 */
	isComparisonOperator(operator) {
		return ["=", "≠", ">", "<", "≥", "≤"].includes(operator);
	}

	intersect(prevNodes, nextNodes) {
		return prevNodes.reduce((r, pNode) => {
			nextNodes.forEach(nNode => {
				if (nNode.siblings.includes(pNode)) {
					r.push(pNode);
				}
			});
			return r;
		}, [])
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