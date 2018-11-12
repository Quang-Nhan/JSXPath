import { Action, State, OperatorState } from "../JSXInterfaces";
import { OPERATOR_START, OPERATORS, OPERATOR_LHS, OPERATOR_RHS, OPERATOR_END, FILTERS } from "../constants";


export const OperatorReducer = (utils, typeMapper) => (state:State, action:Action) => {
  switch(action.type) {
    case OPERATOR_START:
      const currentSubState = state.subStates[state.currentStateId]
      return {
        ...state,
        previousActionType: action.type,
        currentStateId: action.payload.id,
        subStates: {
          ...state.subStates,
          [action.payload.id]: {
            id: action.payload.id,
            type: OPERATORS,
            link: action.payload.link,
            lhs: null,
            rhs: null,
            operatorType: action.payload.token,
            subType: action.payload.subType,
            operate: typeMapper.getTypeHandler({type: OPERATORS}).run
          }
        },
        history: state.history.concat(utils.createHistory(action))
      };
    case OPERATOR_LHS:
      return {
        ...state,
        previousActionType: action.type,
        subStates: {
          ...state.subStates,
          [action.payload.link.relatedId]: {
            ...state.subStates[action.payload.link.relatedId],
            lhs: action.payload.value
          }
        },
        history: state.history.concat(utils.createHistory(action))
      }
    case OPERATOR_RHS: 
      return {
        ...state,
        previousActionType: action.type,
        subStates: {
          ...state.subStates,
          [action.payload.link.relatedId]: {
            ...state.subStates[action.payload.link.relatedId],
            rhs: action.payload.value
          }
        },
        history: state.history.concat(utils.createHistory(action))
      }
    case OPERATOR_END:
      let subState = <OperatorState>state.subStates[action.payload.id];
      
      // if (subState.link.relatedType === FILTERS) {
        // state.filterState.
      // } else {
        subState.value = subState.operate({
          lhs: subState.lhs, rhs: subState.rhs, operation: subState.operatorType, isFilter: utils.isFilterMode(subState.link, state.subStates)// subState.link && subState.link.relatedType === FILTERS
        });
      // }

      const parentState = utils.getUpdatedParentState(subState, state.subStates, action);

      return {
        ...state,
        previousActionType: action.type,
        currentStateId: parentState ? parentState.id : state.currentStateId,
        subStates: parentState ? {
          ...state.subStates,
          [parentState.id]: {
            ...parentState
          }
        } : Object.assign({}, state.subStates),
        history: state.history.concat(utils.createHistory(action))
      }
        
    default:
      return state
    }
}