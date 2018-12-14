import { StateUtility } from "./utility";
import { Action, State, FunctionState } from "../JSXInterfaces";
import { FUNCTION_START, FUNCTION_END, FUNCTIONS, ARG_START, ARG_END, FUNCTION_ARGUMENT, TYPE_MAPPER, FILTERS, FILTERED_CONTEXT_FUNCTION_START, FILTERED_CONTEXT_FUNCTION_END, ROOT } from "../constants";
import { JSXTypeMapper } from "../typeHandlers/JSXTypeMapper";
import { JSXNodes } from "../typeHandlers/JSXNodes";


export const FunctionReducer = (utils: StateUtility, typeMapper: JSXTypeMapper, nodeHandler: JSXNodes) => (state: State, action: Action) => {
  let parentState, currentState, filterState, result;
  switch(action.type) {
    case FUNCTION_START:
      // const context = [].concat(state.subStates[action.payload.link.relatedId].nodes);
      // currentState = state.subStates[state.currentStateId];
      // filterState = currentState.type === FILTERS ? currentState : utils.getFilterState(state.subStates[state.currentStateId].link, state.subStates);
      // return {
      //   ...state,
      //   ...utils.updateCommonStateProperty(state, action),
      //   currentStateId: action.payload.id,
      //   subStates: {
      //     ...state.subStates,
      //     [action.payload.id]: {
      //       id: action.payload.id,
      //       type: FUNCTIONS,
      //       link: action.payload.link,
      //       subType: action.payload.subType,
      //       functionName: action.payload.token,
      //       arguments: [],
      //       execute: typeMapper.getTypeHandler({type: FUNCTIONS}).run(filterState.nodes)
      //     }
      //   }
      // };

      return {
        ...state,
        ...utils.updateCommonStateProperty(state, action),
        subStates: {
          ...state.subStates,
          [action.payload.id]: {
            id: action.payload.id,
            type: FUNCTIONS,
          link: action.payload.link,
            subType: action.payload.subType,
            functionName: action.payload.token,
            arguments: [],
            execute: typeMapper.getTypeHandler({type: FUNCTIONS}).run(nodeHandler.getNodes({name: ROOT}))
          }
        }
      }
    case FUNCTION_END:
      currentState = <FunctionState> state.subStates[state.currentStateId];
      result = currentState.execute({args: currentState.arguments, method: currentState.functionName})
      if (Array.isArray(result) && result.length && utils.isNode(result[0] || utils.isNode(result))) {
        currentState.nodes = result;
      } else {
        currentState.value = result;
      }
      
      parentState = utils.getUpdatedParentState(currentState, state.subStates);
      return {
        ...state,
        ...utils.updateCommonStateProperty(state, action),
        currentStateId: action.payload.id,
        subStates: parentState ? {
          ...state.subStates,
          [parentState.id]: {
            ...parentState
          }
        } : Object.assign({}, state.subStates),
      };
      case FILTERED_CONTEXT_FUNCTION_START:
      // const context = [].concat(state.subStates[action.payload.link.relatedId].nodes);
      currentState = state.subStates[state.currentStateId];
      filterState = currentState.type === FILTERS ? currentState : utils.getFilterState(state.subStates[state.currentStateId].link, state.subStates);
      return {
        ...state,
        ...utils.updateCommonStateProperty(state, action),
        currentStateId: action.payload.id,
        subStates: {
          ...state.subStates,
          [action.payload.id]: {
            id: action.payload.id,
            type: FUNCTIONS,
            link: action.payload.link,
            subType: action.payload.subType,
            functionName: action.payload.token,
            arguments: [],
            execute: typeMapper.getTypeHandler({type: FUNCTIONS}).run(filterState.context)
          }
        }
      };
    case FILTERED_CONTEXT_FUNCTION_END:
      currentState = <FunctionState> state.subStates[state.currentStateId];
      result = currentState.execute({args: currentState.arguments, method: currentState.functionName});
      if (Array.isArray(result) && result.length && utils.isNode(result[0]) || utils.isNode(result)) {
        currentState.nodes = result;
      } else {
        currentState.value = result;
      }
      
      parentState = utils.getUpdatedParentState(currentState, state.subStates);
      return {
        ...state,
        ...utils.updateCommonStateProperty(state, action),
        currentStateId: action.payload.id,
        subStates: parentState ? {
          ...state.subStates,
          [parentState.id]: {
            ...parentState
          }
        } : Object.assign({}, state.subStates),
      };
    case ARG_START: 
      return {
        ...state,
        ...utils.updateCommonStateProperty(state, action),
        currentStateId: action.payload.id,
        subStates: {
          ...state.subStates,
          [action.payload.id]: {
            id: action.payload.id,
            type: FUNCTION_ARGUMENT,
            link: action.payload.link
          }
        },
      }
    case ARG_END:
      currentState = state.subStates[action.payload.id];
      parentState = utils.getUpdatedParentState(currentState, state.subStates);
      
      return {
        ...state,
        ...utils.updateCommonStateProperty(state, action),
        currentStateId: parentState ? parentState.id : state.currentStateId,
        subStates: parentState ? {
          ...state.subStates,
          [parentState.id]: {
            ...parentState
          }
        } : {
          ...state.subStates
        },
      }
      
    default: return state;
  }
}