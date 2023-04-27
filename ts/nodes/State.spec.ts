import { NodesState } from "./State";

describe('NodeState', () => {
  let nodeStateInstance;

  describe('State', () => {
    beforeEach(() => {
      nodeStateInstance = NodesState.getInstance();
    });

    describe('setCaller()', () => {
      beforeEach(() => {
        nodeStateInstance.reset();
      });

      it('State should set caller property.', () => {
        nodeStateInstance.setCaller('stateTest');
        expect(nodeStateInstance.caller).toEqual('stateTest');
      });
    });

    describe('addNode()', () => {
      let node;
      beforeEach(() => {
        nodeStateInstance.reset()
        node = [1, 0, "_", "_", "{$r}", "{$o}", "object", {childrenIds: [2], descendantIds: [2], parentId: null}];
      });

      it('When caller is not set, it should throw an error', () => {
        expect(() => nodeStateInstance.addNode(node)).toThrow('[NodesState.addNodes] Caller is not set');
      });

      it('Should add node to byCaller and byId state', () => {
        nodeStateInstance.setCaller('stateTest');
        nodeStateInstance.addNode(node)
        expect(nodeStateInstance.state.nodes.byCaller['stateTest']).toEqual([node]);
        expect(nodeStateInstance.state.nodes.byId['1']).toEqual(node)
      })
    });

    describe('getNodes()', () => {
      let node, mainCaller;

      beforeEach(() => {
        nodeStateInstance.reset();
        mainCaller = 'main';
        nodeStateInstance.setCaller(mainCaller);
        node = [1, 0, "_", "_", "{$r}", "{$o}", "object", {childrenIds: [2], descendantIds: [2], parentId: null}];
      });

      it('When unknown caller argument is provided, it should return an empty array', () => {
        nodeStateInstance.addNode(node);
        expect(nodeStateInstance.getNodes('abc')).toEqual([]);
      });

      it('When a known caller arugment is provided, it should return the state node', () => {
        nodeStateInstance.addNode(node);
        expect(nodeStateInstance.getNodes(mainCaller)).toEqual([node]);
      });

      it('When a caller has being set and the caller argument is not provided, it should return the state node', () => {
        nodeStateInstance.addNode(node);
        expect(nodeStateInstance.getNodes()).toEqual([node]);
      });

      it('When no nodes being added, it should return an empty string', () => {
        expect(nodeStateInstance.getNodes()).toEqual([])
      });
    });

    describe('getNodesByIds()', () => {

      beforeEach(() => {
        nodeStateInstance.reset();
        nodeStateInstance.setCaller('main');
        [
          [1, 0, "_", "_", "{$r}", "{$a}", "array", {childrenIds: [2], descendantIds: [2, 3, 4, 5], parentId: null}],
          [2, 1, 1, 0, "a", "{$a}", "array", {childrenIds: [3, 4, 5], descendantIds: [3, 4, 5], ancestorIds: [1], parentId: 1}],
          [3, 2, "_", 0, "{$v}", 1, "number", {childrenIds: [], descendantIds: [], ancestorIds: [1, 2], parentId: 2}],
          [4, 2, "_", 1, "{$v}", "string", "string", {childrenIds: [], descendantIds: [], ancestorIds: [1, 2], parentId: 2}],
          [5, 2, 2, 2, "b", 2, "number", {childrenIds: [], descendantIds: [], ancestorIds: [1, 2], parentId: 2}]
        ].forEach(node => {
          nodeStateInstance.addNode(node);
        });
      });

      it('Should return all the requested ids', () => {
        expect(nodeStateInstance.getNodesByIds([1, 2])).toEqual([
          [1, 0, "_", "_", "{$r}", "{$a}", "array", {childrenIds: [2], descendantIds: [2, 3, 4, 5], parentId: null}],
          [2, 1, 1, 0, "a", "{$a}", "array", {childrenIds: [3, 4, 5], descendantIds: [3, 4, 5], ancestorIds: [1], parentId: 1}]
        ]);
      });

      it('When the id list contains an invalid id, it should not return those ids', () => {
        expect(nodeStateInstance.getNodesByIds([5, 6, 7])).toEqual([
          [5, 2, 2, 2, "b", 2, "number", {childrenIds: [], descendantIds: [], ancestorIds: [1, 2], parentId: 2}]
        ]);
      });
    });

    describe('getNodeById()', () => {
      beforeEach(() => {
        nodeStateInstance.reset();
        nodeStateInstance.setCaller('main');
        [
          [1, 0, "_", "_", "{$r}", "{$a}", "array", {childrenIds: [2], descendantIds: [2, 3, 4, 5], parentId: null}],
          [2, 1, 1, 0, "a", "{$a}", "array", {childrenIds: [3, 4, 5], descendantIds: [3, 4, 5], ancestorIds: [1], parentId: 1}],
          [3, 2, "_", 0, "{$v}", 1, "number", {childrenIds: [], descendantIds: [], ancestorIds: [1, 2], parentId: 2}],
          [4, 2, "_", 1, "{$v}", "string", "string", {childrenIds: [], descendantIds: [], ancestorIds: [1, 2], parentId: 2}],
          [5, 2, 2, 2, "b", 2, "number", {childrenIds: [], descendantIds: [], ancestorIds: [1, 2], parentId: 2}]
        ].forEach(node => {
          nodeStateInstance.addNode(node);
        });
      });

      it('When the id is invalid, it should return undefined', () => {
        expect(nodeStateInstance.getNodeById(7)).toEqual(undefined);
      });

      it('Should return a node with the right id', () => {
        expect(nodeStateInstance.getNodeById(4)).toEqual(
          [4, 2, "_", 1, "{$v}", "string", "string", {childrenIds: [], descendantIds: [], ancestorIds: [1, 2], parentId: 2}]
        );
      });
    });

    describe('incrementId()', () => {
      beforeEach(() => {
        nodeStateInstance.reset();
      });

      it('When called, the state id should increment by 1', () => {
        const currentId = nodeStateInstance.state.id;
        nodeStateInstance.incrementId();
        expect(nodeStateInstance.state.id).toBe(currentId+1);
      });
    });

    describe('incrementGroup()', () => {
      beforeEach(() => {
        nodeStateInstance.reset();
      });

      it('When called, the state group should increment by 1', () => {
        const currentId = nodeStateInstance.state.group;
        nodeStateInstance.incrementGroup();
        expect(nodeStateInstance.state.group).toBe(currentId+1);
      });
    });

    describe('getId()', () => {
      beforeEach(() => {
        nodeStateInstance.reset();
      });

      it('When called, should return the state id', () => {
        expect(nodeStateInstance.getId()).toBe(nodeStateInstance.state.id);
      });
    });
  });
});