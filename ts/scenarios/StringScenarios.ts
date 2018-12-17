import { Scenario } from "../JSXInterfaces";

export const stringScenarios: Function = (currentIndex, parsedPath): Scenario[] => [
  {
    description: 'Does the string contains a quotation mark?',
    testScenario: (chars):boolean =>  chars.length === 1 && (chars === '\'' || chars === '"'),
    /* */
    testCases: [
      {
        description: 'Passes because the current chars is a single quote mark',
        inputs: {
          currentIndex: 1,
          parsedPath: '\'Yes\'',
          chars: "'"
        },
        expectedResult: true
      },
      {
        description: 'Passes because the current chars is a double quote mark',
        inputs: {
          currentIndex: 1,
          parsedPath: '"Yes"',
          chars: '"'
        },
        expectedResult: true
      }
    ]
  }
];
