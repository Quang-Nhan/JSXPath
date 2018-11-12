import { FILTERS, OPERATOR_LHS, OPERATOR_RHS } from "../constants";
import { Action, ActionHistory } from "../JSXInterfaces";

export class StateUtility {

  constructor() {}
  
  isFilterMode(currentStateLink, subStates: Object): boolean {
    return currentStateLink && (currentStateLink.relatedType === FILTERS || subStates[currentStateLink.relatedId] && this.isFilterMode(subStates[currentStateLink.relatedId].link, subStates)) || false;
  }

  getFilterNode(currentStateLink, subStates) {
    if (!currentStateLink || !Object.keys(currentStateLink).length) {
      return;
    }

    if (currentStateLink && currentStateLink.relatedType === FILTERS) {
      return subStates[currentStateLink.relatedId];
    }

    return this.getFilterNode(subStates[currentStateLink.relatedId].link, subStates);
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
        lhs: currentState.value
      };
    } else if (parentState && currentState.subType === OPERATOR_RHS) {
      return {
        ...parentState,
        rhs: currentState.value
      };
    } else if (parentState) {
      return {
        ...parentState,
        value: currentState.value
      };
    }
  }

  
}