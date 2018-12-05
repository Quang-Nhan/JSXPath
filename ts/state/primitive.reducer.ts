import { Action } from "../JSXInterfaces";
import { OPERATOR_LHS, OPERATOR_RHS, FUNCTION_ARGUMENT } from "../constants";
import { StateUtility } from "./utility";

export const PrimitiveReducer = (utils: StateUtility, operatorReducer) => (state, action:Action) => {

  if (action.payload.link && [OPERATOR_LHS, OPERATOR_RHS].includes(action.payload.subType)) {
    action.type = action.payload.subType;
    return operatorReducer(state, action);
  } else if (action.payload.link && action.payload.link.relatedType === FUNCTION_ARGUMENT) {
    return {
      ...state,
      ...utils.updateCommonStateProperty(state, action),
      currentStateId: action.payload.id,
      subStates: {
        ...state.subStates,
        [action.payload.link.relatedId]: {
          ...state.subStates[action.payload.link.relatedId],
          value: action.payload.value
        }
      }
    }
  } else {
    return  {
      ...state,
      ...utils.updateCommonStateProperty(state, action),
      currentStateId: action.payload.id,
      subStates: {
        [action.payload.id]: {
          id: action.payload.id,
          type: action.type,
          value: action.payload.value,
          link: action.payload.link
        }
      }
    }
  }
};
