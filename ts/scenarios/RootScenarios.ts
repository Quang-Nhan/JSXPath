import { Scenario } from "../JSXInterfaces";

export const rootScenarios: Function = (currentIndex, parsedPath): Scenario[] => [
  {
    description: 'first character is a root',
    testScenario: (chars): boolean => { 
      return chars.length === 1 && chars === '/' && currentIndex === 0 && parsedPath[currentIndex + 1] !== '/';
    },
    /* */
    testCases: [
      {
        description: 'Passes because the current index is 0 and is a / character',
        inputs: {
          currentIndex: 0,
          parsedPath: '/a/@b === "true"',
          chars: '/'
        },
        expectedResult: true
      }
    ]
  },
  {
    description: 'root is after predicate or space',
    testScenario: (chars): boolean => { 
      return currentIndex > 0 && chars.length === 1 && chars === '/' && parsedPath[currentIndex + 1] !== '/' && (parsedPath[currentIndex - 1] === ' ' || parsedPath[currentIndex - 1] === '[');
    },
    /* */
    testCases: [
      {
        description: 'Passes because the / is after a space',
        inputs: {
          currentIndex: 5,
          parsedPath: '19 = /a/@b',
          chars: '/'
        },
        expectedResult: true
      },
      {
        description: 'Passes because the / is after a [',
        inputs: {
          currentIndex: 3,
          parsedPath: '/a[/a/@b]',
          chars: '/'
        },
        expectedResult: true
      }
    ]
  }
];
