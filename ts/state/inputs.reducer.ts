import { INCREMENT_CURRENT_INDEX, INPUT_ADDED, UPDATE_CURRENT_INDEX } from "../constants";
import { StateUtility } from "./utility";

export const InputsReducer = (utils: StateUtility) => (inputStates, action) => {
  switch (action.type) {
    case INPUT_ADDED:
      return {
        ...inputStates,
        [action.payload.id]: {
          id: action.payload.id,
          ...action.payload.value
        }
      }
    case INCREMENT_CURRENT_INDEX:
      return {
        ...inputStates,
        [action.payload.id]: {
          ...inputStates[action.payload.id],
          currentIndex: inputStates[action.payload.id].currentIndex+1
        }
      };
    case UPDATE_CURRENT_INDEX:
      return {
        ...inputStates,
        [action.payload.id]: {
          ...inputStates[action.payload.id],
          currentIndex: action.payload.value
        }
      };
    default: return inputStates;
  }
};