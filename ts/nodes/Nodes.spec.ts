import { Nodes } from './Nodes';
import { NodesState } from './State';

describe('Class Nodes', () => {
  let nodesInstance;

  describe('jsonToNodes()', () => {
    describe('Base tests', () => {
      let callerId
      let nodesState;
      beforeEach(() => {
        nodesState = new NodesState();
        nodesInstance = new Nodes(nodesState);
        callerId = 'main';
      });

      it('Simple object', () => {
        const json = {
          a: "a",
          b: true
        };
        expect(nodesInstance.jsonToNodes(json, callerId)).toEqual([
          [1, 0, "_", "_", "{$r}", "{$o}", "object", { childrenIds: [2, 3], parentId: null }],
          [2, 1, 1, "_", "a", "a", "string", { childrenIds: [], parentId: 1 }],
          [3, 1, 1, "_", "b", true, "boolean", { childrenIds: [], parentId: 1 }]
        ]);
      });

      it('Simple Array of objects', () => {
        const json = [
          { a: 1 },
          { a: 3 }
        ];
        expect(nodesInstance.jsonToNodes(json, callerId)).toEqual([
          [1, 0, "_", "_", "{$r}", "{$a}", "array", { childrenIds: [2, 4], parentId: null }],
          [2, 1, "_", 0, "{$ao}", "{$o}", "object", { childrenIds: [3], parentId: 1 }],
          [3, 2, 1, 0, "a", 1, "number", { childrenIds: [], parentId: 2 }],
          [4, 1, "_", 1, "{$ao}", "{$o}", "object", { childrenIds: [5], parentId: 1 }],
          [5, 2, 2, 1, "a", 3, "number", { childrenIds: [], parentId: 4 }]
        ]);
      });

      it('Nested object in an object', () => {
        const json = {
          a: {
            b: {
              value: 3
            }
          }
        };
        expect(nodesInstance.jsonToNodes(json, callerId)).toEqual([
          [1, 0, "_", "_", "{$r}", "{$o}", "object", { childrenIds: [2], parentId: null }],
          [2, 1, 1, "_", "a", "{$o}", "object", { childrenIds: [3], parentId: 1 }],
          [3, 2, 2, "_", "b", "{$o}", "object", { childrenIds: [4], parentId: 2 }],
          [4, 3, 3, "_", "value", 3, "number", { childrenIds: [], parentId: 3 }],
        ]);
      });

      it('Nested array in an array', () => {
        const json = [
          {
            a: [
              1,
              'string',
              {
                b: 2
              }
            ]
          },
        ];

        expect(nodesInstance.jsonToNodes(json, callerId)).toEqual([
          [1, 0, "_", "_", "{$r}", "{$a}", "array", { childrenIds: [2], parentId: null }],
          [2, 1, "_", 0, "{$ao}", "{$o}", "object", { childrenIds: [3], parentId: 1 }],
          [3, 2, 1, 0, "a", "{$a}", "array", { childrenIds: [4, 5, 6], parentId: 2 }],
          [4, 3, "_", 0, "{$v}", 1, "number", { childrenIds: [], parentId: 3 }],
          [5, 3, "_", 1, "{$v}", "string", "string", { childrenIds: [], parentId: 3 }],
          [6, 3, "_", 2, "{$ao}", "{$o}", "object", { childrenIds: [7], parentId: 3 }],
          [7, 4, 2, 2, "b", 2, "number", { childrenIds: [], parentId: 6 }]
        ]);
      });
    });
  });
});