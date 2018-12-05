import { ROOT, PARSED_NODES, DISPATCH, ACTION_HANDLER, PATH_HANDLER, GET_STATE, FILTERED_CONTEXT_NODES } from './../constants';
import { JSXPathHandler } from "../pathParser/JSXPathHandler";
import { Node, Instruction, ImpInstruction, ImpAction, State, ActionParams, Action } from '../JSXInterfaces';
import { NODES } from '../constants';
import { JSXAction } from '../JSXAction';
import { JSXRegistrar } from '../JSXRegistrar';


export class JSXNodes implements ImpInstruction, ImpAction{
  static NODE_NAMES: string[] = [];
  private pathHandler: JSXPathHandler;
  private getState: Function;
  private actionHandler: JSXAction;
  private nodesByIds: object = {};
  private nodesByName: object = {};
  private currentId = -1;
  private currentGroupId = -1;

  constructor(private reg: JSXRegistrar) {

  }

  init() {
    let json, dispatch;
    [
      this.pathHandler, 
      this.actionHandler, 
      json, 
      this.getState, 
      dispatch
    ] = this.reg.get([
      PATH_HANDLER, 
      ACTION_HANDLER, 
      '0:json', 
      GET_STATE, 
      DISPATCH
    ]);
    
    this.buildAndDispatchNodesMap(ROOT, json);
    // this.setNodes(ROOT, json, this.currentId, Array.isArray(json) ? true : false, ++this.currentGroupId);
    // this.removeDuplicates();
    // this.setSiblings();
    // dispatch(this.actionHandler.create(PARSED_NODES, {value: {
    //   nodesByName: {...this.nodesByName},
    //   nodesByIds: {...this.nodesByIds},
    //   NODE_NAMES: [...JSXNodes.NODE_NAMES]
    // }}));
    // this.resetMap();
  }

  buildAndDispatchNodesMap(rootNodeName, value) {
    const [dispatch, actionHandler] = this.reg.get([DISPATCH, ACTION_HANDLER]);

    this.setNodes(rootNodeName, value, this.currentId, Array.isArray(value) ? true : false, ++this.currentGroupId);
    this.removeDuplicates();
    this.setSiblings();
    dispatch(actionHandler.create(PARSED_NODES, {value: {
      nodesByName: {...this.nodesByName},
      nodesByIds: {...this.nodesByIds},
      NODE_NAMES: [...JSXNodes.NODE_NAMES]
    }}));
    this.resetMap();
  }

  

  resetMap() {
    this.nodesByIds = {};
    this.nodesByName = {};
    JSXNodes.NODE_NAMES = [];
    this.resetIds();
  }

  resetIds() {
    this.currentGroupId = -1;
    this.currentId = -1;
  }

  createNode(name: string, value: any, parentId: number, groupId: number): Node {
    return {
      id: ++this.currentId,
      groupId,
      name,
      value,
      parentId,
      ancestorIds: [],
      descendantIds: [],
      childrenIds: [],
      siblingIds: []
    }
  }

  getNodes(props: {name?:string, id?:number, ids?:number[]}):Node[] {
    const {name, id, ids} = props;
    const state = this.getState();
    if (name) {
      return state.nodes.nodesByName[name];
    } else if (id) {
      return [state.nodes.nodesByIds[id]];
    } else if (ids) {
      return ids.map(id => state.nodes.nodesByIds[id]);
    }
  }

  getInstruction(subPath: string, startIndex: number, instructionHandlerId:number):Instruction {
    // if (this.currentId !== -1) {
    //   this.resetIds();
    // }
    return {
      type: NODES,
      subPath,
      startIndex,
      endIndex: this.pathHandler.getCurrentIndex(instructionHandlerId),
      link: {}
    }
  }

  isNode(nodes): boolean {
    return Array.isArray(nodes) && nodes.every(this.isNodeInstance) || this.isNodeInstance(nodes);
  }
  
  getAction(params: ActionParams): Action {
    const { instruction } = params;
    return this.actionHandler.create(
      NODES, 
      this.getNodesPayload(instruction)
    );
  }

  getFilteredContextAction(params): Action {
    const { instruction } = params;
    return this.actionHandler.create(
      FILTERED_CONTEXT_NODES, 
      this.getNodesPayload(instruction)
    );
  }

  private getNodesPayload(instruction) {
    return {
      id: instruction.id,
      link: instruction.link, 
      subType: instruction.subType, 
      value: instruction.subPath 
    }
  }

  private isNodeInstance(node): boolean {
    return node && node.hasOwnProperty('childrenIds') && node.hasOwnProperty('ancestorIds') && node.hasOwnProperty('siblingIds');
  }
  
  private setNodes(nodeName: string, value, parentId:number, parentIsArray?:boolean, groupId?: number) {
    let currentNode;

    if (Array.isArray(value)) {
      value.forEach(nodeValue => this.setNodes(nodeName, nodeValue, parentId, true, groupId));
    } else {
      if (typeof value !== 'object' && !parentIsArray) {
        nodeName = '@' + nodeName;
      }
      JSXNodes.NODE_NAMES.push(nodeName);
      currentNode = this.createNode(nodeName, value, parentId, groupId);
      this.addNode(currentNode);
    }

    if (typeof value === 'object' && !Array.isArray(value)) {
      const keyNames = Object.keys(value);
      const groupId = ++this.currentGroupId;
      keyNames.forEach(name => this.setNodes(name, value[name], currentNode.id, undefined, groupId));
    }
  }

