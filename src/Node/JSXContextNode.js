const JSXOperationNode = require('./JSXOperationNode');
const JSXValidator = require('../Utils/JSXValidator');
const Validator = new JSXValidator();


class JSXContextNode {

    /**
     * Creates an instance of JSXContextNode.
     * @param {any} poParams { children: ,}
     * 
     * @memberOf JSXContextNode
     */
    constructor(pnDepth, exploded, isPredicate) {
        this.exploded = exploded["$_clone"]();
        this.children = [];
        this.type = null,
        this.depth = pnDepth;
        this.list = [];
        this.parent = null;
        this.isPredicate = !!isPredicate;
        this.isPosition = false;
        if (this.depth === 0) {
            this.id = 0;
        }
    }

    getId() {
        return this.id;
    }

    getDepth() {
        return this.depth;
    }

    setType(psType) {
        this.type = psType;
    }

    getChildren() {
        return this.children;
    }

    addNode(pValue, poProps) {
        if (Validator.validateNode(pValue) || poProps && poProps.isLiteral) {
            this.list.push(pValue);
        } else if (Validator.validateString(pValue))  {
            const lastItem = this.getLastListedItem();
            const getNodeChildren = (r, item) => {
                const children = item.getChildren([pValue]);
                if (children.length) {
                    r = r.concat(children);
                }
                return r;
            }
            let nodesChildren = null;
            if (Validator.validateNode(lastItem) && pValue !== '*') {
                nodesChildren = Array.isArray(lastItem) ? lastItem.reduce(getNodeChildren, []) : lastItem.getChildren([pValue]);
            } 
            
            if (Array.isArray(nodesChildren) && nodesChildren.length > 0) {
                this.list.push(nodesChildren.length === 1 ? nodesChildren[0] : nodesChildren);
            } else if (poProps && poProps.isFromNode && pValue === '@') {
                this.list.push(this.exploded['@']);
            } else if (poProps && poProps.isFromNode) {
                this.list.push(null);
            } else {
                this.list.push(pValue);
            }
        } else {
            this.list.push(pValue);
        }
    }

    addChildContext(poContextToken) {
        this.children.push(poContextToken)
    }

    setParentContext(poContextNode) {
        this.parent = poContextNode;
        this.id = this.getDepth() + String.fromCharCode(97 + this.parent.getChildren().length);
    }

    getParentContext() {
        return this.parent;
    }

    addParentFromCurrent() {
        const lastItem = this.getLastListedItem();
        if (Array.isArray(lastItem)) {
            const parents = lastItem.reduce((r, item) => {
                if (item.parent && !r.includes(item.parent)) {
                    r.push(item.parent);
                }
                return r;
            }, []);
            this.list.push(parents);
        } else if (lastItem && lastItem.parent) {
            this.list.push(lastItem.parent);
        }
    }

    getLastListedItem() {
        return this.list.length && this.list[this.list.length-1] || null;
    }

    getItemBeforeLastListedItem() {
        return this.list.length && this.list.length > 1 && this.list[this.list.length-2] || null;``
    }

    getFirstListedItem() {
        return this.list.length && this.list[0] || null;
    }

    pop() {
        return this.list.pop();
    }

    cleanUp() {
        this.children = [];
        this.type = null,
        this.depth = null;
        this.list = [];
        this.id = -1;
        this.parent = null;
    }
}

module.exports = JSXContextNode;