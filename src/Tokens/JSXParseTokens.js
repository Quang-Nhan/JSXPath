var JSXDebugConfig = require("../JSXDebugConfig");
var JSXUtils = require("../Utils/JSXUtils");

class JSXParseTokens {
	/*
	 TODO: 
	 !groupings ()
	 !string tokens '<' instead of < look at splitToken functions.
	 */
	constructor(){
		var self = this;
		this.Utils = new JSXUtils();
		this.DEBUG = JSXDebugConfig.debugOn;
		this.SHOWPARSETOKENS  = JSXDebugConfig.showParseTokens;
		this.tokens = {
			/*
			 * "start()" => ["start("]
			 * "abc func(a" => ["abc", "func("]
			 */
			"(": function(paBracket, psPath, pnCIndex, pnPIndex) {
				let nPIndex = /*pnPIndex === 0 ||*/ pnPIndex === null ? pnPIndex = 0 : pnPIndex + 1;
				let nTokenIndex = self.Utils.lastIndexOfString(psPath, Object.keys(self.tokens).concat([" "]), pnCIndex);
				let sOpenParen = psPath.substring(nTokenIndex + 1, pnCIndex + 1); //returns the function name eg sum( from "ab sum("
				let sExpression = nPIndex < nTokenIndex ? psPath.substring(nPIndex, nTokenIndex) : null; //returns "ab"

				if (sExpression) paBracket.push(sExpression.trim());
				paBracket.push(sOpenParen.trim());

				if (self.DEBUG && self.SHOWPARSETOKENS) console.log(new Date(), "JSXParseTokens: (", "parsed:", JSON.stringify(paBracket));
				return paBracket;
			},
			/*
			 * ["start(", "something"], "start(something)" => [[" something", "start("]]
			 * "1 + (2 * 8)" => [1, +, [2, * , 8]]
			 */
			")": function(paBracket, psPath, pnCIndex, pnPIndex) {
				var sCurrentString = psPath.substring(pnPIndex + 1, pnCIndex).trim();
				var aFunction = [];
				var nOpenParen = self.lastIndexOf(paBracket, ["("]);
				if (nOpenParen === -1)
					throw Error("Invalid path expression. Expecting to have a pair of '(' and ')'.");
				if (nOpenParen !== paBracket.length - 1)
					aFunction = paBracket.splice(nOpenParen + 1, paBracket.length - nOpenParen + 1);
				if (sCurrentString !== "")
					aFunction.push(sCurrentString);
				
				let sOpenParen = paBracket.pop();
				//only push if function i.e "sum("
				if (sOpenParen !== "(") { 
					aFunction.push(sOpenParen);
				}
				paBracket.push(aFunction);

				if (self.DEBUG && self.SHOWPARSETOKENS) console.log(new Date(), "JSXParseTokens: )", "parsed:", JSON.stringify(paBracket));
				return paBracket;
			},
			/*
			 * 
			 */
			"[": function(paBracket, psPath, pnCIndex, pnPIndex) {
				var nTokenIndex = self.Utils.lastIndexOfString(psPath, [" ", "[", "(", ")", "]"], pnCIndex);
				var sPrePredicate = psPath.substring(nTokenIndex + 1, pnCIndex);
				if (sPrePredicate !== "")
					paBracket.push(sPrePredicate);
				paBracket.push("[");

				if (self.DEBUG && self.SHOWPARSETOKENS) console.log(new Date(), "JSXParseTokens: [", "parsed:", JSON.stringify(paBracket));
				return paBracket;
			  }
			, 
			"]": function(paBracket, psPath, pnCIndex, pnPIndex) {
				//find '['
				var sCurrentString = psPath.substring(pnPIndex + 1, pnCIndex).trim();
				var aPredicate = [];
				var nOpenPredicate = self.lastIndexOf(paBracket, ["["]);

				if (nOpenPredicate === -1)
					throw Error("Invalid path expression. Expecting to have a pair of '[' and ']'.");
				// if (nOpenPredicate !== paBracket.length - 1)
					aPredicate = paBracket.splice(nOpenPredicate, paBracket.length - nOpenPredicate + 1);
				if (sCurrentString !== "")
					aPredicate.push(sCurrentString);
				paBracket.push(aPredicate);

				if (self.DEBUG && self.SHOWPARSETOKENS) console.log(new Date(), "JSXParseTokens: ]", "parsed:", JSON.stringify(paBracket));
				return paBracket;
			  }
			, "~": (paBracket, psPath, pnCIndex, pnPIndex, paAvoids) => { //multiply to differentiate from * (any)
				paAvoids = paAvoids || Object.keys(self.tokens);
				return this.splitToken(paBracket, psPath, pnCIndex, pnPIndex, paAvoids);
			  }
			, "+": (paBracket, psPath, pnCIndex, pnPIndex, paAvoids) => {
				paAvoids = paAvoids || Object.keys(self.tokens);
				return this.splitToken(paBracket, psPath, pnCIndex, pnPIndex, paAvoids);
			  }
			, "¬": (paBracket, psPath, pnCIndex, pnPIndex, paAvoids) => { //minus alt+l
				paAvoids = paAvoids || Object.keys(self.tokens);
				return this.splitToken(paBracket, psPath, pnCIndex, pnPIndex, paAvoids);
			  }
			, "÷": (paBracket, psPath, pnCIndex, pnPIndex, paAvoids) => {//div (sh+op+1)
				paAvoids = paAvoids || Object.keys(self.tokens);
				return this.splitToken(paBracket, psPath, pnCIndex, pnPIndex, paAvoids);
			  }
			, ",": (paBracket, psPath, pnCIndex, pnPIndex, paAvoids) => {
				paAvoids = paAvoids || Object.keys(self.tokens);
				return this.splitToken(paBracket, psPath, pnCIndex, pnPIndex, paAvoids);
			  }
			, "=": (paBracket, psPath, pnCIndex, pnPIndex, paAvoids) => {
				paAvoids = paAvoids || Object.keys(self.tokens);
				return this.splitToken(paBracket, psPath, pnCIndex, pnPIndex, paAvoids);
			  }
			, "≠": (paBracket, psPath, pnCIndex, pnPIndex, paAvoids) => {
				paAvoids = paAvoids || Object.keys(self.tokens); 
				return this.splitToken(paBracket, psPath, pnCIndex, pnPIndex, paAvoids);
			  } //not equal to != (sh+opt+7)
			, ">": (paBracket, psPath, pnCIndex, pnPIndex, paAvoids) => {
				paAvoids = paAvoids || Object.keys(self.tokens);
				return this.splitToken(paBracket, psPath, pnCIndex, pnPIndex, paAvoids);
			  }
			, "<": (paBracket, psPath, pnCIndex, pnPIndex, paAvoids) => {
				paAvoids = paAvoids || Object.keys(self.tokens);
				return this.splitToken(paBracket, psPath, pnCIndex, pnPIndex, paAvoids);
			  }
			, "!": (paBracket, psPath, pnCIndex, pnPIndex, paAvoids) => {
				paAvoids = paAvoids || Object.keys(self.tokens);
				return this.splitToken(paBracket, psPath, pnCIndex, pnPIndex, paAvoids);
			  }
			, "|": (paBracket, psPath, pnCIndex, pnPIndex, paAvoids) => {
				paAvoids = paAvoids || Object.keys(self.tokens);
				return this.splitToken(paBracket, psPath, pnCIndex, pnPIndex, paAvoids);
			  }
			, "%": (paBracket, psPath, pnCIndex, pnPIndex, paAvoids) => {
				paAvoids = paAvoids || Object.keys(self.tokens);
				return this.splitToken(paBracket, psPath, pnCIndex, pnPIndex, paAvoids);
			  }
			, "&": (paBracket, psPath, pnCIndex, pnPIndex, paAvoids) => { // and
				paAvoids = paAvoids || Object.keys(self.tokens);
				return this.splitToken(paBracket, psPath, pnCIndex, pnPIndex, paAvoids);
			  }
			, "Ø": (paBracket, psPath, pnCIndex, pnPIndex, paAvoids) => { // or (Çsh+op+o)`
				paAvoids = paAvoids || Object.keys(self.tokens);
				return this.splitToken(paBracket, psPath, pnCIndex, pnPIndex, paAvoids);
			  }
			, "≤": (paBracket, psPath, pnCIndex, pnPIndex, paAvoids) => { //less than and equal to (sh+op+3)
				paAvoids = paAvoids || Object.keys(self.tokens);
				return this.splitToken(paBracket, psPath, pnCIndex, pnPIndex, paAvoids);
			  }
			, "≥": (paBracket, psPath, pnCIndex, pnPIndex, paAvoids) => { //greater and equal to (sh+op+4)
				paAvoids = paAvoids || Object.keys(self.tokens);
				return this.splitToken(paBracket, psPath, pnCIndex, pnPIndex, paAvoids);
			  }
			, "&": (paBracket, psPath, pnCIndex, pnPIndex, paAvoids) => {
				paAvoids = paAvoids || Object.keys(self.tokens);
				return this.splitToken(paBracket, psPath, pnCIndex, pnPIndex, paAvoids);
			  }
			, "Ø": (paBracket, psPath, pnCIndex, pnPIndex, paAvoids) => {
				paAvoids = paAvoids || Object.keys(self.tokens);
				return this.splitToken(paBracket, psPath, pnCIndex, pnPIndex, paAvoids);
			  }
		};
	}

