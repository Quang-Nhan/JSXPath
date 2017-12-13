const JSXPathFunctions = require("./JSXPathFunctions");
const JSXContext = require("../Exploder/JSXContext");

describe("JSXPathFunctions", () => {
	var func;
	beforeEach(() => {
		let exploded = {
			".": {
				name: "currentNodeName",
				value: "some value",
				children: ["a", "b"],
				parent: "@"
			}
		}
		func = new JSXPathFunctions(exploded);
	});
	
	describe("token functions", () => {
		describe("contains()", () => {
			it("should return true for source string ABCDE and search string CD", () => {
				let args = ["ABCDE", "CD"];
				let result = func.tokens.contains(args);
				expect(result).toBe(true);
			});

			it("should return false for source string ABCDE and search string KF", () => {
				let args = ["ABCDE", "KF"];
				let result = func.tokens.contains(args);
				expect(result).toBe(false);
			});

			it("should return true for source object with value ABC-DEF and search string C-DE", () => {
				let args = [{value: "ABC-DEF"}, "C-DE"];
				let result = func.tokens.contains(args);
				expect(result).toBe(true);
			});

			it("should throw error from number 1234 as source", () => {
				let args = [1234, "A"];
				let result = () => func.tokens.contains(args);
				expect(result).toThrow();
			});

			it("should throw error from source string ABCDEFG with 12 as number as search input.", () => {
				let args = ["ABCDEFG", 12];
				let result = () => func.tokens.contains(args);
				expect(result).toThrow();
			});

			it("should throw error from invalid number of arugments", () => {
				let args = ["AB", "A", "B"];
				let result = () => func.tokens.contains(args);
				expect(result).toThrow();
			});
		});

		describe("concat()", () => {
			it("should return 'abc'", () => {
				let args = ["a", "b", "c"];
				let result = func.tokens.concat(args);
				expect(result).toBe("abc");
			});
			it("should return 'abc nodeABC' ", () => {
				let args = ["a", "b", "c ", {value: "nodeABC"}];
				let result = func.tokens.concat(args);
				expect(result).toBe("abc nodeABC");
			});
			it("should throw error", () => {
				let args = ["a", "b", "c", "d", 1];
				let result = () => func.tokens.concat(args);
				expect(result).toThrow();
			});
		});

		describe("substring()", () => {
			it("should return cd from abcd with no arg 3 length argument.", () => {
				let args = ["abcd", 2];
				let result = func.tokens.substring(args);
				expect(result).toBe("cd");
			});

			it("should return bc from abcd with arg 3 length argument.", () => {
				let args = ["abcd", 1, 2];
				let result = func.tokens.substring(args);
				expect(result).toBe("bc");
			});

			it("should throw error due to invalid number of arguments.", () => {
				let args = ["abcd", 1, 2, 3];
				let result = () => func.tokens.substring(args);
				expect(result).toThrow();
			});

			it("should throw error on number input for arg 1 string argument.", () => {
				let args = [1, 2];
				let result = () => func.tokens.substring(args);
				expect(result).toThrow();
			});

			it("should throw error on invalid type for arg 2 start argument.", () => {
				let args = ["abc", "2"];
				let result = () => func.tokens.substring(args);
				expect(result).toThrow();
			});

			it("should throw error on invalid type for arg 3 length argument.", () => {
				let args = ["abc", 2, "3"];
				let result = () => func.tokens.substring(args);
				expect(result).toThrow();
			});
		});

		describe("substringAfter()", () => {
			it("should return ABCD from source string ABABCD with AB as seatch string", () => {
				let args = ["ABABCD", "AB"];
				let result = func.tokens.substringAfter(args);
				expect(result).toBe("ABCD");
			});

			it("should return empty string from source string ABCDEFG with DEFG as search string", () => {
				let args = ["ABCDEFG", "DEFG"];
				let result = func.tokens.substringAfter(args);
				expect(result).toBe("");
			});

			it("should return FG from source object with value ABCDE-FG with '-' as search string", () => {
				let args = [{value: "ABCDE-FG"}, "-"];
				let result = func.tokens.substringAfter(args);
				expect(result).toBe("FG");
			});

			it("should throw error from number 1234 as source", () => {
				let args = [1234, "A"];
				let result = () => func.tokens.substringAfter(args);
				expect(result).toThrow();
			});

			it("should throw error from source string ABCDEFG with 12 as number as search input.", () => {
				let args = ["ABCDEFG", 12];
				let result = () => func.tokens.substringAfter(args);
				expect(result).toThrow();
			});

			it("should throw error from invalid number of arugments", () => {
				let args = ["AB", "A", "B"];
				let result = () => func.tokens.substringAfter(args);
				expect(result).toThrow();
			});
		});

		describe("substringBefore", () => {
			it("should return empty string from source string ABABCD with AB as search string", () => {
				let args = ["ABABCD", "AB"];
				let result = func.tokens.substringBefore(args);
				expect(result).toBe("");
			});

			it("should return string ABC from source string ABCDEFG with DEFG as search string", () => {
				let args = ["ABCDEFG", "DEFG"];
				let result = func.tokens.substringBefore(args);
				expect(result).toBe("ABC");
			});

			it("should return ABCDE from source object with value ABCDE-FG with '-' as search string", () => {
				let args = [{value: "ABCDE-FG"}, "-"];
				let result = func.tokens.substringBefore(args);
				expect(result).toBe("ABCDE");
			});

			it("should throw error from number 1234 as source", () => {
				let args = [1234, "A"];
				let result = () => func.tokens.substringBefore(args);
				expect(result).toThrow();
			});

			it("should throw error from source string ABCDEFG with 12 as number as search input.", () => {
				let args = ["ABCDEFG", 12];
				let result = () => func.tokens.substringBefore(args);
				expect(result).toThrow();
			});

			it("should throw error from invalid number of arugments", () => {
				let args = ["AB", "A", "B"];
				let result = () => func.tokens.substringBefore(args);
				expect(result).toThrow();
			});
		});

		describe("translate()", () => {
			it("should translate 'apple' to 'APPLE'", () => {
				let from = "abcdefghijklmnopqrstuvwxyz";
				let to = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
				let args = ["apple", from, to];
				let result = func.tokens.translate(args);
				expect(result).toBe("APPLE");
			});

			it("should translate 'beboy905' to 'BeBoy_0*'", () => {
				let from = "b95";
				let to = "B_*";
				let args = ["beboy905", from, to];
				let result = func.tokens.translate(args);
				expect(result).toBe("BeBoy_0*");
			});

			it("should translate 'Northern Territory' to 'NoRtheRn TeRRitoRy'", () => {
				let from = "r";
				let to = "RVK";
				let args = ["Northern Territory", from, to];
				let result = func.tokens.translate(args);
				expect(result).toBe("NoRtheRn TeRRitoRy");
			});

			it("should throw error from number 1234 as source", () => {
				let args = [1234, "A", "a"];
				let result = () => func.tokens.translate(args);
				expect(result).toThrow();
			});

			it("should throw error from source string ABCDEFG with 12 as number as search input.", () => {
				let args = ["ABCDEFG", 12, "34"];
				let result = () => func.tokens.translate(args);
				expect(result).toThrow();
			});

			it("should throw error from invalid number of arguments", () => {
				let args = ["AB", "A"];
				let result = () => func.tokens.translate(args);
				expect(result).toThrow();
			});
		});

		describe("stringLength()", () => {
			it("should return 4 for source string 'ABCD'.", () => {
				let args = ["ABCD"];
				let result = func.tokens.stringLength(args);
				expect(result).toBe(4);
			});

			it("should return 6 for source object with value 'ACDC12'.", () => {
				let args = [{value: "ACDC12"}];
				let result = func.tokens.stringLength(args);
				expect(result).toBe(6);
			});

			it("should throw error for source number.", () => {
				let args = [122];
				let result = () => func.tokens.stringLength(args);
				expect(result).toThrow();
			});

			it("should throw error for invalid number of arguments.", () => {
				let args = ["ABC", "DC"];
				let result =() => func.tokens.stringLength(args);
				expect(result).toThrow();
			});
		});

		describe("matches()", () => {
			it("should return true for source string ABCDE with pattern CD", () => {
				let args = ["ABCDE", "CD"];
				let result = func.tokens.matches(args);
				expect(result).toBe(true);
			});

			it("should return true for source string ABCDE with pattern '^A.*E$", () => {
				let args = ["ABCDE", "^A.*E$"];
				let result = func.tokens.matches(args);
				expect(result).toBe(true);
			});

			it("should return true for source string 123456 with pattern '^1(B|2)", () => {
				let args = ["123456", "1(B|2)"];
				let result = func.tokens.matches(args);
				expect(result).toBe(true);
			});

			it("should return false for source string ABCDE with GH", () => {
				let args = ["ABCDE", "GH"];
				let result = func.tokens.matches(args);
				expect(result).toBe(false);
			});

			it("should throw error for invalid type for second argument.", () => {
				let args = ["ABCDE", 12];
				let result = () => func.tokens.matches(args);
				expect(result).toThrow();
			});

			it("should throw error for invalid number of arguments.", () => {
				let args = ["ABCDE", "CD", false];
				let result = () => func.tokens.matches(args);
				expect(result).toThrow();
			});
		});

		describe("replace()", () => {
			it("shuould return ABCdefg from source ABCDEF with pattern DEF and replace with defg.", () => {
				let args = ["ABCDEF", "DEF", "defg"];
				let result = func.tokens.replace(args);
				expect(result).toBe("ABCdefg");
			});

			it("should return A123C123 from source ABCB with pattern B and replace with 123.", () => {
				let args = ["ABCB", "B", "123"];
				let result = func.tokens.replace(args);
				expect(result).toBe("A123C123");
			});

			it("should throw error for invalid source type.", () => {
				let args = [123, "2", "1"];
				let result = () => func.tokens.replace(args);
				expect(result).toThrow();
			});

			it("should throw error for invalid pattern type.", () => {
				let args = ["123", 2, "1"];
				let result = () => func.tokens.replace(args);
				expect(result).toThrow();
			});

			it("should throw error for invalid replace type.", () => {
				let args = ["123", "2", 1];
				let result = () => func.tokens.replace(args);
				expect(result).toThrow();
			});

			it("should throw error for invalid number of arguments.", () => {
				let args = [12];
				let result = () => func.tokens.replace(args);
				expect(result).toThrow();
			});
		});

		describe("tokenize()", () => {
			it("should return [A, B, C, D] from source A-B-C-D from token pattern '-'", () => {
				let args = ["A-B-C-D", "-"];
				let result = func.tokens.tokenize(args);
				expect(result).toEqual(["A", "B", "C", "D"]);
			});

			it("should return ['1', '15', '24', '50'] source '1, 15, 24, 50' with token pattern ',\\s*'", () => {
				let args = ["1, 15, 24, 50", ",\\s*"];
				let result = func.tokens.tokenize(args);
				expect(result).toEqual(["1", "15", "24", "50"]);
			});

			it("should raise an error for pattern source 'abba' with token pattern '.?'", () => {
				let args = ["abba", ".?"];
				let result = () => func.tokens.tokenize(args);
				expect(result).toThrow();
			});

			it("should throw error for invalid source type.", () => {
				let args = [123, "-"];
				let result = () => func.tokens.tokenize(args);
				expect(result).toThrow();
			});

			it("should throw erro for invalid pattern type.", () => {
				let args = ["A-B-C-D", 9];
				let result = () => func.tokens.tokenize(args);
				expect(result).toThrow();
			});

			it("should throw error for invalid number of arguments.", () => {
				let args = ["A-B-C-D"];
				let result = () => func.tokens.tokenize(args);
				expect(result).toThrow();
			});
		});

		describe("round()", () => {
			it("should return 1 from source number 1.49.", () => {
				let args = [1.49];
				let result = func.tokens.round(args);
				expect(result).toBe(1)
			});

			it("should return 2 from source object with value 1.5.", () => {
				let args = [{value: 1.5}];
				let result = func.tokens.round(args);
				expect(result).toBe(2);
			});

			it("should return -2 from source number -1.51.", () => {
				let args = [-1.51];
				let result = func.tokens.round(args);
				expect(result).toBe(-2);
			});

			it("should throw error when source is a string.", () => {
				let args = ["12.1"];
				let result = () => func.tokens.round(args);
				expect(result).toThrow();
			});

			it("shold throw error for invalid number of arguments.", () => {
				let args = [12, "b"];
				let result = () => func.tokens.round(args);
				expect(result).toThrow();
			});
		});

		describe("floor()", () => {
			it("should return 1 from source number 1.49.", () => {
				let args = [1.49];
				let result = func.tokens.floor(args);
				expect(result).toBe(1)
			});

			it("should return 2 from source object with value 2.51.", () => {
				let args = [{value: 2.51}];
				let result = func.tokens.floor(args);
				expect(result).toBe(2);
			});

			it("should return -2 from source number -1.51.", () => {
				let args = [-1.51];
				let result = func.tokens.floor(args);
				expect(result).toBe(-2);
			});

			it("should throw error when source is a string.", () => {
				let args = ["12.1"];
				let result = () => func.tokens.floor(args);
				expect(result).toThrow();
			});

			it("shold throw error for invalid number of arguments.", () => {
				let args = [12, "b"];
				let result = () => func.tokens.floor(args);
				expect(result).toThrow();
			});
		});

		describe("ceiling()", () => {
			it("should return 2 from source number 1.49.", () => {
				let args = [1.49];
				let result = func.tokens.ceiling(args);
				expect(result).toBe(2)
			});

			it("should return 3 from source object with value 2.51.", () => {
				let args = [{value: 2.51}];
				let result = func.tokens.ceiling(args);
				expect(result).toBe(3);
			});

			it("should return -2 from source number -1.51.", () => {
				let args = [-1.51];
				let result = func.tokens.ceiling(args);
				expect(result).toBe(-1);
			});

			it("should throw error when source is a string.", () => {
				let args = ["12.1"];
				let result = () => func.tokens.ceiling(args);
				expect(result).toThrow();
			});

			it("should throw error for invalid number of arguments.", () => {
				let args = [12, "b"];
				let result = () => func.tokens.ceiling(args);
				expect(result).toThrow();
			});
		});

		//TODO:
		describe("count()", () => {

		});

		describe("sum()", () => {
			it("should return 10 from source numbers 1,2,3,4.", () => {
				let args = [1,2,3,4];
				let result = func.tokens.sum(args);
				expect(result).toBe(10);
			});

			it("should return -1 from source numbers 4, -5.", () => {
				let args = [4, -5];
				let result = func.tokens.sum(args);
				expect(result).toBe(-1);
			});

			it("should return 0 if no arguments are given.", () => {
				let args = [];
				let result = func.tokens.sum(args);
				expect(result).toBe(0);
			});

			it("should return NaN if one of the input value is NaN.", () => {
				let args = [1, 23, NaN];
				let result = func.tokens.sum(args);
				expect(result).toEqual(NaN);
			});;

			it("should return NaN if one of the input value is a string.", () => {
				let args = ["12"];
				let result = func.tokens.sum(args);
				expect(result).toEqual(NaN);
			});
		});

		describe("name()", () => {
			it("should default to current node name if no argument is defined.", () => {
				let args = [];
				let result = func.tokens.name(args);
				expect(result).toBe("currentNodeName")
			});

			it("should return the name of the node if argument is a node.", () => {
				let args = [{name: "new", parent: "k", children: [], value: "a"}];
				let result = func.tokens.name(args);
				expect(result).toBe("new");
			});

			it("should return an empty string if the argument is an empty list.", () => {
				let args = [[]];
				let result = func.tokens.name(args);
				expect(result).toBe("");
			});

			it("should return the first node name if argument contains a list of one or more nodes", () => {
				let args = [[{name: "1", parent: "", children: [], value: {}}, {name: "2", parent: "", children: [], value: {}}]];
				let result = func.tokens.name(args);
				expect(result).toBe("1")
			});

			it("should should throw an error if the argument is not a node: err:XPDY0004.", () => {
				let args = [1];
				let result = () => func.tokens.name(args);
				expect(result).toThrow();
			});

			it("should throw error for invalid number of arguments.", () => {
				let args = [[{name: "1"}], [{name: "2"}]];
				let result = () => func.tokens.name(args);
				expect(result).toThrow();
			});
		});

		//TODO:
		describe("localName()", () => {
			//same functionality as name()
		});

		fdescribe("position()", () => {
			
			beforeEach(() => {
				let exploded = {
					".": {
						value: [
					    {
					      "name": "b",
					      "value": 1,
					      "parent": "a",
					      "children": []
					    },
					    {
					      "name": "b",
					      "value": 2,
					      "parent": "a",
					      "children": []
					    },
					    {
					      "name": "b",
					      "value": 4,
					      "parent": "a",
					      "children": []
					    }
					  ]
					},
					"$_clone": () => {}
				}
				func = new JSXPathFunctions(exploded);
				// func.context = new JSXContext(exploded);
				// spyOn(func.context, 'getLatestItem').and.returnValue(exploded['.']);
			});

			describe("with = operator", () => {
				it("should return the first matched positioned node.", () => {
					let args = ["∏", "=", 1];
					let result = func.tokens.position(args);
					let expected = [{
						"name": "b",
						"value": 1,
						"parent": "a",
						"children": []
					}];
					expect(result).toEqual(expected);
				});

				it("should return the 3rd matched positioned node.", () => {
					let args = [3, "=", "∏"];
					let result = func.tokens.position(args);
					let expected = [{
						"name": "b",
						"value": 4,
						"parent": "a",
						"children": []
					}];
					expect(result).toEqual(expected);
				})
			});
			describe("with != operator", () => {
				it("should return the all matched postioned nodes except the first node.", () => {
					let args = ["∏", "≠", 1];
					let result = func.tokens.position(args);
					let expected = [{
						"name": "b",
						"value": 2,
						"parent": "a",
						"children": []
					},{
						"name": "b",
						"value": 4,
						"parent": "a",
						"children": []
					}]
					expect(result).toEqual(expected);
				});
			});

			describe("with > operator", () => {
				it("should return all matched positioned nodes whose postion is greater than 1.", () => {
					let args = ["∏", ">", 1];
					let result = func.tokens.position(args);
					let expected = [{
						"name": "b",
						"value": 2,
						"parent": "a",
						"children": []
					},{
						"name": "b",
						"value": 4,
						"parent": "a",
						"children": []
					}];
					expect(result).toEqual(expected);
				});

				it("should return all matched positioned nodes whose posiion is greater than 2.",() => {
					let args = ["∏", ">", 2];
					let result = func.tokens.position(args);
					let expected = [{
						"name": "b",
						"value": 4,
						"parent": "a",
						"children": []
					}];
					expect(result).toEqual(expected);
				});
			});

			describe("with < operator", () => {
				it("should return all matched positioned nodes whose position is less than 4", () => {
					let args = ["∏", "<", 4];
					let result = func.tokens.position(args);
					let expected = [{
						"name": "b",
						"value": 1,
						"parent": "a",
						"children": []
					},{
						"name": "b",
						"value": 2,
						"parent": "a",
						"children": []
					},{
						"name": "b",
						"value": 4,
						"parent": "a",
						"children": []
					}];
					expect(result).toEqual(expected);
				});
			});

			describe("with ≥ operator", () => {
				it("should return all matched positioned nodes whose position is greater or equal to 2", () => {
					let args = ["∏", "≥", 2];
					let result = func.tokens.position(args);
					let expected = [{
						"name": "b",
						"value": 2,
						"parent": "a",
						"children": []
					},{
						"name": "b",
						"value": 4,
						"parent": "a",
						"children": []
					}];
					expect(result).toEqual(expected);
				});
			});

			describe("with ≤ operator", () => {
				it("should return all matched position nodes whose position is less than or equal to 2", () => {
					let args = ["∏", "≤", 2];
					let result = func.tokens.position(args);
					let expected = [{
						"name": "b",
						"value": 1,
						"parent": "a",
						"children": []
					},{
						"name": "b",
						"value": 2,
						"parent": "a",
						"children": []
					}];
					expect(result).toEqual(expected);
				})
			});
		});

		//TODO:
		describe("last()", () => {

		});

		//TODO:
		describe("first()", () => {

		});

		describe("number()", () => {
			let func = new JSXPathFunctions({".": {value: 17}});
			it("should return 17 with for no arugments.", () => {
				let args = [];
				let result = func.tokens.number(args);
				expect(result).toBe(17);
			});

			it("should return 0.5 from source number 0.5.", () => {
				let args = [0.5];
				let result = func.tokens.number(args);
				expect(result).toBe(0.5);
			});

			it("should return 0.5 from source string '0.5'", () => {
				let args = ["0.5"];
				let result = func.tokens.number(args);
				expect(result).toBe(0.5);
			});

			it("should return NaN from source string 'sss'", () => {
				let args = ["sss"];
				let result = func.tokens.number(args);
				expect(result).toEqual(NaN);				
			});

			it("should throw error for invalid number of arguments.", () => {
				let args = ["1", 2];
				let result = () => func.tokens.number(args);
				expect(result).toThrow();
			});
		});

		describe("string()", () => {
			it("should return the string value of the current node if no argument is passed.", () => {
				let args = [];
				let result = func.tokens.string(args);
				expect(result).toBe("some value")
			});

			it("should return '12' from source number value 12", () => {
				let args = [12];
				let result = func.tokens.string(args);
				expect(result).toBe("12");
			});

			it("should return an empty string if the input value is null", () => {
				let args = [null];
				let result = func.tokens.string(args);
				expect(result).toBe("");
			});

			it("should throw error for invalid number of arguments.", () => {
				let args = [1, 2];
				let result = () => func.tokens.string(args);
				expect(result).toThrow();
			});
		});

		//TODO:
		describe("boolean()", () => {

		});

		//TODO:
		describe("castableAs()", () => {

		});

		//TODO:
		describe("instanceOf()", () => {

		});

		//TODO:
		describe("castTo()", () => {

		});

		//TODO:
		describe("true()", () => {

		});

		//TODO:
		describe("false()", () => {

		});

		//TODO:
		describe("distinctValues()", () => {

		});

		describe("not()", () => {
			it("should return false when from input true.", () => {
				let args = [true];
				let result = func.tokens.not(args);
				expect(result).toBe(false);
			});

			it("should return true when from input false.", () => {
				let args = [false];
				let result = func.tokens.not(args);
				expect(result).toBe(true);
			});

			it("should throw error when source is a string.", () => {
				let args = ["Carry me on"];
				let result = () => func.tokens.not(args);
				expect(result).toThrow();
			});

			it("should throw error for invalid number of arguments.", () => {
				let args = [true, false];
				let result = () => func.tokens.not(args);
				expect(result).toThrow();
			});
		});
	});

	//TODO:
	describe("_outputDebug()", () => {

	});
});