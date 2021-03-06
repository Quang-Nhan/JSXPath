var JSXDebugConfig = require("../JSXDebugConfig");
var moment = require("moment");

class JSXNode {
	constructor(poArgs) {
		this.type = poArgs.type,
		this.value = poArgs.value;
		this.parent = poArgs.parent;
		this.children = poArgs.children || [];
		this.name = poArgs.name;
		this.siblings = poArgs.siblings || [];
		this.depth = poArgs.depth || 0;
		this.ancestors = poArgs.ancestors || [];
		this.descendants = poArgs.descendants || [];
		this.index = poArgs.index || -1;
		this.exploderId = poArgs.exploderId || -1;
	}

	getChildren(paNodeNames) {
		if (!paNodeNames || paNodeNames.includes("*")) {
			return this.children;
		}
		return this.children.filter(child => {
			return paNodeNames.includes(child.name);
		})
	}

	composeValue() {
		return this.siblings.reduce((r, sibling) => {
			r[sibling.name] = sibling.value;
			return r;
		}, {[this.name]: this.value});
	}
}

module.exports = JSXNode;