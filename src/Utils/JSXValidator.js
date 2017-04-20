var JSXError = require("./JSXError");
var JSXUtils = require("./JSXUtils");

class JSXValidator {
	//TODO implement different kinds of errors codes
	//see https://www.w3.org/TR/xpath20
	constructor() {
		this.ErrorHandler = new JSXError();
		this.Utils = new JSXUtils();
	}
	/**
	 * Validate that the input value is a number or a node object that contains a number.
	 * Returns a subset of nodes that contains number value, or the number if the input is a number.
	 * @param  {any} 	val        	the value to be tested against
	 * @param  {string} caller      the name of the caller
	 * @param  {boolean} throwError flag to throw an error or not
	 * @return {object|number|null}
	 */
	validateNumber(val, caller, throwError) {
		if (val && Array.isArray(val.value) &&  val.value.length && val.value[0].hasOwnProperty("value") && (val.value.filter((e) => this.Utils.isNumber(e.value))).length === val.value.length) { 
			return val.value;
		}
		if (Array.isArray(val) && (val.filter((e) => this.Utils.isNumber(e.value))).length === val.length) {
			return val;
		}
		if (val && val.hasOwnProperty("value") && this.Utils.isNumber(val.value)) {
			return val.value;
		}
		if (this.Utils.isNumber(val)) {
			return val;
		}
		if (throwError) {
			this.ErrorHandler.throw("jsx002", { name: caller, type: typeof val, expectedType: "number", at: "JSXValidator.validateNumber"});
		}
		return null;
	}

	// _areNumbers(val){
	// 	return !val.some((e) => isNaN(e) || !isFinite(e));
	// }

	validateString(val, caller, throwError) {
		if (val && Array.isArray(val.value) && val.value.length && val.value[0].hasOwnProperty("value") && (val.value.filter((e) => typeof e.value === "string")).length === val.value.length) {
			return val.value;
		}
		if (Array.isArray(val) && (val.filter((e) => typeof e === "string")).length === val.length) {
			return val;
		}
		if (val && val.hasOwnProperty("value") && "string" === typeof val.value) {
			return val.value;
		}
		if ("string" === typeof val) {
			return val;
		}
		if (throwError) {
			this.ErrorHandler.throw("jsx002", { name: caller, type: typeof val, expectedType: "string", at: "JSXValidator.validateString"});
		}
		return null;
	}

	validateBoolean(val, caller, throwError) {
		if (val && Array.isArray(val.value) && val.value.length && val.value[0].hasOwnProperty("value")) {
			return val.value.filter((e) => typeof e.value === "boolean");
		}
		if (val && val.hasOwnProperty("value") && "boolean" === typeof val.value) {
			return val.value;
		}
		if ("boolean" === typeof val) {
			return val;
		}
		if (throwError) {
			this.ErrorHandler.throw("jsx002", { name: caller, type: typeof val, expectedType: "boolean", at: "JSXValidator.validateBoolean" });
		}
		return null;
	}

	validateNode(val, caller, throwError) {
		if (val && Array.isArray(val.value) && val.value.length && val.value[0].hasOwnProperty("value")) {
			return val.value.filter((e) => e && e.name && e.value && e.children && e.parent);
		}
		if (Array.isArray(val) && val.length && val[0].hasOwnProperty("name") && val[0].hasOwnProperty("value") && val[0].hasOwnProperty("parent") && val[0].hasOwnProperty("children")) {
			return val;
		}
		if (val && val.hasOwnProperty("name") && val.hasOwnProperty("value") && val.hasOwnProperty("children") && val.hasOwnProperty("parent"))
			return val;
		if (throwError) {
			this.ErrorHandler.throw("jsx004", { name: caller, at: "JSXValidator.validateNode"});
		}
		return null;
	}

	validateObject(val, caller, throwError) {
		if (val && val.hasOwnProperty("value") && val.value !== null && !Array.isArray(val.value) && typeof val.value === "object") {
			return val.value;
		}
		if (val && val !== null && !Array.isArray(val) && typeof val === "object") {
			return val;
		}
		if (throwError) {//TODO: create a new error for handling plain object
			this.ErrorHandler.throw("jsx002", { name: caller, type: typeof val, expectedType: "object", at: "JSXValidator.validateString"});
		}
		return null;
	}

	isArray(val, caller, throwError) {
		if (val && val.hasOwnProperty("value") && Array.isArray(val.value)) {
			return val.value;
		}
		if (Array.isArray(val)) {
			return val;
		}
		if (throwError) {
			this.ErrorHandler.throw("jsx006", { name: caller, at: "JSXValidator.isArray"});
		}
		return null;
	}
}

module.exports = JSXValidator;
