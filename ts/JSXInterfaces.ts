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
import { JSXPathHandler } from "./pathParser/JSXPathHandler";
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
    id?: number,
    value?: any,
    subType?: string,
    /** Used by Operators */
    token?: string,
    link?: any
  }
};

export interface ActionHistory {
  dateTime: number,
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
  errorMessage?: string,
  subInstructions?: Instruction[],
  args?: Array<Instruction[]>
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
  testScenario: Function,
  testCases: testCase[]
}

export interface testCase {
  description: string,
  inputs: {
    currentIndex: number,
    parsedPath: string,
    state?: object,
    chars: string
  },
  expectedResult: any
}


export interface Node {
  id: number,
  groupId: number,
  name: string,
  value: any,
  parentId: number,
  childrenIds: number[],
  ancestorIds: number[],
  descendantIds: number[],
  siblingIds: number[],
  position?: number
}

export interface ImpInstruction {
  getInstruction(subPath: string, startIndex: number, handlerId:number, prevInstruction?:Instruction): Instruction|Instruction[]
};

export interface ActionParams {
  instruction:Instruction, 
  processInstruction?:Function, 
  isFilterContext?:boolean
};

export interface ImpAction {
  getAction(params: ActionParams): Action,
  getFilteredContextAction(params: ActionParams): Action
};

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
  helpers: CacheHelpers,
  enums: object
}

export interface CacheHelpers {
  dispatch: Function,
  generateId: Function,
  createLink: Function,
  getState: Function
};

// State interface

export interface State {
  previousActionType: string,
  values: any[],
  status: string,
  message?: string,
  currentStateId?,
  subStates: {
    [key: number]: OperatorState|NodeState|FilterState
  },
  history: ActionHistory[],
  inputs?: Inputs, //TODO: update to allow multiple inputs, or update path
  nodes?: {
    nodesByName: object,
    nodesByIds: object,
    NODE_NAMES: string[]
  }
}

interface BaseState {
  id: number,
  type: string,
  link: {
    relatedId: number,
    relatedType: string
  },
  value: any,
  nodes: Node[]
}

export interface NodeState extends BaseState {
  childrenIds?: number[],
  descendantIds?: number[]
}

export interface OperatorState extends BaseState {
  subType: string,
  operatorType: string,
  lhs?: number,
  rhs?: number,
  operate: Function
}

export interface FilterState extends BaseState {
  filteredNodes: Node[],
  context: any
}

export interface FunctionState extends BaseState {
  functionName: string,
  arguments: any[],
  execute: Function
}

export interface Inputs {
  [id: number]: Input
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