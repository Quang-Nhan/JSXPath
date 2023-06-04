import { NodesState } from './State';
import { KEYS, SYMBOLS } from './consts';
import { TYPES } from '../consts';
import { iState, tNode } from '../types';

type tAnyObject = {
  [key: string]: any
};
type tAnyArray = Array<any>;
type tJSON = tAnyObject | tAnyArray;

export class Nodes {
  private nodeState: iState;
  
  constructor() {
    // singleton nodeState shared across main and variables
    this.nodeState = NodesState.getInstance();
  }

  private add = {
    root: (data: tJSON) => {
      return this.add.node(this.nodeState.getId(), SYMBOLS.na, SYMBOLS.root, data, null);
    },
    node: (id: tNode[0], group: tNode[2], key: tNode[4], value: tNode[5], parent?: tNode, position?: tNode[3]) => {
      const depth = (parent ? parent[KEYS.depth] : -1) + 1;
      const node: tNode = [id, depth, group, (position || position === 0 ? position : SYMBOLS.na), key, value, this.determineValueType(value), {}];

      this.add.links(parent, node);
      this.nodeState.addNode(node);
      this.nodeState.incrementId();
      return node;
    },
    // Add parent/ancestor/children/descendant links
    links: (ancestorNode: tNode, currentNode: tNode) => {
      if (currentNode[KEYS.links].parentId === undefined) {
        currentNode[KEYS.links] = {
          ancestorIds: [],
          parentId: ancestorNode ? ancestorNode[KEYS.id] : null,
          descendantIds: [],
          siblings: [],
          childrenIds: []
        };
      }
      if (ancestorNode) {
        if (currentNode[KEYS.links].parentId === ancestorNode[KEYS.id]) {
          ancestorNode[KEYS.links].childrenIds.push(currentNode[KEYS.id]);
        }
        ancestorNode[KEYS.links].descendantIds.push(currentNode[KEYS.id]);
        currentNode[KEYS.links].ancestorIds.push(ancestorNode[KEYS.id]);
        this.add.links(this.nodeState.getNodeById(ancestorNode[KEYS.links].parentId), currentNode);
      }
    },
    siblings: (nodes: tNode[]) => {
      nodes.forEach(node => {
        nodes.forEach(linkedNode => {
          if (node[KEYS.id] !== linkedNode[KEYS.id]) {
            node[KEYS.links].siblings.push(linkedNode[KEYS.id]);
          }
        });
      });
    }
  };

  private deconstruct = {
    array: (data: tJSON, parent: tNode) => {
      data.forEach((d, i) => {
        const value = this.deconstruct.getValue(d);
        if (value === SYMBOLS.array) {
          const id = this.nodeState.getId();
          const node = this.add.node(id, SYMBOLS.na, SYMBOLS.na, SYMBOLS.array, parent, i);
          this.deconstruct.array(d, node);
        } else if (value === SYMBOLS.object) {
          // create a meta object
          const currentId = this.nodeState.getId();
          const node = this.add.node(currentId, SYMBOLS.na, SYMBOLS.ao, SYMBOLS.object, parent, i);
          this.deconstruct.object(d, node, i);
        } else {
          this.add.node(this.nodeState.getId(), SYMBOLS.na, SYMBOLS.value, d, parent, i);
        }
      });
    },
    object: (data: tJSON, parent: tNode, pos?) => {
      const group = this.nodeState.incrementGroup();
      const siblings = [];
      for (let key in data) {
        const currentId = this.nodeState.getId();
        const value = this.deconstruct.getValue(data[key]);
        const node = this.add.node(currentId, group, key, value, parent, pos);
        if (value === SYMBOLS.array) {
          this.deconstruct.array(data[key], node);
        } else if (value === SYMBOLS.object) {
          this.deconstruct.object(data[key], node);
        } else {
          // this.add(b.id, currentId, group, symbols.value, data[key], pos);
        }
        siblings.push(node);
      }
      this.add.siblings(siblings);
    },
    getValue: (value) => {
      if (Array.isArray(value)) {
        return SYMBOLS.array;
      } else if (value && typeof value === 'object') {
        return SYMBOLS.object;
      }
      return value;
    }
  };

  private determineValueType = (value) => {
    if (value === SYMBOLS.array) {
      return 'array';
    } else if (value === SYMBOLS.object) {
      return 'object';
    } else if (value === null) {
      return 'null';
    } else if (value === undefined) {
      return 'undefined';
    } else if (typeof value === TYPES.string) {
      return TYPES.string;
    }  else if (typeof value === TYPES.boolean) {
      return TYPES.boolean;
    } else if (!Number.isNaN(Number(value))) {
      return 'number'
    }
  };

  public jsonToNodes(data: tJSON, caller: string) {
    this.nodeState.setCaller(caller);
    const value = this.deconstruct.getValue(data);
    const root = this.add.root(value);
    if (value === SYMBOLS.array) {
      this.deconstruct.array(data, root);
    } else if (value === SYMBOLS.object) {
      this.deconstruct.object(data, root);
    }
    return this.nodeState.getNodes();
  };
}
