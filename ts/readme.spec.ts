import { runPath, runPaths, KEYS, nodesOps } from './index';
import { tPathWithCallBack, tStack } from './types';

describe('README.md', () => {
  let json, path;
  describe('Why JSXPath', () => {
    beforeEach(() => {
      json = { "a": 1, "b": 2, "c": "pass"};
    });

    it('/c[sum(/a | /b) = 3]', () => {
      expect(runPath('/c[sum(/a | /b) = 3]', { json })).toEqual(['pass']);
    });
  });

  describe('Use', () => {
    beforeEach(() => {
      json = {
        a: {
            links: [
              { id: 3, type: 'b' },
              { id: 1, type: 'c' }
            ],
            value: 'master'
        },
        b: [
          { id: 1, value: 'one' },
          { id: 2, value: 'two' },
          { id: 3, value: 'three' }
        ]
      };
      path = '/b/*[id = /a/links/*[type="b"]/id]/value';
    });

    it('/b/*[id = /a/links/*[type="b"]/id]/value: basic', () => {
      expect(runPath('/b/*[id = /a/links/*[type="b"]/id]/value', { json })).toEqual(['three']);
    });

    it('/b/*[id = /a/links/*[type="b"]/id]/value: callback', () => {
      runPath({
        path: '/b/*[id = /a/links/*[type="b"]/id]/value',
        then: ({value }) => {
          expect(value).toEqual(['three']);
        } 
      }, {json});
    });

    it('/b/*[id = $aLinkToB_id]/value', () => {
      expect(runPath( '/b/*[id = $aLinkToB_id]/value', 
        { 
          json, variables: { aLinkToB_id: '$root/a/links/*[type="b"]/id' } 
        }
      )).toEqual(['three']);
    });
  });

  describe('multiple paths', () => {
    beforeEach(() => {
      json = {
        c: [
          { id: 1, type: 'TypeA', value: 'car'},
          { id: 2, type: 'TypeB', value: 'house'},
          { id: 3, type: 'TypeA', value: 'boat'}
        ]
      }
    });

    it('2 Paths', () => {
      const pathsResult = {
        objects: null,
        typeAs: null
      };
    
      const pathsAndCallbacks: tPathWithCallBack[] = [
        { 
          path: '/c/*/value',
          then: (result) => {
            // custom code
            if (result.value.length) {
              pathsResult.objects = result.value;
            }
          }
        },
        {
          path: '/c/*[type="TypeA"]',
          description: 'type "A" objects in "c"',
          then: ({value, error}) => {
            // custom code
            if (!error) {
              pathsResult.typeAs = value;
            }
          }
        }
      ];
      runPaths( pathsAndCallbacks, { json });
      expect(pathsResult).toEqual({
        objects: ['car', 'house', 'boat'],
        typeAs: [
          { id: 1, type: 'TypeA', value: 'car'},
          { id: 3, type: 'TypeA', value: 'boat'}
        ]
      })
    });
  });

  describe('budget examples', () => {
    let budget;
    beforeEach(() => {
      budget = {
        incomes: [
          { id: 1, type: 'salary', display: 'salary', value: 2000.30, frequency: 'monthly'},
          { id: 2, type: 'rent', display: 'rent', value: 300.95, frequency: 'fortnightly'},
          { id: 3, type: 'share', display: 'shares', value: 0.20, frequency: 'monthly'}
        ],
        expenses: [
          { id: 1, type: 'transport', display: 'car', value: -200.70, frequency: 'fortnightly' },
          { id: 2, type: 'household', display: 'grocery', value: -400.20, frequency: 'monthly' },
          { id: 3, type: 'transport', display: 'train', value: -200.10, frequency: 'monthly' },
          { id: 4, type: 'household', display: 'gardening', value: -20.10, frequency: 'monthly' }
        ]
      };
    });

    describe('base functions', () => {
      it('Monthly budget profit', () => {
        let totalIncomePerMonth = 0;
        runPaths([
          {
            path: 'sum(/incomes/*[frequency="monthly"][floor(value) >= 1]/value)',
            then: ({value}) => {
              // returns salary value
              totalIncomePerMonth += value;
            }
          },
          {
            path: 'sum(/incomes/*[frequency="fortnightly"]/value) * 2',
            then: ({value}) => {
              // returns rent value
              totalIncomePerMonth += value;
            }
          },
          {
            path: 'sum(/expenses/*[frequency="monthly"][abs(value) > 25]/value)',
            then: ({value}) => {
              // returns grocery and train sum value
              totalIncomePerMonth += value;
            }
          },
          {
            path: 'sum(/expenses/*[frequency="fortnightly"]/value) * 2',
            then: ({value}) => {
              // returns car value
              totalIncomePerMonth += value;
            }
          }
        ], {json: budget});
        expect(totalIncomePerMonth).toBe(1600.5);
      });

      it('Other function example', () => {
        runPaths([
          {
            path: '/incomes/*[first()]/display',
            then: ({value}) => {
              expect(value).toEqual(['salary']);
            }
          },
          {
            path: '/incomes/*[last()]',
            then: ({value}) => {
              expect(value).toEqual([{ id: 3, type: 'share', display: 'shares', value: 0.20, frequency: 'monthly'}])
            }
          },
          {
            path: 'count(/incomes/*[frequency = "monthly"])',
            then: ({value}) => {
              expect(value).toBe(2);
            }
          },
          {
            path: '//*[local-name()="id"][sibling::type = "transport"]',
            then: ({value}) => {
              expect(value).toEqual([1, 3]);
            }
          },
          {
            path: '/expenses/*[concat(type, ":", display) = "transport:train"]/value',
            then: ({value}) => {
              expect(value).toEqual([-200.10]);
            }
          }
        ], { json: budget });
      });
    });

    describe('custom functions', () => {
      let functions;
      beforeEach(() => {
        functions = {
          max: (item: tStack) => {
            if (item.type !== 'nodes') {
              throw new Error('[functions.max], invalid arg type. Was expecting nodes');
            }
            
            const value = item.value.reduce((maxNumber, node) => {
              if (node[KEYS.valueType] === 'number' && node[KEYS.value] > maxNumber) {
                maxNumber = node[KEYS.value];
              }
              return maxNumber;
            }, 0);
            
            return { type: 'number', value };
          }
        };
        json = {
          a: [
            {value: 3},
            {value: '90'},
            {value: 16}
          ],
          b: [
            {value: -1},
            {value: 30},
            {value: true}
          ]
        }
      });

      it('', () => {
        const max = runPath('max( /a/*/value | /b/*/value ) + 10', {
          json,
          functions
        });
        expect(max).toBe(40);
      });
    });

    describe('variables', () => {
      it('Monthly budget profit', () => {
        const totalIncomePerMonth = runPath(
          '$incomeMonthlyTypes + $incomeFortnightlyTypes + $expenseMonthlyTypes + $expenseFortnightlyTypes', 
          {
            json: budget,
            variables: {
              incomeMonthlyTypes: 'sum($root/incomes/*[frequency="monthly"][floor(value) >= 1]/value)',
              incomeFortnightlyTypes: 'sum($root/incomes/*[frequency="fortnightly"]/value) * 2',
              expenseMonthlyTypes: 'sum($root/expenses/*[frequency="monthly"][abs(value) > 25]/value)',
              expenseFortnightlyTypes: 'sum($root/expenses/*[frequency="fortnightly"]/value) * 2'
            }
          }
        );
        expect(totalIncomePerMonth).toBe(1600.5);
      });

      it('Additional variable uses', () => {
        runPath({
          path: 'abs($tuitionAmount) > abs(/expenses/*[display="gardening"]/value)',
          description: 'Is tuition fee cost less than the the amount spent on gardening?',
          then: ({value}) => {
            const message = value === true ?
              'Tuition is overly expensive. We should spend our time on gardening':
              'Tuition is still dirt cheap.'
            console.log(message);
            expect(message).toBe('Tuition is overly expensive. We should spend our time on gardening')
          }
        }, {
          json: budget,
          variables: {
            tuitionType: { id: 100, type: 'education', display: 'tuition', value: -80, frequency: 'monthly' },
            tuitionAmount: '$tuitionType/value'
          }
        });
      });
    });
  });
});