// const find = require('lodash/find');
const cloneDeep = require('lodash/cloneDeep');
const JSXAxisTokens = require("../Tokens/JSXAxisTokens");
const JSXDebugConfig = require("../JSXDebugConfig");
const JSXNode = require("../Node/JSXNode");
const JSXValidator = require("../Utils/JSXValidator");

const Validator = new JSXValidator();

class JSXPloder {
	constructor() {
		this.ContextTokens = new JSXAxisTokens();
		this.json = {};
		this.DEBUG = JSXDebugConfig.debugOn;
		this.SHOW_EXPLODE = JSXDebugConfig.showExplode;
		this.SHOW_CONTEXT = JSXDebugConfig.showContext;
		this.maxDepth = 0;
		this.json['@_id'] = 0;
	}

	axis() {
		object.keys(this.ContextTokens.tokens);
	}

	/**
	 * explode the input json
	 * @param  {object} poInput  the input json
	 * @param  {boolean} [internal] [description]
	 * @return {object}          [description]
	 */
	explode(poInput) {
		if (["string", "number", null, undefined].indexOf(typeof poInput) > -1)
			throw new Error("Input data is not a valid JSON data.");
			
		this._setDefaultProperties(poInput, this.json);
		if (Array.isArray(poInput)) {
			this._explodeArray(poInput, this.json["@"], this.json);
		} else { 
			this._explodeObject(poInput, this.json["@"], this.json);
		}
		this._setChildren(this.json);
		this._setDescendants(this.json);
		this.json['$_isOriginal'] = true;

		return this.json;
	}

	_explode(overrideId) {//used by JSXAxisTokens' descendant and descendant-or-self
		let self = this;
		return (poInput) => {
			let oRef = {};
			if (overrideId) {
				oRef['@_id'] = overrideId;
			}

			self._setDefaultProperties(poInput, oRef);
			if (Array.isArray(poInput)) {
				self._explodeArray(poInput, oRef["@"], oRef);
			} else { 
				self._explodeObject(poInput, oRef["@"], oRef);
			}
			self._setChildren(oRef);
			self._setDescendants(oRef);
			oRef['$_isOriginal'] = false;
			return oRef;
		}
	}

	_updateChildren() {
		this.json["*"] = this.ContextTokens.tokens["*"](this.json);
	}

	_explodeObject(poInput, poParent, poRef) {
		if (!Array.isArray(poInput)) {
			let siblings = [];
			for (let key in poInput) {
				let prop = this.createNode(key, poInput[key], poParent, poRef);
				siblings.push(prop);
				if (poRef.hasOwnProperty(key)) {
					if (Array.isArray(poRef[key])){
						poRef[key].push(prop);
					} else {
						let aValue = [];
						aValue.push(poRef[key]);
						aValue.push(prop);
						poRef[key] = aValue;
					}
				} else {
					poRef[key] = prop;
				}

				//work through the children
				if (Array.isArray(poInput[key])) {
					this._explodeArray(poInput[key], prop, poRef);
				} else if (null !== poInput[key] && "object" === typeof poInput[key]) {
					this._explodeObject(poInput[key], prop, poRef);
				}
			}
			for (let i =0; i < siblings.length; ++i) {
				siblings[i].siblings = siblings.reduce((r, node, index) => {
					if (index !== i) {
						r.push(node);
					}
					return r;
				}, []);
			}
		}
	}

	_explodeArray(paInput, poParent, poRef) {
		var self = this;
		if (Array.isArray(paInput)) {
			paInput.forEach(function(e){
				if (Array.isArray(e)) {
					self._explodeArray(e, poParent, poRef);
				} else if (e !== null && typeof e) {
					self._explodeObject(e, poParent, poRef);
				}
			});
		}
	}

	_setDefaultProperties(poInput, poRef) {
		poRef["@"] = this.createNode("@", poInput, null, poRef);
		poRef["."] = poRef["@"]; // TODO delete
		poRef['$_clone'] = this.clone(poRef);
		poRef["$_find"] = this.find(poRef);
		poRef["$_prune"] = this.prune;
	}

	createNode(psName, pValue, poParent, poRef) {
		const calculateDepth = (parent) => {
			let nDepth = 0;
			let p = parent;
			while (p) {
				p = p.parent;
				++nDepth;
			}
			if (nDepth > this.maxDepth) {
				this.maxDepth = nDepth;
			}
			return nDepth;
		};
		return new JSXNode({
			type: Array.isArray(pValue) ? "nodeList" : "node",
			name: psName,
			value: pValue,
			parent: poParent,
			ancestors: poParent && poParent.ancestors.concat(poParent) || [],
			siblings: [],
			children: [],
			descendants: [],
			index: -1,
			depth: calculateDepth(poParent),
			exploderId: poRef['@_id']
		});
	}

	_setChildren(poRef) {
		const addChildToParent = (child, i) => {
			if (child.parent) {
				child.parent.children.push(child);
				if (i > -1) {
					child.index = i;
				}
			}
		};
		for(let key in poRef) {
			const node = poRef[key];
			if (Array.isArray(node)) {
				node.forEach((n, i) => {
					addChildToParent(n, i);
				})
			} else {
				addChildToParent(node);
			}
		}
	}

	_setDescendants(poRef) {
		const setParentDescendants = (ball, bucket) => {
			if (bucket) {
				bucket.descendants.push(ball);
				setParentDescendants(ball, bucket.parent);
			}
		};
		for (var d = this.maxDepth; d > 0; --d) {
			for (let key in poRef) {
				const node = poRef[key];
				if (Array.isArray(node)) {
					node.forEach(n => {
						if (d === n.depth) {
							setParentDescendants(n, n.parent);
						}
					})
				} else if (d === node.depth) {
					setParentDescendants(node, node.parent);
				}
			};
		}
	}

	clone(poRef) {
		return () => this._explode(poRef['@_id'] + 1)(cloneDeep(poRef['@'].value));
	}

	prune(filteredNodes) {
		const updateParentValue = (node) => {
			if (node._keep && node.type === "nodeList") {
				node._keep.forEach(child => {
					const childValue = child.composeValue();
					if (!node._tmp) {
						node._tmp = [];
						node.value = [];
						node.children = [];
					}
					if (!node._tmp.find(n => n.siblings.includes(child))) {
						node._tmp.push(child);
						node.value.push(childValue);
						node.children.push(child);
						node.children = node.children.concat(child.siblings);
					}
				});
			} else  {
				node.children.forEach(child => {
					node.value[child.name] = child.value;
				});
			}
			if (node.hasOwnProperty('_tmp')) {
				delete node._tmp;
			}
			if (node.parent) {
				updateParentValue(node.parent);
			}
		};
		filteredNodes.forEach(node => {
			if (node.parent.hasOwnProperty('_keep')) {
				node.parent._keep.push(node);
			} else {
				node.parent._keep = [node];
			}
			
		});
		filteredNodes.forEach(node => {
			if (node.parent._keep) {				
				updateParentValue(node.parent);
				delete node.parent._keep;
			}
		})
		console.log('pruned complete', filteredNodes);
	}

	find (poRef) {
		return (pNode) => {
			const isNode = !!Validator.validateNode(pNode);
			if (isNode && Array.isArray(pNode)) {
				return pNode.map(n => {
					return Array.isArray(poRef[n.name]) ? poRef[n.name][n.index] : poRef[n.name];
				});
			} else if (isNode) {
				return Array.isArray(poRef[pNode.name]) ? poRef[pNode.name][pNode.index] : poRef[pNode.name];
			} else {
				return poRef[pNode];
			}
		}
	}
}

module.exports = JSXPloder;