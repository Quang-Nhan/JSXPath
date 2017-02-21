var JSXPathParser = require("../Parser/JSXPathParser");
var JSXPloder = require("../Exploder/JSXPloder");
var JSXPathFunctions = require("../Tokens/JSXPathFunctions");
var JSXOperatorTokens = require("../Tokens/JSXOperatorTokens");
var JSXAxisTokens = require("../Tokens/JSXAxisTokens");
var JSXError = require("../Utils/JSXError");
var JSXDebugConfig = require("../JSXDebugConfig");
var JSXValidator = require("../Utils/JSXValidator");
/**
 * @module Processor
 */

/**
 * @class JSXProcessor
 * @constructor
 * @params {Object} poCustomFunctions Object containing custom funnctions
 */
class JSXProcessor {
	constructor(poCustomFunctions) {
		//debug
		this.DEBUG = JSXDebugConfig.debugOn;
		this.SHOWEXPLODED = JSXDebugConfig.showExploded;
		this.SHOWPROCESSTYPE = JSXDebugConfig.showProcessType;

		//variables
		this.variables = {};
		this.path = null;
		this.parsedPath = [];
		this.json = null;
		this.exploded = null;
		this.customFunctions = poCustomFunctions;

		//Objects
		this.PathParser = new JSXPathParser();
		this.Exploder = new JSXPloder();
		this.OperatorTokens = new JSXOperatorTokens();
		this.ContextTokens = new JSXAxisTokens();
		this.ErrorHandler = new JSXError();
		this.Validator = new JSXValidator();
	}


