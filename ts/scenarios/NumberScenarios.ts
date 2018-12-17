import { Scenario } from "../JSXInterfaces";

export const numberScenarios = (currentIndex, parsedPath): Scenario[] => [
  {
    description: 'Does the string contains a negative number character?',
    testScenario: (chars): boolean => {
      return chars[0] === '-' && !isNaN(Number(parsedPath[currentIndex] + parsedPath[currentIndex+1]));
    },
    testCases: [
      {
        description: 'Passes because the current character is denotes the beginning of a negative number.',
        inputs: {
          currentIndex: 0,
          parsedPath: '-1',
          chars: '-'
        },
        expectedResult: true
      }
    ]
  },
  {
    description: 'Does the string contains a number character?',
    testScenario: (chars): boolean => chars.length === 1 && !isNaN(Number(chars)),
    testCases: [
      {
        description: 'Passes the current character is a number.',
        inputs: {
          currentIndex: 5,
          parsedPath: '(1 + 2)',
          chars: '2'
        },
        expectedResult: true
      }
    ]
  }
];
