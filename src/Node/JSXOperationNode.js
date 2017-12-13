const JSXOperationTokens = require("../Tokens/JSXOperatorTokens");
// const JSXContextNode = require("./JSXContextNode");
const JSXError = require("../Utils/JSXError");



const tokens = new JSXOperationTokens().tokens;
const ErrorHandler = new JSXError();

const props = {
    lhs: null,
    rhs: null,
    operation: null,
    function: null,
    result: null
}

class JSXOperationNode {
    // Not sure why the require JSXContextNode does not produces a class but instead produces an empty object
    // For now we are passingin the JSXContextNode as part of this constructor
    // TODO: investigate why?
    constructor(psOperation) {
        ErrorHandler.test("hasProperty", { parent: tokens, child: psOperation, parentName: "OperatorTokens", at: "JSXOperationNode.setOperation" });
        this.operation = psOperation;
        this.function = tokens[this.operation];
    }

    setLHS(pValue) {
        this.lhs = pValue;
    }

    setRHS(pValue) {
        this.rhs = pValue;
    }

    operate() {
        ErrorHandler.test("Defined", { data: this.lhs, name: "this.lhs", at: "JSXOperationNode.operate" });
        ErrorHandler.test("Defined", { data: this.rhs, name: "this.rhs", at: "JSXOperationNode.operate" });
        this.result = this.function.apply(this, [this.lhs])(this.rhs);

        return this.result;
    }
}

module.exports = JSXOperationNode;