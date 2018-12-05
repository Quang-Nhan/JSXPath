import { Scenario } from '../JSXInterfaces';

export const booleanScenarios: Function = (currentIndex, parsedPath): Scenario[] => [
  {
    description: 'Is true',
    testScenario: (chars) => chars === 'true'
  },
  {
    description: 'Is false',
    testScenario: (chars) => chars === 'false'
  }
];