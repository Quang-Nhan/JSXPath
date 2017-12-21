var JSXParseTokens = require("./JSXParseTokens");

xdescribe("JSXParseTokens", () => {
	var parseTokens;
	beforeEach(() => {
		parseTokens = new JSXParseTokens();
	});

	describe("this.tokens", () => {

		describe("(", () => {
			it("1", () => {
				let path = "( 1 )"
				let bracket = [];
				let currentIndex = 0;
				let prevIndex = 0;
				let expected = ["("];
				let result = parseTokens.tokens["("](bracket, path, currentIndex, prevIndex);
				expect(result).toEqual(expected);
			});
		});

		describe(")", () => {
			it("1", () => {
				let path = "( 1 )"
				let bracket = [];
				let currentIndex = 0;
				let prevIndex = 0;
				let expected = ["("];
				let result = parseTokens.tokens["("](bracket, path, currentIndex, prevIndex);
				expect(result).toEqual(expected);
			});
		});

		describe("[", () => {
			it("1", () => {
				let path = "@/a[b]";
				let bracket = [];
				let currentIndex = 3;
				let prevIndex = 0;
				let expected = ["@/a", "["];
				let result = parseTokens.tokens["["](bracket, path, currentIndex, prevIndex);
				expect(result).toEqual(expected);
			});
		});

		describe("]", () => {
			it("1", () => {
				let path = "@/a[b]";
				let bracket = ["@/a", "["];
				let currentIndex = 5;
				let prevIndex = 3;
				let expected = ["@/a", ["[", "b"]];
				let result = parseTokens.tokens["]"](bracket, path, currentIndex, prevIndex);
				expect(result).toEqual(expected);
			});
		});

		describe("~", () => {
			it("1", () => {
				let path = "a ~ b";
				let bracket = [];
				let currentIndex = 2;
				let prevIndex = 0;
				let expected = ["a", "~"];
				let result = parseTokens.tokens["~"](bracket, path, currentIndex, prevIndex);
				expect(result).toEqual(expected);
			});
		});

		describe("+", () => {
			it("1", () => {
				let path = "a + b";
				let bracket = [];
				let currentIndex = 2;
				let prevIndex = 0;
				let expected = ["a", "+"];
				let result = parseTokens.tokens["+"](bracket, path, currentIndex, prevIndex);
				expect(result).toEqual(expected);
			});

		});

		describe("¬", () => {
			it("1", () => {
				let path = "a ¬ b";
				let bracket = [];
				let currentIndex = 2;
				let prevIndex = 0;
				let expected = ["a", "¬"];
				let result = parseTokens.tokens["¬"](bracket, path, currentIndex, prevIndex);
				expect(result).toEqual(expected);
			});
			
		});

		describe("÷", () => {
			it("1", () => {
				let path = "a + b";
				let bracket = [];
				let currentIndex = 2;
				let prevIndex = 0;
				let expected = ["a", "+"];
				let result = parseTokens.tokens["+"](bracket, path, currentIndex, prevIndex);
				expect(result).toEqual(expected);
			});

		});

		describe(",", () => {

		});

		describe("=", () => {
			it("1", () => {
				let path = "a = b";
				let bracket = [];
				let currentIndex = 2;
				let prevIndex = 0;
				let expected = ["a", "="];
				let result = parseTokens.tokens["="](bracket, path, currentIndex, prevIndex);
				expect(result).toEqual(expected);
			});

		});

		describe("≠", () => {
			it("1", () => {
				let path = "a ≠ b";
				let bracket = [];
				let currentIndex = 2;
				let prevIndex = 0;
				let expected = ["a", "≠"];
				let result = parseTokens.tokens["≠"](bracket, path, currentIndex, prevIndex);
				expect(result).toEqual(expected);
			});

		}); 

		describe(">", () => {
			it("1", () => {
				let path = "a > b";
				let bracket = [];
				let currentIndex = 2;
				let prevIndex = 0;
				let expected = ["a", ">"];
				let result = parseTokens.tokens[">"](bracket, path, currentIndex, prevIndex);
				expect(result).toEqual(expected);
			});

		});

		describe("<", () => {
			it("1", () => {
				let path = "a < b";
				let bracket = [];
				let currentIndex = 2;
				let prevIndex = 0;
				let expected = ["a", "<"];
				let result = parseTokens.tokens["<"](bracket, path, currentIndex, prevIndex);
				expect(result).toEqual(expected);
			});

		});

		describe("≤", () => {
			it("1", () => {
				let path = "a ≤ b";
				let bracket = [];
				let currentIndex = 2;
				let prevIndex = 0;
				let expected = ["a", "≤"];
				let result = parseTokens.tokens["≤"](bracket, path, currentIndex, prevIndex);
				expect(result).toEqual(expected);
			});

		});

		describe("≥", () => {
			it("1", () => {
				let path = "a ≥ b";
				let bracket = [];
				let currentIndex = 2;
				let prevIndex = 0;
				let expected = ["a", "≥"];
				let result = parseTokens.tokens["≥"](bracket, path, currentIndex, prevIndex);
				expect(result).toEqual(expected);
			});

		});

		describe("!", () => {
			it("1", () => {
				let path = "a ! b";
				let bracket = [];
				let currentIndex = 2;
				let prevIndex = 0;
				let expected = ["a", "!"];
				let result = parseTokens.tokens["!"](bracket, path, currentIndex, prevIndex);
				expect(result).toEqual(expected);
			});

		});

		describe("|", () => {
			it("1", () => {
				let path = "a | b";
				let bracket = [];
				let currentIndex = 2;
				let prevIndex = 0;
				let expected = ["a", "|"];
				let result = parseTokens.tokens["|"](bracket, path, currentIndex, prevIndex);
				expect(result).toEqual(expected);
			});

		});

		describe("%", () => {
			it("1", () => {
				let path = "a % b";
				let bracket = [];
				let currentIndex = 2;
				let prevIndex = 0;
				let expected = ["a", "%"];
				let result = parseTokens.tokens["%"](bracket, path, currentIndex, prevIndex);
				expect(result).toEqual(expected);
			});

		});

		describe("&", () => {
			it("1", () => {
				let path = "a & b";
				let bracket = [];
				let currentIndex = 2;
				let prevIndex = 0;
				let expected = ["a", "&"];
				let result = parseTokens.tokens["&"](bracket, path, currentIndex, prevIndex);
				expect(result).toEqual(expected);
			});

		});

		describe("Ø", () => {
			it("1", () => {
				let path = "a Ø b";
				let bracket = [];
				let currentIndex = 2;
				let prevIndex = 0;
				let expected = ["a", "Ø"];
				let result = parseTokens.tokens["Ø"](bracket, path, currentIndex, prevIndex);
				expect(result).toEqual(expected);
			});

		});
	});

	describe("1 ¬ -1", () =>{
		let path = "(1 ¬ -1)";

		it("1", () => {
			let bracket = [];
			let currentIndex = 0;
			let prevIndex = 0;
			let expected = ["("];
			let result = parseTokens.tokens["("](bracket, path, currentIndex, prevIndex);
			expect(result).toEqual(expected);
		});

		it("2", () => {
			let bracket = ["("];
			let currentIndex = 3;
			let prevIndex = 0;
			let expected = ["(", "1", "¬"];
			let result = parseTokens.tokens["¬"](bracket, path, currentIndex, prevIndex);
			expect(result).toEqual(expected);
		});

		it("3", () => {
			let bracket = ["(", "1", "¬"];
			let currentIndex = 7;
			let prevIndex = 3;
			let expected = [["1", "¬", "-1"]];
			let result = parseTokens.tokens[")"](bracket, path, currentIndex, prevIndex);
			expect(result).toEqual(expected);
		});
	});

	describe("splitToken()", () => {

	});

	describe("lastIndexOfString()", () => {

	});

	describe("nextIndexOfString()", () => {

	});

	describe("lastIndexOf()", () => {

	});
});