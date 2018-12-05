import { Action } from "../JSXInterfaces";
import { LEFT_GROUPING, GROUPINGS, RIGHT_GROUPING, OPERATOR_LHS, OPERATOR_RHS } from "../constants";
import { StateUtility } from "./utility";


export const GroupReducer = (utils: StateUtility) => (state, action: Action) => {
  switch(action.type) {
    case LEFT_GROUPING:
      return {
        ...state,
        previousActionType: action.type,
        currentStateId: action.payload.id,
        subStates: {
          ...state.subStates,
          [action.payload.id]: {
            id: action.payload.id,
            type: GROUPINGS,
            link: action.payload.link,
            subType: action.payload.subType
          }
        },
        history: state.history.concat(utils.createHistory(action))
      };
    case RIGHT_GROUPING:
      
      const subState = state.subStates[action.payload.id];
      const parentState = utils.getUpdatedParentState(subState, state.subStates);
      return {
        ...state,
        previousActionType: action.type,
        currentStateId: parentState ? parentState.id : state.currentStateId,
        subStates: parentState ? {
          ...state.subStates,
          [parentState.id] : {
            ...parentState,
            lhs: subState.subType === OPERATOR_LHS ? subState.nodes || subState.value : parentState.lhs,
            rhs: subState.subType === OPERATOR_RHS ? subState.nodes || subState.value : parentState.rhs
          }
        } : Object.assign({}, state.subStates),
        history: state.history.concat(utils.createHistory(action))
      }
    default:
      return state;
  }
};