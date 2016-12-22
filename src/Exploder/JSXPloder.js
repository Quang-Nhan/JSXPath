var JSXAxisTokens = require("../Tokens/JSXAxisTokens");
var JSXDebugConfig = require("../JSXDebugConfig");

class JSXPloder {
	constructor() {
		this.ContextTokens = new JSXAxisTokens();
		this.json = {};
		this.currentContexts = []; //stores current array before 
		this.DEBUG = JSXDebugConfig.debugOn;
		this.SHOW_EXPLODE = JSXDebugConfig.showExplode;
	}

	contextList() {
		return this.currentContexts;
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
		if (psName === "@" || psName === "*") { //do nothing
		} else if (Object.keys(this.ContextTokens.tokens["*"](this.json)).indexOf(psName) > -1) {
			this.updateCurrent({ 
				name: psName, 
				parent: this.json["."].name 
			});
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
		this.currentContexts.push(Object.assign( {}, this.json["."]));
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
			parent: popped.parent
		});
	}

	createErrorNode() {
		this.json["."] = {
			name: "#ERR",
			parent: null,
			value: [],
			children: []
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

		if (Array.isArray(poInput)) {
			this._explodeArray(poInput, "@", this.json);
		} else { 
			this._explodeObject(poInput, "@", this.json);
		}

		this._setDefaultProperties(poInput);

		return this.json;
	}

	_explode() {//used by JSXAxisTokens' descendant and descendant-or-self
		var self = this;
		return (poInput) => {
			var oRef = {};
			if (Array.isArray(poInput)) {
				self._explodeArray(poInput, "@", oRef);
			} else { 
				self._explodeObject(poInput, "@", oRef);
			}
			return oRef;
		}
	}

	reset() {
		this.updateCurrent("@", null);
		this.currentContexts.length = 0;
	}

	updateCurrent(poParam) {
		if (poParam.name) {
			this._updateCurrentToNode(poParam.name, poParam.parent);
		} else if (Array.isArray(poParam.values)) {
			this._updateCurrentToNodes(poParam.values)
		}		
	}

	_updateCurrentToNode(psName, psParent) {
		if (!this.json.hasOwnProperty(psName))
			throw new Error("Key " + psName + " does not exists.")
		
		if (Array.isArray(this.json[psName])) {
			for (var i = 0; i < this.json[psName].length; ++i) {
				if (psParent === this.json[psName][i].parent) {
					this.json["."] = this.json[psName][i];
					break;
				}
			}
		} else if (psParent === this.json[psName].parent) {
			this.json["."] = this.json[psName];
		}
		this._updateChildren();
	}

	_updateCurrentToNodes(paValues) {
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

		this.json["."] = {
			name: sName,
			value: paValues,
			parent: null,
			children: []
		}
	}

	// _onCurrentNodeChange() {
	// 	for (let key in this.ContextTokens.tokens) {
	// 		this.json[key] = this.ContextTokens.tokens[key].apply(this, [this.json, this._explode()]);
	// 	}
	// }

	_updateChildren() {
		this.json["*"] = this.ContextTokens.tokens["*"](this.json);
	}

	_explodeObject(poInput, psParent, poRef) {
		if (!Array.isArray(poInput)) {
			for (var key in poInput) {
				var prop = this._createProperty(key, poInput[key], psParent)
				if (poRef.hasOwnProperty(key)) {
					if (Array.isArray(poRef[key])){
						poRef[key].push(prop);
					} else {
						var aValue = [];
						aValue.push(poRef[key]);
						aValue.push(prop);
						poRef[key] = aValue;
					}
				} else {
					poRef[key] = prop;
				}

				//work through the children
				if (Array.isArray(poInput[key])) {
					this._explodeArray(poInput[key], key, poRef);
				} else if (null !== poInput[key] && "object" === typeof poInput[key]) {
					this._explodeObject(poInput[key], key, poRef);
				}
			}
		}
	}

	_explodeArray(paInput, psParent, poRef) {
		var self = this;
		if (Array.isArray(paInput)) {
			paInput.forEach(function(e){
				if (Array.isArray(e)) {
					self._explodeArray(e, psParent, poRef);
				} else if (e !== null && typeof e) {
					self._explodeObject(e, psParent, poRef);
				}
			});
		}
	}

	_setDefaultProperties(poInput) {
		this.json["@"] = this._createProperty("@", poInput, null);
		this.json["."] = this.json["@"];
		// this._onCurrentNodeChange(this.json);
	}

	_createProperty(psName, pValue, psParent) {
		var children = [];
		if (Array.isArray(pValue)) {
			pValue.forEach(function(e){
				if (null !== e && "object" === typeof e) {
					var eKeys = Object.keys(e);
					eKeys.forEach(function(c){
						if (children.indexOf(c) === -1) {
							children.push(c);
						}
					});
				}
			});
		} else if (null !== pValue && "object" === typeof pValue) {
			children = Object.keys(pValue);
		}
		return {
			name: psName,
			value: pValue,
			parent: psParent,
			children: children
		}
	}
}

module.exports = JSXPloder;