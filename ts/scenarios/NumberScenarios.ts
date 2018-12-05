import { Scenario } from "../JSXInterfaces";

export const numberScenarios = (currentIndex, parsedPath): Scenario[] => [
  {
    description: 'Does the string contains a negative number character?',
    testScenario: (chars): boolean => {
      return chars[0] === '-' && !isNaN(Number(parsedPath[currentIndex] + parsedPath[currentIndex+1]));
    }
  },
  {
    description: 'Does the string contains a number character?',
    testScenario: (chars): boolean => chars.length === 1 && !isNaN(Number(chars))
  }
];
