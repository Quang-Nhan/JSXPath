import { StateUtility } from "./utility";
import { Action, State, FunctionState } from "../JSXInterfaces";
import { FUNCTION_START, FUNCTION_END, FUNCTIONS, ARG_START, ARG_END, FUNCTION_ARGUMENT, TYPE_MAPPER, FILTERS } from "../constants";
import { JSXTypeMapper } from "../typeHandlers/JSXTypeMapper";


export const FunctionReducer = (utils: StateUtility, typeMapper: JSXTypeMapper) => (state: State, action: Action) => {
  let parentState, currentState;
  switch(action.type) {
    case FUNCTION_START:
      // const context = [].concat(state.subStates[action.payload.link.relatedId].nodes);
      currentState = state.subStates[state.currentStateId];
      const filterState = currentState.type === FILTERS ? currentState : utils.getFilterState(state.subStates[state.currentStateId].link, state.subStates);
      return {
        ...state,
        previousActionType: action.type,
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
            execute: typeMapper.getTypeHandler({type: FUNCTIONS}).run(filterState.nodes)
          }
        }
      };
    case FUNCTION_END:
      currentState = <FunctionState> state.subStates[state.currentStateId];
      const result = currentState.execute({args: currentState.arguments, method: currentState.functionName})
      if (Array.isArray(result) && result.length && utils.isNode(result[0] || utils.isNode(result))) {
        currentState.nodes = result;
      } else {
        currentState.value = result;
      }
      
      parentState = utils.getUpdatedParentState(currentState, state.subStates);
      return {
        ...state,
        previousActionType: action.type,
        currentStateId: action.payload.id,
        subStates: parentState ? {
          ...state.subStates,
          [parentState.id]: {
            ...parentState
          }
        } : Object.assign({}, state.subStates),
        history: state.history.concat(utils.createHistory(action))
      };
    case ARG_START: 
      return {
        ...state,
        previousActionType: action.type,
        currentStateId: action.payload.id,
        subStates: {
          ...state.subStates,
          [action.payload.id]: {
            id: action.payload.id,
            type: FUNCTION_ARGUMENT,
            link: action.payload.link
          }
        },
        history: state.history.concat(utils.createHistory(action))
      }
    case ARG_END:
      currentState = state.subStates[action.payload.id];
      parentState = utils.getUpdatedParentState(currentState, state.subStates);
      
      return {
        ...state,
        previousActionType: action.type,
        currentStateId: parentState ? parentState.id : state.currentStateId,
        subStates: parentState ? {
          ...state.subStates,
          [parentState.id]: {
            ...parentState
          }
        } : {
          ...state.subStates
        },
        history: state.history.concat(utils.createHistory(action))
      }
      
    default: return state;
  }
}