class JSXError {
	constructor() {
		this.tokens = {
			"jsx000" : (args) => args.name + " is an unrecognisable element. Thrown in " + args.at + "."
			, "jsx001": (args) => args.name + " is not defined. Thrown in " + args.at + "." 
			, "jsx002": (args) => args.name + " was expecting " + args.expectedType + " type, instead received type " + args.type + ". Thrown at " + args.at + "."
			, "jsx003": (args) => args.name + " is type: " + args.type + ". Expected type '" + args.expectedType + "'. Thrown in " + args.at + "."
			, "jsx004": (args) => args.name + " is not a valid JSX Node. A JSXNode must contain {name, children, parent and value} properties. Thrown in " + args.at + "." 
			, "jsx005": (args) => args.name + " contains invalid number of arguments. Thrown at " + args.at + "."
			, "jsx006": (args) => args.name + " was expecting an array. Thrown in " + args.at + "."
			, "jsx007": (args) => args.name + " was expecting an arry of type: " + args.expectedType + "." + " Thrown at " + args.at + "."
			, "jsx008": (args) => args.data + " is not a valid JSON." + ". Thrown at " + args.at + "."
			, "jsx009": (args) => "Position index of " + args.pos + " cannot be" + (args.key === ">" ? " greater than " : " less than ") + args.length + ". Thrown at " + arg.at + "."
		}
	}

	test(psName, poArgs) {
		switch(psName) {
			case "Defined":
				this.testDefined(poArgs);
			case "ValidType":
				this.testType(poArgs);
				break;
			case "DefinedAndValidType":
				this.testDefined(poArgs);
				this.testType(poArgs);
				break;
			case "Length": 
				this.testExpectedLength();
				break;
			case "JSON":
				this.testJSON(poArgs);
				break;
			case "ArgumentLength":
				this.testNumberOfArguments(poArgs);
				break;
			default: 
				console.log("Unsupported Error test case.");
		}
	}

	throw(psCode, poArgs) {
		throw new Error(this.tokens[psCode](poArgs));
	}

	testDefined(poArgs) {
		if (!poArgs.data) throw new Error(this.tokens["jsx001"](poArgs));
	}

	/**
	 * Test the param is of a valid type. throw type jsx002 or jsx003 error if not valid.
	 * @param  {object} poArgs {param, name, type, expectedType, at}
	 */
	testType(poArgs) {
		//assumed poArgs.param exists
		if (poArgs.data && poArgs.expectedType === "null" && poArgs.type === "object" && poArgs.data)  {
			// throw new Error("TEST")
			throw new Error(this.tokens["jsx002"](poArgs))
		}
		if (poArgs.data && poArgs.type !== poArgs.expectedType) 
			throw new Error(this.tokens["jsx003"](poArgs));
	}

	testExpectedLength(poArgs) {
		if (Array.isArray(poArgs)) {}
	}

	testJSON(poArgs) {
		if (poArgs.data) {
			try {
				JSON.parse(poArgs.data);
			} catch(e) {
				throw new Error(this.tokens["jsx008"](poArgs));
			}
		}
	}

	testNumberOfArguments(poArgs) {
		if (poArgs.data) {
			throw new Error(this.tokens["jsx005"](poArgs))
		}
	}
}

module.exports = JSXError;