import { Action, State, FilterState } from "../JSXInterfaces";
import { LEFT_FITLER, RIGHT_FILTER, FILTERS, SET_CONTEXT } from "../constants";
import { StateUtility } from "./utility";


export const FilterReducer = (utils: StateUtility) => (state: State, action: Action) => {
  let currentFilterState;
  
  switch(action.type) {
    case LEFT_FITLER:
      const currentState = state.subStates[state.currentStateId]
      return {
        ...state,
        ...utils.updateCommonStateProperty(state, action),
        currentStateId: action.payload.id,
        subStates: {
          ...state.subStates,
          [action.payload.id]: {
            id: action.payload.id,
            type: FILTERS,
            link: {
              relatedId: currentState.id,
              relatedType: currentState.type
            },
            nodes: [].concat(currentState.nodes)
          }
        }
      };
    case SET_CONTEXT:
      currentFilterState = state.subStates[action.payload.id];
      return {
        ...state,
        ...utils.updateCommonStateProperty(state, action),
        subStates: {
          ...state.subStates,
          [action.payload.id]: {
            ...currentFilterState,
            context: action.payload.value
          }
        }
      };    
    case RIGHT_FILTER:
      currentFilterState = <FilterState> state.subStates[action.payload.id];
      const parentState = utils.getUpdatedParentState(currentFilterState, state.subStates);
      return {
        ...state,
        ...utils.updateCommonStateProperty(state, action),
        currentStateId: parentState ? parentState.id : state.currentStateId,
        subStates: parentState ? {
          ...state.subStates,
          [parentState.id]: {
            ...parentState,
            nodes: currentFilterState.filteredNodes,
            value: currentFilterState.value
          }
        } : {
          ...state.subStates
        }
      }
      // TODO
    default: return state;
  }
};