  private removeDuplicates() {
    JSXNodes.NODE_NAMES = Array.from(new Set(JSXNodes.NODE_NAMES));
  }

  // Group together all siblings determeind by the children of parents
  private setSiblings() {
    for (let nodeName in this.nodesByName) {
      this.nodesByName[nodeName].forEach(node => {
        if (node.parentId > -1) {
          const parentNode = this.nodesByIds[node.parentId];
          const childrenNodes = parentNode.childrenIds.map(cid => this.nodesByIds[cid]);
          node.siblingIds = childrenNodes.filter(cNode => {
            return cNode.groupId === node.groupId && node.id !== cNode.id;
          }).map(node => node.id);
        }
      })
    }
  }

  private addNode(node:Node ) {
    if (this.nodesByIds.hasOwnProperty(node.id)) {
      return;
    }
    if (!this.nodesByName.hasOwnProperty(node.name)) {
      this.nodesByName[node.name] = [];
    }

    this.nodesByName[node.name].push(node);
    this.nodesByIds[node.id] = node;
    this.updateNodeAxisIds(node);
  }

  private updateNodeAxisIds(node: Node) {
    // add child id to parent children
    if (node.parentId > -1) {
      this.addChild(this.nodesByIds[node.parentId], node.id);
      this.addDescendant(this.nodesByIds[node.parentId], node.id);
      this.addAncestor(node, node.parentId);
      // this.addSiblings(node, node.parentId);
    }
  }

  private addChild(node: Node, childId: number) {
    if (!node.childrenIds.hasOwnProperty(childId)) {
      node.childrenIds.push(childId);
    }
  }

  private addDescendant(node: Node, descendantId: number) {
    if (!node.descendantIds.hasOwnProperty(descendantId)) {
      node.descendantIds.push(descendantId);
    }

    if (node.parentId > -1) {
      this.addDescendant(this.nodesByIds[node.parentId], descendantId);
    }
  }

  private addAncestor(node: Node, ancestorId: number) {
    node.ancestorIds = this.nodesByIds[node.parentId].ancestorIds.concat([node.parentId]);
  }

  getNodeValues(nodes) {
    return Array.isArray(nodes) ? nodes.map(n => n.value) : [nodes.value];
  }

  /**********************
   * TODO move this to another class NODE get functions
   */

   
  /**
   * 
   * @param nodes 
   */
  getChildrenIds(nodes): number[] {
    return nodes.reduce((list, node) => {
      list = list.concat(node.childrenIds.filter(childId => !list.includes(childId)));
      return list;
    }, []);
  }

  getChildrenNodes(nodes): Node[] {
    if (!Array.isArray(nodes)) {
      nodes = [nodes];
    }
    return this.getNodes({ids: this.getChildrenIds(nodes)});
  }

  getChildrenValues(nodes) {

  }
  
  getDescendantIds(nodes): number[] {
    return nodes.reduce((list, node:Node) => {
      list = node.descendantIds.filter(descendantId => !list.includes(descendantId));
      return list;
    }, []);
  }

  getDescendantNodes(nodes): Node[] {
    return this.getNodes({ids: this.getDescendantIds(nodes)});
  }

  getDescendantValues(nodes) {

  }

  getDescendantOrSelfIds(nodes:Node[]): number[] {
    return nodes.reduce((list, node:Node) => {
      list = node.descendantIds.concat(node.id).filter(id => !list.includes(id));
      return list;
    }, []);
  }

  getDescendantOrSelfNodes(nodes:Node[]): Node[] {
    return this.getNodes({ids: this.getDescendantOrSelfIds(nodes)});
  }

  getDescendantOrSelfValues(nodes:Node[]) {

  }
  
  getParentIds(nodes: Node[]): number[] {
    return nodes.reduce((list, node:Node) => {
      list.push(node.parentId);
      return list;
    }, []);
  }

  getParentNodes(nodes: Node[]): Node[] {
    return this.getNodes({ids: this.getParentIds(nodes)});
  }

  getParentValues(nodes:Node[]) {

  }

  getAncestorIds(nodes:Node[]): number[] {
    return nodes.reduce((list, node:Node) => {
      list = node.ancestorIds.filter(ancestorId => !list.includes(ancestorId));
      return list;
    }, []);
  }

  getAncestorNodes(nodes:Node[]): Node[] {
    return this.getNodes({ids: this.getAncestorIds(nodes)});
  }

  getAncestorValues(nodes:Node[]) {

  }

  getAncestorOrSelfIds(nodes:Node[]): number[] {
    return nodes.reduce((list, node:Node) => {
      list = node.ancestorIds.concat(node.id).filter(id => !list.includes(id));
      return list;
    }, []);
  }

  getAncestorOrSelfNodes(nodes:Node[]) {
    return this.getNodes({ids: this.getAncestorOrSelfIds(nodes)});
  }

  getAncestorOrSelfValues(nodes:Node[]) {

  }
}