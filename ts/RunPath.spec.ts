import { RunPath } from "./RunPath";

describe('RunPath', () => {
  let json, input, path, runPathInstance;
  beforeEach(() => {
    json = {
      a: {
        b: {
          c: 12
        },
        d: 'string'
      }
    };
  });

  describe('callbackMode()', () => {

    describe('default', () => {
      beforeEach(() => {
        input = { json };
      });

      afterEach(() => {
        runPathInstance.reset();
      });

      it('should not return nodes and node value', () => {
        path = '/a/b/c'
        runPathInstance = new RunPath(input);
        runPathInstance.callbackMode({
          path,
          then: ({value, nodes, nodesValue}) => {
            expect(value).toEqual([12]);
            expect(nodesValue).toBe(undefined);
            expect(nodes).toBe(undefined);
          }
        });
      });

      it('should return sibling d via parent notation', () => {
        runPathInstance = new RunPath(input);
        runPathInstance.callbackMode({
          path: '//b/../d',
          then: ({value}) => {
            expect(value).toEqual(['string']);
          }
        });
      });

      it('should return ancestor value of a', () => {
        runPathInstance = new RunPath(input);
        runPathInstance.callbackMode({
          path: '//c/ancestor::a',
          then: ({value}) => {
            expect(value).toEqual([{
              b: {
                c: 12
              },
              d: 'string'
            }]);
          }
        });
      });
    });

    describe('outputOptions', () => {
      beforeEach(() => {
        input = {
          json,
          outputOptions: {
            nodes: true
          }
        }
      });
      afterEach(() => {
        runPathInstance.reset();
      });

      it('should return the full node sets and node value', () => {
        path = '/a/b/c'
        runPathInstance = new RunPath(input);
        runPathInstance.callbackMode({
          path,
          then: ({value, nodes, nodesValue}) => {
            expect(value).toEqual([12]);
            expect(nodesValue).toEqual([
              [4, 3, 3, '_', 'c', 12, 'number', {parentId: 3, childrenIds: [], descendantIds: [], ancestorIds: [3, 2, 1], siblings: []}]
            ]);
            expect(nodes).toEqual({
              "1": [ 1, 0, "_", "_", "{$r}", "{$o}", "object", { parentId: null, childrenIds: [ 2 ], descendantIds: [ 2, 3, 4, 5 ], ancestorIds: [], siblings: [ ], } ],
              "2": [ 2, 1, 1, "_", "a", "{$o}", "object", { parentId: 1, childrenIds: [ 3, 5 ], descendantIds: [ 3, 4, 5 ], ancestorIds: [ 1 ], siblings: [ ], } ],
              "3": [ 3, 2, 2, "_", "b", "{$o}", "object", { parentId: 2, childrenIds: [ 4 ], descendantIds: [ 4 ], ancestorIds: [ 2, 1 ], siblings: [ 5 ], } ],
              "4": [ 4, 3, 3, "_", "c", 12, "number", { parentId: 3, childrenIds: [ ], descendantIds: [ ], ancestorIds: [ 3, 2, 1 ], siblings: [ ], } ],
              "5": [ 5, 2, 2, "_", "d", "string", "string", { parentId: 2, childrenIds: [ ], descendantIds: [ ], ancestorIds: [ 2 ,1 ], siblings: [ 3 ], } ],
            });
          }
        });
      });
    });
  });

  describe('stringPathMode()', () => {
    beforeEach(() => {
      input = { json };
    });

    afterEach(() => {
      runPathInstance.reset();
    });

    it('path is /a/b/c', () => {
      path = '/a/b/c';
      runPathInstance = new RunPath(input);
      expect(runPathInstance.stringPathMode(path)).toEqual([12]);
    });
  });
});