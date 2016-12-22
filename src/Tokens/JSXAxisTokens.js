var JSXDebugConfig = require("../JSXDebugConfig");

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
 * @module Tokens
 * @class JSXAxisTokens
 * @constructor
 */
class JSXAxisTokens {
	constructor() {
		this.DEBUG = JSXDebugConfig.debugOn;
		this.SHOWCONTEXTTOKENS = JSXDebugConfig.showContextTokens;
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
				let result = {};
				let oChildren = {};
				let asChildren = poRef["."].children;
				let sParent = poRef["."].name;
				if (0 < asChildren.length) {
					for (let i = asChildren.length-1; i >= 0; --i) {
						let c = asChildren[i];
						let oChild = poRef[c];
						if (Array.isArray(oChild)) {
							let thisChildren = [];
							for (let j = oChild.length-1; j >= 0; --j) {
								if (sParent === oChild[j].parent) {
									thisChildren.push(oChild[j]);
								}
							}
							oChildren[c] = thisChildren;
						} else {
							oChildren[c] = oChild;
						}
					}
				}

				if (!psNode) {
					result = oChildren;
				} else if (oChildren[psNode]) {
					result = oChildren[psNode];
				}
				// istanbul ignore next
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
				let result = {};
				let parent = {};
				if (poRef["."] === poRef["@"]) {
					return parent;
				}
				let oCurrent = poRef[poRef["."].parent] || [];
				let sChildName = poRef["."].name;

				if (Array.isArray(oCurrent)) {
					for (let i = 0; i < oCurrent.length; ++i) {
						if (oCurrent[i].children.indexOf(sChildName) > -1) {
							oCurrent = oCurrent[i];
							break;
						}
					}
				} 
				parent[oCurrent.name] = oCurrent;

				if (psNode && psNode===oCurrent.name || psNode === "*" || !psNode) {
					result = parent;
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
			 * // result => 
			 * ```
			 * 
			 * @function siblings
			 * @param  {object} poRef - the exploded input json
			 * @param  {string} [psNode] - the name of the node
			 * @return {object} Key Value object
			 */
			, "siblings": (poRef, psNode, pfExplode) => {
				let result = {};
				let siblings = {};
				let self = this;
				if (poRef["."] === poRef["@"]) {
					result = siblings;
				} else {
					let oCurrent = poRef[poRef["."].parent] || [];
					let sChildName = poRef["."].name;
					let values = [];
					let nodes = [];

					if (Array.isArray(oCurrent)) {
						for (let i = 0; i < oCurrent.length; ++i) {
							if (oCurrent[i].children.indexOf(sChildName) > -1) {
								oCurrent = oCurrent[i];
								break;
							}
						}
					}
					oCurrent.children.forEach((c) => {
						if (c !== sChildName) {
							let p = oCurrent.name;
							let oNode = poRef[c];
							if (Array.isArray(oNode)){
								for (let i = 0; i < oNode.length; ++i) {
									if (oNode[i].parent = p) {
										oNode = oNode[i];
										break;
									}
								}
							}
							siblings[c] = oNode;
						}
					});

					if (!psNode || psNode === "*") {
						result = siblings;
					} else if (siblings[psNode]) {
						result = siblings[psNode];
					} 
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
				let result = {};
				let oCurrent = poRef["."];
				let descendant = {};
				if (null !== oCurrent && "object" === typeof oCurrent.value) {
					descendant = pfExplode.apply(this, [oCurrent.value]);
				}
				if (!psNode || psNode === "*") {
					result = descendant; 
				} else if (descendant[psNode]) {
					result = descendant[psNode];
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
				var result = {};
				let oCurrent = poRef["."];
				let dos = {};
				if (null !== oCurrent && "object" === typeof oCurrent.value)
					dos = pfExplode(oCurrent.value);
				dos[oCurrent.name] = oCurrent;
				// if (psNode && dos[psNode]) {
				// 	result = dos[psNode];
				// }

				if (!psNode || psNode === '*') {
					result = dos;
				} else if (dos[psNode]) {
					result = dos[psNode];
				}
				// istanbul ignore next
				this._outputDebug("JSXAxisTokens:descendantOrSelf", result);
				return result;
			  }
			/**
			  * ## ancestor
			 * retrieves all ancestors of current node excluding self
			 * 
			 * @function ancestor
			 * @param  {object} poRef - the exploded input json
			 * @param  {string} [psNode] - the name of the node
			 * @return {object} Key Value object
			 */
			, "ancestor": (poRef, psNode) => {
				let result = {};
				let current = poRef["."];
				let child = null;
				let parent = null;
				let ancestors = {};

				do {
					child = current.name;
					parent = current.parent;

					if (parent !== null) {
						current = poRef[parent];

						if (Array.isArray(current)) {
							for (let i = 0; i < current.length; ++i) {
								if (current[i].children.indexOf(child) > -1) {
									current = current[i];
									break;
								}
							} 
						} 
						ancestors[current.name] = current;
					}
				} while(null !== parent);

				if (!psNode) {
					result = ancestors;
				} else if (ancestors[psNode]) {
					result = ancestors[psNode];
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
				let result = {};
				let current = poRef["."];
				let child = null;
				let parent = null;
				let ancestors = {}

				ancestors[current.name] = current;

				do {
					child = current.name;
					parent = current.parent;

					if (parent !== null) {
						current = poRef[parent];

						if (Array.isArray(current)) {
							for (let i = 0; i < current.length; ++i) {
								if (current[i].children.indexOf(child) > -1) {
									current = current[i];
									break;
								}
							} 
						} 
						ancestors[current.name] = current;
					}
				} while(null !== parent);
				
				if (!psNode || psNode === "*") {
					result = ancestors;
				} else  if (ancestors[psNode]) {
					result = ancestors[psNode];
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
			 * alias: [descendant-or-self](#)
			 * 
			 * @function self
			 * @param  {object} poRef - the exploded input json
			 * @param  {string} [psNode] - the name of the node
			 * @return {object} Key Value object
			 */
			, "self": (poRef, psNode) => {
				let current = poRef["."];
				let result = {};

				if (!psNode) {
					result = current;
				} else {
					result = this.tokens["*"](poRef, psNode);
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
			, "position": (poRef, nPos) => {
				//if array returns the index of the object
				//otherwise returns the index according the the sorted children list
				let current = poRef["."];
				let result = {};
				if (nPos < 1)
					return console.log("position index:", nPos, " cannot be less than 1.");
				if (current && current.value && Array.isArray(current.value)) {
					if (nPos > current.value.length)
						return console.log("position index:", nPos, " is greater than ", current.value.length);
					return current.value[nPos-1];
				}
				// istanbul ignore next
				this._outputDebug("JSXAxisTokens:position", result);
			  }
		};
	}

	tokens() {
		return this.tokens;
	}

	_outputDebug(where) {
		// istanbul ignore next
		if (this.DEBUG && this.SHOWCONTEXTTOKENS) console.log(new Date(), where, JSON.stringify(result));
	}
}

module.exports = JSXAxisTokens;