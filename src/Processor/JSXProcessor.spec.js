var JSXProcessor = require("./JSXProcessor");

describe("JSXProcessor", () => {
	var Processor;
	beforeEach(() => {
		// let path = "/a/b/c";
		Processor = new JSXProcessor();
	});

	describe("constructor()", () => {
		// it("should contain undefined properties when constuctor is called without parameters.", () => {
		// 	expect(() => new JSXProcessor()).not.toThrow();
		// });

		// it("should throw error when contains invalid path param type.", () => {
		// 	expect(() => new JSXProcessor({})).toThrow();
		// });

		// it("should throw error when contains invalid json param type.", () => {
		// 	expect(() => new JSXProcessor("s", "s")).toThrow();
		// });

		// it("should throw error when contains invalid variable param type.", () => {
		// 	expect(() => new JSXProcessor("s", {}, "s")).toThrow();
		// });
	});

	describe("process()", () => {
		// var json;
		// beforeEach(() => {
		// 	json = {
		// 		a: {
		// 			b: "c",
		// 			d: [ "e", "f" ],
		// 			g: {
		// 				b: "b2",
		// 				l: [2, 3, 4]
		// 			}
		// 		},
		// 		h: 1,
		// 		i: [
		// 			{ k: -10 }
		// 			, { k: 0 }
		// 			, { k: 20 }
		// 		]
		// 	}
		// });

		// it("should return with multiple truthy predicates.", () => {
		// 	let path  = "/a[b='c' and g/b='b2']/g[b='b2']";
		// 	let expected = {};
		// 	let result = Processor.process(path, json);
		// 	expect(result).toEqual(expected);
		// });

		// fit("should return with multiple truthy predicates.2", () => {
		// 	let path  = "/a[b='c' and g/b='b1']/g[b='b2']";
		// 	let expected = {};
		// 	let result = Processor.process(path, json);
		// 	expect(result).toEqual(expected);
		// });

		// it ("should throw error when called without params.", () => {
		// 	let result = () => Processor.process();
		// 	expect(result).toThrow();
		// });
		
		// it ("should throw error when called with only path param.", () => {
		// 	let path = "a";
		// 	let result = () => Processor.process(path);
		// 	expect(result).toThrow()
		// });

		// it ("should throw error when called with only json param.", () => {
		// 	let path = undefined;
		// 	let json = {};
		// 	let result = () => Processor.process(path, json);
		// 	expect(result).toThrow()
		// });

		// it("should return a node object with name 'a'.", () => {
		// 	let path = "/a/g/b";
		// 	// let json = { "a": "b" };
		// 	let expected = { parent: "g", name: "b", value: "b2", children: [] };
		// 	let result = Processor.process(path, json);
		// 	expect(result).toEqual(expected)
		// });

		// it("should return an array of node object with name 'b' when starting from root.", () => {
		// 	let path = "//b";
		// 	let expected = [{ parent: "a", name: "b", value: "c", children: [] }, 
		// 					{ parent: "g", name: "b", value: "b2", children: [] }];
		// 	let result = Processor.process(path, json);
		// 	// expect(Porcessor.exploded).toEqual(expected);
		// 	// expect(result).toEqual(expected);
		// });

		// it("should return a node object with.", () => {
		// 	let path = "/a//l";
		// 	let expected = { parent: "g", name: "l", value: [2,3,4], children: [] };
		// 	let result = Processor.process(path, json);
		// 	expect(result).toEqual(expected);
		// });

		// it("should return sibling", () => {
		// 	let path = "/a/b/siblings::*";
		// 	let expected = { "d": { parent: "a", name: "d", value: [ "e", "f" ], children: [] },
		// 					 "g": { parent: "a", name: "g", value: {b: "b2", l: [2, 3, 4] }, children: ["b", "l"] } }; 
		// 	let result = Processor.process(path, json);
		// 	expect(result).toEqual(expected);
		// });
		
		
	});
});
