

import { JSXRegistrar } from '../JSXRegistrar';
import { JSXTypeMapper } from '../typeHandlers/JSXTypeMapper';
import { JSXNodes } from '../typeHandlers/JSXNodes';
import { StateUtility } from './utility';
import { NodesReducer } from './node.reducer';
import { InputsReducer } from './inputs.reducer';
import { GroupReducer } from './group.reducer';
import { OperatorReducer } from './operator.reducer';
import { FilterReducer } from './filter.reducer';
import { PrimitiveReducer } from './primitive.reducer';
import { FunctionReducer } from './function.reducer';
import {
  State,
  Action
} from '../JSXInterfaces';
import {
  ARG_END,
  ARG_START,
  AXES,
  BOOLEAN, 
  EOF, 
  ERROR, 
  FILTERED_CONTEXT_FUNCTION_END,
  FILTERED_CONTEXT_FUNCTION_START,
  FILTERED_CONTEXT_NODES,
  FILTERED_CONTEXT_NUMBERS,
  FILTERED_CONTEXT_OPERATORS_END,
  FILTERED_CONTEXT_OPERATORS_START,
  FILTERS, 
  FLUSH, 
  FUNCTION_END,
  FUNCTION_START, 
  INCREMENT_CURRENT_INDEX, 
  INPUT_ADDED, 
  LEFT_FITLER, 
  LEFT_GROUPING, 
  NODES, 
  NUMBERS, 
  OPERATOR_END, 
  OPERATOR_START,
  PARSED_NODES, 
  RIGHT_FILTER, 
  RIGHT_GROUPING, 
  ROOT, 
  SET_CONTEXT,
  STRINGS, 
  TYPE_MAPPER, 
  UPDATE_CURRENT_INDEX, 
  VARIABLES,
  FILTERED_CONTEXT_AXES
} from '../constants';


export class JSXState {
  state: State = {
    previousActionType: null,
    status: 'success',
    values: [],
    subStates: {},
    history: []
  };
  private typeMapper: JSXTypeMapper;
  private nodesReducer;
  private inputsReducer;
  private groupReducer;
  private operatorReducer;
  private filterReducer;
  private nodeHandler: JSXNodes;
  private functionReducer;
  private primitiveReducer;
  utils;

  constructor(private reg: JSXRegistrar) {}

  init() {
    this.utils = new StateUtility();
    [this.typeMapper, this.nodeHandler] = this.reg.get([TYPE_MAPPER, NODES]);
    this.nodesReducer = NodesReducer(this.utils, this.nodeHandler);
    this.inputsReducer = InputsReducer(this.utils);
    this.groupReducer = GroupReducer(this.utils);
    this.operatorReducer = OperatorReducer(this.utils, this.typeMapper);
    this.filterReducer = FilterReducer(this.utils);
    this.functionReducer = FunctionReducer(this.utils, this.typeMapper, this.nodeHandler);
    this.primitiveReducer = PrimitiveReducer(this.utils, this.operatorReducer);
  }

  private getFinalValues(currentStateId, stateValue, subStates) {
    if (currentStateId && subStates.hasOwnProperty(currentStateId)) {
      const currentState = subStates[currentStateId];
      if (currentState.nodes && Array.isArray(currentState.nodes) && currentState.nodes.length === 1) {
        // return currentState.nodes[0].value; // TODO decide if we want to return single value for an array with 1 value?
        return this.nodeHandler.getNodeValues(currentState.nodes);
      } else if (this.nodeHandler.isNode(currentState.value)) {
        return this.nodeHandler.getNodeValues(currentState.value);
      } else if (currentState.filteredNodes) {
        return this.nodeHandler.getNodeValues(currentState.filteredNodes);
      } else if (currentState.nodes) {
        return this.nodeHandler.getNodeValues(currentState.nodes);
      } else {
        return currentState.value;
      }
    }

    if (!currentStateId) {
      return this.parseValue(stateValue);
    }

    const firstSubState = subStates[0];
    if (firstSubState.type === FILTERS && firstSubState.value) {
      return this.parseValue(stateValue);
    }
  }

  private parseValue(values) {
    if (Array.isArray(values) && this.containsNodes(values)) {
      return values.map(value => {
        if (this.utils.isNode(value)) {
          return value.value;
        }
        return value;
      })
    }
    return values;
  }

  private containsNodes(values) {
    // assume values are arrays
    for (let i = 0; i < values.length; ++i) {
      if (this.utils.isNode(values[i])) {
        return true;
      }
    }
    return false;
  }

  private reducer(state: State, action:Action): State {
    switch(action.type) {
      case INPUT_ADDED:
      case INCREMENT_CURRENT_INDEX:
      case UPDATE_CURRENT_INDEX:
        return {
          ...state,
          previousActionType: action.type,
          inputs: this.inputsReducer(state.inputs, action),
          history: state.history.concat(this.utils.createHistory(action))
        };
      case PARSED_NODES:
        return {
          ...state,
          previousActionType: action.type,
          nodes: action.payload.value,
          history: state.history.concat(this.utils.createHistory(action))
        };
      case NODES:
      case FILTERED_CONTEXT_NODES:
      case AXES:
      case FILTERED_CONTEXT_AXES:
      case ROOT:
        return this.nodesReducer(state, action);
      case STRINGS:
      case NUMBERS:
      case BOOLEAN:
      case VARIABLES:
      case FILTERED_CONTEXT_NUMBERS:
        return this.primitiveReducer(state, action);
      case OPERATOR_START:
      case OPERATOR_END:
      case FILTERED_CONTEXT_OPERATORS_START:
      case FILTERED_CONTEXT_OPERATORS_END:
        return this.operatorReducer(state, action);
      case LEFT_GROUPING:
      case RIGHT_GROUPING:
        return this.groupReducer(state, action);
      case LEFT_FITLER:
      case SET_CONTEXT:
      case RIGHT_FILTER:
        return this.filterReducer(state, action);
      case FUNCTION_START:
      case FUNCTION_END:
      case ARG_START:
      case ARG_END:
      case FILTERED_CONTEXT_FUNCTION_START:
      case FILTERED_CONTEXT_FUNCTION_END:
        return this.functionReducer(state, action);
      case FLUSH:
        return {
          previousActionType: null,
          status: 'success',
          values: [],
          subStates: {},
          history: [],
          nodes: {
            NODE_NAMES: [],
            nodesByIds: {},
            nodesByName: {},
          }
        };
      case EOF:
        return {
          ...state,
          values: this.getFinalValues(state.currentStateId, state.values, state.subStates),
          history: state.history.concat(this.utils.createHistory(action))
        };
      case ERROR:
        return {
          ...state,
          status: 'error',
          message: action.payload.value,
          values: null,
          history: state.history.concat(this.utils.createHistory(action))
        };
      default: return state;
    }
  }

  dispatch(actionPayload) {
    this.state = this.reducer(this.state, actionPayload);
  }

  getState():State {
    return this.state;
  }

  getHist() {
    return this.state.history;
  }
}
