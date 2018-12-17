import { Scenario } from "../JSXInterfaces";
import { groupings } from "../enums/groupings";

export const groupingScenarios: Function = (currentIndex, parsedPath): Scenario[] => [
  {
    description: 'Is the character a grouping character?',
    testScenario: (chars):boolean => Object.values(groupings).includes(chars),
    testCases: [
      {
        description: 'Passes because the current character is a ( character.',
        inputs: {
          currentIndex: 0,
          parsedPath: '(1 + 2)',
          chars: '('
        },
        expectedResult: true
      },
      {
        description: 'Passes because the current character is a ) character.',
        inputs: {
          currentIndex: 6,
          parsedPath: '(1 + 2)',
          chars: ')'
        },
        expectedResult: true
      }
    ]
  }
]