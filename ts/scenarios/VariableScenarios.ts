import { JSXVariables } from '../typeHandlers/JSXVariables';

export const variableScenarios: Function = (currentIndex, parsedPath) => [
  {
    description: 'first character starts with a dollar sign and a match can be found in the variable map',
    testScenario: (chars) => chars[0] === '$' && JSXVariables.VARIABLES.includes(chars)
  }
];