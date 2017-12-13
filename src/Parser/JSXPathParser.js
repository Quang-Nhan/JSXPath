var JSXParseTokens = require("../Tokens/JSXParseTokens");
var JSXOperatorTokens = require("../Tokens/JSXOperatorTokens");
var JSXReplacer = require("./JSXReplacer");
var JSXDebugConfig = require("../JSXDebugConfig");
var JSXError = require("../Utils/JSXError");
var JSXUtils = require("../Utils/JSXUtils");

class JSXPathParser {
	constructor() {
		this.DEBUG = JSXDebugConfig.debugOn;
		this.ParseTokens = new JSXParseTokens();
		this.Utils = new JSXUtils();
		this.OperatorTokens = new JSXOperatorTokens();
		this.Error = new JSXError();
		this.Replacer = null;
	}

	parse(psPath, poVariables, poJSONKeys) {
		this.Error.test("DefinedAndValidType", {name: "psPath", data: psPath, type: typeof psPath, expectedType: "string", at: "JSXPathParser:parse"})
		if (!psPath)
			throw new Error("Path expression has not being defined.");
		if ("string" !== typeof psPath)
			throw new Error("Path expression is not of type 'string'.");
		this.Replacer = new JSXReplacer(poVariables, poJSONKeys);

		const sPath = this._normalise(psPath).trim();
		/* istanbul ignore if */
		if (this.DEBUG) console.log(new Date(), "JSXPathParser:parse:sPath", sPath);

		const aParsed = this._transform(sPath);
		/* istanbul ignore if */
		if (this.DEBUG) console.log(new Date(), "JSXPathParser:parse:aParsed", JSON.stringify(aParsed));

		const aFinalParsed =  this._postParsedProcessing(aParsed); //used to group comma separate expressions
		/* istanbul ignore if */
		if (this.DEBUG) console.log(new Date(), "JSXPathParser:parse:aFinalParsed", aFinalParsed);
		return aFinalParsed;
	}

	_normalise(psPath) {
		let sNormalised = this.Replacer.replace(psPath, "preAutoParenthesis"); //this._replace(psPath);
		/* istanbul ignore if */
		if (this.DEBUG) console.log(new Date(), "JSXPathParser:_normalised:replace1", sNormalised);

		sNormalised = this._autoParenthesis(sNormalised);
		/* istanbul ignore if */
		if (this.DEBUG) console.log(new Date(), "JSXPathParser:_normalised:sAutoParenthesized", sNormalised);
		
		sNormalised = this.Replacer.replace(sNormalised, "postAutoParenthesis");
		/* istanbul ignore if */
		if (this.DEBUG) console.log(new Date(), "JSXPathParser:_normalised:replace2", sNormalised);

		return this._camelCase(sNormalised);
	}

