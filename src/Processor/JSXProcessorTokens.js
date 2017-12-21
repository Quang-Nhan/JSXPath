const isEqual = require("lodash/isEqual");
const JSXContextNode = require("../Node/JSXContextNode");
const JSXOperationNode = require("../Node/JSXOperationNode");
const JSXValidator = require("../Utils/JSXValidator");
const JSXAxisTokens = require("../Tokens/JSXAxisTokens");
const JSXOPeratorNode = require("../Tokens/JSXOperatorTokens");

const Validator = new JSXValidator();
const OperatorTokens = new JSXOPeratorNode();

class JSXProcssorTokens {

    constructor(context, exploded, variables) {
        this.context = context;
        this.AxisTokens = new JSXAxisTokens(this.context);
        this.context.addNode(exploded["@"]);
        this.variables = variables;
        this.tokens = {
            array: (prev, current, next) => {
                return (processPath, processElements, jsxProcessor) => {
                    if (current.includes("∏")) {
                        this.context.setIsPosition(true);
                    }
                    return processPath(current, this.context.getExploded(), jsxProcessor);
                };
            },
            path: (prev, current, next) => {
                const asNodes = current.split("/");
                let i = 0;
                if (asNodes[0] === "@") {
                    if (this.context.getParent() && this.context.getParent().isPredicate) {
                        this.context.setContextToParent();
                    }
                    this.context.spawn(this.context.getRootExploded(), '@');
                    ++i;
                }
        
                for (; i < asNodes.length; ++i) {
                    switch (asNodes[i]) {
                        case ".":
                            break;
                        case "..":
                            this.context.addParentFromCurrent();
                            break;
                        case "": 
                            break;
                        default:
                            if (this.variables.hasOwnProperty(asNodes[i])) {
                                asNodes[i] = this.variables[asNodes[i]];
                            }
                            this.context.addNode(asNodes[i], {isFromNode: true});
                    }
                }
                return this.context.getLatestItem();
            },
            null: () => {
                //do nothing
            },
            number: (prev, current, next) => {
                if (this.context.isPositionContext()) {
                    return current;
                }
                this.context.addNode(Number(current));
                return this.context.getLatestItem();
            },
            string: (prev, current, next) => {
                this.context.addNode(current.substring(1, current.length-1));
                return this.context.getLatestItem();
            },
            boolean: (prev, current, next) => {
                this.context.addNode(current === 'true' ? true : false);
                return this.context.getLatestItem();
            },
            function: (prev, current, next) => {
                return (processPath, processElements, jsxProcessor) => {
                    let result;
                    var args = Array.isArray(prev) ? prev : [prev];
                    let sFName = current.substring(0, current.length - 1).trim();
                    if (this.AxisTokens.tokens[sFName]) {
                        result = this.AxisTokens.tokens[sFName].apply(this, [this.context.getExploded(), prev, jsxProcessor.Exploder._explode()]);
                    } else if (jsxProcessor.pathFunctions.customs && jsxProcessor.pathFunctions.customs.hasOwnProperty(sFName)) {
                        result = jsxProcessor.pathFunctions.customs[sFName].apply(jsxProcessor, [args, jsxProcessor.Validator]);
                    } else {
                        result = jsxProcessor.pathFunctions.tokens[sFName].apply(jsxProcessor, [args]);
                    }
                    this.context.addNode(result);
                    return this.context.getLatestItem();
                }
            },
            node: (prev, current, next) => {
                if (current === ".") {
                    this.context.addNode(this.context.getLatestItem(), { isFromNode: true} );
                } else if (current === "..") {
                    this.context.addParentFromCurrent();
                } else {
                    this.context.addNode(current, { isFromNode: true} );
                }
                return this.context.getLatestItem();
            },
            /**
             * 
             */
            operator: (prev, current, next) => {
                return (processPath, processElements, jsxProcessor) => {
                    if (this.context.isPositionContext()) {
                        return current;
                    }
                    let result;
                    const opNode = new JSXOperationNode(current);
                    const contextId = this.context.getId();

                    opNode.setLHS(this.context.pop());
                    const nextResult = processElements(null, next, null, this.context.getExploded(), jsxProcessor);
                    opNode.setRHS(this.context.pop());
                    
                    result = opNode.operate();
                    
                    if (!this.context.isPredicateContext() && typeof result !== 'boolean' && OperatorTokens.isComparisonOperator(opNode.operation)) {
                        result = Array.isArray(result) && result.length || result ? true : false;
                    }

                    this.context.setContextToContextWithId(contextId);
                    this.context.addNode(result);

                    return this.context.getLatestItem();
                }
            },
            variable: (prev, current, next) => {
                this.context.addNode(this.variables[current], { isLiteral: true });
                return this.context.getLatestItem();
            },
            position: (prev, current, next) => {
                return current;
            },
            args: (prev, current, next, exploded) => {

            },
            tests: (prev, current, next) => {
                return (processPath, processElements, jsxProcessor) => {
                    this.context.spawn(this.context.getExploded(), undefined ,true);
                    let result = processPath(next, this.context.getExploded(), jsxProcessor);
                    
                    this.context.setContextToNearestPredicateContext();
                    if (Validator.validateNode(result)) {
                        const nodes = this.context.getExploded()['$_find'](result);
                        this.context.getExploded()['$_prune']([].concat(nodes));
                        result = this.filterNodes(this.context.getPreviousItem(), nodes);
                    }

                    this.context.setContextToParent();

                    if (typeof result === 'boolean') {
                        if (result) {
                            result = this.context.getLatestItem();
                        }
                    }

                    this.context.addNode(result);

                    return this.context.getLatestItem();
                }
            }
        }
    }

    filterNodes(first, testResultNode) {
        if (Validator.validateNode(first)) {
            return [].concat(first).reduce((r, fn) => {
                [].concat(testResultNode).forEach(tn => {
                    if ([fn].concat(fn.descendants).includes(tn) && !r.includes(fn)) {
                        r.push(fn);
                    }
                });
                return r;
            }, []);
        }
        return first;
    }
}


module.exports = JSXProcssorTokens;