import { tNode, tNodesState, iState } from "../types";
import { KEYS } from "./consts";

  
class State implements iState {
  private state: tNodesState;
  private caller: string;
  constructor() {
    this.setState();
  };

  private setState() {
    if (!this.state) {
      this.state = {
        nodes: {
          byCaller: {},
          byId: {}
        },
        id: 1,
        group: 0
      }
    }
  };

  public setCaller(caller: string) {
    this.caller = caller;
  };

  public addNode(node: tNode) {
    if (!this.caller) {
      throw new Error('[NodesState.addNodes] Caller is not set');
    }
    if (!this.state.nodes.byCaller[this.caller]) {
      this.state.nodes.byCaller[this.caller] = [];
    }
    this.state.nodes.byCaller[this.caller].push(node);
    this.state.nodes.byId[node[KEYS.id]] = node;
  };

  public getNodes(caller?: string): tNode[] {
    if (caller) {
      return this.state.nodes.byCaller[caller] || [];
    }
    if (!this.caller) {
      throw new Error('[NodesState.getNodes] Caller is not defined');
    }
    return this.state.nodes.byCaller[this.caller] || [];
  };

  public getNodesByIds(ids: number[]) {
    return ids.map(id => {
      return this.getNodeById(id);
    }).filter(node => !!node);
  };

  public getNodeById(id: number) {
    return this.state.nodes.byId[id];
  };

  public incrementId() {
    this.state.id++;
    return this.state.id;
  };

  public incrementGroup() {
    this.state.group++;
    return this.state.group;
  };

  public getId() {
    return this.state.id;
  };

  public getNodeList(byId: boolean) {
    return byId ?  this.state.nodes.byId : this.state.nodes.byCaller;
  }

  public reset() {
    this.caller = null;
    this.state = {
      nodes: {
        byCaller: {},
        byId: {}
      },
      id: 1,
      group: 0
    }
  };
};

export class NodesState {
  static instance: State;
  static getInstance() {
    if (!this.instance) {
      this.instance = new State();
    }
    return this.instance;
  }
};
