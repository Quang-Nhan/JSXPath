var JSXNode = require("./JSXNode");

describe("JSXNode", () => {
	var Node;

	describe("A single node", () => {
		beforeEach(() => {
			Node = new JSXNode({
				name: "",
				value: "",
				parent: "",
				children: "",
				type: ""
			})
		});
		
		describe("update", () => {

		});

		describe("type", () => {

		});

		describe("name", () => {

		});

		describe("value", () => {

		});

		describe("parent", () => {

		});
	});

	describe("A node list", () => {
		beforeEach(() => {
			Node = new JSXNode({
				name: "a",
				value: "",
				parent: "",
				children: "",
				type: "nodeList"
			});
		});

		describe("update", () => {

		});

		describe("type", () => {

		});

		describe("name", () => {

		});

		describe("value", () => {

		});

		describe("parent", () => {

		});

	});
});