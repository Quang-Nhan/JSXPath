
import { JSXAxes } from '../typeHandlers/JSXAxes';
import { JSXOperators } from '../typeHandlers/JSXOperators';

export const axesScenarios: Function = (currentIndex, parsedPath) => [
  {
    description: 'Is descendant axes',
    testScenario: (chars) => chars === '//'
  },
  {
    description: 'Is child axes',
    testScenario: (chars) => {
      const isSingleCharOperator = currentIndex > 1 && JSXOperators.SORTED_OPERATORS_BY_LENGTH['1'].includes(parsedPath[currentIndex-1]);
      const isDoubleCharOperator = currentIndex > 2 && JSXOperators.SORTED_OPERATORS_BY_LENGTH['2'].includes(parsedPath[currentIndex-2] + parsedPath[currentIndex-1]);
      return chars === '/' && currentIndex !== 0 && parsedPath[currentIndex + 1] !== '/' && parsedPath[currentIndex-1] !== ' ' && !isSingleCharOperator && !isDoubleCharOperator;
    }
  },
  {
    description: 'is an axes',
    testScenario: (chars) => JSXAxes.JSX_AXES.includes(chars)
  }
];