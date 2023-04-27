import { OPERATORS, TYPES } from "../consts";
import { Json } from "../nodes/Json";
import { Nodes } from "../nodes/Nodes";
import { nodesOps } from "../Util";
import { Postfix } from "../path/Postfix";
import { tNode, tVariables } from "../types";
import { Processor } from "./Processor";

type tVariableCache = {
  [variableName: string]: {
    name: string,
    value: any,
    nodes: tNode[],
    isPath: boolean
  }
};

type tRoot = {root: object, nodes: tNode[]};

export class Variables {
  private cache: tVariableCache;
  private NodesClass: Nodes;
  private postfixInstance: Postfix;
  private processorInstance: Processor;
  private toJsonInstance: Json;
  constructor(rootProps: tRoot, private variables?: tVariables) {
    this.NodesClass = new Nodes();
    this.variables = variables || {};
    this.cacheVariables(rootProps);
  }

  private cacheVariables({root, nodes}: tRoot) {
    this.cache = {
      root: {
        name: 'root',
        value: root,
        nodes,
        isPath: false
      }
    };
    for(let key in this.variables) {
      this.cache[key] = {
        name: key,
        value: this.variables[key],
        nodes: null,
        isPath: this.tests.isPath(this.variables[key])
      }
    }
  };

  private tests = {
    isPath: (value: any) => {
      return typeof value === 'string' && value.includes('$');
    }
  };

  private getVariableEndIndex(path, startIndex) {
    const stopChars = [' ', '[', ']', '/', ...OPERATORS.byLength['1']];
    for (
      let i = startIndex; 
      i < path.length;
      i++
    ) {
      if(stopChars.includes(path[i])) {
        return i;
      }
    }
    return startIndex;
  };

  private getReferenceVariableInPath(variableValue: string) {
    const startOfDollarSign = variableValue.indexOf('$');
    const endOfVariableName = this.getVariableEndIndex(variableValue, startOfDollarSign);
    return variableValue.substring(startOfDollarSign+1, endOfVariableName);
  };

  private getVariablePathResult(path) {
    const postfixPath = this.postfixInstance.toPostfix(path);
    this.processorInstance.processPostfixPath(postfixPath);
    const item = this.processorInstance.output.pop();
    
    let value;
    if (item.type === TYPES.nodes) {
      value = this.toJsonInstance.reconstruct(item.value);
      if (value.length === 1) {
        value = value[0];
      }
    } else {
      value = item.value;
    }
    return value;
  };

  private updateVariablePathValue(variableCache: tVariableCache["variableName"]) {
    const variableReferenceName = this.getReferenceVariableInPath(variableCache.value);
    if (!this.cache[variableReferenceName]) {
      throw new Error(`[Variables.updateVariablePathValue] variable \$${variableReferenceName} is not defined`)
    }

    if (this.cache[variableReferenceName].isPath) {
      this.updateVariablePathValue(this.cache[variableReferenceName]);
    }
    
    if (!this.cache[variableReferenceName].nodes) {
      const referenceValue = this.cache[variableReferenceName].value;
      this.cache[variableReferenceName].nodes = this.NodesClass.jsonToNodes(referenceValue, this.cache[variableReferenceName].name);
    }

    this.cache[variableCache.name].value = this.getVariablePathResult(variableCache.value);
    this.cache[variableCache.name].isPath = false;
  };

  // This should be called early
  public setInstances({postfixInstance, processorInstance, toJsonInstance}) {
    this.postfixInstance = postfixInstance
    this.processorInstance = processorInstance;
    this.toJsonInstance = toJsonInstance;
  };

  public getVariableRootNode(variable: string) {
    if (variable[0] === '$') {
      variable = variable.substring(1);
    }

    if (!this.cache[variable]) {
      throw new Error(`[Variables.getVariableRootNode] variable \$${variable} is not defined`);
    }

    if (this.cache[variable].isPath) {
      this.updateVariablePathValue(this.cache[variable]);
    } 
    
    if (!this.cache[variable].nodes) {
      this.cache[variable].nodes = this.NodesClass.jsonToNodes(this.cache[variable].value, variable);
    }

    return nodesOps.get.root(this.cache[variable].nodes);
  };

  public reset() {
    this.variables = null;
    this.cache = null;
  };
}