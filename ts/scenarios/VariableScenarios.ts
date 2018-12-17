import { JSXVariables } from '../typeHandlers/JSXVariables';
import { Scenario } from '../JSXInterfaces';

export const variableScenarios: Function = (currentIndex, parsedPath): Scenario[] => [
  {
    description: 'first character starts with a dollar sign and a match can be found in the variable map',
    testScenario: (chars) => chars[0] === '$' && JSXVariables.VARIABLES.includes(chars),

    /* */
    testCases: [
      {
        description: 'Passes because the current chars is "true"',
        inputs: {
          currentIndex: 1,
          parsedPath: '/a/@b === "true"',
          chars: 'true'
        },
        expectedResult: true
      }
    ]
  }
];