import Main from './JSXMain';

xdescribe('Main()', () => {
  let main, json, path;
  beforeEach(() => {
    main = new Main();
  });

  describe('Test node traversals', () => {
    
    describe('Root', () => {
      beforeEach(() => {
        main.flush();
        json = {
          a: 'b',
          c: 'd'
        }
      });

      it('Return the root node', () => {
        path = '/';
        main.process(path, json);
        expect(main.getResult()).toEqual(json);
      });
    });

    describe('AXES', () => {
      
      describe('Children()', () => {
        beforeEach(() => {
          // main.flush();
          json = {
            a: {
              b: 1
            },
            c: [
              {
                a: 1,
                b: 2
              },
              {
                a: 3,
                b: -4
              }
            ]
          }
        });

        it('child shorthand', () => {
          path = '/a';
          main.process(path, json);
          expect(main.getResult()).toEqual({
            b: 1
          });
        });
  
        it('child longhand', () => {
          // TODO
        });

        it('Child in an array.', () => {
          path = '/c/@b';
          main.process(path, json);
          expect(main.getResult()).toEqual([
            2,
            -4
          ])
        });
      });
    
      describe('Descendants()', () => {
        beforeEach(() => {
          main.flush();
          json = {
            a: {
              b: {
                c: {
                  d: {
                    e: {
                      f: 123
                    }
                  }
                }
              },
              g: {
                h: [
                  {
                    i: 1
                  },
                  {
                    i: 2
                  },
                  {
                    i: 3
                  }
                ],
                i: 6
              }
            }
          };
        });

        it('Get the element e - shorthand', () => {
          path = '//e';
          main.process(path, json);
          expect(main.getResult()).toEqual({
            f: 123
          })
        });

        it('Get the element e - longhand', () => {
          path = '/descendant::e';
          main.process(path, json);
          expect(main.getResult()).toEqual({
            f: 123
          });
        });

        it('Get all fields i value', () => {
          path = '//@i';
          main.process(path, json);
          expect(main.getResult()).toEqual([
            1, 2, 3, 6
          ]);
        });
      });

      describe('Parent()', () => {
        beforeEach(() => {
          main.flush();
          json = {
            a: {
              b: {
                c: {
                  d: {
                    e: {
                      f: 123
                    }
                  }
                }
              }
            }
          };
        });

        it('Get parent of e - short hand', () => {
          path = '//e/..';
          main.process(path, json);
          expect(main.getResult()).toEqual({
            e: {
              f: 123
            }
          });
        });
      });

      describe('Complex traversals', () => {

      });
    });
    
    describe('OPERATORS', () => {

      beforeEach(() => {
        json = {
          a: 1,
          b: 2,
          c: {
            a: 10,
            b: 20
          }
        }
      });
      
      describe('+', () => {
        beforeEach(() => {
          main.flush();
        });

        it('Simple addition', () => {
          path = '/@a + /@b';
          main.process(path, json);
          expect(main.getResult()).toBe(3);
        });

        it('Sum all', () => {
          path = '/@a + /@b + /c/@a + /c/@b';
          main.process(path, json);
          expect(main.getResult()).toBe(33);
        });
      });

      describe('-', () => {

      });

      describe('*', () => {
        beforeEach(() => {
          main.flush();
        });

        it('Simple multiplication', () => {
          path = '/@a * /@b';
          main.process(path, json);
          expect(main.getResult()).toBe(2);
        });

        it('Multiply all', () => {
          path = '/@a * /@b * /c/@a * /c/@b';
          main.process(path, json);
          expect(main.getResult()).toBe(400);
        });
      });

      describe('=', () => {
        beforeEach(() => {
          main.flush();
        });

        it('Simple equality check', () => {
          path = '/@a = /@b';
          main.process(path, json);
          expect(main.getResult()).toBe(false);
        });
      });

      describe('or', () => {
        beforeEach(() => {
          main.flush();
        });

        it('simple Or', () => {
          path = 'false or /@b';
          main.process(path, json);
          expect(main.getResult()).toBe(2);
        });
      });

      describe('composite operations', () => {

      });
    });

    describe('FILTERS', () => {
      beforeEach(() => {
        json = {
          a: [
            {
              b: 1,
              c: 2
            },
            {
              b: 'b',
              c: 9
            },
            {
              b: 'b',
              d: 13
            },
            {
              d: 13,
              c: 13
            },
            {
              c: 13,
              d: -1,
              e: {
                a: 1
              },
              f: {
                a: 1
              }
            }
          ]
        }
      });

      describe('Simple', () => {
        beforeEach(() => {
          main.flush();
        });

        it('Returns records where b === "b" where lhs is node test', () => {
          path = '/a[@b="b"]';
          main.process(path, json);
          expect(main.getResult()).toEqual([
            {
              b: 'b',
              c: 9
            },
            {
              b: 'b',
              d: 13
            }
          ]);
        });

        it('Returns records where b === "b" where rhs is node test', () => {
          path = '/a["b"=@b]';
          main.process(path, json);
          expect(main.getResult()).toEqual([
            {
              b: 'b',
              c: 9
            },
            {
              b: 'b',
              d: 13
            }
          ]);
        });

        it('Returns all records where c is equal to d for primitive value', () => {
          path = '/a[@c=@d]';
          main.process(path, json);
          expect(main.getResult()).toEqual([
            {
              c: 13,
              d: 13
            }
          ]);
        });

        it('Returns all records where c is equal to d for object value', () => {
          path = '/a[e=f]';
          main.process(path, json);
          expect(main.getResult()).toEqual([
            {
              c: 13,
              d: -1,
              e: {
                a: 1
              },
              f: {
                a: 1
              }
            }
          ]);
        });
      });

      describe('Complex', () => {
        beforeEach(() => {
          main.flush();
        });

        it('Or conditional filters', () => {
          path = '/a[@b=1 or @b= "b"]';
          main.process(path, json);
          expect(main.getResult()).toEqual([
            {
              b: 1,
              c: 2
            },
            {
              b: 'b',
              c: 9
            },
            {
              b: 'b',
              d: 13
            }
          ]);
        });
      });
    });
  });
})