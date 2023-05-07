import { TYPES } from '../consts';
import { Functions } from '../evaluate/Functions';
import { Postfix } from './Postfix';

describe('Class Postfix', () => {
  let 
    callerId, 
    expected,
    functionsInstance, 
    path, 
    postfixInstance;

  beforeEach(() => {
    callerId = 'main';
    functionsInstance = new Functions();
  });

  describe('Simple path', () => {
    beforeEach(() => {
      postfixInstance = new Postfix(callerId, functionsInstance);
    });

    it('path is /a', () => {
      path = '/a',
      expect(postfixInstance.toPostfix(path)).toEqual([
        {
          type: TYPES.rootPath,
          callerId,
          value: '/a'
        }
      ]);
    });

  });

  describe('Simple predicate', () => {
    beforeEach(() => {
      postfixInstance = new Postfix(callerId, functionsInstance);
    });

    it('path is /a[b]', () => {
      path = '/a[b]',
      expect(postfixInstance.toPostfix(path)).toEqual([
        {
          type: TYPES.rootPath,
          callerId,
          value: '/a'
        },
        [
          {
            type: TYPES.path,
            callerId,
            value: './b'
          }
        ]
      ]);
    });

    it('path is /a[b]/c', () => {
      path = '/a[b]/c',
      expect(postfixInstance.toPostfix(path)).toEqual([
        {
          type: TYPES.rootPath,
          callerId,
          value: '/a'
        },
        [
          {
            type: TYPES.path,
            callerId,
            value: './b'
          }
        ],
        {
          type: TYPES.path,
          callerId,
          value: '/c'
        }
      ]);
    });
  });

  describe('Operators', () => {
    beforeEach(() => {
      postfixInstance = new Postfix(callerId, functionsInstance);
    });

    it('path is /a/b = /a/c', () => {
      path = '/a/b = /a/c';
      expected = [
        {
          type: TYPES.rootPath,
          callerId,
          value: '/a/b'
        },{
          type: TYPES.rootPath,
          callerId,
          value: '/a/c'
        },
        {
          type: TYPES.operator,
          callerId,
          value: '='
        }
      ];
      expect(postfixInstance.toPostfix(path)).toEqual(expected);

      path = '/a/b=/a/c';
      expect(postfixInstance.toPostfix(path)).toEqual(expected);

      path = '/a/b =/a/c';
      expect(postfixInstance.toPostfix(path)).toEqual(expected);

      path = '/a/b=  /a/c';
      expect(postfixInstance.toPostfix(path)).toEqual(expected);
    });

    it('path is /a[b + /c/d = 3]', () => {
      path = '/a[b + /c/d = 3]';
      expected = [
        {
          callerId,
          type: TYPES.rootPath,
          value: '/a'
        },
        [
          {
            callerId,
            type: TYPES.path,
            value: './b'
          },
          {
            callerId,
            type: TYPES.rootPath,
            value: '/c/d'
          },
          {
            callerId,
            type: TYPES.operator,
            value: '+'
          },
          {
            type: TYPES.number,
            value: 3
          },
          {
            callerId,
            type: TYPES.operator,
            value: '='
          }
        ]
      ];
      expect(postfixInstance.toPostfix(path)).toEqual(expected);
      
      path = '/a[b+/c/d=3]';
      expect(postfixInstance.toPostfix(path)).toEqual(expected);

      path = '/a[ b+ /c/d= 3  ]';
      expect(postfixInstance.toPostfix(path)).toEqual(expected);
    });


    it('path is 1 - 2 * 3', () => {
      path = '1 - 2 * 3';
      const expected = [
        {
          type: TYPES.number,
          value: 1
        },
        {
          type: TYPES.number,
          value: 2
        },
        {
          type: TYPES.number,
          value: 3
        },
        {
          callerId,
          type: TYPES.operator,
          value: '*'
        },
        {
          callerId,
          type: TYPES.operator,
          value: '-'
        }
      ];
      expect(postfixInstance.toPostfix(path)).toEqual(expected);

      path = '1-2*3';
      expect(postfixInstance.toPostfix(path)).toEqual(expected);

      path = '1 -2 *3';
      expect(postfixInstance.toPostfix(path)).toEqual(expected);
    });

    it('path is (1 - -2) * 3]', () => {
      path = '(1 - -2) * 3';
      const expected = [
        {
          type: TYPES.number,
          value: 1
        },
        {
          type: TYPES.number,
          value: -2
        },
        {
          callerId,
          type: TYPES.operator,
          value: '-'
        },
        {
          type: TYPES.number,
          value: 3
        },
        {
          callerId,
          type: TYPES.operator,
          value: '*'
        }
      ];
      expect(postfixInstance.toPostfix(path)).toEqual(expected);

      path = '(1--2)*   3';
      expect(postfixInstance.toPostfix(path)).toEqual(expected);
    });

    it('path is /a[b + /c/d * 3]', () => {
      path = '/a[b + /c/d * 3]';
      expect(postfixInstance.toPostfix(path)).toEqual([
        {
          callerId,
          type: TYPES.rootPath,
          value: '/a'
        },
        [
          {
            callerId,
            type: TYPES.path,
            value: './b'
          },
          {
            callerId,
            type: TYPES.rootPath,
            value: '/c/d'
          },
          {
            type: TYPES.number,
            value: 3
          },
          {
            callerId,
            type: TYPES.operator,
            value: '*'
          },
          {
            callerId,
            type: TYPES.operator,
            value: '+'
          }
        ]
      ]);
    });
  });

  describe('Functions', () => {
    beforeEach(() => {
      postfixInstance = new Postfix(callerId, functionsInstance);
    });

    it('path is string(/a/b)', () => {
      path = 'string(/a/b)';
      expect(postfixInstance.toPostfix(path)).toEqual([
        {
          type: TYPES.arguments,
          value: [{
            type: TYPES.rootPath,
            callerId,
            value: '/a/b'
          }]
        },
        {
          type: TYPES.function,
          callerId,
          value: 'string'
        }
      ]);
    });

    it('path is string(/a[b=12]/c)', () => {
      path = 'string(/a[b=12]/c)';
      expect(postfixInstance.toPostfix(path)).toEqual([
        {
          type: TYPES.arguments,
          value: [[
            {
              callerId,
              type: TYPES.rootPath,
              value: '/a'
            },
            [
              {
                callerId,
                type: TYPES.path,
                value: './b'
              },
              {
                type: TYPES.number,
                value: 12
              },
              {
                callerId,
                type: TYPES.operator,
                value: '='
              }
            ],
            {
              callerId,
              type: TYPES.path,
              value: '/c'
            }
          ]]
        },
        {
          type: TYPES.function,
          callerId,
          value: 'string'
        }
      ]);
    });

    it('path is /a[contains(., "test")]', () => {
      path = '/a[contains(., "test")]';
      expect(postfixInstance.toPostfix(path)).toEqual([
        {
          type: TYPES.rootPath,
          callerId,
          value: '/a'
        },
        [
          {
            type: TYPES.arguments,
            value: [
              {
                type: TYPES.path,
                callerId,
                value: '.'
              },
              {
                type: TYPES.string,
                value: "test"
              }
            ]
          },
          {
            type: TYPES.function,
            callerId,
            value: 'contains'
          }
        ]
      ]);
    });

    it('path is choose(/a = /c, boolean(/d), boolean(/f))', () => {
      path = 'choose(/a = /c, boolean(/d), boolean(/f))';
      expected = [
        {
          type: TYPES.arguments,
          value: [
            [
              {
                callerId,
                type: TYPES.rootPath,
                value: '/a'
              },
              {
                callerId,
                type: TYPES.rootPath,
                value: '/c'
              },
              {
                callerId,
                type: TYPES.operator,
                value: '='
              }
            ],
            [
              {
                type: TYPES.arguments,
                value: [
                  {
                    callerId,
                    type: TYPES.rootPath,
                    value: '/d'
                  }
                ]
              },
              {
                callerId,
                type: TYPES.function,
                value: 'boolean'
              }
            ],
            [
              {
                type: TYPES.arguments,
                value: [
                  {
                    callerId,
                    type: TYPES.rootPath,
                    value: '/f'
                  }
                ]
              },
              {
                callerId,
                type: TYPES.function,
                value: 'boolean'
              }
            ]
          ]
        },
        {
          callerId,
          type: TYPES.function,
          value: 'choose'
        }
      ];
      expect(postfixInstance.toPostfix(path)).toEqual(expected);
    });

    it('path is /*[name()="a" or name()="b"]', () => {
      const path = '/*[name()="a" or name()="b"]';
      expected = [
        {
          type: TYPES.rootPath,
          value: "/*",
          callerId: 'main'
        },
        [
          {
            type: TYPES.arguments,
            value: []
          },
          {
            type: TYPES.function,
            value: 'name',
            callerId: 'main'
          },
          {
            type: TYPES.string,
            value: 'a'
          },
          {
            type: TYPES.operator,
            value: '=',
            callerId: 'main'
          },
          {
            type: TYPES.arguments,
            value: []
          },
          {
            type: TYPES.function,
            value: 'name',
            callerId: 'main'
          },
          {
            type: TYPES.string,
            value: 'b'
          },
          {
            type: TYPES.operator,
            value: '=',
            callerId: 'main'
          },
          {
            type: TYPES.operator,
            value: 'or',
            callerId: 'main'
          }
        ]
      ];
      expect(postfixInstance.toPostfix(path)).toEqual(expected);
    });

    it('path is //*[local-name()="a" and sibling::b="c"]', () => {
      const path = '//*[local-name()="a" and sibling::b="c"]';
      expected = [
        {
          type: TYPES.rootPath,
          value: "//*",
          callerId: 'main'
        },
        [
          {
            type: TYPES.arguments,
            value: []
          },
          {
            type: TYPES.function,
            value: 'local-name',
            callerId: 'main'
          },
          {
            type: TYPES.string,
            value: 'a'
          },
          {
            type: TYPES.operator,
            value: '=',
            callerId: 'main'
          },
          {
            type: TYPES.path,
            value: './sibling::b',
            callerId: 'main'
          },
          {
            type: TYPES.string,
            value: 'c'
          },
          {
            type: TYPES.operator,
            value: '=',
            callerId: 'main'
          },
          {
            type: TYPES.operator,
            value: 'and',
            callerId: 'main'
          }
        ]
      ];
      expect(postfixInstance.toPostfix(path)).toEqual(expected);
    });
  });

  describe('Variables', () => {
    beforeEach(() => {
      postfixInstance = new Postfix(callerId, functionsInstance);
    });

    it('path is $Var1/d/c', () => {
      path = '$Var1/d/c';
      expect(postfixInstance.toPostfix(path)).toEqual([
        {
          callerId,
          type: TYPES.variablePath,
          value: '$Var1/d/c'
        }
      ]);
    });

    it('path is $Var1[f=1]/c = $Var2[l=$Var3]/k', () => {
      path = '$Var1[f=1]/c = $Var2[l=$Var3]/k';
      expect(postfixInstance.toPostfix(path)).toEqual([
        {
          type: TYPES.variable,
          value: '$Var1'
        },
        [
          {
            callerId,
            type: TYPES.path,
            value: './f'
          },
          {
            type: TYPES.number,
            value: 1
          },
          {
            callerId,
            type: TYPES.operator,
            value: '='
          }
        ],
        {
          callerId,
          type: TYPES.path,
          value: '/c'
        },
        {
          type: TYPES.variable,
          value: '$Var2'
        },
        [
          {
            callerId,
            type: TYPES.path,
            value: './l'
          },
          {
            type: TYPES.variable,
            value: '$Var3'
          },
          {
            callerId,
            type: TYPES.operator,
            value: '='
          }
        ],
        {
          callerId,
          type: TYPES.path,
          value: '/k'
        },
        {
          callerId,
          type: TYPES.operator,
          value: '='
        }
      ])
    });
  });
});