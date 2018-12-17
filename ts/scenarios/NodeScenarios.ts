import { JSXOperators } from '../typeHandlers/JSXOperators';
import { Scenario } from '../JSXInterfaces';

export const nodeScenarios: Function = (currentIndex, parsedPath, state): Scenario[] => [
  {  //1
    description: 'Is the node and node is end of path?',
    testScenario: (chars):boolean => state.nodes.NODE_NAMES.includes(chars) && currentIndex === parsedPath.length-1,
    /**/
    testCases: [
      {
        description: 'Passes becuase the current index is pointing to a node a the end of the path.',
        inputs: {
          currentIndex: 0,
          parsedPath: 'a',
          state: {
            nodes: {
              NODE_NAMES: [
                'a',
                'b',
                'c'
              ]
            }
          },
          chars: 'a'
        },
        expectedResult: true
      }
    ]
  },
  { //2
    description: 'Is the node followed by white space?',
    testScenario: (chars):boolean => state.nodes.NODE_NAMES.includes(chars) && parsedPath[currentIndex+1] === ' ',
    /**/
    testCases: [
      {
        description: 'Passes because the current index is pointing to a node and the following character is a white space.',
        inputs: {
          currentIndex: 4,
          parsedPath: '/a/@b + 1',
          state: {
            nodes: {
              NODE_NAMES: [
                'a',
                '@b',
                'c'
              ]
            }
          },
          chars: '@b'
        },
        expectedResult: true
      }
    ]
  },
  { //3
    description: 'Is the node followed by / character?',
    testScenario: (chars):boolean => state.nodes.NODE_NAMES.includes(chars) && parsedPath[currentIndex+1] === '/',
    /**/
    testCases: [
      {
        description: 'Passes because the current index is pointing to a node and is followed by a / character.',
        inputs: {
          currentIndex: 1,
          parsedPath: '/a/@b',
          state: {
            nodes: {
              NODE_NAMES: [
                'a',
                '@b'
              ]
            }
          },
          chars: 'a'
        },
        expectedResult: true
      }
    ]
  },
  { //4
    description: 'Is the node followed by [ character?',
    testScenario: (chars):boolean => state.nodes.NODE_NAMES.includes(chars) && parsedPath[currentIndex+1] === '[',
    /**/
    testCases: [
      {
        description: 'Passes because the current index is pointing to a node character and is followed by the [ character.',
        inputs: {
          currentIndex: 1,
          parsedPath: '/a[@b=1]',
          state: {
            nodes: {
              NODE_NAMES: [
                'a',
                '@b'
              ]
            }
          },
          chars: 'a'
        },
        expectedResult: true
      }
    ]
  },
  { //5
    description: 'Is the node followed by ] or ) character?',
    testScenario: (chars):boolean => state.nodes.NODE_NAMES.includes(chars) && [']', ')'].includes(parsedPath[currentIndex+1]),
    /**/
    testCases: [
      {
        description: 'Passes because the current index is pointing to a node and is followed by a ] character.',
        inputs: {
          currentIndex: 8,
          parsedPath: '/a[1 = @b]',
          state: {
            nodes: {
              NODE_NAMES: [
                'a',
                '@b'
              ]
            }
          },
          chars: '@b'
        },
        expectedResult: true
      },
      {
        description: 'Passes because the current index is pointing to a node and is followed by a ) character.',
        inputs: {
          currentIndex: 9,
          parsedPath: '/a[(1 = @b) and 2 = 3]',
          state: {
            nodes: {
              NODE_NAMES: [
                'a',
                '@b'
              ]
            }
          },
          chars: '@b'
        },
        expectedResult: true
      }
    ]
  },
  { //6
    description: 'Is the node followed by operator character?',
    testScenario: (chars):boolean => state.nodes.NODE_NAMES.includes(chars) && 
      (JSXOperators.SORTED_OPERATORS_BY_LENGTH['1'].includes(parsedPath[currentIndex+1]) || 
        JSXOperators.SORTED_OPERATORS_BY_LENGTH['2'].includes(parsedPath[currentIndex+1] + parsedPath[currentIndex+2])),
    /**/
    testCases: [
      {
        description: 'Passes because the current index is pointing to anode and is followed by an operator character.',
        inputs: {
          currentIndex: 4,
          parsedPath: '/a/@b+2',
          state: {
            nodes: {
              NODE_NAMES: [
                'a',
                '@b'
              ]
            }
          },
          chars: '@b'
        },
        expectedResult: true
      }
    ]
  },
  { //7
    description: 'Is a wildcard (*) character?',
    testScenario: (chars):boolean => chars.length && parsedPath[currentIndex] === '*' && (currentIndex === 0 || ['/', ':'].includes(parsedPath[currentIndex-1])),
    /**/
    testCases: [
      {
        description: 'Passes because the currentIndex points to a whildcard character and is at the beginning',
        inputs: {
          currentIndex: 0,
          parsedPath: '*/@b',
          state: {
            nodes: {
              NODE_NAMES: [
                'a',
                '@b'
              ]
            }
          },
          chars: '*'
        },
        expectedResult: true
      },
      {
        description: 'Passes because the currentIndex points to a wildcard character that follows / character',
        inputs: {
          currentIndex: 3,
          parsedPath: '/a/*',
          state: {
            nodes: {
              NODE_NAMES: [
                'a',
                '@b'
              ]
            }
          },
          chars: '*'
        },
        expectedResult: true
      }
    ]
  },
  { //8
    description: 'Is the node a current node?',
    testScenario: (chars): boolean => {
      return chars.length === 1 && chars === '.' && 
        (
          (['[', '/'].concat(JSXOperators.SORTED_OPERATORS_BY_LENGTH['1'])).includes(getPreviousCharacterIgnoringSpaces(parsedPath, currentIndex, 1)) ||
          JSXOperators.SORTED_OPERATORS_BY_LENGTH['2'].includes(getPreviousCharacterIgnoringSpaces(parsedPath, currentIndex, 2)) ||
          JSXOperators.SORTED_OPERATORS_BY_LENGTH['3'].includes(getPreviousCharacterIgnoringSpaces(parsedPath, currentIndex, 3))
        );
    },
    /**/
    testCases: [
      {
        description: 'Passes because the current index is pointing to the current node character',
        inputs: {
          currentIndex: 3,
          parsedPath: '/a[./@b = 9]',
          state: {
            nodes: {
              NODE_NAMES: [
                'a',
                '@b'
              ]
            }
          },
          chars: '.'
        },
        expectedResult: true
      }
    ]
  },
];

const getPreviousCharacterIgnoringSpaces = (parsedPath:string, currentIndex:number, expectedCharacterLength:number) => {
  if (currentIndex < expectedCharacterLength) {
    return;
  }

  let result = '';
  for (let i = currentIndex-1; i >= 0 && result.length !== expectedCharacterLength; --i) {
    if (parsedPath[i] !== ' ' || result.length) {
      result = parsedPath[i] + result;
    }
  }
  return result.trim();
}