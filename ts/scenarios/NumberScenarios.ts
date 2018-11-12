import { Scenario } from "../JSXInterfaces";

export const numberScenarios = (currentIndex, parsedPath): Array<Scenario> => [
  {
    description: 'Does the string contains a number character?',
    testScenario: (chars): boolean => chars.length === 1 && !isNaN(Number(chars))
  }
];
