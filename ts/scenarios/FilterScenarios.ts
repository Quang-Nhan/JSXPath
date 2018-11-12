import { Scenario } from "../JSXInterfaces";
import { filters } from "../enums/filters";

export const filterScenarios = (currentIndex, parsedPath): Array<Scenario> => [
  {
    description: 'Is the character a filter character?',
    testScenario: (chars):boolean => Object.values(filters).includes(chars)
  }
]