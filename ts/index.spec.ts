import { runPath, runPaths } from './index';

const getTestDescription = (result) => {
  return result.description ?  `${result.path}: ${result.description}` : result.path;
}

describe('Misc Tests' , () => {
  let json;

  describe('Array of mixed values', () => {
    beforeEach(() => {
      json =[1 ,  "2", {o: 3}, [{a: 4.1}, {b: 5.2}, {a: 6.6}]];
    });

    it('', () => {
      runPaths([
        {
          path: '/*[2]',
          then: (result) => {
            expect(result.value).toEqual(['2']);
          }
        },
        {
          path: '/*/o',
          then: (result) => {
            expect(result.value).toEqual([3]);
          }
        },
        {
          path: '/*[4]',
          description: 'from root, get the fourth positioned value',
          then: (result) => {
            expect(result.value).toEqual([[{a: 4.1}, {b: 5.2}, {a: 6.6}]]);
          }
        },
        {
          path: '/*[4]/*',
          description: 'get all the node values within the array',
          then: (result) => {
            expect(result.value).toEqual([{a: 4.1}, {b: 5.2}, {a: 6.6}]);
          }
        },
        {
          path: '/*[4]/*[a]',
          description: 'filter and display a nodes',
          then: (result) => {
            expect(result.value).toEqual([{a: 4.1}, {a: 6.6}]);
          }
        },
        {
          path: '/*[4]/*[a]/a',
          description: 'filter and display a node values',
          then: (result) => {
            expect(result.value).toEqual([4.1, 6.6]);
          }
        }
      ], {json});
    });
  });
});