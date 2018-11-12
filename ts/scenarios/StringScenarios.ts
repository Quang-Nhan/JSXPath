
export const stringScenarios: Function = (currentIndex, parsedPath) => [
  {
    description: 'Does the string contains a quotation mark?',
    testScenario: (chars):boolean =>  chars.length === 1 && (chars === '\'' || chars === '"')
  }
];
