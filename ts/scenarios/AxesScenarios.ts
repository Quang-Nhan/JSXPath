
import { JSXAxes } from '../typeHandlers/JSXAxes';
import { JSXOperators } from '../typeHandlers/JSXOperators';
import { Scenario } from '../JSXInterfaces';

export const axesScenarios: Function = (currentIndex, parsedPath): Scenario[] =>  [ //order is important
  {
    description: 'Is descendant axes',
    testScenario: (chars) => chars === '//',
    /* */
    testCases: [
      {
        description: 'Passes because is // characters',
        inputs: {
          currentIndex: 1,
          parsedPath: '//a',
          chars: '//'
        },
        expectedResult: true
      }
    ]
  },
  {
    description: 'Is child axes',
    testScenario: (chars) => {
      const isSingleCharOperator = currentIndex > 1 && JSXOperators.SORTED_OPERATORS_BY_LENGTH['1'].includes(parsedPath[currentIndex-1]);
      const isDoubleCharOperator = currentIndex > 2 && JSXOperators.SORTED_OPERATORS_BY_LENGTH['2'].includes(parsedPath[currentIndex-2] + parsedPath[currentIndex-1]);
      return chars === '/' && currentIndex !== 0 && parsedPath[currentIndex + 1] !== '/' && parsedPath[currentIndex-1] !== ' ' && !isSingleCharOperator && !isDoubleCharOperator;
    },
    /* NOTE some odd behaviour in isolation but it will pass at run time */
    testCases: [
      {
        description: 'Passes because is / character',
        inputs: {
          currentIndex: 2,
          parsedPath: '/a/@b',
          chars: '/'
        },
        expectedResult: true
      }
    ]
  },
  {
    description: 'is an axes',
    testScenario:  (chars) => { return JSXAxes.JSX_AXES.includes(chars)},
    /* */
    testCases: [
      {
        description: 'Passes because the current substring is an axes',
        inputs: {
          currentIndex: 18,
          parsedPath: '/a/ancestorOrSelf::*',
          chars: 'ancestorOrSelf::'
        },
        expectedResult: true
      }
    ]
  }
];