	splitToken(paBracket, psPath, pnCIndex, pnPIndex, paAvoids) {
		var aTokens = paAvoids && paAvoids || Object.keys(this.tokens) ;
		var nTokenIndex = this.Utils.lastIndexOfString(psPath, aTokens, pnCIndex);
		var sSub = psPath.substring(nTokenIndex+1, pnCIndex).trim();
		var sExpression = pnPIndex < nTokenIndex ? psPath.substring(pnPIndex + 1, nTokenIndex).trim() : null;
		var sCurrentToken = psPath[pnCIndex].trim();

		if (sExpression && sExpression !== "")
			paBracket.push(sExpression);
		if (pnCIndex === psPath.length - 1) {
			paBracket.push(sSub+sCurrentToken);
		} else {
			if (sSub !== "")
				paBracket.push(sSub);
			if (sCurrentToken !== "")
				paBracket.push(sCurrentToken);
		}
		return paBracket;
	}

	lastIndexOf(paValues, paAvoid) {
		let nIndex = -1;
		for (let i = paValues.length; i >= 0; --i) {
			if ("string" === typeof paValues[i]) {
				if (this.Utils.lastIndexOfString(paValues[i], paAvoid, paValues[i].length) > -1) {
					nIndex = i;
					break;
				}
			}
		}
		return nIndex;
	}
}

module.exports = JSXParseTokens;