import { ROOT, NODES, AXES, OPERATOR_LHS, OPERATOR_RHS, FILTERED_CONTEXT_NODES } from "../constants";
import { tokens } from '../tokens/axes.tokens';
import { Action, State } from "../JSXInterfaces";
import { JSXNodes } from "../typeHandlers/JSXNodes";
import { StateUtility } from "./utility";

export const NodesReducer = (utils: StateUtility, nodesHandler: JSXNodes) => (state: State, action: Action) => {
  let nodes, currentState, filteredSubState;
  switch (action.type) {
    case AXES:
      if (!state.currentStateId) {
        // get root node
        currentState = {
          nodes: nodesHandler.getNodes({name: ROOT}),
          id: action.payload.id
        };
      } else {
        currentState = state.subStates[state.currentStateId];
      }

      nodes = tokens[action.payload.subType](nodesHandler, currentState.nodes);
      
      return state.currentStateId ? {
        ...state,
        previousActionType: action.type,
        subStates: {
          ...state.subStates,
          [currentState.id]: {
            ...state.subStates[currentState.id],
            nodes,
            value: utils.getNodesValues(nodes)
          }
        },
        history: state.history.concat(utils.createHistory(action))
      } : {
        ...state,
        previousActionType: action.type,
        currentStateId: action.payload.id,
        subStates: {
          ...state.subStates,
          [currentState.id]: {
            id: action.payload.id,
            type: action.type,
            nodes,
            value: utils.getNodesValues(nodes),
          }
        },
        history: state.history.concat(utils.createHistory(action))
      };

    case NODES:
      currentState = state.subStates[state.currentStateId];
      
      nodes = currentState.nodes.filter(node => {
        return node.name === action.payload.value
      });
      
      return {
        ...state,
        subStates: getSubStates(state.subStates, action, nodes, currentState)
      };
    case FILTERED_CONTEXT_NODES:
      currentState = state.subStates[state.currentStateId];
      filteredSubState = utils.getFilterState(action.payload.link, state.subStates);
      const childrenNodes = nodesHandler.getChildrenNodes(filteredSubState.context);
      nodes = childrenNodes.filter(n => n.name === action.payload.value);
      return {
        ...state,
        ...utils.updateCommonStateProperty(state, action),
        subStates: getSubStates(state.subStates, action, nodes, currentState)
      }
    case ROOT:
      nodes = nodesHandler.getNodes({name: ROOT});
      return Object.keys(action.payload.link).length ? {
        ...state,
        ...utils.updateCommonStateProperty(state, action),
        subStates: {
          ...state.subStates,
          [state.currentStateId]: {
            ...state.subStates[state.currentStateId],
            nodes,
            value: utils.getNodesValues(nodes)
          }
        }
      } : {
        ...state,
        ...utils.updateCommonStateProperty(state, action),
        currentStateId: action.payload.id,
        subStates: {
          [action.payload.id]: {
            id: action.payload.id,
            type: action.type,
            nodes,
            value: utils.getNodesValues(nodes)
          }
        }
      };
    default: return state;
  }
};

const getSubStates = (subStates, action, nodes, currentState) => {
  const extra = Object.assign({}, 
    action.payload.subType === OPERATOR_LHS ? 
      {lhs: nodes} : 
      (
        action.payload.subType === OPERATOR_RHS ? 
          {rhs: nodes} : 
          {nodes}
      )
    );
  return {
    ...subStates,
    [currentState.id]: {
      ...subStates[currentState.id],
      ...extra
    }
  }
}