
type tFunctionsFunction = (...args: tStack[]) => tStack

export type tFunctions = {
  [functionName: string]: tFunctionsFunction
};

export type tVariables = {
  [variableName: string]: any
};

// https://dev.to/ankittanna/how-to-create-a-type-for-complex-json-object-in-typescript-d81
type tJSONValue =
  | string
  | number
  | boolean
  | tJSONObject
  | iJSONArray;
type tJSONObject = {
  [x: string]: tJSONValue|null;
};
interface iJSONArray extends Array<tJSONValue|null> { };
export type tJSON = tJSONObject | iJSONArray;

export type tRunPathsInput = {
  json: tJSON,
  functions?: tFunctions,
  variables?: tVariables,
  // return optional nodes and nodesValue in callback mode
  outputOptions?: {
    nodes?: boolean
  }
};

export type tRunPathResult = {
  path: string,
  description?: string,
  value: any,
  error?: string,
  // set when outputOptions.nodes is true
  nodes?: tNodesState['nodes']['byId'],
  nodesValue?: tNode[]
};

export type tPathWithCallBack = {
  path: string,
  then(result: tRunPathResult),
  description?: string,
  [key: string]: any
};

export enum eStackTypesObject  {
  number = 'number',
  boolean = 'boolean',
  string = 'string',
  nodes = 'nodes',
  function = 'function',
  arguments = 'arguments',
  position = 'position',
  operator = 'operator',
  operatedValues = 'operatedValues',
  variable = 'variable',
  variablePath = 'variablePath',
  null = 'null',
  undefined = 'undefined',
  rootPath = 'rootPath',
  path = 'path',
  invalid = 'invalid'
};

export type tConsts = {
  AXES: string[],
  OPERATORS: {
    byName: { [key: string]: string },
    byLength: { [key: number ]: string[] }
    values: string[],
  },
  OPERATOR_PRECEDENCE: Array<string[]>,
  GROUPINGS: {
    [key: string]: string
  },
  FILTERS: {
    [key: string]: string
  },
  TYPES: {
    [key in eStackTypesObject]: keyof typeof eStackTypesObject
  }
};

export type tGuid = string;

export type tNodeLinks = {
  parentId?: number,
  childrenIds?: number[],
  descendantIds?: number[],
  ancestorIds?: number[],
  siblings?: number[]
};
export type tNode = [
  id: number,
  depth: number,
  group: number|string,
  arrayPosition: number|string,
  key: string,
  value: any,
  valueType: string,
  links: tNodeLinks
];
// singleton state shared across main Nodes set and Variables
export type tNodesState = {
  nodes: {
    byCaller: {
      [caller: string]: tNode[]
    },
    byId: {
      [key:number]: tNode
    }
  },
  // id and group to be incremented globally
  id: number,
  group: number
};
export interface iState {
  setCaller(caller: string): void,
  addNode(node: tNode): void,
  getNodes(caller?: string): tNode[],
  getNodesByIds(ids: number[]): tNode[],
  getNodeById(id: number): tNode,
  incrementId(): number,
  incrementGroup(): number,
  getId(): number,
  reset(): void
};

export type tStackOperator = string;
export type tStack = {
  type: keyof typeof eStackTypesObject,
  value: any,
  callerId?: string,  // used when type is TYPES.nodes /paths/rootPaths/variables
  startedFromRoot?: boolean | undefined // used for nodes in filter mode and the path starts at root
};
export type tStackMix = tStack|tStack[]
export type tStackParent = {
  [id: string]: tStackMix[]
};

export type tFilterModeOptions = {
  isFilterMode?: boolean,
  current?: tNode,
  // Index starting at 1
  index?: number,
  lastIndex?: number,
  firstIndex?: number
};