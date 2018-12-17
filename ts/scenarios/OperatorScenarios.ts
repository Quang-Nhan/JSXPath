import { Scenario } from '../JSXInterfaces';
import { JSXOperators } from '../typeHandlers/JSXOperators';

export const operatorScenarios = (currentIndex, parsedPath): Scenario[] => [
  {
    description: 'Is an operator with 3 characters.',
    testScenario: (chars) => { // mod, div, and,
      const isSpace = parsedPath[currentIndex + 3] === ' ';
      return chars.length && isSpace && JSXOperators.SORTED_OPERATORS_BY_LENGTH[3].includes(parsedPath.slice(currentIndex, currentIndex+3));
    },
    testCases: [
      {
        description: 'Passes because the current index is pointing to the start of an operator that has three characters.',
        inputs: {
          currentIndex: 7,
          parsedPath: 'bumble and bee',
          chars: 'a'
        },
        expectedResult: true
      }
    ]
  },
  {
    description: 'Is an operator with 2 characters.',
    testScenario: (chars) => {
      // test if it is an 'or' operator or other symbol operators;
      const isSpace = parsedPath[currentIndex + 2] === ' ';
      const operator = parsedPath.slice(currentIndex, currentIndex+2);
      return chars.length && (isSpace && operator === 'or' || operator !== 'or' && JSXOperators.SORTED_OPERATORS_BY_LENGTH[2].includes(operator));
    },
    testCases: [
      {
        description: 'Passes because the current index is pointing to the start of an operator that has two characters.',
        inputs: {
          currentIndex: 2,
          parsedPath: 'a or b',
          chars: 'o'
        },
        expectedResult: true
      }
    ]
  },
  {
    description: 'Is an operator with 1 character.',
    testScenario: (chars) => {
      return chars.length && JSXOperators.SORTED_OPERATORS_BY_LENGTH[1].includes(chars);
    },
    testCases: [
      {
        description: 'Passes because the chars is a single character operator.',
        inputs: {
          currentIndex: 2,
          parsedPath: '1 + 2',
          chars: '+'
        },
        expectedResult: true
      }
    ]
  }
]