	/**
	 * Converts function name and axes name containing dashes to Camel Case if any;
	 * @param  {string} psInput path expression
	 * @return {string}         camelcased function name and axes path expressions
	 */
	_camelCase(psInput) {
		let aMinusSplits = psInput.split(/\-(?=[\w|\-]+[\(|\:{2}])/);
		let sCamelCase = aMinusSplits[0];
		for (let i = 1; i < aMinusSplits.length; ++i) {
			//grab the first character and replace with the capitalVersion
			let sUpper = aMinusSplits[i][0].toUpperCase();
			let sReplaced = sUpper + aMinusSplits[i].substring(1, aMinusSplits[i].length);
			sCamelCase += sReplaced;
		}
		return sCamelCase;
	}

	_autoParenthesis(psInput) {
		var sAutoParen = psInput;
		const PRECEDENCE = [
			{ level: 1, regex: /[\~|\÷|\%]/g  }
			, { level: 2, regex: /(\+|\¬(?!\d+))/g }
			, { level: 3, regex: /[\<|\>|\≤|\≥]/g } 
			, { level: 4, regex: /[\=|\≠]/g }
			, { level: 5, regex: /[\&|\Ø]/g }
			, { level: 6, regex: /\s@/g }
		]
		var oUpdated = {};

		for (let i = 0; i < PRECEDENCE.length; ++i) {
			let match;
			let aMatches = [];
			while(match = PRECEDENCE[i].regex.exec(sAutoParen)) {
				aMatches.push(match.index);
			}
			for (let j = 0; j < aMatches.length; ++j) {
				if (this._requireAutoParen(sAutoParen, aMatches[j])) {
					oUpdated = this._autoParenAt(sAutoParen, aMatches[j]);
					sAutoParen = oUpdated.autoParen;
					//update remaining matched positions to reflect the changes to paren string.
					for (let k = j+1; k < aMatches.length; ++k) {
						if (oUpdated.left === -1) {
							break;
						} else if (oUpdated.left <= aMatches[k] && aMatches[k] <= oUpdated.right) {
							aMatches[k]++;
						} else {
							aMatches[k] += 2;
						}
					}
				}
			}
			if (this.DEBUG) console.log(new Date(), "JSXPathParser:_autoParenthesis:level " + PRECEDENCE[i].level + ": " + PRECEDENCE[i].regex, sAutoParen);
		}
		return sAutoParen;
	}

	_requireAutoParen(psInput, pnIndex) {
		let leftSub, rightSub;
		let leftSpaceIndex = this.Utils.lastIndexOfString(psInput, [" "], pnIndex - 1);
		let rightSpaceIndex = this.Utils.nextIndexOfString(psInput, [" "], pnIndex + 2);

		leftSpaceIndex = leftSpaceIndex === -1 ? 0 : leftSpaceIndex;
		leftSub = psInput.substring(leftSpaceIndex, pnIndex);
		rightSpaceIndex = rightSpaceIndex === -1 ? psInput.length : rightSpaceIndex;
		rightSub = psInput.substring(pnIndex, rightSpaceIndex);

		return !(leftSub.indexOf("(") > -1 && rightSub.indexOf(")") > -1);
	}

	_autoParenAt(psInput, pnIndex) {
		let sAutoParened = psInput;
		let nLeftScope = psInput[pnIndex+1] === '@' ? pnIndex : this._findInsertPosition("left", sAutoParened, pnIndex);
		let nRightScope = this._findInsertPosition("right", sAutoParened, pnIndex);

		nLeftScope = nLeftScope === 0 ? 0 : nLeftScope + 1;
		sAutoParened = (sAutoParened.substring(0, nLeftScope) + "(" +  sAutoParened.substring(nLeftScope, nRightScope) + ")" + sAutoParened.substring(nRightScope, sAutoParened.length)).trim();
		
		return {
			autoParen: sAutoParened,
			left: nLeftScope,
			right: nRightScope
		}		
	}

	_findInsertPosition(psDirection, psInput, pnIndex) {
		let oCounts = {
			parenCount: 0,
			brackCount: 0,
			root: 0,
			run: {
				"]": (self) => --self.brackCount,
				")": (self) => --self.parenCount,
				"[": (self) => ++self.brackCount,
				"(": (self) => ++self.parenCount,
				"@": (self) => ++self.root
			}
		}

		return (psDirection === "left") ? 
		this._handleLeftHandScope(psInput, pnIndex, oCounts) : 
		this._handleRightHandScope(psInput, pnIndex, oCounts);
	}

	_handleLeftHandScope(psInput, pnIndex, poCounts) {
		let nInsertsAt = -1;
		let nPointer = pnIndex;

		for (let i = pnIndex; i >= 0; --i) {
			if ((psInput[i] === "(" && poCounts.parenCount === 0) ||
				(psInput[i] === "[" && poCounts.brackCount === 0) || 
				(psInput[i] === " " && i < pnIndex - 1 && poCounts.brackCount === 0 && poCounts.parenCount === 0)) {
				
				nPointer = i;
				nInsertsAt = nPointer;
				break;
			} else if (poCounts.run[psInput[i]]) {
				nPointer =  i;
				poCounts.run[psInput[i]](poCounts);
				if (poCounts.parenCount === poCounts.brackCount && poCounts.parenCount === 0) {
					let sSub, nSubParen, nSubBrack;
					let nSpace = this.Utils.lastIndexOfString(psInput, [" "], nPointer);
					
					nSpace = nSpace === -1 ? 0 : nSpace;
					sSub = psInput.substring(nSpace, nPointer);
					nSubParen = sSub.lastIndexOf("(");
					nSubBrack = sSub.lastIndexOf("[");
					
					if (nSubParen === -1 && nSubBrack === -1) {
						nPointer = nSpace;
					} else if (nSubParen >= nSubBrack) {
						nPointer = nSpace + nSubParen;
					} else {
						nPointer = nSpace + nSubBrack;
					}
					nInsertsAt = nPointer;
					break;
				}
			}
		}

		if (nPointer === pnIndex) {
			nInsertsAt = this.Utils.lastIndexOfString(psInput, [" "], nPointer-1);
			return nInsertsAt === -1 ? 0 : nInsertsAt;
		}

		return nInsertsAt;
	}

	_handleRightHandScope(psInput, pnIndex, poCounts) {
		let nInsertsAt = -1;
		let nPointer = pnIndex;

		for (let i = pnIndex; i < psInput.length; ++i) {
			if ((psInput[i] === ")" && poCounts.parenCount === 0) || 
				(psInput[i] === "]" && poCounts.brackCount === 0) ||
				(psInput[i] === " " && i > pnIndex + 1 && poCounts.brackCount === 0 && poCounts.parenCount === 0)) {
				
				nPointer = i;
				nInsertsAt = nPointer;
				break;
			} else if (poCounts.run[psInput[i]]) {
				nPointer =  i;
				poCounts.run[psInput[i]](poCounts);
				if (poCounts.parenCount === poCounts.brackCount && poCounts.parenCount === 0 && poCounts.root === 0) {
					let sSub, nSubParen, nSubBrack;
					let nSpace = this.Utils.nextIndexOfString(psInput, [" "], nPointer);
					sSub = psInput.substring(nPointer, nSpace);
					nSubParen = sSub.indexOf(")");
					nSubBrack = sSub.indexOf("]");

					if (nSpace === -1) {
						// nPointer = psInput.length;
					} else if (nSubParen === nSubBrack && nSubParen === -1) {
						nPointer = nSpace;
					} else if (nSubParen <= nSubBrack) {
						nPointer += ++nSubParen;
					} else {
						nPointer += ++nSubBrack;
					}
					nInsertsAt = nPointer;
					break;
				}
			}
		}

		if (nPointer === pnIndex) {
			nInsertsAt = this.Utils.nextIndexOfString(psInput, [" "], nPointer+2);
			return nInsertsAt === -1 ? psInput.length : nInsertsAt;
		}

		return nInsertsAt === -1 ? psInput.length : nInsertsAt;
	}


	_transform(psPath) {
		let aParsed = [];
		let prevIndex = null;
		for (let i = 0; i < psPath.length; ++i) {
			if (this.ParseTokens.tokens.hasOwnProperty(psPath[i])) {
				aParsed = this.ParseTokens.tokens[psPath[i]].apply(this, [aParsed, psPath, i, prevIndex]);
				prevIndex = i;
			} else if (i === psPath.length - 1) {
				aParsed = this.ParseTokens.splitToken(aParsed, psPath, i, prevIndex);
			}
		}
		return aParsed;
	}

	_postParsedProcessing(paParse) {
		let nBeg = null;
		let aRange = [];
		let self = this;

		for (let i = 0; i < paParse.length; ++i) {
			let e = paParse[i];
			if (Array.isArray(e)) {
				paParse[i] = self._postParsedProcessing(e);
			} else if ("," === e) {
				if (nBeg === null)
					nBeg = i-1;
				if ( (i+2) > paParse.length - 1 || Object.keys(this.OperatorTokens.tokens).concat([","]).indexOf(paParse[i+2]) === -1 ) {
					aRange.push({ b: nBeg, e: i+1 });
					nBeg = null;
				}
			}
		}

		//if an argument consists of operator, group it into an array.
		//eg [a, ',', b, +, c, ',', d ] => [',', a, [b, +, c], d]
		while (aRange.length > 0) {
			let range = aRange.pop();
			let aSplice = paParse.splice(range.b, range.e - range.b+1);
			let aArgs = [","];
			let group = [];
			let bNewArg = true;
			while (aSplice.length > 0) {
				let e = aSplice.shift();
				if ("," === e) {
					bNewArg = true; 
				} else {
					if (bNewArg) {
						aArgs.push(e); 	
					} else {
						let lastArg = aArgs[aArgs.length-1];
						if (Array.isArray(lastArg)) {
							lastArg.push(e);
						} else {
							aArgs[aArgs.length-1] = [lastArg, e];
						}
					}
					bNewArg = false;
				}
			}
			paParse.splice(range.b, 0 , aArgs);
		}

		return paParse;
	}
}

module.exports = JSXPathParser;