
import {
  State,
  Action
} from '../JSXInterfaces';
import { 
  ROOT, 
  AXES,
  NODES, 
  NUMBERS, 
  STRINGS, 
  OPERATOR_START,
  OPERATOR_END, 
  FLUSH, 
  TYPE_MAPPER, 
  INPUT_ADDED, 
  OPERATOR_LHS, 
  OPERATOR_RHS, EOF, 
  LEFT_GROUPING, 
  RIGHT_GROUPING, ERROR, LEFT_FITLER, RIGHT_FILTER, FILTERS, PARSED_NODES, INCREMENT_CURRENT_INDEX, UPDATE_CURRENT_INDEX, BOOLEAN, VARIABLES } from '../constants';
import { StateUtility } from './utility';
import { JSXTypeMapper } from '../typeHandlers/JSXTypeMapper';
import { JSXRegistrar } from '../JSXRegistrar';
import { NodesReducer } from './node.reducer';
import { InputsReducer } from './inputs.reducer';
import { GroupReducer } from './group.reducer';
import { OperatorReducer} from './operator.reducer';
import { FilterReducer } from './filter.reducer';


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
  private nodeHandler;
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
  }

  private getFinalValues(currentStateId, stateValue, subStates) {
    if (currentStateId && subStates.hasOwnProperty(currentStateId)) {
      const currentState = subStates[currentStateId];
      if (currentState.nodes && Array.isArray(currentState.nodes) && currentState.nodes.length === 1) {
        return currentState.nodes[0].value;
      } else if (this.nodeHandler.isNode(currentState.value)) {
        return this.nodeHandler.getNodeValues(currentState.value);
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
        if (this.isNode(value)) {
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
      if (this.isNode(values[i])) {
        return true;
      }
    }
    return false;
  }

  private isNode(value) {
    return value.hasOwnProperty('name') && value.hasOwnProperty('parentId') && value.hasOwnProperty('value') && value.hasOwnProperty('id');
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
      case AXES:
      case ROOT:
        return this.nodesReducer(state, action);
      case STRINGS:
      case NUMBERS:
      case BOOLEAN:
      case VARIABLES:
        return action.payload.link && [OPERATOR_LHS, OPERATOR_RHS].includes(action.payload.subType) ? 
          this.operatorReducer(state, Object.assign({}, action, {type: action.payload.subType})) :
          {
            ...state,
            previousActionType: action.type,
            currentStateId: action.payload.id,
            subStates: {
              [action.payload.id]: {
                id: action.payload.id,
                type: action.type,
                value: action.payload.value,
                link: action.payload.link
              }
            },
            history: state.history.concat(this.utils.createHistory(action))
          };
      case OPERATOR_START:
      case OPERATOR_END:
        return this.operatorReducer(state, action);
      case LEFT_GROUPING:
      case RIGHT_GROUPING:
        return this.groupReducer(state, action);
      case LEFT_FITLER:
      case RIGHT_FILTER:
        return this.filterReducer(state, action); 
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
