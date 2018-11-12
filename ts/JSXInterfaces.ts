import { JSXState } from "./state/JSXState";
import { JSXAxes } from "./typeHandlers/JSXAxes";
import { JSXFilters } from "./typeHandlers/JSXFilters";
import { JSXFunctions } from "./typeHandlers/JSXFunctions";
import { JSXGroupings } from "./typeHandlers/JSXGroupings";
import { JSXNodes } from "./typeHandlers/JSXNodes";
import { JSXNumbers } from "./typeHandlers/JSXNumbers";
import { JSXOperators } from "./typeHandlers/JSXOperators";
import { JSXRoot } from "./typeHandlers/JSXRoot";
import { JSXString } from "./typeHandlers/JSXString";
import { JSXVariables } from "./typeHandlers/JSXVariables";
import { JSXPathHandler } from "./JSXPathHandler";
import { JSXAction } from "./JSXAction";
import { JSXProcessor } from "./JSXProcessor";
import { JSXTypeMapper } from "./typeHandlers/JSXTypeMapper";
import { JSXPathScenarios } from "./JSXPathScenarios";
import { JSXEndOfFile } from "./typeHandlers/JSXEndOfFile";
import { JSXErrors } from "./typeHandlers/JSXErrors";
import { JSXBoolean } from "./typeHandlers/JSXBooleans";

export interface Variable {
  name: string,
  value: any
}

export interface Action {
  type: string,
  payload: {
    value?: any,
    id?: number,
    subType?: string,
    token?: string,
    link?: any
  }
};

export interface ActionHistory {
  dateTime: string,
  action: Action
};


export interface SubInstruction {
  value: string,
  endIndex: number
};

export interface Instruction {
  type: string,
  subType?: string,
  subPath: string,
  startIndex: number,
  endIndex: number,
  // next?: string,
  errorMessage?: string,
  subInstructions?: Array<Instruction>,
  lhs?:Instruction,
  rhs?:Instruction,
  id?: number,
  link: {
    relatedId?: number,
    relatedType?: string
  }
}

export interface Scenario {
  description: string,
  testScenario: Function
}


export interface Node {
  id: number,
  groupId: number,
  name: string,
  value: any,
  parentId: number,
  childrenIds: Array<number>,
  ancestorIds: Array<number>,
  descendantIds: Array<number>,
  siblingIds: Array<number>
}

export interface ImpInstruction {
  getInstruction(subPath: string, startIndex: number, prevInstruction?:Instruction): Instruction|Array<Instruction>
}

export interface ImpAction {
  getAction(instruction:Instruction, state?:State, processInstruction?:Function): Action
}

export interface RegistrarCache {
  typeHandlers: {
    AXES: JSXAxes,
    FILTERS: JSXFilters,
    FUNCTIONS: JSXFunctions,
    GROUPINGS: JSXGroupings,
    NODES: JSXNodes,
    NUMBERS: JSXNumbers,
    OPERATORS: JSXOperators,
    ROOT: JSXRoot,
    STRINGS: JSXString,
    VARIABLES: JSXVariables,
    EOF: JSXEndOfFile,
    ERROR: JSXErrors,
    BOOLEAN: JSXBoolean
  },
  stateHandler: JSXState,
  coreHandlers: {
    pathHandler: JSXPathHandler,
    actionHandler: JSXAction,
    processor: JSXProcessor,
    typeMapper: JSXTypeMapper,
    pathScenarios: JSXPathScenarios
  },
  helpers: {
    dispatch: Function,
    generateId: Function,
    createLink: Function,
    getState: Function
  }
  enums: object
}

// State interface

export interface State {
  previousActionType: string,
  values: Array<any>,
  status: string,
  message?: string,
  currentStateId?,
  subStates: {
    [key: number]: OperatorState|NodeState|FilterState|BaseState
  },
  history: Array<ActionHistory>,
  inputs?: Input, //TODO: update to allow multiple inputs, or update path
  nodes?: {
    nodesByName: object,
    nodesByIds: object,
    NODE_NAMES: Array<string>
  }
}

interface BaseState {
  id: number,
  type: string,
  link: {
    relatedId: number,
    relatedType: string
  }
}

export interface NodeState extends BaseState {
  nodes: Array<Node>|Function,
  childrenIds?: Array<number>,
  descendantIds?: Array<number>
}

export interface OperatorState extends BaseState {
  subType: string,
  operatorType: string,
  lhs?: number,
  rhs?: number,
  value: any,
  operate: Function
}

export interface FilterState extends BaseState {
  value: any,
  nodes: Array<Node>
}

export interface Input {
  id: number,
  path: string,
  parsedPath: string,
  pathLength: number,
  json: any,
  variables: object,
  currentIndex: number
}