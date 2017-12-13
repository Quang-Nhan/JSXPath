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
		this.currentContexts = []; //stores current array before 
		this.DEBUG = JSXDebugConfig.debugOn;
		this.SHOW_EXPLODE = JSXDebugConfig.showExplode;
		this.SHOW_CONTEXT = JSXDebugConfig.showContext;
		this.maxDepth = 0;
		this.json['@_id'] = 0;
	}

	contextList() {
		return this.currentContexts;
	}

	getCurrentContext() {
		return this.currentContexts.length ? this.currentContexts[this.currentContexts.length-1] : null;
	}

	current() {
		return this.json["."];
	}

	axis() {
		object.keys(this.ContextTokens.tokens);
	}

	processAxis(psAxis, paArgs) {
		oResult = this.ContextTokens.tokens[key].apply(this, [this.json, this._explode()]);
		return oResult;
	}

	setCurrentToChildNode(psName) {
		const children = this.ContextTokens.tokens["*"](this.json);
		if (psName === "@" || psName === "*") { //do nothing
		} else if (children.hasOwnProperty(psName)) {
			this.updateCurrent(children[psName].length > 1 ? {values: children[psName]} : children[psName][0]);
		} else {
			if (this.DEBUG && this.SHOW_EXPLODE) console.log(new Date(), "JSXPloder:setCurrentToChildNode: creating error node", psName);
			this.createErrorNode();
		}
		// return this.json["."];
	}

	setParentAsCurrent(){
		let oParent = this.ContextTokens.tokens[".."](this.json);
		let sParentKey = Object.keys(oParent)[0];
		this.updateCurrent({
			name: sParentKey, 
			parent: oParent[sParentKey].parent
		});
	}

	addCurrentContext() {
		const node = this.json[this.json['.'].name];
		this.currentContexts.push(node);
		if (this.DEBUG && this.SHOW_CONTEXT) console.log(new Date(), "JSXPloder:addCurrentContext:", this.contextList());
	}

	resetCurrentContext() {
		if (this.currentContexts.length === 0) {
			throw new Error("thrown in triggerCurrentNodesReset, no node item to reference to.")
		}
		let resetTo = this.currentContexts[this.currentContexts.length-1];
		this.updateCurrent({ 
			name: resetTo.name, 
			parent: resetTo.parent
		});
	}

	removeCurrentContext() {
		if (this.currentContexts.length === 0) {
			throw new Error("thrown in triggerTestsEnd, cannot pop an empty list.");
		}
		let popped = this.currentContexts.pop();
		this.updateCurrent({
			name: popped.name, 
			parent: popped.parent && popped.parent.name
		});
		if (this.DEBUG && this.SHOW_CONTEXT) console.log(new Date(), "JSXPloder:removeCurrentContext:", this.contextList());
	}

	updateParentContext(pValue) {
		if (this.currentContexts.length > 1) {
			this.currentContexts[this.currentContexts.length - 2] = pValue;
		}
	}

	createErrorNode() {
		this.json["."] = {
			name: "#ERR",
			parent: null,
			value: [],
			children: [],
			siblings: []
		}
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

	reset() {
		this.updateCurrent("@", null);
		this.currentContexts.length = 0;
	}

	updateCurrent(poParam) {
		if (poParam.name) {
			this._updateCurrentToNode(poParam);
		} else if (Array.isArray(poParam.values)) {
			this._updateCurrentToNodes(poParam.values);
		}

		if (this.DEBUG && this.SHOW_EXPLODE) console.log(new Date(), "JSXPloder:updateCurrent: this.json[\".\"]", this.json["."], "poParam", poParam);	
	}

	_updateCurrentToNode(poNode) {
		if (!this.json.hasOwnProperty(poNode.name))
			throw new Error("Key " + poNode.name + " does not exists.")
		if (Array.isArray(this.json[poNode.name])) {
			let result = [];
			for (var i = 0; i < this.json[poNode.name].length; ++i) {
				if (psParent === this.json[poNode.name][i].parent.name) {
					result.push(this.json[poNode.name][i]);
				}
			}
			if (result.length > 1) {
				this._updateCurrentToNodes(result);
				this.parent = psParent;
			} else if (result.length === 1) {
				return this.json["."] = result[0];
			}
		} else {
			const parentName = this.json[poNode.name].parent && this.json[poNode.name].parent.name;
			if (!poNode.parent || (poNode.parent && poNode.parent.name === parentName)) {
				this.json["."] = this.json[poNode.name];
			}
		}
		this._updateChildren();
	}

	_updateCurrentToNodes(paValues) {
		if (!paValues.length) {
			this.json["."] = paValues;
			return;
		}
		let sName = null;
		for (let i = 0; i < paValues.length; ++i) {
			if (paValues[i].name && sName !== undefined) {
				if (sName !== null && sName !== paValues[i].name) {
					sName = undefined;
				} else {
					sName = paValues[i].name;
				}
			}
		}
		const PARENT = paValues[0].parent;

		this.json["."] = new JSXNode({
			type: "nodelist",
			name: sName,
			value: paValues,
			parent: paValues.every((e) => e.parent === PARENT) ? PARENT : null,
			children: []
		});
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
		poRef['$_clone'] = () => {
			return this._explode(poRef['@_id'] + 1)(cloneDeep(poRef['@'].value));
		}
		poRef["$_find"] = (pNode) => {
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

	prune(filteredNodes) {
		// const composeValue = (node) => {
		// 	return node.siblings.reduce((r, sibling) => {
		// 		r[sibling.name] = sibling.value;
		// 		return r;
		// 	}, {[node.name]: node.value});
		// };
		const contains = (list, ob) => {

		};
		const updateParentValue = (node) => {
			if (node._keep && node.meta.type === "nodeList") {
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
				// node.parent._keepValue.push(node.value);
			} else {
				node.parent._keep = [node];
				// node.parent._keepValue = [{[node.name] : node.value}];
			}
			
		});
		filteredNodes.forEach(node => {
			if (node.parent._keep) {				
				updateParentValue(node.parent);
				// node.parent.children = node.parent._keep.concat(node.siblings);
				delete node.parent._keep;
				// delete node.parent._keepValue;
			}
		})
		console.log('pruned complete', filteredNodes);
	}
}

module.exports = JSXPloder;