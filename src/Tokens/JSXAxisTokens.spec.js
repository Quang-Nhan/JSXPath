var JSXAxisTokens = require("./JSXAxisTokens");

xdescribe("JSXAxisTokens", () => {
	var exploded, ct;
	beforeEach(() => {
		ct = new JSXAxisTokens();
		exploded = {
			"a": {
				"meta": {
					"type": "node"
				},
				"name": "a",
				"value": "A",
				"parent": "@",
				"children": []
			},
			"b": {
				"meta": {
					"type": "node"
				},
				"name": "b",
				"value": 1,
				"parent": "@",
				"children": []
			},
			"c": {
				"meta": {
					"type": "node"
				},
				"name": "c",
				"value": [
					"d",
					"e"
				],
				"parent": "@",
				"children": []
			},
			"f": {
				"meta": {
					"type": "node"
				},
				"name": "f",
				"value": { "g": { "h": "H"} },
				"parent": "@",
				"children": ["g"]
			},
			"g": {
				"meta": {
					"type": "node"
				},
				"name": "g",
				"value": { "h": "H"},
				"parent": "f",
				"children": ["h"]
			},
			"h": {
				"meta": {
					"type": "node"
				},
				"name": "h",
				"value": "H",
				"parent": "g",
				"children": []
			},
			"@": {
				"meta": {
					"type": "node"
				},
				"name": "@",
				"value": {
					"a": "A",
					"b": 1,
					"c": [
						"d",
						"e"
					],
					"f": { "g": { "h": "H"} }
				},
				"parent": null,
				"children": [
					"a",
					"b",
					"c",
					"f"
				]
			},
			".": {
				"meta": {
					"type": "node"
				},
				"name": "@",
				"value": {
					"a": "A",
					"b": 1,
					"c": [
						"d",
						"e"
					]
				},
				"parent": null,
				"children": [
					"a",
					"b",
					"c"
				]
			}
		}
	});

	describe("this.tokens", () => {
		xdescribe("*", () => {
			it("should return children nodes.", () => {
				let expected = {
					"a": exploded.a,
					"b": exploded.b,
					"c": exploded.c
				};
				let result = ct.tokens["*"](exploded);
				expect(result).toEqual(expected);
			});
		});

		describe("..", () => {
			beforeEach(() => {
				exploded["."] = exploded.g;
			});

			it("should return the parent node.", () => {
				let expected = {"f": exploded["f"] }; 
				let result = ct.tokens[".."](exploded, undefined);
				expect(result).toEqual(expected);
			});

			it("should return an empty object when the nodename is not valid.", () => {
				let expected = {}; 
				let result = ct.tokens[".."](exploded, "a");
				expect(result).toEqual(expected);
			});

			it("should return the parent node when the nodename is valid.", () => {
				let expected = {"f": exploded["f"] }; 
				let result = ct.tokens[".."](exploded, "f");
				expect(result).toEqual(expected);
			});
		});

		describe("siblings()", () => {
			beforeEach(() => {
				exploded["."] = exploded.a;
			});

			it("should return the sibling nodes.", () => {
				let expected = {
					"b": exploded.b,
					"c": exploded.c,
					"f": exploded.f
				};
				let result = ct.tokens["siblings"](exploded);
				expect(result).toEqual(expected);
			});

			it("should return an empty object when the nodename is not valid.", () => {
				let expected = {}; 
				let result = ct.tokens["siblings"](exploded, "a");
				expect(result).toEqual(expected);
			});

			it("should return the parent node when the nodename is valid.", () => {
				let expected = exploded["f"]; 
				let result = ct.tokens["siblings"](exploded, "f");
				expect(result).toEqual(expected);
			});
		});

		describe("descendant", () => {
			it("should return the descendant node.", () => {
				let expected = {
					"a": exploded.a,
					"b": exploded.b,
					"c": exploded.c
				};
				let fEx = jasmine.createSpy("fEx").and.returnValue(expected);
				let result = ct.tokens["descendant"](exploded, null, fEx);
				expect(fEx).toHaveBeenCalledWith(exploded["."].value);
				expect(result).toEqual(expected);
			});
		});

		describe("descendantOrSelf", () => {
			it("should return the descendant-or-self node.", () => {
				let expected = {
					"a": exploded.a,
					"b": exploded.b,
					"c": exploded.c,
					"@": exploded["@"]
				};
				let fEx = jasmine.createSpy("fEx").and.returnValue(expected);
				let result = ct.tokens["descendantOrSelf"](exploded, undefined, fEx);
				expect(fEx).toHaveBeenCalledWith(exploded["."].value);
				expect(result).toEqual(expected);
			});
		});

		describe("ancestor", () => {
			beforeEach(() => {
				exploded["."] = exploded["g"];
			});

			it("should return the ancestor node.", () => {
				let expected = { "@" : exploded["@"], "f": exploded["f"] };
				let result = ct.tokens["ancestor"](exploded);
				expect(result).toEqual(expected);
			});

			it("should return an empty object containing an invalid parent name.", () => {
				let expected = {};
				let result = ct.tokens["ancestor"](exploded, "car");
				expect(result).toEqual(expected);
			});

			it("should return ancestor", () => {
				let expected = exploded["f"];
				let result = ct.tokens["ancestor"](exploded, "f");
				expect(result).toEqual(expected);
			});
		});

		describe("ancestorOrSelf", () => {
			it("should return the ancestor-or-self.", () => {
				exploded["."] = { "meta": {"type": "node"}, name: "a", "parent": "@", children: [], value: "A" };
				let expected = {
					"@": exploded["@"],
					"a": exploded.a
				};
				let result = ct.tokens["ancestorOrSelf"](exploded);
				expect(result).toEqual(expected);
			});
		});

		describe("//", () => {
			it("should return the descedant node.", () => {
				let expected = {
					"a": exploded.a,
					"b": exploded.b,
					"c": exploded.c
				};
				let fEx = jasmine.createSpy("fEx").and.returnValue(expected);
				let result = ct.tokens["//"](exploded, undefined, fEx);
				expect(fEx).toHaveBeenCalledWith(exploded["."].value);
				// expect(result).toEqual(expected);
			});
		});

		describe("self", () => {
			it("should return the context node if no node name param is undefined.", () => {
				exploded["."] = { name: "a", "parent": "@", children: [], value: "A" };
				let expected = exploded["."];
				let result = ct.tokens["self"](exploded);
				expect(result).toEqual(expected);
			});

			it("should return the node of the according to the node name param.", () => {
				let expected = exploded["a"];
				let result = ct.tokens["self"](exploded, "a");
				expect(result).toEqual(expected);
			});

			it("should throw error for invalid node name param.", () => {
				let expected = null;
				let result = () => ct.tokens("self")(exploded, "k");
				expect(result).toThrow();
			});
		});

		describe("parent", () => {
			it("should return the parent node.", () => {
				exploded["."] = { name: "a", "parent": "@", children: [], value: "A" };
				let expected = { "@": exploded["@"] };
				let result = ct.tokens["parent"](exploded, undefined);
				expect(result).toEqual(expected);
			});
		});

		describe("preceding", () => {

		});

		describe("precedingSiblings", () => {

		});

		describe("following", () => {

		});

		describe("followingSibling", () => {

		});
	});

});