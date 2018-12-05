import { JSXNodes } from '../typeHandlers/JSXNodes';
import { JSXOperators } from '../typeHandlers/JSXOperators';
import { Scenario } from '../JSXInterfaces';

export const nodeScenarios: Function = (currentIndex, parsedPath, state): Scenario[] => [
  {
    description: 'Is the node and node is end of path?',
    testScenario: (chars):boolean => { 
      return state.nodes.NODE_NAMES.includes(chars) && currentIndex === parsedPath.length-1 
    }
  },
  {
    description: 'Is the node followed by white space?',
    testScenario: (chars):boolean => state.nodes.NODE_NAMES.includes(chars) && parsedPath[currentIndex+1] === ' '
  },
  {
    description: 'Is the node followed by / character?',
    testScenario: (chars):boolean => state.nodes.NODE_NAMES.includes(chars) && parsedPath[currentIndex+1] === '/'
  },
  {
    description: 'Is the node followed by [ character?',
    testScenario: (chars):boolean => state.nodes.NODE_NAMES.includes(chars) && parsedPath[currentIndex+1] === '['
  },
  {
    description: 'Is the node followed by ] or ) character?',
    testScenario: (chars):boolean => state.nodes.NODE_NAMES.includes(chars) && [']', ')'].includes(parsedPath[currentIndex+1])
  },
  {
    description: 'Is the node followed by operator character?',
    testScenario: (chars):boolean => state.nodes.NODE_NAMES.includes(chars) && 
      (JSXOperators.SORTED_OPERATORS_BY_LENGTH['1'].includes(parsedPath[currentIndex+1]) || 
        JSXOperators.SORTED_OPERATORS_BY_LENGTH['2'].includes(parsedPath[currentIndex+1] + parsedPath[currentIndex+2]))
  },
  {
    description: 'Is a wildcard (*) character?',
    testScenario: (chars):boolean => {
      return chars.length && parsedPath[currentIndex] === '*' && (currentIndex === 0 || ['/', ':'].includes(parsedPath[currentIndex-1]));
    }
  }
]