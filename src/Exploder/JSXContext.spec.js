const JSXContext = require("./JSXContext");
const JSXContextNode = require("../Node/JSXContextNode");
const JSXExploded = require("../Exploder/JSXPloder");

describe("JSXContext()", () => {
    let context, exploded, current;
    beforeEach(() => {
        const exploder = new JSXExploded();
        exploded = exploder.explode({
            a: "a",
            b: "b",
            c: {
                d: "d",
                e: "e"
            }
        });
        
        context = new JSXContext(exploded);
        spyOn(context.audit, "push");
    });
    describe("addNode()", () => {
        it("Expect to context.current to call add node.", () => {
            spyOn(context.current, "addNode");
            context.addNode("c");
            expect(context.current.addNode).toHaveBeenCalled();
            expect(context.audit.push).toHaveBeenCalled();
        });
    });

    describe("addParentFromCurrent()", () => {
        it("Expect context.current to call add parent from current.", () => {
            spyOn(context.current, "addParentFromCurrent");
            context.addParentFromCurrent();
            expect(context.current.addParentFromCurrent).toHaveBeenCalled();
        });
    });

    describe("getLatestItem()", () => {
        it("Expect context.current to call get last listed item.", () => {
            spyOn(context.current, "getLastListedItem");
            context.getLatestItem();
            expect(context.current.getLastListedItem).toHaveBeenCalled();
            expect(context.audit.push).toHaveBeenCalled();
        });
    });

    describe("getPreviousItem", () => {
        it("Expect context.current to call get item before last listed item..", () => {
            spyOn(context.current, "getItemBeforeLastListedItem");
            context.getPreviousItem();
            expect(context.current.getItemBeforeLastListedItem).toHaveBeenCalled();
            expect(context.audit.push).toHaveBeenCalled();
        });
    });

    describe("getFirstItem()", () => {
        it("Expect context.current to call get first listed item.", () => {
            spyOn(context.current, "getFirstListedItem");
            context.getFirstItem();
            expect(context.current.getFirstListedItem).toHaveBeenCalled();
            expect(context.audit.push).toHaveBeenCalled();
        });
    });

    describe("spawn()", () => {
        // TODO
    });

    describe("setContextToParent", () => {
        it("Expect context.current to call get parent context.", () => {
            const newContextNode = new JSXContextNode(2, exploded);
            spyOn(context.current, "getParentContext").and.returnValue(newContextNode);
            context.setContextToParent();
            expect(context.current).toEqual(newContextNode);
            expect(context.audit.push).toHaveBeenCalled();
        });
    });

    describe("pop()", () => {
        it("Expect context.current to call pop.", () => {
            spyOn(context.current, "pop");
            context.pop();
            expect(context.current.pop).toHaveBeenCalled();
            expect(context.audit.push).toHaveBeenCalled();
        });
    });

    describe("getExploded()", () => {
        it("Expect to return the current exploded", () => {
            expect(context.getExploded()).toEqual(context.current.exploded);
        });
    });

    describe("cleanUp()", () => {
        // TODO
    });

    describe("getRootExploded()", () => {
        it("Expect to return the root exploded", () => {
            expect(context.getRootExploded()).toEqual(context.root.exploded);
        });
    });

    describe("getParent()", () => {
        it("Expect to return the current parent", () => {
            expect(context.getParent()).toEqual(context.current.parent);
        });
    });

    describe("setContextToNearestPredicateContext()", () => {
        it("Expect to set context to parent becaue parent is a predicate context.", () => {
            const parentContext = new JSXContextNode(2, exploded, true);
            context.current.parent = parentContext;
            context.setContextToNearestPredicateContext();
            expect(context.current).toEqual(parentContext);
        });

        it("Expect context to not have being updated because the parent is not a predicate context.", () => {
            const parentContext = new JSXContextNode(2, exploded);
            const currentContext = context.current;
            context.current.parent = parentContext;
            context.setContextToNearestPredicateContext();
            expect(context.current).toEqual(currentContext);
        });
    });

    describe("isPredicateContext()", () => {
        it("Expect to return false because the current context is not a predicate context.", () => {
            const node = new JSXContextNode(2, exploded);
            context.current = node;
            expect(context.isPredicateContext()).toBe(false);
        });

        it("Expect to return true because the current context is a predicate context.", () => {
            const node = new JSXContextNode(2, exploded, true);
            context.current = node;
            expect(context.isPredicateContext()).toBe(true);
        });
    });

    describe("setIsPosition()", () => {
        it("Expect to set is position to true successfully.", () => {
            context.setIsPosition(true);
            expect(context.current.isPosition).toBe(true);
        });

        it("Expect to set is position to false successfully.", () => {
            context.setIsPosition(false);
            expect(context.current.isPosition).toBe(false);
        });
    });

    describe("setContextToContextWithId()", () => {
        // TODO
    });

    describe("getId()", () => {
        it("Expect context.current to call get id.", () => {
            spyOn(context.current, "getId");
            context.getId();
            expect(context.current.getId).toHaveBeenCalled();
        });
    });
});