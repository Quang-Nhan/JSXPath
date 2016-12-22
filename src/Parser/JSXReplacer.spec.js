var JSXReplacer = require("./JSXReplacer");
var JSXParseTokens = require("../Tokens/JSXParseTokens");

describe("JSXReplacer", () => {
	var Replacer;
	beforeEach(() => {
		Replacer = new JSXReplacer({}, {});
	});

	describe("replace()", () => {
		it("1", () => {
			let path = "1*2";
			let expected = "1 ~ 2";
			let mode = "preAutoParenthesis";
			let result = Replacer.replace(path, mode);
			expect(result).toBe(expected);
		});

		it("2", () => {
			let path = "1 mod 12";
			let expected = "1 % 12";
			let mode = "preAutoParenthesis";
			let result = Replacer.replace(path, mode);
			expect(result).toBe(expected);
		});

		it("3", () => {
			let path = "a>=b<=c";
			let expected = "a ≥ b ≤ c";
			let mode = "preAutoParenthesis";
			let result = Replacer.replace(path, mode);
			expect(result).toBe(expected);
		});

		it("4", () => {
			let path = "a!=b and c or d";
			let expected = "a ≠ b & c Ø d";
			let mode = "preAutoParenthesis";
			let result = Replacer.replace(path, mode);
			expect(result).toBe(expected);
		});

		it("5", () => {
			let path = "19 div a/* * 8";
			let expected = "19 ÷ a/* ~ 8";
			let mode = "preAutoParenthesis";
			let result = Replacer.replace(path, mode);
			expect(result).toBe(expected);
		});

		it("6", () => {
			let path = "/a/b/*";
			let expected = "@/a/b/*";
			let mode = "preAutoParenthesis";
			let result = Replacer.replace(path, mode);
			expect(result).toBe(expected);
		});

		it("7", () => {
			let path = "/a/b+/de[/f/g+/h]!=/i/j/*";
			let expected = "@/a/b + @/de[@/f/g + @/h] ≠ @/i/j/*";
			let mode = "preAutoParenthesis";
			let result = Replacer.replace(path, mode);
			expect(result).toBe(expected);
		});

		it("8", () => {
			let path = "1= 2*3 div 4";
			let expected = "1 = 2 ~ 3 ÷ 4";
			let mode = "preAutoParenthesis";
			let result = Replacer.replace(path, mode);
			expect(result).toBe(expected);
		});

		it("8", () => {
			let path = "/k+/a";
			let expected = "@/k + @/a";
			let mode = "preAutoParenthesis";
			let result = Replacer.replace(path, mode);
			expect(result).toBe(expected);
		});

		it("9 Negative numbers", () => {
			let path = "1-2";
			let expected = "1 ¬ 2";
			let mode = "preAutoParenthesis";
			let result = Replacer.replace(path, mode);
			expect(result).toBe(expected);
		});

		it("10 Negative numbers", () => {
			let path = "1--2+-3-4";
			let expected = "1 ¬ -2 + -3 ¬ 4";
			let mode = "preAutoParenthesis";
			let result = Replacer.replace(path, mode);
			expect(result).toBe(expected);
		});

		it("11 Negative numbers", () => {
			let path = "a-b-c() + d-1d-f()";
			let expected = "a-b-c() + d-1d-f()";
			let mode = "preAutoParenthesis";
			let result = Replacer.replace(path, mode);
			expect(result).toBe(expected);
		});

		it("12 axis", () => {
			let path = "/a/ancestor-or-self::b/d!=/k/sibling::c";
			let expected = "@/a/ancestor-or-self::b/d ≠ @/k/sibling::c"
			// let expected = "@/a/ancestor-or-self('b')/d ≠ @/k/sibling('c')";
			let mode = "preAutoParenthesis";
			let result = Replacer.replace(path, mode);
			expect(result).toBe(expected);
		});

		it("13 position predicate", () => {
			let path = "a[1]";
			let expected = "a[position(1)]";
			let mode = "postAutoParenthesis";
			let result = Replacer.replace(path, mode);
			expect(result).toBe(expected);
		});

		it("14 position predicate", () => {
			let path = "a[position() = 1]";
			let expected = "a[position(1)]";
			let mode = "postAutoParenthesis";
			let result = Replacer.replace(path, mode);
			expect(result).toBe(expected);
		});

		it("15a position predicate", () => {
			let path = "/a/b[3]/c[position() = 9]";
			let expected = "@/a/b[3]/c[position() = 9]";
			let mode = "preAutoParenthesis";
			let result = Replacer.replace(path, mode);
			expect(result).toBe(expected);
		});


		it("15b position predicate", () => {
			let path = "@/a/b[3]/c[position() = 9]";
			let expected = "@/a/b[position(3)]/c[position(9)]";
			let mode = "postAutoParenthesis";
			let result = Replacer.replace(path, mode);
			expect(result).toBe(expected);
		});

		it("16 axis with *.", () => {
			let path = "@/self::*";
			let expected = "(@ self('*'))";
			let mode = "postAutoParenthesis";
			let result = Replacer.replace(path, mode);
			expect(result).toBe(expected);
		});

		it("17", () => {
			let path = "/a/b[t1 = c[t2 = [1,2,3]]]";
			let mode = "preAutoParenthesis";
			let expected = "@/a/b[t1 = c[t2 = $array0]]";
			let result = Replacer.replace(path, mode);
			expect(result).toEqual(expected);
		});
	});

	describe("_op1()", () => {

	});

	describe("_op2()", () => {

	});

	describe("_objectKey()", () => {

	});

	describe("_axis()", () => {

	});

	describe("_root()", () => {

	});

	describe("_position()", () => {

	});

	describe("_descendant()", () => {

	});

	describe("_object()", () => {

	});

	describe("_array()", () => {

	});

	describe("_extractor()", () => {
		var variables, extractor;
		beforeEach(() => {
			variables = {
				"$var": { "a": 1 }
			}
			extractor = Replacer._extractor("{", variables, []);
		});

		describe("variableReplacement()", () => {
			it("should return a replaced variable path expression.", () => {
				let key = '{"a":1} = $var';
				let result = extractor.variablesReplacement(key);
				let expected = '{"a":1} = {"a":1}';
				expect(result).toBe(expected);
			});

			it("should return the original path expression since no matched variable is found.", () => {
				let key = 'ab = $test';
				let result = extractor.variablesReplacement(key);
				let expected = key;
				expect(result).toBe(expected);
			});
		});

		describe("extract", () => {
			it("test predicate within test predicate", () => {
				extractor = Replacer._extractor("[", variables, []);
				let sString = "[t1 = c[t2 = [1,2,3]]]";
				let m = "[t1 = c[t2 = [1,2,3]]]";
				let i = 4;
				let o = "/a/b[t1 = c[t2 = [1,2,3]]]";
				let result = extractor.extract(sString, i, o);
				let expected = [{ start: 17, end: 23, array: [ 1, 2, 3 ] }];
				expect(result).toEqual(expected);
			});
		});

		describe("parse()", () => {
			beforeEach(() => {
				extractor = Replacer._extractor("[", variables, []);
			});

			it("Expect to return the original since it is not a valid pure array object.", () => {
				let sString = "[ 1 != [3, 2, 1] ]";
				let i = 5;
				let o = "19 = [ 1 != [3, 2, 1] ]";
				let result = extractor.parse(sString, i, o);
				let expected = "[ 1 != [3, 2, 1] ]";
				expect(result).toEqual(expected);
			});
		});

		describe("prepStrings()", () => {
			it("1", () => {
				extractor = Replacer._extractor("[", variables, []);
				let aoStrings = [{start: 8, array: [21,23,43], end: 19}, {start: 25, array: ['a', 'b'], end: 34}];
				let sString = "[ 19 != [21, 23, 43] and ['a', 'b'] = /a ]";
				let result = extractor.prepStrings(aoStrings, sString, 0);
				let expected = [ '[ 19 != ', '$array0', ' and ', '$array1', ' = /a ]' ];
				expect(result).toEqual(expected);
			});
		});
	});

});