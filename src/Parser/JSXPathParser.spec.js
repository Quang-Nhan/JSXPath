var JSXPathParser = require("./JSXPathParser");
var JSXReplacer = require("./JSXReplacer");

describe("JSXPathParser", () => {
	var pathParser;
	beforeEach(() => {
		pathParser = new JSXPathParser();
	});

	describe("parse()", () => {
		it("1", () => {			
			let path = "1>2*3 div 4";
			let expected = [[ "1", ">", [["2", "~", "3"], "÷", "4"]]];
			spyOn(pathParser, "_normalise").and.callThrough();
			let result = pathParser.parse(path);
			expect(result).toEqual(expected);
		});

		it("2", () => {			
			let path = "1--1";
			let expected = [["1", "¬", "-1"]];
			spyOn(pathParser, "_normalise").and.callThrough();
			let result = pathParser.parse(path);
			expect(result).toEqual(expected);
		});

		it("3", () => {
			let path = '/a/ancestor-or-self::b/d+/k/sibling::c';
			let expected = [[["@/a",["'b'","ancestorOrSelf("],"/d"],"+",[["@/k",["'c'","sibling("]]]]] ;
			let result = pathParser.parse(path);
			expect(result).toEqual(expected);
		});

		it("4", () => {
			let path = '//name/quang/siblings::me'; //(@ descendant('name')/quang sibling('me'))
			let expected = [ [ '@', [ '\'name\'', 'descendant(' ], '/quang', [ '\'me\'', 'siblings(' ] ] ];
			let result = pathParser.parse(path);
			expect(result).toEqual(expected);
		});

		it("5", () => {
			let path = "child::*";
		});

		it("6", () => {
			let path = "child::node()"
		});

		it("7", () => {
			let path = "child::empinfo"
		});

		it("8", () => {
			let path = "//employee/descendant::*"
		});

		it("9", () => {
			let path = "//descendant::employee"
		});

		it("10", () => {
			let path = "//employee/descendant-or-self::*"
		});

		it("6", () => {
			let path = "//descendant-or-self::employee"
		});

		it("6", () => {
			let path = "//employee/ancestor::*"
		});

		it("6", () => {
			let path = "//ancestor::name"
		});

		it("6", () => {
			let path = "//employee/ancestor-or-self::*"
		});

		it("6", () => {
			let path = "//name/ancestor-or-self::employee"
		});

		it("6", () => {
			let path = "//name/parent::*"
		});

		it("6", () => {
			let path = "//name/parent::employee"
		});

		it("6", () => {
			let path = "//attribute::id"
		});

		it("6", () => {
			let path = "//attribute::*"
		});

		it("6", () => {
			let path = "//employee[@id=1]/following::*"
		});

		it("6", () => {
			let path = "//employee[@id=1]/following-sibling::*"
		});

		it("6", () => {
			let path = "//employee[@id=3]/preceding::*"
		});

		it("6", () => {
			let path = "//employee[@id=3]/preceding-sibling::*"
		});

	});

	describe("_normalise", () => {
		it("1", () => {
			let path = "a+b";
			let expected = "(a + b)";
			pathParser.Replacer = new JSXReplacer({});
			let result = pathParser._normalise(path);
			expect(result).toBe(expected);
		});;
	});

	describe("_camelCase", () => {
		it("1", () => {
			let path = "a-b-c()";
			let expected = "aBC()";
			let result = pathParser._camelCase(path);
			expect(result).toBe(expected);
		});

		it("2", () => {
			let path = "a ¬ b";
			let expected = "a ¬ b";
			let result = pathParser._camelCase(path);
			expect(result).toBe(expected);
		});

		it("3", () => {
			let path = "a-bz-cx::def";
			let expected = "aBzCx::def";
			let result = pathParser._camelCase(path);
			expect(result).toBe(expected);
		});
	});

	describe("_autoParenthesis", () => {

		it("1", () => {
			let input = "1 + 2 + 3";
			let expected = "((1 + 2) + 3)";
			let result = pathParser._autoParenthesis(input);
			expect(result).toEqual(expected);
		});

		it("2", () => {
			let input = "1 + 2 ~ 3";
			let expected = "(1 + (2 ~ 3))";
			let result = pathParser._autoParenthesis(input);
			expect(result).toEqual(expected);
		});

		it("3. should produce ((2 ~ (3 ÷ 4)) ~ 5) from 2 ~ (3 ÷ 4) ~ 5", () => {
			let input = "2 ~ (3 ÷ 4) ~ 5";
			let expected = "((2 ~ (3 ÷ 4)) ~ 5)";
			let result = pathParser._autoParenthesis(input);
			expect(result).toEqual(expected);
		});

		it("4", () => {
			let input = "1 + 2 ÷ (3 ~ 4) ¬ 5";
			let expected = "((1 + (2 ÷ (3 ~ 4))) ¬ 5)";
			let result = pathParser._autoParenthesis(input);
			expect(result).toEqual(expected);
		});

		it("5", () => {
			let input = "1 ¬ 9 > 13 ~ 4 ÷ (8 + 3) ≤ 10";
			let expected = "(((1 ¬ 9) > ((13 ~ 4) ÷ (8 + 3))) ≤ 10)";
			let result = pathParser._autoParenthesis(input);
			expect(result).toEqual(expected);
		});

		it("6", () => {
			let input = "1 + 10 = 10 = 20 ¬ 11";
			let expected = "(((1 + 10) = 10) = (20 ¬ 11))";
			let result = pathParser._autoParenthesis(input);
			expect(result).toEqual(expected);
		});

		it("7", () => {
			let input = "16 > 11 & 17 + 40 = 9 or 17 ¬ 8 ≥ 2";
			let expected = "((16 > 11) & ((17 + 40) = 9)) or ((17 ¬ 8) ≥ 2)";
			let result = pathParser._autoParenthesis(input);
			expect(result).toEqual(expected);
		});

		it("8", () => { //single side have closed paren/bracket
			let input = "16 > 11 & (17 + 40 = 9 or 17 ¬ 8 ≥ 2)";
			let expected = "((16 > 11) & (((17 + 40) = 9) or ((17 ¬ 8) ≥ 2)))";
			let result = pathParser._autoParenthesis(input);
			expect(result).toEqual(expected);
		});

		it("9", () => {
			let input = "/abc[d + e = 12]/k ~ 12 + (19 ¬ 3)";
			let expected = "((/abc[((d + e) = 12)]/k ~ 12) + (19 ¬ 3))";
			let result = pathParser._autoParenthesis(input);
			expect(result).toEqual(expected);
		});

		it("10", () => {
			let input = "sum(/abc[d = e & v = /k]/k) + 12";
			let expected = "(sum(/abc[((d = e) & (v = /k))]/k) + 12)";
			let result = pathParser._autoParenthesis(input);
			expect(result).toEqual(expected);
		});

		it("11", () => {
			let input = "1 ¬ -1";
			let expected = "(1 ¬ -1)";
			let result = pathParser._autoParenthesis(input);
			expect(result).toEqual(expected);
		});

		it("12", () => {
			let input = "@/a[1=1 & 2=2]";
			let expected = "@/a[(1=1) & (2=2)]";
			let result = pathParser._autoParenthesis(input);
			expect(result).toEqual(expected);
		});

		it("13", () => {
			let input = "@/a + $1 ¬ $2";
			let expected = "((@/a + $1) ¬ $2)";
			let result = pathParser._autoParenthesis(input);
			expect(result).toEqual(expected);
		});

	});

	describe("_requireAutoParen", () => {
		it("1", () => {
			let path = "a + b";
			let index = 2;
			let expected = true;
			let result = pathParser._requireAutoParen(path, index);
			expect(result).toBe(expected);
		});

		it("2", () => {
			let path = "(a + b)";
			let index = 3;
			let expected = false;
			let result = pathParser._requireAutoParen(path, index);
			expect(result).toBe(expected);
		});

		it("3", () => {
			let path = "(a + b) + c";
			let index = 8;
			let expected = true;
			let result = pathParser._requireAutoParen(path, index);
			expect(result).toBe(expected);
		});

		it("4", () => {
			let path = "[(a + b)] + c";
			let index = 10;
			let expected = true;
			let result = pathParser._requireAutoParen(path, index);
			expect(result).toBe(expected);
		});

		it("5", () => {
			let path = "sum(a, b) + c";
			let index = 10;
			let expected = true;
			let result = pathParser._requireAutoParen(path, index);
			expect(result).toBe(expected);
		});
	});

	describe("_autoParenAt", () => {

		it("1", () => {
			let path = "a + b";
			let index = 2;
			let expected = {
				autoParen : "(a + b)",
				left: 0,
				right: 5
			};
			let result = pathParser._autoParenAt(path, index);
			expect(result).toEqual(expected);
		});

		it("2", () => {
			let path = "(a + b) + c";
			let index = 8;
			let expected = {
				autoParen : "((a + b) + c)",
				left: 0,
				right: 11
			};
			let result = pathParser._autoParenAt(path, index);
			expect(result).toEqual(expected);
		});

		it("3", () => {
			let path = "(a + b ~ c) = d";
			let index = 7;
			let expected = {
				autoParen : "(a + (b ~ c)) = d",
				left: 5,
				right: 10
			};
			let result = pathParser._autoParenAt(path, index);
			expect(result).toEqual(expected);
		});
	});

	describe('_findInsertPosition', () => {
		it("1", () => {
			let direction = "left";
			let path = "a + b";
			let index = 2;
			let expected = 0;
			let result = pathParser._findInsertPosition(direction, path, index);
			expect(result).toBe(expected);
		});

		it("2", () => {
			let direction = "left";
			let path = "(a + b ÷ c)";
			let index = 7;
			let expected = 4;
			let result = pathParser._findInsertPosition(direction, path, index);
			expect(result).toBe(expected);
		});

		it("3", () => {
			let direction = "left";
			let path = "(a + (b ÷ c) = d(/e ~ f))";
			let index = 20;
			let expected = 16;
			let result = pathParser._findInsertPosition(direction, path, index);
			expect(result).toBe(expected);
		});

		it("4", () => {
			let direction = "right";
			let path = "a + b";
			let index = 2;
			let expected = 5;
			let result = pathParser._findInsertPosition(direction, path, index);
			expect(result).toBe(expected);
		});

		it("5", () => {
			let direction = "right";
			let path = "(a + b ÷ c)";
			let index = 7;
			let expected = 10;
			let result = pathParser._findInsertPosition(direction, path, index);
			expect(result).toBe(expected);
		});

		it("6", () => {
			let direction = "right";
			let path = "(a + b ÷ c = d(/e ~ f))";
			let index = 7;
			let expected = 10;
			let result = pathParser._findInsertPosition(direction, path, index);
			expect(result).toBe(expected);
		});
	});

	describe("_handleLeftHandScope", () => {
		var counts;
		beforeEach(() => {
			counts = {
				parenCount: 0,
				brackCount: 0,
				run: {
					"]": (self) => --self.brackCount,
					")": (self) => --self.parenCount,
					"[": (self) => ++self.brackCount,
					"(": (self) => ++self.parenCount
				}
			}
		});
		it("1", () => {
			let path = "(a + b ÷ c)";
			let index = 7;
			let expected = 4;
			let result = pathParser._handleLeftHandScope(path, index, counts);
			expect(result).toBe(expected);
		});

		it("2", () => {
			let path = "a + b";
			let index = 2;
			let expected = 0;
			let result = pathParser._handleLeftHandScope(path, index, counts);
			expect(result).toBe(expected);
		});

		it("3", () => {
			let path = "(a + (b ÷ c) = d(/e ~ f))";
			let index = 20;
			let expected = 16;
			let result = pathParser._handleLeftHandScope(path, index, counts);
			expect(result).toBe(expected);
		});
	});

	describe("_handleRightHandScope", () => {
		var counts;
		beforeEach(() => {
			counts = {
				parenCount: 0,
				brackCount: 0,
				run: {
					"]": (self) => --self.brackCount,
					")": (self) => --self.parenCount,
					"[": (self) => ++self.brackCount,
					"(": (self) => ++self.parenCount
				}
			}
		});

		it("1", () => {
			let path = "a + b";
			let index = 2;
			let expected = 5;
			let result = pathParser._handleRightHandScope(path, index, counts);
			expect(result).toBe(expected);
		});

		it("2", () => {
			let path = "(a + b ÷ c)";
			let index = 7;
			let expected = 10;
			let result = pathParser._handleRightHandScope(path, index, counts);
			expect(result).toBe(expected);
		});

		it("3", () => {
			let path = "(a + b ÷ c = d(/e ~ f))";
			let index = 7;
			let expected = 10;
			let result = pathParser._handleRightHandScope(path, index, counts);
			expect(result).toBe(expected);
		});
	});

	describe("_transform()", () => {
		it("1", () => {
			let path = "@/a[(1=1) + (2=2)]";
			let expected = ["@/a", [ "[", [ "1", "=", "1"], "+", ["2", "=", "2"]]];
			let result = pathParser._transform(path);
			expect(result).toEqual(expected);
		});

		it("2", () => {
			let path = "(@ descendant('name')/quang siblings('me'))";
			let expected = [ [ '@', [ '\'name\'', 'descendant(' ], '/quang', [ '\'me\'', 'siblings(' ] ] ];
			let result = pathParser._transform(path);
			expect(result).toEqual(expected);
		});
	});

	describe("_postParsedProcessing", () => {
		it("1", () => {
			let path = [ [ 'a', ',', 'b', 'sum(' ] ];
			let expected = [ [ [ ',', 'a', 'b'],  'sum(' ] ];
			let result = pathParser._postParsedProcessing(path);
			expect(result).toEqual(expected);
		});

		it("2", () => {
			let path = [ [ 'a', ',', 'b', 'sum(' ] ];
			let expected = [ [ [ ',', 'a', 'b'],  'sum(' ] ];
			let result = pathParser._postParsedProcessing(path);
			expect(result).toEqual(expected);
		});
	});
});