import { Scenario } from "../JSXInterfaces";
import { filters } from "../enums/filters";

export const filterScenarios = (currentIndex, parsedPath): Scenario[] => [
  {
    description: 'Is the character a filter character?',
    testScenario: (chars):boolean => Object.values(filters).includes(chars),
    /* */
    testCases: [
      {
        description: 'Passes because the current character is a [ character.',
        inputs: {
          currentIndex: 3,
          parsedPath: '/a[@b]',
          chars: '['
        },
        expectedResult: true
      },
      {
        description: 'Passes becuase the current character is a ] character.',
        inputs: {
          currentIndex: 6,
          parsedPath: '/a[@b]',
          chars: ']'
        },
        expectedResult: true
      }
    ]
  }
]