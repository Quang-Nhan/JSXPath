import { INCREMENT_CURRENT_INDEX, INPUT_ADDED, UPDATE_CURRENT_INDEX } from "../constants";

export const InputsReducer = (utils) => (inputState, action) => {
  switch (action.type) {
    case INPUT_ADDED:
      return Object.assign({}, action.payload.value);
    case INCREMENT_CURRENT_INDEX:
      return {
        ...inputState,
        currentIndex: inputState.currentIndex+1
      };
    case UPDATE_CURRENT_INDEX:
      return {
        ...inputState,
        currentIndex: action.payload.value
      };
    default: return inputState;
  }
};