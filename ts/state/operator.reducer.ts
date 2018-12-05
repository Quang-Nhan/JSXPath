import { Action, State, OperatorState } from "../JSXInterfaces";
import { OPERATOR_START, OPERATORS, OPERATOR_LHS, OPERATOR_RHS, OPERATOR_END, FILTERS, FILTERED_CONTEXT_OPERATORS_START, FILTERED_CONTEXT_OPERATOR_LHS, FILTERED_CONTEXT_OPERATORS_END } from "../constants";
import { StateUtility } from "./utility";
import { JSXTypeMapper } from "../typeHandlers/JSXTypeMapper";


export const OperatorReducer = (utils: StateUtility, typeMapper: JSXTypeMapper) => (state:State, action:Action) => {
  let filteredSubState, currentState, operatedResult, parentState;
  switch(action.type) {
    case OPERATOR_START:
      return {
        ...state,
        ...utils.updateCommonStateProperty(state, action),
        currentStateId: action.payload.id,
        subStates: {
          ...state.subStates,
          [action.payload.id]: {
            ...getStartProperties(action),
            operate: typeMapper.getTypeHandler({type: OPERATORS}).run()
          }
        }
      };
    case FILTERED_CONTEXT_OPERATORS_START:
      filteredSubState = utils.getFilterState(action.payload.link, state.subStates);
      return {
        ...state,
        ...utils.updateCommonStateProperty(state, action),
        currentStateId: action.payload.id,
        subStates: {
          ...state.subStates,
          [action.payload.id]: {
            ...getStartProperties(action),
            operate: typeMapper.getTypeHandler({type: OPERATORS}).run(filteredSubState.context)
          }
        }
      };


    case OPERATOR_LHS:
      return {
        ...state,
        previousActionType: action.type,
        subStates: {
          ...state.subStates,
          [action.payload.link.relatedId]: {
            ...state.subStates[action.payload.link.relatedId],
            lhs:  action.payload.value
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
      currentState = <OperatorState>state.subStates[action.payload.id];
      
      operatedResult = currentState.operate({
        lhs: currentState.lhs, 
        rhs: currentState.rhs, 
        operation: currentState.operatorType, 
        isFilter: utils.isFilterMode(currentState.link, state.subStates)// subState.link && subState.link.relatedType === FILTERS
      });
      
      if (Array.isArray(operatedResult) && utils.isNode(operatedResult[0]) || utils.isNode(operatedResult)) {
        currentState.nodes = operatedResult;
        currentState.value = utils.getNodesValues(operatedResult);
      } else {
        currentState.value = operatedResult;
      }

      parentState = utils.getUpdatedParentState(currentState, state.subStates);

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
    case FILTERED_CONTEXT_OPERATORS_END:
      currentState= <OperatorState>state.subStates[action.payload.id];
        
      operatedResult = currentState.operate({
        lhs: currentState.lhs, 
        rhs: currentState.rhs, 
        operation: currentState.operatorType, 
        isFilter: utils.isFilterMode(currentState.link, state.subStates)// subState.link && subState.link.relatedType === FILTERS
      });
      
      if (!Array.isArray(operatedResult) && utils.isNode(operatedResult)) {
        operatedResult = [operatedResult];
      }

      if (Array.isArray(operatedResult) && utils.isNode(operatedResult[0])) {
        currentState.nodes = operatedResult;
        currentState.value = utils.getNodesValues(operatedResult);
      } else {
        currentState.value = operatedResult;
      }

      parentState = utils.getUpdatedParentState(currentState, state.subStates);

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

const getStartProperties = (action) => {
  return {
    id: action.payload.id,
    type: OPERATORS,
    link: action.payload.link,
    lhs: null,
    rhs: null,
    operatorType: action.payload.token,
    subType: action.payload.subType
  }
}

const getHSProperties = (action) => {
  return {
    
  }
}