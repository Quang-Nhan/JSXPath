
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
  }
};

export const tokens = {
  string: (context) => (inputValue): string => {
    if (typeof inputValue === 'object') {
      return JSON.stringify(inputValue)
    }
    return String(inputValue);
  },
  position: context => (operatorType, index, indexLocation): any => {
    if (!Array.isArray(context) || !index || isNaN(index)) {
      return;
    }
    if (indexLocation === 'rhs') {
      operatorType = helper.switchOperator(operatorType);
    }
    switch(operatorType) {
      case '=':
        return context.filter((n, i) => i === index);
      case '>':
        return context.filter((n, i) => i > index);
      case '<':
        return context.filter((n, i) => i < index);
      case '>=':
        return context.filter((n, i) => i >= index);
      case '<=':
        return context.filter((n, i) => i <= index);
      case '!=': 
        return context.filter((n, i) => i !== index);
    }
  }
}