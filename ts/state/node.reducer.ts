import { ROOT, NODES, AXES, OPERATOR_LHS, OPERATOR_RHS } from "../constants";
import { tokens } from '../tokens/axes.tokens';
import { Action, State } from "../JSXInterfaces";
import { JSXNodes } from "../typeHandlers/JSXNodes";
import { StateUtility } from "./utility";

export const NodesReducer = (utils: StateUtility, nodesHandler: JSXNodes) => (state: State, action: Action) => {
  let nodes, currentState;
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
            type: action.type,
            nodes,
            id: action.payload.id
          }
        },
        history: state.history.concat(utils.createHistory(action))
      };

    case NODES:
      currentState = state.subStates[state.currentStateId];
      const filterState = utils.getFilterNode(currentState.link, state.subStates);

      if (filterState && filterState.nodes) {
        switch(state.previousActionType) {
          // TODO when AXES
          default: 
            const childrenNodes = nodesHandler.getChildrenNodes(filterState.nodes);
            nodes = childrenNodes.filter(n => n.name === action.payload.value);
        }

      } else {
        nodes = currentState.nodes.filter(node => {
          return node.name === action.payload.value
        });
      }

      
      return {
        ...state,
        previousActionType: action.type,
        subStates: getSubStates(state.subStates, action, nodes, currentState),
        history: state.history.concat(utils.createHistory(action))
      };
    case ROOT:
      nodes = nodesHandler.getNodes({name: ROOT});
      return Object.keys(action.payload.link).length ? {
        ...state,
        previousActionType: action.type, 
        subStates: {
          ...state.subStates,
          [state.currentStateId]: {
            ...state.subStates[state.currentStateId],
            nodes
          }
        },
        history: state.history.concat(utils.createHistory(action))
      } : {
        ...state,
        previousActionType: action.type,
        currentStateId: action.payload.id,
        subStates: {
          [action.payload.id]: {
            type: action.type,
            nodes,
            id: action.payload.id,
            parentId: null
          }
        },
        history: state.history.concat(utils.createHistory(action))
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