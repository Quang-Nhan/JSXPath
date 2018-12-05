import { OPERATOR_LHS, OPERATOR_RHS, FILTERS, FUNCTIONS } from "../constants";
import { Action, ActionHistory, Node, State } from "../JSXInterfaces";

export class StateUtility {

  constructor() {}
  
  isFilterMode(currentStateLink, subStates: Object): boolean {
    return currentStateLink && (currentStateLink.relatedType === FILTERS || subStates[currentStateLink.relatedId] && this.isFilterMode(subStates[currentStateLink.relatedId].link, subStates)) || false;
  }

  getFilterState(currentStateLink, subStates) {
    if (!currentStateLink || !Object.keys(currentStateLink).length) {
      return;
    }

    if (currentStateLink && currentStateLink.relatedType === FILTERS) {
      return subStates[currentStateLink.relatedId];
    }

    return this.getFilterState(subStates[currentStateLink.relatedId].link, subStates);
  }

  getContext(currentState, subStates) {
    const filterState = this.getFilterState(currentState.link, subStates);

    return filterState && filterState.context;
  }

  createHistory(action: Action): ActionHistory {
    return {
      dateTime: new Date().toDateString(),
      action
    }
  }

  getUpdatedParentState(currentState, subStates) {
    let link = currentState.link;
    let parentState;
    if (link && link.relatedId) {
      parentState = subStates[link.relatedId];
    }

    if (parentState && currentState.subType === OPERATOR_LHS) {
      return {
        ...parentState,
        lhs: currentState.nodes ? currentState.nodes : currentState.value
      };
    } else if (parentState && currentState.subType === OPERATOR_RHS) {
      return {
        ...parentState,
        rhs: currentState.nodes ? currentState.nodes : currentState.value
      };
    } else if (parentState && parentState.type === FUNCTIONS) {
      return {
        ...parentState,
        arguments: parentState.arguments.concat(currentState.nodes && currentState.nodes.length ? this.getNodesValues(currentState.nodes) : currentState.value)
      }
    } else if (parentState) {
      parentState = {
        ...parentState,
        value: currentState.value
      }

      if (parentState.type === FILTERS) {
        parentState.filteredNodes = parentState.filteredNodes  && currentState.nodes ? 
          parentState.filteredNodes.concat(currentState.nodes) :
          parentState.filteredNodes || currentState.nodes;
      } else {
        parentState.nodes = currentState.nodes
      }
      return parentState;
    }
  }

  getNodesValues(nodes: Node[]): any[] {
    return nodes.map(node => node.value);
  }

  isNode(value: any): boolean {
    return value && value.hasOwnProperty('name') && value.hasOwnProperty('parentId') && value.hasOwnProperty('value') && value.hasOwnProperty('id');
  }

  updateCommonStateProperty(state:State, action:Action): State {
    return {
      ...state,
      previousActionType: action.type,
      history: state.history.concat(this.createHistory(action))
    }
  }
}