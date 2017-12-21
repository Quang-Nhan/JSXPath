const JSXPathParser = require("../Parser/JSXPathParser");
const JSXPloder = require("../Exploder/JSXPloder");
const JSXPathFunctions = require("../Tokens/JSXPathFunctions");
const JSXOperatorTokens = require("../Tokens/JSXOperatorTokens");
const JSXAxisTokens = require("../Tokens/JSXAxisTokens");
const JSXError = require("../Utils/JSXError");
const JSXDebugConfig = require("../JSXDebugConfig");
const JSXValidator = require("../Utils/JSXValidator");
const JSXContext = require("../Exploder/JSXContext");
const JSXProcessorTokens = require("./JSXProcessorTokens");


const OperatorTokens = new JSXOperatorTokens();
/**
 * @module Processor
 */


/**
 * @private
 * 
 * @method _processPath
 * @param  {Array} paPath Array construct of the path
 * @param  {Object} exploded Flattened/exploded form of the initial json
 * @return {any} Processed result
 */
const processPath = (paPath, exploded, jsxProcessor) => {
	var result, aArg;
	var bArg = false;

	for (var i = 0; i < paPath.length; ++i) {
		if (paPath[i] === ",") {
			aArg = [];
			bArg = true;
		} else {
			result = processElements(aArg && aArg || result, paPath[i], paPath[i + 1], exploded, jsxProcessor);
			if (!result) {//tests resturns a false result
				return result;
			}
			if (OperatorTokens.tokens[paPath[i]] && (!aArg || aArg.indexOf("∏") === -1) && paPath[i + 1] !== "∏") { // ∏ = position symbol
				++i;
			} else if (paPath[i] === '[') {

				++i;
			} else if (bArg) {
				aArg.push(result);
			}
		}
	}

	if (bArg) {
		return aArg;
	}

	return result;
}


/**
* @private
* 
* @method processElements
* @description Process the current element
* @param  {any} prev The previous parsed element
* @param  {any} current The current element
* @param  {any} next The next element to be parsed
* @param  {Object} exploded The flattened/exploded json
* @return {Object} The parsed result of the current element.
*/
const processElements = (prev, current, next, exploded, jsxProcessor) => {
	const sType = getType(current, exploded);
	let result = jsxProcessor.processorTokens.tokens[sType](prev, current, next);
	if (typeof result === 'function') {
		return result(processPath, processElements, jsxProcessor);
	}
	/* istanbul ignore if */
	if (jsxProcessor.DEBUG && jsxProcessor.SHOWPROCESSTYPE) console.log(new Date(), "JSXProcessor:" + (sType && sType.toUpperCase() || ''), "current", JSON.stringify(current), "result:", result);
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
const getType = (pPath, poRef) => {
	if (undefined === pPath)
		throw new Error("Path is not defined.");
	if (null === pPath)
		return "null";
	else if (Array.isArray(pPath))
		return "array";
	else if (pPath.indexOf("'") === 0 && pPath.lastIndexOf("'") === pPath.length - 1 ||
		pPath.indexOf('"') === 0 && pPath.lastIndexOf('"') === pPath.length - 1)
		return "string";
	else if (parseFloat(pPath) === parseFloat(pPath))
		return "number";
	else if (pPath === 'true' || pPath === 'false')
		return 'boolean';
	else if (OperatorTokens.tokens[pPath])
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
			/* istanbul ignore if */
			if (this.DEBUG && this.SHOWEXPLODED) console.log(new Date(), "JSXProcessor:this.exploded", this.exploded);
		}
		
		this.path = psPath;
		this.parsedPath = this.PathParser.parse(this.path, this.variables, Object.keys(this.exploded));
		/* istanbul ignore if */
		if (this.DEBUG) console.log(new Date(), "JSXProcessor:this.parsedPath", JSON.stringify(this.parsedPath));
		
		this.ErrorHandler.test("Defined", { data: this.path, name: "this.path", at: "JSXProcessor.process" });
		this.ErrorHandler.test("Defined", { data: this.json, name: "this.json", at: "JSXProcessor.process" });
		this.context = new JSXContext(this.exploded);
		this.pathFunctions = new JSXPathFunctions(this.exploded, this.customFunctions, this.context);
		this.processorTokens = new JSXProcessorTokens(this.context, this.exploded, this.variables);

		let result = processPath(this.parsedPath, this.exploded, this);
		if (!Array.isArray(result)) {
			result = !result ? [] : [result];
		}
		/* istanbul ignore if */
		if (this.DEBUG) console.log(new Date(), "JSXPROCESSOR:this.context", this.context);

		this.context.cleanUp();
		return result;
	}
};

module.exports = JSXProcessor;