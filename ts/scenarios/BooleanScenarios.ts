import { Scenario } from '../JSXInterfaces';

export const booleanScenarios: Function = (currentIndex, parsedPath): Scenario[] => [
  {// 1
    description: 'Is true',
    testScenario: (chars) => chars === 'true',
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

  },
  { //2
    description: 'Is false',
    testScenario: (chars) => chars === 'false',
    /* */
    testCases: [
      {
        description: 'Passes because is the current chars is "false"',
        inputs: {
          currentIndex: 1,
          parsedPath: '/a/@b === "false"',
          chars: 'false'
        },
        expectedResult: true
      }
    ]
  }
];