import { Scenario } from '../JSXInterfaces';
import { JSXOperators } from '../typeHandlers/JSXOperators';

export const operatorScenarios = (currentIndex, parsedPath): Array<Scenario> => [
  {
    description: 'Is an operator with 4 characters',
    testScenario: (chars) => {
      // 'not('
      return false; // TODO
      // return JSXOperators.OPERATORS.includes(chars);
    }
  },
  {
    description: 'Is an operator with 3 characters.',
    testScenario: (chars) => { // mod, div, and,
      const isSpace = parsedPath[currentIndex + 3] === ' ';
      return chars.length && isSpace && JSXOperators.SORTED_OPERATORS_BY_LENGTH[3].includes(parsedPath.slice(currentIndex, currentIndex+3));
    }
  },
  {
    description: 'Is an operator with 2 characters.',
    testScenario: (chars) => {
      // test if it is an 'or' operator or other symbol operators;
      const isSpace = parsedPath[currentIndex + 2] === ' ';
      const operator = parsedPath.slice(currentIndex, currentIndex+2);
      return chars.length && (isSpace && operator === 'or' || operator !== 'or' && JSXOperators.SORTED_OPERATORS_BY_LENGTH[2].includes(operator));
    }
  },
  {
    description: 'Is an operator with 1 character.',
    testScenario: (chars) => {
      return chars.length && JSXOperators.SORTED_OPERATORS_BY_LENGTH[1].includes(chars);
    }
  }
]