	setJSON(poJSON) {
		this.ErrorHandler.test("DefinedAndValidType", { data: poJSON, name: "poJSON", type: typeof poJSON, expectedType: "object", at: "JSXProcessor.setJSON" });
		this.json = poJSON;
	}
	/**
	 * @method process
	 * @description Main function to process
	 * @param  {String} psPath The path expression.
	 * @param  {Object} [poJSON] The input json object to be traversed against.
	 * @param  {Object} [poVariables] An object containing user defined variables.
	 * @return {any} processed result.
	 */
	process(psPath, poJSON, poVariables) {
		this.ErrorHandler.test("DefinedAndValidType", { data: psPath, name: "psPath", type: typeof psPath, expectedType: "string", at: "JSXProcessor.process" })
		this.ErrorHandler.test("ValidType", { data: poJSON, name: "poJSON", type: typeof poJSON, expectedType: "object", at: "JSXProcessor.process" })
		this.ErrorHandler.test("ValidType", { data: poVariables, name: "poJSON", type: typeof poJSON, expectedType: "object", at: "JSXProcessor.process" });

		if (poVariables) {
			this.variables = poVariables;
		}

		if (poJSON) {
			this.json = poJSON;
			this.exploded = this.Exploder.explode(this.json);
			this.PathFunctions = new JSXPathFunctions(this.exploded, this.customFunctions);
			/* istanbul ignore if */
			if (this.DEBUG && this.SHOWEXPLODED) console.log(new Date(), "JSXProcessor:this.exploded", this.exploded);
		}

		this.path = psPath;
		this.parsedPath = this.PathParser.parse(this.path, this.variables, Object.keys(this.exploded));
		/* istanbul ignore if */
		if (this.DEBUG) console.log(new Date(), "JSXProcessor:this.parsedPath", JSON.stringify(this.parsedPath));

		this.ErrorHandler.test("Defined", { data: this.path, name: "this.path", at: "JSXProcessor.process" });
		this.ErrorHandler.test("Defined", { data: this.json, name: "this.json", at: "JSXProcessor.process" });

		let result = this._processPath(this.parsedPath, this.exploded);
		if (!Array.isArray(result)) {
			result = !result ? [] : [result];
		}
		return result;
	}
	/**
	 * @private
	 * 
	 * @method _processPath
	 * @param  {Array} paPath Array construct of the path
	 * @param  {Object} exploded Flattened/exploded form of the initial json
	 * @return {any} Processed result
	 */
	_processPath(paPath, exploded) {
		var result, aArg;
		var bArg = false;
		this.Exploder.addCurrentContext();

		for (var i = 0; i < paPath.length; ++i) {
			if (paPath[i] === ",") {
				aArg = [];
				bArg = true;
			} else if (paPath[i] === "[") {
				result = this._tests(paPath.slice(i + 1, paPath.length), exploded);
				if (!result || Array.isArray(result) && !result.length) {
					return result;
				} else if (Array.isArray(result)){
					this.Exploder.updateCurrent({values: result});
				} else {
					return this.Exploder.current();
				}
				break;
			} else {
				result = this._processArrayElement(aArg && aArg || result, paPath[i], paPath[i+1], exploded);
				if (!result)  {//tests resturns a false result
					return result;
				}
				if (this.OperatorTokens.tokens[paPath[i]] && (!aArg || aArg.indexOf("∏") === -1) && paPath[i+1] !== "∏") { // ∏ = position symbol
					++i;
				} else if (bArg) {
					aArg.push(result);
					this.Exploder.resetCurrentContext();
				}
			}
		}

		if (bArg) {
			return aArg;
		}

		this.Exploder.removeCurrentContext();
		return result;
	}
	/**
	 * @private
	 * 
	 * @method _processCurrentNode
	 * @description Returns the current node after parsing the list of keys that denotes the document path
	 * @param  {Array<String>} pasNodes A list of node string denoting the document path
	 * @return {Object} The current node
	 */
	_processCurrentNode(pasNodes) {
		var i = 0;
		var result;
		if (pasNodes[0] === "@") {
			this.Exploder.updateCurrent({ 
				name: pasNodes[0], 
				parent: null
			});
			++i;
		}

		if (this.Exploder.current().name === "#ERR")
			return this.Exploder.current().value;

		for (; i < pasNodes.length; ++i) {
			switch (pasNodes[i]) {
				case ".":
					break;
				case "..":
					this.Exploder.setParentAsCurrent();
					break;
				case "": 
					break;
				default:
					if (this.variables.hasOwnProperty(pasNodes[i])) {
						pasNodes[i] = this.variables[pasNodes[i]];
					}
					this.Exploder.setCurrentToChildNode(pasNodes[i]);
			}
		}
		return this.Exploder.current();
	}
	/**
	 * @private
	 * 
	 * @method _test
	 * @description Function to parse a predicates.
	 * @param  {Array} paPath Array construct of the path
	 * @param  {Object} exploded Flattened/exploded form of the initial json
	 * @return {any} Processed result
	 */
	_tests(paPath, exploded) {
		let result =  this._processPath(paPath, exploded);
		let currentContext = this.Exploder.contextList();
		if (Array.isArray(result)) {
			if (result.every((e) => { 
				return currentContext[currentContext.length-1].name === e.name || currentContext[currentContext.length-1].name === e.parent }
				)) {
				return result;
			} else {
				return true;
			}
		}
		
		return result;
	}
	/**
	 * @private
	 * 
	 * @method _type
	 * @description Function to determine what type of element is in the parsed array.
	 * @param  {String|Array} pPath The element of the path array construct.
	 * @param  {Object} poRef The exploded json.
	 * @return {String} The JSXPath enum type
	 */
	_type(pPath, poRef) {
		if (undefined === pPath)
			throw new Error("Path is not defined.");
		if (null === pPath)
			return "null";
		else if (Array.isArray(pPath))
			return "array";
		else if (pPath.indexOf("'") === 0 && pPath.lastIndexOf("'") === pPath.length-1 || 
				 pPath.indexOf('"') === 0 && pPath.lastIndexOf('"') === pPath.length-1)
			return "string";
		else if (parseFloat(pPath) === parseFloat(pPath))
			return "number";
		else if (this.OperatorTokens.tokens[pPath])
			return "operator";
		else if (poRef[pPath])
			return "node";
		else if (pPath.indexOf("/") > -1)
			return "path";
		else if (pPath.indexOf("(") > -1)
			return "function";
		else if (pPath.indexOf("$") > -1)
			return "variable";
		else if (pPath === ",") //preprocessed
			return "args";
		else if (pPath === "[") //preprocessed
			return "tests";
		else if (pPath === "∏")
			return "position";
		else {
			return null;
		}
	}
	/**
	 * @private
	 * 
	 * @method _processArrayElement
	 * @description Process the current element
	 * @param  {any} prev The previous parsed element
	 * @param  {any} current The current element
	 * @param  {any} next The next element to be parsed
	 * @param  {Object} exploded The flattened/exploded json
	 * @return {Object} The parsed result of the current element.
	 */
	_processArrayElement(prev, current, next, exploded) {
		var result;
		let sType = this._type(current, exploded)
		switch (sType) {
			case "array": 
				result = this._processPath(current, exploded);
				break;
			case "path":
				var sPath = current;
				var asNodes = sPath.split("/");
				result = this._processCurrentNode(asNodes);
				break;
			case "null": 
				break;
			case "number": 
				result = Number(current);
				break;
			case "string": 
				result = current.substring(1, current.length - 1);
				break;
			case "function": 
				var args = Array.isArray(prev) ? prev : [prev];
				let sFName = current.substring(0, current.length - 1).trim();
				if (this.ContextTokens.tokens[sFName]) {
					result = this.ContextTokens.tokens[sFName].apply(this, [this.exploded, prev, this.Exploder._explode()]);
					if (Array.isArray(result)) {
						this.Exploder.updateCurrent({ values: result });
						this.Exploder.addCurrentContext();
					} else if (result.name) {
						this.Exploder.updateCurrent({
							name: result.name, 
							parent: result.parent
						});
						this.Exploder.addCurrentContext();
					}
				} else if (this.PathFunctions.customs && this.PathFunctions.customs.hasOwnProperty(sFName)) {
					result = this.PathFunctions.customs[sFName].apply(this, [args, this.Validator]);
				} else {
					result = this.PathFunctions.tokens[sFName].apply(this, [args]);
				}
				break;
			case "node":
				if (current === ".") {
					result = this.Exploder.current();
				} else if (current == "..") {
					result = this.ContextTokens[".."](this.exploded);
				} else {
					this.Exploder.setCurrentToChildNode(current);
					result = this.Exploder.current();
				}
				break;
			case "operator":
				if (!Array.isArray(prev) || (prev.indexOf("∏") === -1 && next !== "∏")) { // does not have position symbol
					var opfunc = this.OperatorTokens.tokens[current].apply(this, [prev]);
					var nextResult = this._processArrayElement(null, next, null, exploded);
					result = opfunc.apply(null, [nextResult]);
					this.Exploder.resetCurrentContext();
				} else {
					result = current;
				}
				break;
			case "variable":
				this.ErrorHandler.test("Defined", {data: this.variables[current], name: current, at: "JSXProcessor:_processArrayElement"});
				result = this.variables[current];
				break;
			case "position":
				result = current;
				break;
			case "args": //handled in preporcess
				break;
			case "tests": //handled in preprocess
				break;
			default:
				// this.ErrorHandler.throw("jsx000", {name: current, at: "JSXProcessor:_processArrayElement"})
				console.log("default", current, "prev", prev, this.Exploder.current());
		}
		/* istanbul ignore if */
		if (this.DEBUG && this.SHOWPROCESSTYPE) console.log(new Date(), "JSXProcessor:" + sType.toUpperCase(), "current", JSON.stringify(current), "result:", JSON.stringify(result));
		return result;
	}
};

module.exports = JSXProcessor;