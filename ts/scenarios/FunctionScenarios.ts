import { JSXFunctions } from '../typeHandlers/JSXFunctions';


export const functionScenarios: Function = (currentIndex, parsedParth) => [
  {
    description: 'first character is # followed by check if it matches the cached function names',
    testScenario: (chars): boolean => {
      return chars[0] === '#' && JSXFunctions.JSX_FUNCTIONS.includes(chars);
    }
  }
]