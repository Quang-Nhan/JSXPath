import { Scenario } from "../JSXInterfaces";
import { groupings } from "../enums/groupings";

export const groupingScenarios: Function = (currentIndex, parsedPath): Array<Scenario> => [
  {
    description: 'Is the character a grouping character?',
    testScenario: (chars):boolean => Object.values(groupings).includes(chars)
  }
]