import { Nodes } from './Nodes';
import { NodesState } from './State';

describe('Class Nodes', () => {
  let nodesInstance;

  describe('jsonToNodes()', () => {
    describe('Base tests', () => {
      let callerId
      beforeEach(() => {
        NodesState.getInstance().reset();
        nodesInstance = new Nodes();
        callerId = 'main';
      });
  
      it('Simple object', () => {
        const json = {
          a: "a"
        };
        expect(nodesInstance.jsonToNodes(json, callerId)).toEqual([
          [1, 0, "_", "_", "{$r}", "{$o}", "object", {childrenIds: [2], descendantIds: [2], parentId: null, ancestorIds: [], siblings:[]}],
          [2, 1, 1, "_", "a", "a", "string", {childrenIds: [], descendantIds: [], ancestorIds: [1], parentId: 1, siblings:[]}]
        ]);
      });
  
      it('Simple Array of objects', () => {
        const json = [
          { a: 1 },
          { a: 3 }
        ];
        expect(nodesInstance.jsonToNodes(json, callerId)).toEqual([
          [ 1, 0, "_", "_", "{$r}", "{$a}", "array", {ancestorIds: [], childrenIds: [2, 4], descendantIds: [2, 3, 4, 5], parentId: null, siblings: []}],
          [ 2, 1, "_", 0, "{$ao}", "{$o}", "object", { ancestorIds: [ 1 ], childrenIds: [ 3 ], descendantIds: [ 3 ], parentId: 1, siblings: [] } ],
          [ 3, 2, 1, 0, "a", 1, "number", {childrenIds: [], descendantIds: [], ancestorIds: [2, 1], parentId: 2, siblings: []}],
          [ 4, 1, "_", 1, "{$ao}", "{$o}", "object", { ancestorIds: [ 1 ], childrenIds: [ 5 ], descendantIds: [ 5 ], parentId: 1, siblings: [] } ],
          [ 5, 2, 2, 1, "a", 3, "number", {childrenIds: [], descendantIds: [], ancestorIds: [4, 1], parentId: 4, siblings: []}]
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
          [1, 0, "_", "_", "{$r}", "{$o}", "object", {childrenIds: [2], descendantIds: [2, 3, 4], ancestorIds: [], parentId: null, siblings:[]}],
          [2, 1, 1, "_", "a", "{$o}", "object", {childrenIds: [3], descendantIds: [3, 4], ancestorIds: [1], parentId: 1, siblings:[]}],
          [3, 2, 2, "_", "b", "{$o}", "object", {childrenIds: [4], descendantIds: [4], ancestorIds: [2, 1], parentId: 2, siblings:[]}],
          [4, 3, 3, "_", "value", 3, "number", {childrenIds: [], descendantIds: [], ancestorIds: [3, 2, 1], parentId: 3, siblings:[]}],
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
          [ 1, 0, "_", "_", "{$r}", "{$a}", "array", { ancestorIds: [], childrenIds: [ 2 ], descendantIds: [ 2, 3, 4, 5, 6, 7 ], parentId: null, siblings: [] } ], 
          [ 2, 1, "_", 0, "{$ao}", "{$o}", "object", { ancestorIds: [ 1 ], childrenIds: [ 3 ], descendantIds: [ 3, 4, 5, 6, 7 ], parentId: 1, siblings: [] } ],
          [ 3, 2, 1, 0, "a", "{$a}", "array", { ancestorIds: [ 2, 1 ], childrenIds: [ 4, 5, 6 ], descendantIds: [ 4, 5, 6, 7 ], parentId: 2, siblings: [] } ],
          [ 4, 3, "_", 0, "{$v}", 1, "number", { ancestorIds: [ 3, 2, 1 ], childrenIds: [], descendantIds: [], parentId: 3, siblings: [] } ], 
          [ 5, 3, "_", 1, "{$v}", "string", "string", { ancestorIds: [ 3, 2, 1 ], childrenIds: [], descendantIds: [], parentId: 3, siblings: [] } ],
          [ 6, 3, "_", 2, "{$ao}", "{$o}", "object", { ancestorIds: [ 3, 2, 1 ], childrenIds: [ 7 ], descendantIds: [ 7 ], parentId: 3, siblings: [] } ], 
          [ 7, 4, 2, 2, "b", 2, "number", { ancestorIds: [ 6, 3, 2, 1 ], childrenIds: [], descendantIds: [], parentId: 6, siblings: [] } ]
        ]);
      });
    });
  });
});