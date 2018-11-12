import { Action, State, NodeState, FilterState } from "../JSXInterfaces";
import { LEFT_FITLER, RIGHT_FILTER, FILTERS } from "../constants";


export const FilterReducer = (utils) => (state: State, action: Action) => {
  
  
  switch(action.type) {
    case LEFT_FITLER:
      const currentSubState = <NodeState> state.subStates[state.currentStateId]
      return {
        ...state,
        previousActionType: action.type,
        currentStateId: action.payload.id,
        subStates: {
          ...state.subStates,
          [action.payload.id]: {
            id: action.payload.id,
            type: FILTERS,
            link: {
              relatedId: currentSubState.id,
              relatedType: currentSubState.type
            },
            nodes: [].concat(currentSubState.nodes)
          }
        },
        history: state.history.concat(utils.createHistory(action))
      };
    case RIGHT_FILTER:
      const subState = <FilterState> state.subStates[action.payload.id];
      const parentState = utils.getUpdatedParentState(subState, state.subStates, action);
      const filteredNodes = subState.nodes.filter(n => {
        return n.childrenIds.filter(cid => subState.value.map(s => s.id).includes(cid)).length;
      });
      return {
        ...state,
        previousActionType: action.type,
        currentStateId: parentState ? parentState.id : state.currentStateId,
        subStates: parentState ? {
          ...state.subStates,
          [parentState.id]: {
            ...parentState,
            value: filteredNodes
          }
        } : {
          ...state.subStates
        },
        history: state.history.concat(utils.createHistory(action))
      }
      // TODO
    default: return state;
  }
};