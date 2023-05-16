import { nodesOps } from "./Util"
import { TYPES } from "./consts"
import { Functions } from "./evaluate/Functions"
import { Processor } from "./evaluate/Processor"
import { Variables } from "./evaluate/Variables"
import { Json } from "./nodes/Json";
import { Nodes } from "./nodes/Nodes"
import { Postfix } from "./path/Postfix"
import { tNode, tNodesState, tPathWithCallBack, tRunPathsInput } from "./types"

export class RunPath {
  private nodesInstance: Nodes;
  private functionInstance: Functions;
  private postfixInstance: Postfix;
  private nodes: tNode[];
  private variablesInstance: Variables;
  private processorInstance: Processor;
  private toJsonInstance: Json;
  private caller;
  private options: tRunPathsInput['outputOptions'] = {};

  constructor({json, functions, variables, outputOptions}: tRunPathsInput) {
    this.caller = 'main'
    this.nodesInstance = new Nodes();
    this.functionInstance = new Functions(functions);
    this.postfixInstance = new Postfix(this.caller, this.functionInstance);
    this.nodes = this.nodesInstance.jsonToNodes(json, this.caller);
    this.variablesInstance = new Variables({root: json, nodes: this.nodes}, variables);
    this.processorInstance = new Processor(this.nodesInstance, this.variablesInstance, this.functionInstance);
    this.toJsonInstance = new Json();
    this.variablesInstance.setInstances({ 
      postfixInstance: this.postfixInstance, 
      processorInstance: this.processorInstance, 
      toJsonInstance: this.toJsonInstance 
    });
    this.options.nodes = outputOptions?.nodes || false;
  }

  public callbackMode({path, then, description}: tPathWithCallBack) {
    let error: string;
    let value = [];
    let nodesValue;
    try {
      const postfixPath = this.postfixInstance.toPostfix(path);
      this.processorInstance.processPostfixPath(postfixPath);
      const item = this.processorInstance.output.pop();
      if (item) {
        value = item.type !== TYPES.nodes
          ? item.value 
          : this.toJsonInstance.reconstruct(item.value);
      }
      if (item && item.type === TYPES.nodes && this.options.nodes) {
        nodesValue = item.value;
      }
    } catch(e) {
      error = `${e.message}${description ? ` for the scenario:"${description}"`: ` for path "${path}"`}`;
    }
    
    then({
      path,
      description,
      value,
      error,
      nodes: this.options.nodes ? nodesOps.get.nodeList(true) as tNodesState['nodes']['byId'] : undefined,
      nodesValue
    });
  }

  public stringPathMode(path: string) {
    let value = [];
    try {
      const postfixPath = this.postfixInstance.toPostfix(path);
      this.processorInstance.processPostfixPath(postfixPath);
      const item = this.processorInstance.output.pop();
      if (item) {
        value = item.type !== TYPES.nodes ? item.value : this.toJsonInstance.reconstruct(item.value);
      } 
    } catch(e) {
      throw new Error(`${e.message} for path "${path}"`);
    }
    return value;
  }

  reset() {
    this.processorInstance.reset();
  }
}