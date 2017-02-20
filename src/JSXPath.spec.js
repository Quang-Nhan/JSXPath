var JSXPath = require("./JSXPath");

describe("JSXPath", () => {
	let jsxpath;

	describe("README", () => {
		describe("Why JSXPath", () => {
			it("should return the value of json.c if the sum of values json.a and json.b is equal to 3", () => {
				let js = {a:1, b:2, c: "pass"}
				let jsxpath = new JSXPath(js);
				let expected = ["pass"];
				let path = '/c[sum(/a, /b) = 3]';
				let result = jsxpath.process({ path: path });
				expect(result).toEqual(expected);
			});
		});

		describe("Predicate Expression", () => {
			var js;
			beforeEach(() => {
				js = {
					tic: 1,
					tac: 10,
					toe: 100,
					foo: {
						tic: 2,
						tac: 20,
						toe: 200
					}
				};
				jsxpath = new JSXPath(js);
			});

			it("should return a value when predicate expression resolved to be true and the final result is a single node.", () => {
				let path = '/toe[/tic = 1 and /tac > 9]';
				let expected = true;
				let result = jsxpath.process({ path: path });
				expect(result).toEqual([100]);
			});

			it("should return an array of values when the predicate expression resolved to be true and the final result is a set of node values.", () => {
				let path = '//tac[.>1]';
				let expected = [10, 20];
				let result = jsxpath.process({ path: path });
				expect(result).toEqual(expected);
			});

			it("should return an empty array when the predicate expression resolved to be false.", () => {
				let path = '/toe[/tac = 3]';
				let expected = [];
				let result = jsxpath.process({ path: path });
				expect(result).toEqual(expected);
			});
		});

		describe("Variables", () => {
			it("should return 17 with variables input", () => {
				let js = { a: 18 };
				let path = '/a + $v1 - $v2';
				let vars = { $v1: 19, $v2: 20 };
				let expected = [17];
				let jsxpath = new JSXPath(js);
				let result = jsxpath.process({ path: path, variables: vars });
				expect(result).toEqual(expected);
			});
		});

		describe("Custom Functions", () => {
			it("custom max", () => {
				let customFunctions = {
				    max: (args, validator) => {
				      let max = validator.validateNumber(args[0], "max()", true);
				      for (let i = 1; i < args.length; i++) {
				        let n = validator.validateNumber(args[i], "max()", true);
				        if (n > max) {
				          max = n;
				        }
				      }
				      return max;
				    }
				};
				let js = {
					a: 1,
					b: 2,
					c: 3
				};

				let jsxpath = new JSXPath(js, customFunctions);
				let path = "max(/a, /b, /c)";
				let result = jsxpath.process({ path: path });
				expect(result).toEqual([js.c]);
			});
		});

		describe("Object Comparison", () => {
			it("should be supported when using pure object directly in expression.", () => {
				let js = {
					a: 1,
					b: {c: 2}
				};
				let jsxpath = new JSXPath(js);
				let path = '/b != {"c": 2}';
				let result = jsxpath.process({path: path}, (err, result) => {
					expect(result).toBe(true);
				});
			});

			it("should be supported when using array object directly in expression.", () => {
				let js = {
					a: [1, "b", 2],
					b: "c"
				}
				let jsxpath = new JSXPath(js);
				let path = '/a = [1, "b", 2]';
				let result = jsxpath.process({ path: path });
				expect(result).toEqual([true]);
			});

			it("should be supported when using object or array as variables.", () => {
				let js = {
					a: 1,
					b: {c: 2},
					c: [ 9 ]
				};
				let jsxpath = new JSXPath(js);
				let vars = { $c: {c:2}, $n: [ 10 ] };
				let path = '/b = $c and /c != $n';
				let result = jsxpath.process({ path: path, variables: vars });
				expect(result).toEqual([true]);
			});
		});

		describe("Examples", () => {
			describe("Node Selection", () => {
				var jsxpath, js;
				beforeEach(() => {
					js = {
						a: {
							b: {
								c: "d",
								g: ["hi", "ho"],
								k: { o: 0 }
							},
							e: "f",
							g: [1,2,3,4,5]
						}
					}
					jsxpath = new JSXPath(js);
				});

				it("nodes path", () => {
					let path = '/a/b';
					let result = jsxpath.process({ path: path });
					expect(result).toEqual([js.a.b]);
				});

				it("should returns a single value using //e", () => {
					let path  = '//e';
					let expected = ["f"];
					let result = jsxpath.process({ path: path });
					expect(result).toEqual(expected);
				});

				it("should returns an array of values using //g", () => {
					// order is not guaranteed
					let path = '//g';
					let expected = [["hi", "ho"], [1, 2, 3, 4, 5]];
					let result = jsxpath.process({ path: path });
					expect(result).toEqual(expected);
				});

				it("should return a single value using /a//o", () => {
					let path = '/a//o';
					let expected = [0];
					let result = jsxpath.process({ path: path });
					expect(result).toEqual(expected);
				});

				it("should return the value of the node e when the predicate with [. = 'f'] returns true.", () => {
					let path = '//e[.="f"]';
					let expected = [js.a.e];
					let result = jsxpath.process({ path: path })
					expect(result).toEqual(expected);
				});

				it("should return the parent node b using //c/../b", () => {
					let path = '//c/../g';
					let expected = [js.a.b.g];
					let result = jsxpath.process({ path: path });
					expect(result).toEqual(expected);
				});
			});

			describe("Operators", () => {
				var jsxpath, js;
				beforeEach(() => {
					js = {
						a: 1,
						b: 2,
						c: [3, 4]
					};
					jsxpath = new JSXPath(js);
				});

				it("|", () => {
					let path = '/a|/c';
					let expected = [1, [3, 4]];
					let result = jsxpath.process({ path: path });
					expect(result).toEqual(expected);
				});

				it("+", () => {
					let path = "9 + /a";
					let expected = [10];
					let result = jsxpath.process({ path: path });
					expect(result).toEqual(expected);
				});
			});

			describe("Descendant", () => {
				var jsxpath, js;
				beforeEach(() => {
					js = {
						k: { "a d": { f: 1 } },
						b: 2,
						c: 3
					};
					jsxpath = new JSXPath(js);
				});


				it("all descedant to give 6", () => {
					let path = '//f + //b + //c';
					let expected = [6];
					let result = jsxpath.process({ path: path });
					expect(result).toEqual(expected);
				});

				it("1", () => {
					let path = "//'a d'";
					let expected = [{ f: 1}];
					let result = jsxpath.process({ path: path });
					expect(result).toEqual(expected);
				});

				it("2", () => {
					let path = '//"a d"';
					let expected = [{ f: 1}];
					let result = jsxpath.process({ path: path });
					expect(result).toEqual(expected);
				});
			});
		});
	});

	fdescribe("ARRAY", () => {
		let js;
		beforeEach(() => {
			js = {
				a: [
					{ b: 1 },
					{ b: {c: 9} },
					{ d: "d" },
					{ b: 3, k: 20 },
				],
				b: 19
			}
		});

		it("should return object {c: 9} from using index predicate only with node b.", () => {
			let jsxpath = new JSXPath(js);
			let expected = [{c: 9}];
			let path = '/a/b[2]';
			let result = jsxpath.process({ path: path });
			expect(result).toEqual(expected);
		});

		it("should return an empty array when is negative.", () => {
			let jsxpath = new JSXPath(js);
			let expected = [];
			let path = '/a/b[position() =-2 ]';
			let result = jsxpath.process({ path: path });
			expect(result).toEqual(expected);
		});

		it("should return the first 2 b node values.", () => {
			let jsxpath = new JSXPath(js);
			let expected = [1, {c: 9}];
			let path = '/a/b[ 2 >= position()]';
			let result = jsxpath.process({ path: path });
			expect(result).toEqual(expected);
		});

		fit("position 4", () => {
			let jsxpath = new JSXPath(js);
			let expected = [{ b: 3, k: 20 }];
			let path = '/a[b = 3 and d="d"]';
			let result = jsxpath.process({ path: path });
			expect(result).toEqual(expected);
		});

		it("position 5", () => {
			let jsxpath = new JSXPath(js);
			let expected = { b: 2 };
			let path = '/a/b[contains("abc", "c")]';
			let result = jsxpath.process({ path: path });
			expect(result).toEqual(expected);
		});
	});
});