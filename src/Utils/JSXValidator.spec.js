var JSXValidator = require("./JSXValidator");

describe("JSXValidator", () => {
	var validator;
	beforeEach(() => {
		validator = new JSXValidator();
	});

	describe("validateNumber()", () => {
		it("should return 1", () => {
			let result = validator.validateNumber(1, "function", true);
			expect(result).toBe(1);
		});

		it("should throw error if throwError is set true and incorrect source type.", () => {
			let result = () => validator.validateNumber("a", "function", true);
			expect(result).toThrow();
		});
	});

	describe("validateString", () => {
		it("should return 'a'", () => {
			let result = validator.validateString("a", "function", true);
			expect(result).toBe("a");
		});

		it("should throw error if throwError is set true and incorrect source type.", () => {
			let result = () => validator.validateString(1, "function", true);
			expect(result).toThrow();
		});
	});

	describe("valdiateBoolean", () => {
		it ("should return true.", () => {
			let result = validator.validateBoolean(true, "function", true);
			expect(result).toBe(true);
		});

		it("should return false.", () => {
			let result = validator.validateBoolean(false, "function", true);
			expect(result).toBe(false);
		});

		it("should return null if throwError is set to false and incorrect source type.", () => {
			let result = validator.validateBoolean("node", "function", false);
			expect(result).toBe(null);
		});

		it("should throw error if throwError is set true and incorrect source type.", () => {
			let result = () => validator.validateBoolean("data", "function", true);
			expect(result).toThrow();
		});
	});

	describe("validateNode", () => {
		it("should return the node if object contains all the JSXNode properties.", () => {
			let node = {name: "a", parent: "b", value: 12, children: []};
			let result = validator.validateNode(node, "function", true);
			expect(result).toBe(node);
		});

		it("should return null if object is missing a JSX node property.", () => {
			let node = {value: 12, parent: "a", name: "b"};
			let result = validator.validateNode({}, "function", false);
			expect(result).toBe(null);
		});

		it("should throw error if throwError is set to true and input type is invalid.", () => {
			let node = "node";
			let result = () => validator.validateNode(node, "function", true);
			expect(result).toThrow();
		});
	});

	describe("validateObject", () => {

	});

	describe("isArray", () => {

	});


})