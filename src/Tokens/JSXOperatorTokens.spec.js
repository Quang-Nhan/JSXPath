var JSXOperatorTokens = require("./JSXOperatorTokens");

describe("JSXOperatorTokens", () => {
	var opTokens = new JSXOperatorTokens();

	describe("Tokens", () => {
		describe("+", () => {
			it("should return 3 if prev value = 1 and next value = 2", () => {
				const prev = 1;
				const next = 2;
				const result = opTokens.tokens["+"](prev)(next);
				expect(result).toBe(3);
			});

			it("should return shoe19 if prev node string value = shoe and next string value is 19", () => {
				const prev = {value: "shoe"};
				const next = 19;
				const result = opTokens.tokens["+"](prev)(next);
				expect(result).toBe("shoe19");
			});

			it("should throw error if prev input is null.", () => {
				const prev = null;
				const next = 1;
				const result = () => opTokens.tokens["+"](prev)(next);
				expect(result).toThrow();
			});

			it("should throw error if next input is null.", () => {
				const prev = 1;
				const next = null;
				const result = () => opTokens.tokens["+"](prev)(next);
				expect(result).toThrow();
			});
		});

		describe("¬", () => {
			it("should return 31 from prev = 10 and next = -21", () => {
				const prev = 10;
				const next = -21;
				const result = opTokens.tokens["¬"](prev)(next);
				expect(result).toBe(31);
			});

			it("should throw error if prev input is a string.", () => {
				const prev = "0";
				const next = 2;
				const result = () => opTokens.tokens["¬"](prev)(next);
				expect(result).toThrow();
			});

			it("should throw error if prev input is null.", () => {
				const prev = null;
				const next = 2;
				const result = () => opTokens.tokens["¬"](prev)(next);
				expect(result).toThrow();
			});
		});

		describe("%", () => {
			it("should return 1 if prev input is 3 and next input is 2.", () => {
				const prev = 3;
				const next = 2;
				const result = opTokens.tokens["%"](prev)(next);
				expect(result).toBe(1);
			});

			it("should return 0 if prev and and next is equal to 2.", () => {
				const prev = 0;
				const next = 2;
				const result = opTokens.tokens["%"](prev)(next);
				expect(result).toBe(0);
			});

			it("should throw error if prev input is a string.", () => {
				const prev = "1";
				const next = 2;
				const result = () => opTokens.tokens["%"](prev)(next);
				expect(result).toThrow();
			});

			it("should throw error if prev is null.", () => {
				const prev = null;
				const next = 2;
				const result = () => opTokens.tokens["%"](prev)(next);
				expect(result).toThrow();
			});
		});

		describe("÷", () => {
			it("should return 0.5 if prev = 1 and next = 2", () => {
				const prev = 1;
				const next = 2;
				const result = opTokens.tokens["÷"](prev)(next);
				expect(result).toBe(0.5);
			});

			it("should return 0 if prev = 0 and next = 2", () => {
				const prev = 0;
				const next = 2;
				const result = opTokens.tokens["÷"](prev)(next);
				expect(result).toBe(0);
			});

			it("should throw error if prev value is a string.", () => {
				const prev = "string";
				const next = 2;
				const result = () => opTokens.tokens["÷"](prev)(next);
				expect(result).toThrow();
			});

			it("should throw error if prev value is null", () => {
				const prev = null;
				const next = 2;
				const result = () => opTokens.tokens["+"](prev)(next);
				expect(result).toThrow();
			});
		});

		//multiply
		describe("~", () => {
			it("should return 6 if prev = 2 and next = 3.", () => {
				const prev = 2;
				const next = 3;
				const result = opTokens.tokens["~"](prev)(next);
				expect(result).toBe(6);
			});

			it("should return -33 if prev node value = -3 and next = 11", () => {
				const prev = {value: -3};
				const next = 11;
				const result = opTokens.tokens["~"](prev)(next);
				expect(result).toBe(-33);
			});

			it("should return 0 if prev is 0.", () => {
				const prev = 0;
				const next = 3;
				const result = opTokens.tokens["~"](prev)(next);
				expect(result).toBe(0);
			});

			it("should throw an error if prev value is of type string.", () => {
				const prev = "2";
				const next = 3;
				const result = () => opTokens.tokens["~"](prev)(next);
				expect(result).toThrow();
			});

			it("should throw if prev value is null.", () => {
				const prev = null;
				const next = 3;
				const result = () => opTokens.tokens["~"](prev)(next);
				expect(result).toThrow();
			});
		});

		describe("=", () => {
			it("should return true if prev and next value is 'abc'.", () => {
				const prev = "abc";
				const next = "abc";
				const result = opTokens.tokens["="](prev)(next);
				expect(result).toBe(true);
			});

			it("should return false if the prev is node value of 11 and the next value is '11'.", () => {
				const prev = {value: 11};
				const next = "11";
				const result = opTokens.tokens["="](prev)(next);
				expect(result).toBe(false);
			});

			it("should return true if prev and next value is null", () => {
				const prev = null;
				const next = null;
				const result = opTokens.tokens["="](prev)(next);
				expect(result).toBe(true);
			});

			it("", () => {
				const prev = {}
			});

		});

		//not equal to
		describe("≠", () => {
			it("should return false if prev and next value is 'abc'.", () => {
				const prev = "abc";
				const next = "abc";
				const result = opTokens.tokens["≠"](prev)(next);
				expect(result).toBe(false);
			});

			it("should return true if the prev is node value of 11 and the next value is '11'.", () => {
				const prev = {value: 11};
				const next = "11";
				const result = opTokens.tokens["≠"](prev)(next);
				expect(result).toBe(true);
			});

			it("should return false if prev and next value is null", () => {
				const prev = null;
				const next = null;
				const result = opTokens.tokens["≠"](prev)(next);
				expect(result).toBe(false);
			});
		});

		describe(">", () => {
			it("should return true if prev = 15 and next = 14.", () => {
				const prev = 15;
				const next = 14;
				const result = opTokens.tokens[">"](prev)(next);
				expect(result).toBe(true);
			});

			it("should return false if prev and next is equal to 15.", () => {
				const prev = 15;
				const next = 15;
				const result = opTokens.tokens[">"](prev)(next);
				expect(result).toBe(false);
			});

			it("should throw error if prev is a string.", () => {
				const prev = "12";
				const next = 11;
				const result = () => opTokens.tokens[">"](prev)(next);
				expect(result).toThrow();
			});

			it("should throw error prev is null.", () => {
				const prev = null;
				const next = 11;
				const result = () => opTokens.tokens[">"](prev)(next);
				expect(result).toThrow();
			});
		});

		//greater than or equal to
		describe("≥", () => {
			it("should return true if prev = 15 and next = 14.", () => {
				const prev = 15;
				const next = 14;
				const result = opTokens.tokens["≥"](prev)(next);
				expect(result).toBe(true);
			});

			it("should return true if prev and next is equal to 15.", () => {
				const prev = 15;
				const next = 15;
				const result = opTokens.tokens["≥"](prev)(next);
				expect(result).toBe(true);
			});

			it("Should return false if prev = -1 and next = 1", () => {
				const prev = -1;
				const next = 1;
				const result = opTokens.tokens["≥"](prev)(next);
				expect(result).toBe(false);
			});

			it("should throw error if prev is a string.", () => {
				const prev = "12";
				const next = 11;
				const result = () => opTokens.tokens["≥"](prev)(next);
				expect(result).toThrow();
			});

			it("should throw error prev is null.", () => {
				const prev = null;
				const next = 11;
				const result = () => opTokens.tokens["≥"](prev)(next);
				expect(result).toThrow();
			});
		});

		describe("<", () => {
			it("should return false if prev = 15 and next = 14.", () => {
				const prev = 15;
				const next = 14;
				const result = opTokens.tokens["<"](prev)(next);
				expect(result).toBe(false);
			});

			it("should return false if prev and next is equal to 15.", () => {
				const prev = 15;
				const next = 15;
				const result = opTokens.tokens["<"](prev)(next);
				expect(result).toBe(false);
			});

			it("Should return true if prev = -1 and next = 1", () => {
				const prev = -1;
				const next = 1;
				const result = opTokens.tokens["<"](prev)(next);
				expect(result).toBe(true);
			});


			it("should throw error if prev is a string.", () => {
				const prev = "12";
				const next = 11;
				const result = () => opTokens.tokens["<"](prev)(next);
				expect(result).toThrow();
			});

			it("should throw error prev is null.", () => {
				const prev = null;
				const next = 11;
				const result = () => opTokens.tokens["<"](prev)(next);
				expect(result).toThrow();
			});
		});

		//less than or equal to
		describe("≤", () => {
			it("should return false if prev = 15 and next = 14.", () => {
				const prev = 15;
				const next = 14;
				const result = opTokens.tokens["≤"](prev)(next);
				expect(result).toBe(false);
			});

			it("should return true if prev and next is equal to 15.", () => {
				const prev = 15;
				const next = 15;
				const result = opTokens.tokens["≤"](prev)(next);
				expect(result).toBe(true);
			});

			it("Should return true if prev = -1 and next = 1", () => {
				const prev = -1;
				const next = 1;
				const result = opTokens.tokens["≤"](prev)(next);
				expect(result).toBe(true);
			});

			it("should throw error if prev is a string.", () => {
				const prev = "12";
				const next = 11;
				const result = () => opTokens.tokens["≤"](prev)(next);
				expect(result).toThrow();
			});

			it("should throw error prev is null.", () => {
				const prev = null;
				const next = 11;
				const result = () => opTokens.tokens["≤"](prev)(next);
				expect(result).toThrow();
			});
		});

		describe("&", () => {
			it("Should return false if prev = false and next = false.", () => {
				const prev = false;
				const next = false;
				const result = opTokens.tokens["&"](prev)(next);
				expect(result).toBe(false);
			});

			it("Should return false if prev = true and next = false.", () => {
				const prev = true;
				const next = false;
				const result = opTokens.tokens["&"](prev)(next);
				expect(result).toBe(false);
			});

			it("Should return the node A if prev is node A and next = 2.", () => {
				const prev = {
					name: "A",
					value: 12,
					parent: null,
					children: []
				};
				const next = 2;
				const result = opTokens.tokens["&"](prev)(next);
				expect(result).toBe(prev);
			});

			it("Should return an Array containing node A if prev is node A and next is true.", () => {
				const prev = [{
					name: "A",
					value: 12,
					parent: null,
					children: []
				}];
				const next = true;
				const result = opTokens.tokens["&"](prev)(next);
				expect(result).toBe(prev);
			});

			it("Should return true if prev and next is node A.", () => {
				const prev = {
					name: "A",
					value: 12,
					parent: {
						name: "@"
					},
					descendants: [],
					children: [],
					siblings: []
				};
				const next = {
					name: "A",
					value: 12,
					parent: {
						name: "@"
					},
					descendants: [],
					children: [],
					siblings: []
				};
				const result = opTokens.tokens["&"](prev)(next);
				expect(result).toBe(true);
			});

			it("Should return true if prev and next is from the same branch.", () => {
				const child = {
					name: "B",
					value: 12,
					parent: {
						name: "A"
					},
					descendants: [],
					children: [],
					siblings: [],
					depth: 2
				};
				const prev = {
					name: "A",
					value: {
						B: 12
					},
					parent: {
						name: "@"
					},
					descendants: [child],
					children: [child],
					siblings: [],
					depth: 1
				};
				const next = child;
				const result = opTokens.tokens["&"](prev)(next);
				expect(result).toBe(true);
			});
		});

		describe("Ø", () => {
			it("Should return false if prev = false and next = false", () => {
				const prev = false;
				const next = false;
				const result = opTokens.tokens["Ø"](prev)(next);
				expect(result).toBe(false);
			});
			
			it("Should return true if prev = false and next = true.", () => {
				const prev = false;
				const next = true;
				const result = opTokens.tokens["Ø"](prev)(next);
				expect(result).toBe(true);
			});
			
			it("Should return node A if prev is a node A even if next is false.", () => {
				const prev = {
					name: "A",
					value: 12,
					parent: null,
					children: []
				};
				const next = false;
				const result = opTokens.tokens["Ø"](prev)(next);
				expect(result).toBe(prev);
			});

			it("Should return a single node A when both prev and next is node A", () => {
				const prev = {
					name: "A",
					children: [],
					parent: {
						name: "@"
					},
					siblings: [],
					value: 12
				};
				const next = {
					name: "A",
					children: [],
					parent: {
						name: "@"
					},
					siblings: [],
					value: 12
				};
				const expected = {
					name: "A",
					children: [],
					parent: {
						name: "@"
					},
					siblings: [],
					value: 12
				};
			
				const result = opTokens.tokens["Ø"](prev)(next);
				expect(result).toEqual(expected);
			});

			it("Should return an array with only single node A when both prev and next is node A", () => {
				const prev = [{
					name: "A",
					children: [],
					parent: {
						name: "@"
					},
					siblings: [],
					value: 12
				}];
				const next = [{
					name: "A",
					children: [],
					parent: {
						name: "@"
					},
					siblings: [],
					value: 12
				}];
				const expected = [{
					name: "A",
					children: [],
					parent: {
						name: "@"
					},
					siblings: [],
					value: 12
				}];
			
				const result = opTokens.tokens["Ø"](prev)(next);
				expect(result).toEqual(expected);
			});

			it("Should return an array with node A and node B if prev is node A and next is node B.", () => {
				const prev = {
					name: "A",
					children: [],
					parent: {
						name: "C"
					},
					siblings: [],
					value: 12
				};
				const next = {
					name: "B",
					children: [],
					parent: {
						name: "K"
					},
					siblings: [],
					value: 14
				};
				const expected = [
					{
						name: "A",
						children: [],
						parent: {
							name: "C"
						},
						siblings: [],
						value: 12
					},
					{
						name: "B",
						children: [],
						parent: {
							name: "K"
						},
						siblings: [],
						value: 14
					}
				];
			
				const result = opTokens.tokens["Ø"](prev)(next);
				expect(result).toEqual(expected);
			});
		});

		//TODO:
		describe("|", () => {

		});
	});

	//TODO:
	describe("|", () => {

	});
});