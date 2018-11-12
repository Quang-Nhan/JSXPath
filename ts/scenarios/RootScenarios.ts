export const rootScenarios: Function = (currentIndex, parsedPath) => [
  {
    description: 'first character is a root',
    testScenario: (chars): boolean => { 
      return chars.length === 1 && chars === '/' && currentIndex === 0 && parsedPath[currentIndex + 1] !== '/';
    }
  },
  {
    description: 'root is after predicate or space',
    testScenario: (chars): boolean => { 
      return currentIndex > 0 && chars.length === 1 && chars === '/' && parsedPath[currentIndex + 1] !== '/' && (parsedPath[currentIndex - 1] === ' ' || parsedPath[currentIndex - 1] === '[');
    }
  }
];
