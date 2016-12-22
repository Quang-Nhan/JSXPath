var JSXError = require("../Utils/JSXError")
var JSXDebugConfig = require("../JSXDebugConfig");
var JSXUtils = require("../Utils/JSXUtils");
var JSXOperatorTokens = require("../Tokens/JSXOperatorTokens");

/**
 * @module Parser
 */

/**
 * @class JSXReplacer
 * @constructor
 * @param {Object} poVariables An object containing the defined variables.
 * @param {Object} poJSONKeys The list of keys from the input json.
 */
class JSXReplacer {
	constructor(poVariables, poJSONKeys) {
		this.Utils = new JSXUtils();
		this.Error = new JSXError();
		this.operatorTokensKeys = new JSXOperatorTokens().keys();
		this.variables = poVariables || {};
		this.DEBUG = JSXDebugConfig.debugOn;
		this.SHOW_REPLACER = JSXDebugConfig.showReplacer;
		this.REPLACE_MAP = [ 
			{ key: "{", when: "preAutoParenthesis", regex: /\s*\{.*\}(?=[^\}])?/g, with: this._object("{", this.variables, []) }
			, { key: "[", when: "preAutoParenthesis", regex: /\s*\[.*\](?=[^\]])?/g, with: this._object("[", this.variables, this.operatorTokensKeys) }
			, { key: "'", when: "preAutoParenthesis", regex: /(\'.*\')|(\".*\")/g, with: this._objectKey(poVariables, poJSONKeys, this.Utils)}
			, { key: "--", when: "preAutoParenthesis", regex: /--/g, with: " ¬ ◊"}
			, { key: "-", when: "preAutoParenthesis", regex: /-(?![\w|\-]*[\(|\:]|\d+\W)\s*/g, with: " ¬ " }//requires negative lookback to fully function
			, { key: "◊", when: "preAutoParenthesis", regex: /◊/g, with: "-" }
			, { key: "/*", when: "preAutoParenthesis", regex: /\/\*/g, with: "/Ç" }
			, { key: "::*", when: "preAutoParenthesis", regex: /:{2}\*/g, with: "::Ç" }
			, { key: ">=", when: "preAutoParenthesis", regex: /\s*(>=|<=|>|<|\||\*|=|!=|\+)\s*/g, with: this._op1() }
			, { key: "and", when: "preAutoParenthesis", regex: /\s(and|or|mod|div)\s/g, with: this._op2() }
			, { key: "Ç", when: "preAutoParenthesis", regex: /Ç/g, with: "*" }
			, { key: "/", when: "preAutoParenthesis", regex: /^\/(?!\/)/g, with:"@/"}
			, { key: "/", when: "preAutoParenthesis", regex: /(\+|\÷|\=|\%|\Ø|\&|\≠|\-|\>|\<|\≤|\≥)\/|\s\/(?!\/)/g, with: this._root }
			, { key: "[/", when: "preAutoParenthesis", regex: /\[\//g, with: "[@/" }
			, { key: "(/", when: "preAutoParenthesis", regex: /\(\//g, with: "(@/" }
			, { key: "//", when: "postAutoParenthesis", regex: /(^\/{2}|[\s|\|]\/{2}|\/{2})/g, with: this._descendant}
			, { key: "::", when: "postAutoParenthesis", regex:/(\@?[\/|\w|\d|\-]*:{2}[\w|\*|\$]*(\[.*\])*[\.|\/|\w]*)+/g, with: this._axis(this.variables) }
			, { key: "position", when: "postAutoParenthesis", regex:/position\(\s*\)\s*\=\s*\d+/g, with: this._position(this.Utils, this.operatorTokensKeys) }
			, { key: "[", when: "postAutoParenthesis", regex:/\[\s*\d+\s*(?=\])/g, with: this._position(this.Utils, this.operatorTokensKeys) }
			, { key: "  ", when: "preAutoParenthesis", regex:/\s{2}/g, with: " " }
		];
	}

	/**
	 * @method replace
	 * @description Performs a series of predefined string replacement of the path expression.
	 * @param  {String} psPath The path expression.
	 * @param  {String} psWhen one of "preAutoParenthesis|postAutoParenthesis".
	 * @return {String} Transformed psPath.
	 */
	replace(psPath, psWhen) {
		/* istanbul ignore if */
		if (this.DEBUG && this.SHOW_REPLACER) console.log(new Date(), "JSXReplacer:replace init", "path:", psPath, "when:", psWhen);
		let sPath = psPath;
		for (let i = 0; i < this.REPLACE_MAP.length; ++i) {
			if (this.REPLACE_MAP[i].when === psWhen && sPath.match(this.REPLACE_MAP[i].regex)) {
				sPath = sPath.replace(this.REPLACE_MAP[i].regex, this.REPLACE_MAP[i].with);
				/* istanbul ignore if */
				if (this.DEBUG && this.SHOW_REPLACER) console.log(new Date(), "JSXReplacer:replace", "key:", this.REPLACE_MAP[i].key, "result:", sPath);
			}
		}
		return sPath;
	}
	/**
	 * @private
	 * 
	 * @method _op1
	 * @description Replace function for ">=|<=|>|<|\||*|=|!=|+|"
	 * @return {String} 
	 */
	_op1() {
		let map = {
			">=" : " ≥ ",
			"<=": " ≤ ",
			">": " > ",
			"<": " < ",
			"|": " | ",
			"*": " ~ ",
			"=": " = ",
			"!=": " ≠ ",
			"+": " + "
		}
		return (m, i, o) =>  map[m.trim()];
	}
	/**
	 * @private
	 * 
	 * @method _op2
	 * @description Replace function for "and|or|div|mod" operators.
	 * @return {String}
	 */
	_op2() {
		let map = {
			"and": " & ",
			"or": " Ø ",
			"div": " ÷ ",
			"mod": " % "
		};
		return (m) => map[m.trim()];
	}
	/**
	 * @private
	 * 
	 * @method _objectKey
	 * @description Replace function for node name expressions in quotes
	 * @param  {Object} poVariables An object containing the defined variables.
	 * @param  {Object} poKeys The list of keys from the input json.
	 * @param  {Function} Utils Utility function
	 * @return {String}
	 */
	_objectKey(poVariables, poKeys, Utils) {
		// let isInPredicateExpression = (i, o) => {
		// 	let nBracket = Utils.lastIndexOfString(o, ["[", "]"], i);
		// 	return nBracket > -1 && o[nBracket] === "[" ? true : false;
		// };

		// let isInJSONExpression = (m, i, o) => {
		// 	let sRegex = m + "|{|}";
		// 	let oRegex = new RegExp(sRegex, "g");
		// 	let aMatches = o.match(oRegex);
		// 	let nCount = 0;
		// 	for (var i = 0; i < aMatches.length; ++i) {
		// 		if (aMatches[i] === m) {
		// 			break;
		// 		} else if (aMatches[i] === "{") {
		// 			++nCount;
		// 		} else {
		// 			--nCount;
		// 		}
		// 	}

		// 	return nCount !== 0 ? true : false;
		// }

		return (m, m1, m2, i, o) => {
			let sSub = o.substring(i+1, i+m.length-1);
			if (poKeys.indexOf(sSub) > -1) {
				poVariables["$objectKey" + i] = sSub;
				return ("$objectKey" + i);
			}
			return m;
		};
	}
	/**
	 * @privat
	 * 
	 * @method _root
	 * @description Replace function for root expression.
	 * @param  {String} m match
	 * @return {String]}
	 */
	_root(m) {
		return m[0] + " @/"; 
	}
	/**
	 * @private
	 * 
	 * @method _axis
	 * @description Replace function for axis expressions
	 * @param  {Object} poVariables An object containing the defined variables.
	 * @return {String}
	 */
	_axis(poVariables) {
		let objectKey = (k) => {
			return (k.indexOf("$") === 0) && poVariables.hasOwnProperty(k) ? poVariables[k] : k;
		};

		let transformAxis = (s) => {
			let asAxisSplits = s.split("::");
			if (asAxisSplits[1].includes("[")) {
				let nPredStart = asAxisSplits[1].indexOf("[");
				let sPred = asAxisSplits[1].substring(nPredStart+1, asAxisSplits[1].length);
				let sNode = asAxisSplits[1].substring(0, nPredStart);
				
				sNode = objectKey(sNode);
				return " " + asAxisSplits[0] + "('" + sNode + "')" + " [" + sPred;
			} else {
				asAxisSplits[1] = objectKey(asAxisSplits[1]);
				return " " + asAxisSplits[0] + "('" + asAxisSplits[1] + "')";
			}
		};

		return (m, m1, m2, i, o) => {
			let asSplits = m.split("/");
			let sAxis = "";
			for (let i = 0; i < asSplits.length; ++i) {
				if (asSplits[i].includes("::")) {
					sAxis += transformAxis(asSplits[i])
				} else if (asSplits[i] === "@") {
					sAxis += "@"
				} else {
					sAxis += "/" + asSplits[i];
				} 
			}
			return "(" + sAxis + ")";
		}
	}
	/**
	 * @private
	 * 
	 * @method _position
	 * @description Replace function for position expression
	 * @param  {Function} Utils Utility function
	 * @param  {Array} operatorTokensKeys
	 * @return {String}
	 */
	_position(Utils, operatorTokensKeys) {
		return (m, i, o) => {
			let nBeg = m.includes("position") ? Utils.lastIndexOfString(m, [" ", "="], m.length) : 1;
			let nEnd = m.length;
			let sPosIndex = m.substring(nBeg, nEnd).trim();
			let sPos = "position(" + sPosIndex + ")";
			let aKeys = operatorTokensKeys;
			aKeys.push(" ");
			return m[0] === "[" ? m[0] + sPos : sPos;
		}
	}
	/**
	 * @private
	 * 
	 * @method _descendant
	 * @description Replace function for "//".
	 * @param  {String} m1 Matches.
	 * @param  {String} m2 Match.
	 * @param  {Number} i  Index.
	 * @param  {String} o  Original string.
	 * @return {String}
	 */
	_descendant(m1, m2,  i, o) {
		if (m1[0] === "/" && (o[i-1] === "(" || i === 0)) {
			return "@/descendant::"
		} else if (m1[0] === " ") {
			return " @/descendant::";
		}
		return " /descendant::";
	}
	/**
	 * @private
	 * 
	 * @method _object
	 * @description Replace function for pure object or array expression.
	 * @param  {String} key One of "{|["
	 * @param  {Object} variables An object containing the defined variables.
	 * @param  {Array} operatorTokenKeys
	 * @return {String}
	 */
	_object(key, variables, operatorTokenKeys) {
		let extractor = this._extractor(key, variables, operatorTokenKeys);

		return (m, i, o) => {
			let sS = extractor.variablesReplacement(m);
			o = o.replace(m, sS);
			let aS = extractor.extract(sS, i, o);
			if (aS.length) {
				let asS = extractor.prepStrings(aS, sS, i);
				return extractor.composeString(asS);
			}
			return m;
		}
	}
	/**
	 * @private
	 * 
	 * @method _extractor
	 * @description Used by _object function
	 * @param  {String} key                One of "{|["
	 * @param  {Object} variables          An object containing the defined variables.
	 * @param  {Array} operatorTokensKeys
	 * @return {String}
	 */
	_extractor(key, variables, operatorTokensKeys) {
		let nKey = 0;
		let reverseKey = (key === "[") ? "]" : "}";
		let varKey = (key === "[") ? "$array" : "$object";
		let updateVariables = (aValue) => {
			variables[varKey + nKey] = aValue;
		};
		let _prepStrings = (aStrings, sString, i) => {
			let aS = [];
			for (let j = 0; j < aStrings.length; ++j) {
				updateVariables(aStrings[j].array || aStrings[j].object);
				if (j === 0) aS.push(sString.substring(0, aStrings[j].start-i));
				if (j > 0) aS.push(sString.substring(aStrings[j-1].end+1, aStrings[j].start-i));
				aS.push(varKey + nKey++);
				if (j === aStrings.length-1) aS.push(sString.substring(aStrings[j].end+1-i, sString.length));
			}
			return aS;
	  	};
		let _parse = (sString, i, o, oRay) => {
			try {
				if (aKeys.includes(o[i-1])) {
					return JSON.parse(sString);
				} else {
					throw new Error("Invalid array object")
				}
			} catch(e) {
				return sString;
			}
		};
		let _extract = (sString, i, o) => {
			let aoStrings = [];
			let oString = {};
			let count = 0;
			for (let j = 0; j < sString.length; ++j) {
				if (sString[j] === key) {
					if (!oString.hasOwnProperty("start")) oString.start = j + i;
					++count;
				} else if (sString[j] === reverseKey) {
					--count;
				}
				if (count === 0 && oString.hasOwnProperty("start")) {
					oString.end = j + i;
					let sSub = o.substring(oString.start, oString.end+1);
					if (key === "{") {
						this.Error.test("JSON", {data: sSub, at: "JSXReplacer:_object"});
						oString.object = JSON.parse(sSub);
						aoStrings.push(oString);
					} else {
						let aRay = _parse(sSub, oString.start , o, oString);

						if (Array.isArray(aRay)) {
							oString.array = aRay;
							aoStrings.push(oString);
						} else if (sSub.includes("[", 1)) {
							aoStrings = aoStrings.concat(_extract(sSub.substring(1, sSub.length), oString.start + 1, o));
						}
					}
					oString = {};
				}
			}
			return aoStrings;
		};
		let aKeys = operatorTokensKeys;
		aKeys.push(" ");

		return {
			variablesReplacement: (sKey) => {
				sKey = sKey.replace(/\$[\w|\d]*/g, (m) => {
					return variables.hasOwnProperty(m) ? JSON.stringify(variables[m]) : m;
				});
				return sKey;
			  }
			, composeString: (aStrings) => {
				let s = "";
				for (let i = 0 ; i < aStrings.length; ++i) {
					s += aStrings[i];
				}
				return s;
			  }
			, prepStrings: _prepStrings
			, extract: _extract
			, parse: _parse
		}
	}
}

module.exports = JSXReplacer;