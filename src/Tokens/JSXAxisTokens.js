const JSXDebugConfig = require("../JSXDebugConfig");
const JSXValidator = require("../Utils/JSXValidator");

const Validator = new JSXValidator();

const mergeUnique = (source, list) => {
	const mergedList = source;
	list.forEach(item => {
		if (!mergedList.includes(item)) {
			mergedList.push(item);
		}
	});
	return mergedList;
};

/**
 * JSXPath 
 *=======
 * - [Home](../README.html)
 * - Axis
 * - [Functions](FUNCTIONS.html)
 * - [Node Selection](NODESELECTION.html)
 * - [Operators](OPERATORS.html)
 *
 * # Axis
 * #### [*](#) , [..](#) , [siblings](#) , [descendant](#) , [descendant-or-self](#) , [ancestor](#) , [ancestor-or-self](#) , [//](#) , [self](#) , [parent](#)
 * Axis expressions are used to navigate around the node tree to retrieve a node set relative to the current node
 *
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
 * 
 * @module Tokens
 * @class JSXAxisTokens
 * @constructor
 */
class JSXAxisTokens {
	constructor(context) {
		this.DEBUG = JSXDebugConfig.debugOn;
		this.SHOWAXISTOKENS = JSXDebugConfig.showAxisTokens;
		this.context = context;
		this.tokens = {
			/**
			 * ## *
			 * retrieve the children of the current node
			 *
			 * ```js
			 * let path = '';
			 * let result = jsxpath.process(path);
			 * ----------
			 * // result => 
			 * ```
			 * 
			 * @method *
			 * @param  {object} poRef - the exploded input json
			 * @param  {string} [psNode] - the name of the node
			 * @return {object} Key Value object
			 */
			"*": (poRef, psNode) => {
				let lookup = this.context.pop();
				const current = this.context.getLatestItem();
				let children = [];
				let result;

				if (Validator.validateNode(lookup)) {
					lookup = lookup.name;
				}
				if (Validator.validateNode(current)) {
					if (Array.isArray(current)) {
						current.forEach(c => {
							children = mergeUnique(children, c.children);
						});
					} else {
						children = children.concat(current.children);
					}
				}

				if (!lookup || lookup === "*") {
					result = children;
				} else if (poRef.hasOwnProperty(lookup)) {
					result = children.filter((node) => {
						return node.name === lookup;
					});
				}

				// // istanbul ignore next
				this._outputDebug("JSXAxisTokens:*", result);
				return result;
			  }
			/**
			 * ## ..
			 * retrieves the parent node
			 * 
			 * alias: [parent](#)
			 *
			 * ```js
			 * let path = '';
			 * let result = jsxpath.process(path);
			 * ----------
			 * // result => 
			 * ```
			 * 
			 * @function parent
			 * @param  {object} poRef - the exploded input json
			 * @param  {string} [psNode] - the name of the node
			 * @return {object} Key Value object
			 */
			, "..": (poRef, psNode) => {
				let lookup = this.context.pop();
				const current = this.context.getLatestItem();
				let parents = [];
				let result;

				if (Validator.validateNode(lookup)) {
					lookup = lookup.name;
				}
				if (Validator.validateNode(current)) {
					if (Array.isArray(current)) {
						current.forEach(c => {
							parents = mergeUnique(parents, c.parent);
						});
					} else {
						parents = parents.concat(current.parent);
					}
				}

				if (!lookup || lookup === "*") {
					result = parents;
				} else if (poRef.hasOwnProperty(lookup)) {
					result = parents.filter((node) => {
						return node.name === lookup;
					});
				}

				// istanbul ignore next
				this._outputDebug("JSXAxisTokens:..", result);
				return result;
			  }
			/**
			* ## siblings
			 * retrieve all siblings of the current node
			 * 
			 * ```js
			 * let path = '';
			 * let result = jsxpath.process(path);
			 * ----------
			 * // result => \
			 * ```
			 * 
			 * @function siblings
			 * @param  {object} poRef - the exploded input json
			 * @param  {string} [psNode] - the name of the node
			 * @return {object} Key Value object
			 */
			, "siblings": (poRef, psNode, pfExplode) => {
				let lookup = this.context.pop();
				const current = this.context.getLatestItem();
				let siblings = [];
				let result;

				if (Validator.validateNode(lookup)) {
					lookup = lookup.name;
				}
				if (Validator.validateNode(current)) {
					if (Array.isArray(current)) {
						current.forEach(c => {
							if (!siblings.includes(c)) {
								siblings = mergeUnique(siblings, c.siblings);
							}
						});
					} else {
						siblings = siblings.concat(current.siblings);
					}
				}

				if (!lookup || lookup === "*") {
					result = siblings;
				} else if (poRef.hasOwnProperty(lookup)) {
					result = siblings.filter((node) => {
						return node.name === lookup;
					});
				}

				// istanbul ignore next
				this._outputDebug("JSXAxisTokens:siblings", result);
				return result;
			  }
			/**
			 * ## descendant
			 * retrieves all descendants of current node excluding self
			 * 
			 * ```js
			 * let path = '';
			 * let result = jsxpath.process(path);
			 * ----------
			 * // result => 
			 * ```
			 * 
			 * @function descendant
			 * @param  {object} poRef - the exploded input json
			 * @param  {string} [psNode] - the name of the node
			 * @return {object} Key Value object
			 */
			, "descendant": (poRef, psNode, pfExplode) => {
				let descendants = [];
				let result;
				let lookup = this.context.pop();
				const current = this.context.getLatestItem();

				if (Validator.validateNode(lookup)) {
					lookup = lookup.name;
				}
				if (Validator.validateNode(current)) {
					if (Array.isArray(current)) {
						current.forEach(c => {
							descendants = mergeUnique(descendants, c.descendants)
						});
					} else {
						descendants = descendants.concat(current.descendants);
					}
				}

				if (!lookup || lookup === "*") {
					result = descendants;
				} else if (poRef.hasOwnProperty(lookup)) {
					result = descendants.filter((node) => {
						return node.name === lookup;
					});
				}

				// istanbul ignore next
				this._outputDebug("JSXAxisTokens:descendant", result);
				return result;
			  }
			/**
			 * ## descendant-or-self
			 * retrieves all descendants of current node including self
			 * 
			 * alias: [//](#)
			 * 
			 * ```js
			 * let path = '';
			 * let result = jsxpath.process(path);
			 * ----------
			 * // result => 
			 * ```
			 * 
			 * @function descendantOrSelf
			 * @param  {object} poRef - the exploded input json
			 * @param  {string} [psNode] - the name of the node
			 * @return {object} Key Value object
			 */
			, "descendantOrSelf": (poRef, psNode, pfExplode) => {
				let descendants = [];
				let result;
				let lookup = this.context.pop();
				const current = this.context.getLatestItem();

				if (Validator.validateNode(lookup)) {
					lookup = lookup.name;
				}
				if (Validator.validateNode(current)) {
					if (Array.isArray(current)) {
						current.forEach(c => {
							descendants = mergeUnique(descendants, c.descendants.concat(c));
						});
					} else {
						descendants = descendants.concat(current.descendants);
						descendants.push(current);
					}
				}

				if (!lookup || lookup === "*") {
					result = descendants;
				} else if (poRef.hasOwnProperty(lookup)) {
					result = descendants.filter((node) => {
						return node.name === lookup;
					});
				}
				// istanbul ignore next
				this._outputDebug("JSXAxisTokens:descendantOrSelf", result);
				return result;
			  }
			/**
			  * ## ancestor
			 * retrieves all ancestors of current node excluding self
			 * 
			 * * ```js
			 * let path = '';
			 * let result = jsxpath.process(path);
			 * ----------
			 * // result => 
			 * 
			 * @function ancestor
			 * @param  {object} poRef - the exploded input json
			 * @param  {string} [psNode] - the name of the node
			 * @return {object} Key Value object
			 */
			, "ancestor": (poRef, psNode) => {
				let lookup = this.context.pop();
				const current = this.context.getLatestItem();
				let ancestors = [];
				let result;

				if (Validator.validateNode(lookup)) {
					lookup = lookup.name;
				}
				if (Validator.validateNode(current)) {
					if (Array.isArray(current)) {
						current.forEach(c => {
							ancestors = mergeUnique(ancestors, c.ancestors);
						});
					} else {
						ancestors = ancestors.concat(current.ancestors);
					}
				}

				if (!lookup || lookup === "*") {
					result = ancestors;
				} else if (poRef.hasOwnProperty(lookup)) {
					result = ancestors.filter((node) => {
						return node.name === lookup;
					});
				}
				// istanbul ignore next
				this._outputDebug("JSXAxisTokens:ancestor", result);
				return result;
			  }
			/**
			 * ## ancestor-or-self
			 * retrieves the ancestors of current node including self
			 * 
			 * @function ancestorOrSelf
			 * @param  {object} poRef - the exploded input json
			 * @param  {string} [psNode] - the name of the node
			 * @return {object} Key Value object
			 */
			, "ancestorOrSelf": (poRef, psNode) => {
				let lookup = this.context.pop();
				const current = this.context.getLatestItem();
				let ancestors = [];
				let result;

				if (Validator.validateNode(lookup)) {
					lookup = lookup.name;
				}
				if (Validator.validateNode(current)) {
					if (Array.isArray(current)) {
						current.forEach(c => {
							ancestors = mergeUnique(ancestors, c.ancestors.concat);
						});
					} else {
						ancestors = ancestors.concat(current.ancestors);
						ancestors.push(current);
					}
				}

				if (!lookup || lookup === "*") {
					result = ancestors;
				} else if (poRef.hasOwnProperty(lookup)) {
					result = ancestors.filter((node) => {
						return node.name === lookup;
					});
				}
				// istanbul ignore next
				this._outputDebug("JSXAxisTokens:ancestorOrSelf", result);
				return result;
			  }
			/**
			 * ## //
			 * retrieves the parent node
			 * alias: [descendant-or-self](#)
			 * 
			 * @function //
			 * @param  {object} poRef - the exploded input json
			 * @param  {string} [psNode] - the name of the node
			 * @return {object} Key Value object
			 */
			, "//": (poRef, psNode, pfExplode) => {
				this.tokens["descendant"](poRef, psNode, pfExplode);
			  }
			/**
			 * ## self
			 * current node
			 * 
			 * @function self
			 * @param  {object} poRef - the exploded input json
			 * @param  {string} [psNode] - the name of the node
			 * @return {object} Key Value object
			 */
			, "self": (poRef, psNode) => {
				let lookup = this.context.pop();
				const current = this.context.getLatestItem();
				let children = [];
				let result;

				if (Validator.validateNode(lookup)) {
					lookup = lookup.name;
				}
				if (Validator.validateNode(current)) {
					if (Array.isArray(current)) {
						current.forEach(c => {
							children = mergeUnique(children, c.children.concat(c));
						});
					} else {
						children = children.concat(current.children);
						children.push(current);
					}
				}

				if (!lookup || lookup === "*") {
					result = children;
				} else if (poRef.hasOwnProperty(lookup)) {
					result = children.filter((node) => {
						return node.name === lookup;
					});
				}
				// istanbul ignore next
				this._outputDebug("JSXAxisTokens:self", result);
				return result;
			  }
			/**
			 * ## parent
			 * retrieves the parent node
			 * alias: [..](#)
			 * 
			 * @function parent
			 * @param  {object} poRef - the exploded input json
			 * @param  {string} [psNode] - the name of the node
			 * @return {object} Key Value object
			 */
			, "parent": (poRef, psNode) => {
				return this.tokens[".."](poRef, psNode);
			  }
			, "preceding": (poRef, psNode) => {
				//TODO
				//get the chidlren from parent, sorts in alphabetical order
				//compose a set nodes before self.
				
			  }
			, "precedingSiblings": (poRef, psNode) => {
				//TODO
			}
			, "following": (poRef, psNode) => {
				//TODO
			  }
			, "followingSiblings": (poRef, psNode) => {
				//TODO
				//get the chidlren from parent, sorts in alphabetical order
				//compose a set nodes after self.

			  }
		};
	}

	tokens() {
		return this.tokens;
	}

	_outputDebug(where, result) {
		// istanbul ignore next
		if (this.DEBUG && this.SHOWAXISTOKENS) console.log(new Date(), where, result);
	}
}

module.exports = JSXAxisTokens;