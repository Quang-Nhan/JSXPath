var moment = require("moment");
const cloneDeep = require("lodash/cloneDeep");

var JSXContextNode = require("../Node/JSXContextNode");
const JSXValidator = require("../Utils/JSXValidator");


class JSXContext {
	constructor(exploded) {
		this.validator = new JSXValidator();
		this.root = new JSXContextNode(0, exploded);
		this.current = this.root;
		this.current.setType("root");
		this.audit = ["Initialized Root Context " + this.current.getId()];
	}

	addNode(jsxnode, poProps) {
		this.current.addNode(jsxnode, poProps);
		this.audit.push(["Added a new node to " + this.current.getId(), jsxnode]);
	}

	addParentFromCurrent() {
		this.current.addParentFromCurrent();
	}
	
	getLatestItem() {
		const lastItem  = this.current.getLastListedItem();
		this.audit.push("Retrieve the last item on " + this.current.getId() + " list.");
		return lastItem;
	}

	getPreviousItem() {
		const previousItem = this.current.getItemBeforeLastListedItem();
		this.audit.push("Retreive the item before the last item on " + this.current.getId() + " list.");
		return previousItem;
	}

	getFirstItem() {
		const firstItem = this.current.getFirstListedItem();
		this.audit.push("Retrieve the first item on " + this.current.getId() + " list.");
		return firstItem;
	}

	spawn(poExploded, psWithNode, isPredicate) {
		const newContext = new JSXContextNode(this.current.getDepth() + 1, poExploded, isPredicate);
		let item;
		if (psWithNode) {
			item = newContext.exploded["$_find"](psWithNode);
		} else {
			let lastItem = this.getLatestItem();
			if (this.validator.validateNode(lastItem)) {
				item =  newContext.exploded["$_find"](lastItem);
			}
		}
		newContext.setParentContext(this.current);
		this.audit.push("Spawned a new context " + this.current.getId());

		this.current.addChildContext(newContext);
		this.current = newContext;
		this.audit.push("Switched current to point at new context " + this.current.getId());

		this.addNode(item);
	}

	addOperationalNode(psOperation) {
		this.current.addOperationalNode(psOperation);
	}

	operate() {
		this.current.operate();
		this.audit.push("Executed operation on " + this.current.getId())
	}

	setContextToParent() {
		this.current = this.current.getParentContext();
	}

	pop() {
		const popped = this.current.pop();
		this.audit.push("Popped the last item on " + this.current.getId());
		return popped;
	}

	getExploded() {
		return this.current.exploded;
	}

	cleanUp() {
		this.current = this.root;
		const cleanChild = (childNode) => {
			const children = childNode.getChildren();
			children.forEach(child => {
				if (child.getChildren().length) {
					cleanChild(child);
				}
			})
			childNode.cleanUp();
		};
		if (this.current.getChildren().length) {
			cleanChild(this.current);
		}
	}

	getRootExploded() {
		return this.root.exploded;
	}

	getParent() {
		return this.current.parent;
	}

	setContextToNearestPredicateContext() {
		if (!this.current.isPredicate && this.current.parent) {
			this.current = this.current.parent;
			this.setContextToNearestPredicateContext();
		}
	}

	isPredicateContext() {
		return this.current.isPredicate;
	}

	setIsPosition(pbValue) {
		this.current.isPosition = pbValue;
	}

	isPositionContext() {
		return this.current.isPosition;
	}

	setContextToContextWithId(psId) {
		if (this.current.getId() !== psId) {
			if (this.current.parent.id === psId) {
				this.current = this.current.parent;
			}
		}
	}

	getId() {
		return this.current.getId();
	}
}

module.exports = JSXContext;
