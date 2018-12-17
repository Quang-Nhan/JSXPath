import { JSXFunctions } from '../typeHandlers/JSXFunctions';
import { Scenario } from '../JSXInterfaces';


export const functionScenarios: Function = (currentIndex, parsedParth): Scenario[] => [
  {
    description: 'first character is # followed by check if it matches the cached function names',
    testScenario: (chars): boolean => chars[0] === '#' && JSXFunctions.JSX_FUNCTIONS.includes(chars),
    testCases: [
      {
        description: 'Passes because the current substring is a function name.',
        inputs: {
          currentIndex: 7,
          parsedPath: '#string(22)',
          chars: '#string('
        },
        expectedResult: true
      }
    ]
  }
]