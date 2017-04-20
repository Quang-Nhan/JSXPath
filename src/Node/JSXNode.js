var JSXDebugConfig = require("../JSXDebugConfig");
var moment = require("moment");

class JSXNode {
	constructor(poArgs) {
		this.DEBUG = JSXDebugConfig.debugOn;
		this.meta = {
			type: poArgs.type,
			createdDateTime: moment().format()
		}
		this.value = poArgs.value;
		this.parent = poArgs.parent;
		this.children = poArgs.children;
		this.name = poArgs.name;
	}

	update(poArgs) {
		if (Object.hasOwnProperty('type')) {
			this.meta.type = poArgs.type;
		}
		if (Object.hasOwnProperty('value')) {
			this.value = poArgs.value;
		}
		if (Object.hasOwnProperty('parent')) {
			this.value = poArgs.parent;
		}
		if (Object.hasOwnProperty('children')) {
			this.value = poArgs.children;
		}
		if (Object.hasOwnProperty('name')) {
			this.value = poArgs.name;
		}
	}

	type() {
		return this.meta.type;
	}

	name() {
		return this.name;
	}
	value() {
		return this.value;
	}
	parent() {
		return this.parent;
	}
}

module.exports = JSXNode;