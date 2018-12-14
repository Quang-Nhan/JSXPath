
/**
 * TODO: errorhandling
 */
const helper = {
  switchOperator: (operatorType) => {
    switch(operatorType) {
      case '<':
        return '>='
      case '>':
        return '<=';
      case '<=':
        return '>';
      case '>=':
        return '<';
      default: return operatorType;
    }
  },
  isValidPosition: (operatorType, contextIndex, index): boolean => {
    switch(operatorType) {
      case '=':
        return contextIndex === index;
      case '>':
        return contextIndex > index;
      case '<':
        return contextIndex < index;
      case '>=':
        return contextIndex >= index;
      case '<=':
        return contextIndex <= index;
      case '!=': 
        return contextIndex !== index;
    }
  }
};

export const tokens = {
  string: context => (inputValue): string => {
    if (typeof inputValue === 'object') {
      return JSON.stringify(inputValue)
    }
    return String(inputValue);
  },
  position: context => (operatorType, index, indexLocation): any => {
    if (!context || index === undefined || index === null || isNaN(index)) {
      return;
    }
    if (indexLocation === 'lhs') {
      operatorType = helper.switchOperator(operatorType);
    }
    return helper.isValidPosition(operatorType, context.position, index) ? context : null;
  }
}