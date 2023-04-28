import { tNode } from '../types';
import { Json } from './Json';
import { NodesState } from './State';

describe('Class Json', () => {
  let nodesStateInstance;
  beforeEach(() => {
    nodesStateInstance = NodesState.getInstance();
  });

  describe('reconstruct()', () => {
    let nodes: tNode[], rootNode: tNode ,jsonInstance;
    beforeEach(() => {
      nodesStateInstance.reset();
      nodesStateInstance.setCaller('main');
      jsonInstance = new Json();
    });

    it('Should return a simple object', () => {
      rootNode = [1, 0, "_", "_", "{$r}", "{$o}", "object", {childrenIds: [2], descendantIds: [2], parentId: null}];
      nodes = [
        rootNode,
        [2, 1, 1, "_", "a", "a", "string", {childrenIds: [], descendantIds: [], ancestorIds: [1], parentId: 1}]
      ];
      nodes.forEach(node => {
        nodesStateInstance.addNode(node);
      });
      expect(jsonInstance.reconstruct([rootNode])).toEqual([{
        a: "a"
      }]);
    });

    it('Should return a simple array of objects', () => {
      rootNode = [1, 0, "_", "_", "{$r}", "{$a}", "array", {childrenIds: [2, 3], descendantIds: [2, 3], parentId: null}];
      nodes = [
        rootNode,
        [2, 1, 1, 0, "a", 1, "number", {childrenIds: [], descendantIds: [], ancestorIds: [1], parentId: 1}],
        [3, 1, 2, 1, "a", 3, "number", {childrenIds: [], descendantIds: [], ancestorIds: [1], parentId: 1}]
      ];
      nodes.forEach(node => {
        nodesStateInstance.addNode(node);
      });
      expect(jsonInstance.reconstruct([rootNode])).toEqual([[
        { a: 1 },
        { a: 3 }
      ]]);
    });

    it('Should return an object of nested object', () => {
      rootNode = [1, 0, "_", "_", "{$r}", "{$o}", "object", {childrenIds: [2], descendantIds: [2, 3, 4], parentId: null}];
      nodes = [
        rootNode,
        [2, 1, 1, "_", "a", "{$o}", "object", {childrenIds: [3], descendantIds: [3, 4], ancestorIds: [1], parentId: 1}],
        [3, 2, 2, "_", "b", "{$o}", "object", {childrenIds: [4], descendantIds: [4], ancestorIds: [1, 2], parentId: 2}],
        [4, 3, 3, "_", "value", 3, "number", {childrenIds: [], descendantIds: [], ancestorIds: [1, 2, 3], parentId: 3}],
      ];
      nodes.forEach(node => {
        nodesStateInstance.addNode(node);
      });
      expect(jsonInstance.reconstruct([rootNode])).toEqual([{
        a: {
          b: {
            value: 3
          }
        }
      }]);
    });

    it('Should return an array of nested array', () => {
      rootNode = [1, 0, "_", "_", "{$r}", "{$a}", "array", {childrenIds: [2], descendantIds: [2, 3, 4, 5], parentId: null}];
      nodes = [
        rootNode,
        [2, 1, 1, 0, "a", "{$a}", "array", {childrenIds: [3, 4, 5], descendantIds: [3, 4, 5], ancestorIds: [1], parentId: 1}],
        [3, 2, "_", 0, "{$v}", 1, "number", {childrenIds: [], descendantIds: [], ancestorIds: [1, 2], parentId: 2}],
        [4, 2, "_", 1, "{$v}", "string", "string", {childrenIds: [], descendantIds: [], ancestorIds: [1, 2], parentId: 2}],
        [5, 2, 2, 2, "b", 2, "number", {childrenIds: [], descendantIds: [], ancestorIds: [1, 2], parentId: 2}]
      ];
      nodes.forEach(node => {
        nodesStateInstance.addNode(node);
      });
      expect(jsonInstance.reconstruct([rootNode])).toEqual([[
        { a: [
            1,
            'string',
            {
              b: 2
            }
          ] 
        }
      ]]);
    });

    it('When passing multiple node items, it should return multiple result', () => {
      const node1: tNode = [2, 1, 1, 0, "a", "{$a}", "array", {childrenIds: [3, 4, 5], descendantIds: [3, 4, 5], ancestorIds: [1], parentId: 1}];
      const node2: tNode = [5, 2, 2, 2, "b", 2, "number", {childrenIds: [], descendantIds: [], ancestorIds: [1, 2], parentId: 2}];
      nodes = [
        [1, 0, "_", "_", "{$r}", "{$a}", "array", {childrenIds: [2], descendantIds: [2, 3, 4, 5], parentId: null}],
        node1,
        [3, 2, "_", 0, "{$v}", 1, "number", {childrenIds: [], descendantIds: [], ancestorIds: [1, 2], parentId: 2}],
        [4, 2, "_", 1, "{$v}", "string", "string", {childrenIds: [], descendantIds: [], ancestorIds: [1, 2], parentId: 2}],
        node2
      ];
      nodes.forEach(node => {
        nodesStateInstance.addNode(node);
      });
      expect(jsonInstance.reconstruct([node1, node2])).toEqual([
        [ 1, "string", { "b": 2, } ], 2
      ]);
    });

    it('When the passed in node is not cached, it should return undefined value as part of the returned list', () => {
      const node1: tNode =  [3, 1, 1, "_", "a", "a", "string", {childrenIds: [], descendantIds: [], ancestorIds: [1], parentId: 1}];
      const node2: tNode = [2, 1, 1, "_", "a", "a", "string", {childrenIds: [], descendantIds: [], ancestorIds: [1], parentId: 1}];
      nodes = [
        [1, 0, "_", "_", "{$r}", "{$o}", "object", {childrenIds: [2], descendantIds: [2], parentId: null}],
        [2, 1, 1, "_", "a", "a", "string", {childrenIds: [], descendantIds: [], ancestorIds: [1], parentId: 1}]
      ];
      nodes.forEach(node => {
        nodesStateInstance.addNode(node);
      });
      expect(jsonInstance.reconstruct([node1, node2])).toEqual([undefined, 'a']);
    })
  });
});