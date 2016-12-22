var JSXOperatorTokens = require("./JSXOperatorTokens");

describe("JSXOperatorTokens", () => {
	var opTokens = new JSXOperatorTokens();

	describe("Tokens", () => {
		describe("+", () => {
			it("should return 3 if prev value = 1 and next value = 2", () => {
				let prev = 1;
				let next = 2;
				let result = opTokens.tokens["+"](prev)(next);
				expect(result).toBe(3);
			});

			it("should return shoe19 if prev node string value = shoe and next string value is 19", () => {
				let prev = {value: "shoe"};
				let next = 19;
				let result = opTokens.tokens["+"](prev)(next);
				expect(result).toBe("shoe19");
			});

			it("should throw error if prev input is null.", () => {
				let prev = null;
				let next = 1;
				let result = () => opTokens.tokens["+"](prev)(next);
				expect(result).toThrow();
			});

			it("should throw error if next input is null.", () => {
				let prev = 1;
				let next = null;
				let result = () => opTokens.tokens["+"](prev)(next);
				expect(result).toThrow();
			});
		});

		describe("¬", () => {
			it("should return 31 from prev = 10 and next = -21", () => {
				let prev = 10;
				let next = -21;
				let result = opTokens.tokens["¬"](prev)(next);
				expect(result).toBe(31);
			});

			it("should throw error if prev input is a string.", () => {
				let prev = "0";
				let next = 2;
				let result = () => opTokens.tokens["¬"](prev)(next);
				expect(result).toThrow();
			});

			it("should throw error if prev input is null.", () => {
				let prev = null;
				let next = 2;
				let result = () => opTokens.tokens["¬"](prev)(next);
				expect(result).toThrow();
			});
		});

		describe("%", () => {
			it("should return 1 if prev input is 3 and next input is 2.", () => {
				let prev = 3;
				let next = 2;
				let result = opTokens.tokens["%"](prev)(next);
				expect(result).toBe(1);
			});

			it("should return 0 if prev and and next is equal to 2.", () => {
				let prev = 0;
				let next = 2;
				let result = opTokens.tokens["%"](prev)(next);
				expect(result).toBe(0);
			});

			it("should throw error if prev input is a string.", () => {
				let prev = "1";
				let next = 2;
				let result = () => opTokens.tokens["%"](prev)(next);
				expect(result).toThrow();
			});

			it("should throw error if prev is null.", () => {
				let prev = null;
				let next = 2;
				let result = () => opTokens.tokens["%"](prev)(next);
				expect(result).toThrow();
			});
		});

		describe("÷", () => {
			it("should return 0.5 if prev = 1 and next = 2", () => {
				let prev = 1;
				let next = 2;
				let result = opTokens.tokens["÷"](prev)(next);
				expect(result).toBe(0.5);
			});

			it("should return 0 if prev = 0 and next = 2", () => {
				let prev = 0;
				let next = 2;
				let result = opTokens.tokens["÷"](prev)(next);
				expect(result).toBe(0);
			});

			it("should throw error if prev value is a string.", () => {
				let prev = "string";
				let next = 2;
				let result = () => opTokens.tokens["÷"](prev)(next);
				expect(result).toThrow();
			});

			it("should throw error if prev value is null", () => {
				let prev = null;
				let next = 2;
				let result = () => opTokens.tokens["+"](prev)(next);
				expect(result).toThrow();
			});
		});

		//multiply
		describe("~", () => {
			it("should return 6 if prev = 2 and next = 3.", () => {
				let prev = 2;
				let next = 3;
				let result = opTokens.tokens["~"](prev)(next);
				expect(result).toBe(6);
			});

			it("should return -33 if prev node value = -3 and next = 11", () => {
				let prev = {value: -3};
				let next = 11;
				let result = opTokens.tokens["~"](prev)(next);
				expect(result).toBe(-33);
			});

			it("should return 0 if prev is 0.", () => {
				let prev = 0;
				let next = 3;
				let result = opTokens.tokens["~"](prev)(next);
				expect(result).toBe(0);
			});

			it("should throw an error if prev value is of type string.", () => {
				let prev = "2";
				let next = 3;
				let result = () => opTokens.tokens["~"](prev)(next);
				expect(result).toThrow();
			});

			it("should throw if prev value is null.", () => {
				let prev = null;
				let next = 3;
				let result = () => opTokens.tokens["~"](prev)(next);
				expect(result).toThrow();
			});
		});

		describe("=", () => {
			it("should return true if prev and next value is 'abc'.", () => {
				let prev = "abc";
				let next = "abc";
				let result = opTokens.tokens["="](prev)(next);
				expect(result).toBe(true);
			});

			it("should return false if the prev is node value of 11 and the next value is '11'.", () => {
				let prev = {value: 11};
				let next = "11";
				let result = opTokens.tokens["="](prev)(next);
				expect(result).toBe(false);
			});

			it("should return true if prev and next value is null", () => {
				let prev = null;
				let next = null;
				let result = opTokens.tokens["="](prev)(next);
				expect(result).toBe(true);
			});

		});

		//not equal to
		describe("≠", () => {
			it("should return false if prev and next value is 'abc'.", () => {
				let prev = "abc";
				let next = "abc";
				let result = opTokens.tokens["≠"](prev)(next);
				expect(result).toBe(false);
			});

			it("should return true if the prev is node value of 11 and the next value is '11'.", () => {
				let prev = {value: 11};
				let next = "11";
				let result = opTokens.tokens["≠"](prev)(next);
				expect(result).toBe(true);
			});

			it("should return false if prev and next value is null", () => {
				let prev = null;
				let next = null;
				let result = opTokens.tokens["≠"](prev)(next);
				expect(result).toBe(false);
			});
		});

		describe(">", () => {
			it("should return true if prev = 15 and next = 14.", () => {
				let prev = 15;
				let next = 14;
				let result = opTokens.tokens[">"](prev)(next);
				expect(result).toBe(true);
			});

			it("should return false if prev and next is equal to 15.", () => {
				let prev = 15;
				let next = 15;
				let result = opTokens.tokens[">"](prev)(next);
				expect(result).toBe(false);
			});

			it("should throw error if prev is a string.", () => {
				let prev = "12";
				let next = 11;
				let result = () => opTokens.tokens[">"](prev)(next);
				expect(result).toThrow();
			});

			it("should throw error prev is null.", () => {
				let prev = null;
				let next = 11;
				let result = () => opTokens.tokens[">"](prev)(next);
				expect(result).toThrow();
			});
		});

		//greater than or equal to
		describe("≥", () => {
			it("should return true if prev = 15 and next = 14.", () => {
				let prev = 15;
				let next = 14;
				let result = opTokens.tokens["≥"](prev)(next);
				expect(result).toBe(true);
			});

			it("should return true if prev and next is equal to 15.", () => {
				let prev = 15;
				let next = 15;
				let result = opTokens.tokens["≥"](prev)(next);
				expect(result).toBe(true);
			});

			it("Should return false if prev = -1 and next = 1", () => {
				let prev = -1;
				let next = 1;
				let result = opTokens.tokens["≥"](prev)(next);
				expect(result).toBe(false);
			});

			it("should throw error if prev is a string.", () => {
				let prev = "12";
				let next = 11;
				let result = () => opTokens.tokens["≥"](prev)(next);
				expect(result).toThrow();
			});

			it("should throw error prev is null.", () => {
				let prev = null;
				let next = 11;
				let result = () => opTokens.tokens["≥"](prev)(next);
				expect(result).toThrow();
			});
		});

		describe("<", () => {
			it("should return false if prev = 15 and next = 14.", () => {
				let prev = 15;
				let next = 14;
				let result = opTokens.tokens["<"](prev)(next);
				expect(result).toBe(false);
			});

			it("should return false if prev and next is equal to 15.", () => {
				let prev = 15;
				let next = 15;
				let result = opTokens.tokens["<"](prev)(next);
				expect(result).toBe(false);
			});

			it("Should return true if prev = -1 and next = 1", () => {
				let prev = -1;
				let next = 1;
				let result = opTokens.tokens["<"](prev)(next);
				expect(result).toBe(true);
			});


			it("should throw error if prev is a string.", () => {
				let prev = "12";
				let next = 11;
				let result = () => opTokens.tokens["<"](prev)(next);
				expect(result).toThrow();
			});

			it("should throw error prev is null.", () => {
				let prev = null;
				let next = 11;
				let result = () => opTokens.tokens["<"](prev)(next);
				expect(result).toThrow();
			});
		});

		//less than or equal to
		describe("≤", () => {
			it("should return false if prev = 15 and next = 14.", () => {
				let prev = 15;
				let next = 14;
				let result = opTokens.tokens["≤"](prev)(next);
				expect(result).toBe(false);
			});

			it("should return true if prev and next is equal to 15.", () => {
				let prev = 15;
				let next = 15;
				let result = opTokens.tokens["≤"](prev)(next);
				expect(result).toBe(true);
			});

			it("Should return true if prev = -1 and next = 1", () => {
				let prev = -1;
				let next = 1;
				let result = opTokens.tokens["≤"](prev)(next);
				expect(result).toBe(true);
			});

			it("should throw error if prev is a string.", () => {
				let prev = "12";
				let next = 11;
				let result = () => opTokens.tokens["≤"](prev)(next);
				expect(result).toThrow();
			});

			it("should throw error prev is null.", () => {
				let prev = null;
				let next = 11;
				let result = () => opTokens.tokens["≤"](prev)(next);
				expect(result).toThrow();
			});
		});

		//TODO:
		describe("&", () => {

		});

		//TODO:
		describe("Ø", () => {

		});

		//TODO:
		describe("|", () => {

		});
	});

	//TODO:
	describe("|", () => {

	});
});