import { TYPES } from "./consts";
import { tNode, tNodesState, tStack } from "./types";
import { NodesState } from "./nodes/State";
import { KEYS, SYMBOLS } from "./nodes/consts";
import { Json } from "./nodes/Json";

export class NodesOps {
  constructor(private nsInstance: NodesState) { }

  public tests = {
    exists: (id: number) => {
      return !!this.nsInstance.getNodeById(id);
    },
    isEqual: (node1: tNode, node2: tNode): boolean => {
      if (node1[KEYS.valueType] !== node2[KEYS.valueType]) {
        return false;
      }

      if (node1[KEYS.value] === SYMBOLS.object) {
        return this.tests.equal.object(node1, node2);
      } else if (node1[KEYS.value] === SYMBOLS.array) {
        return this.tests.equal.array(node1, node2);
      }
      return node1[KEYS.value] === node2[KEYS.value];
    },
    equal: {
      object: (node1: tNode, node2: tNode): boolean => {
        const node1Children = this.get.children(node1);
        const node2Children = this.get.children(node2);
        if (node1Children.length === node2Children.length) {
          return node1Children.every(n1 => {
            return node2Children.some(n2 => {
              return n1[KEYS.name] === n2[KEYS.name] &&
                n1[KEYS.value] === n2[KEYS.value] &&
                (
                  ![SYMBOLS.array, SYMBOLS.object].includes(n1[KEYS.value]) ||
                  this.tests.equal[KEYS.valueType](n1, n2)
                )
            });
          });
        }
        return false;
      },
      array: (node1: tNode, node2: tNode): boolean => {
        const node1Children = this.get.children(node1);
        const node2Children = this.get.children(node2);
        if (node1Children.length === node2Children.length) {
          return node1Children.every(n1 => {
            return node2Children.some(n2 => {
              return n1[KEYS.name] === n2[KEYS.name] &&
                n1[KEYS.arrayPosition] === n2[KEYS.arrayPosition] &&
                n1[KEYS.value] === n2[KEYS.value] &&
                (
                  ![SYMBOLS.array, SYMBOLS.object, SYMBOLS.ao].includes(n1[KEYS.value]) ||
                  this.tests.equal[n1[KEYS.valueType]](n1, n2)
                )
            });
          });
        }
        return false;
      }
    }
  };

  public get = {
    root: (nodes: tNode[]): tNode[] => {
      if (nodes.length) {
        if (nodes[0][KEYS.name] === SYMBOLS.root) {
          return [nodes[0]];
        } else {
          return this.get.byName(nodes, SYMBOLS.root)[0];
        }
      }
    },
    byName: (nodes: tNode[], name?: string): tNode[] => {
      if (!name || name === '*') return nodes;

      return nodes.filter((c) => {
        return c[KEYS.name] === name;
      });
    },
    byGroup: (nodes: tNode[], group): tNode[] => {
      return nodes.filter(c => {
        return c[KEYS.group] === group;
      });
    },
    byParentId: (nodes: tNode[], parentId): tNode[] => {
      return nodes.filter(c => {
        return c[KEYS.links].parentId === parentId;
      });
    },
    byDepth: (nodes: tNode[], depth): tNode[] => {
      return nodes.filter(c => {
        return c[KEYS.depth] === depth;
      });
    },
    descendants: (current: tNode, nodeName?: string): tNode[] => {
      if (!current) return [];

      // Lazy computation: traverse children recursively
      const descendants: tNode[] = [];
      const queue = [...current[KEYS.links].childrenIds];

      while (queue.length > 0) {
        const childId = queue.shift()!;
        const child = this.nsInstance.getNodeById(childId);
        if (!child) continue;

        // Add to descendants if name matches (or no filter)
        if (!nodeName || nodeName === '*' || child[KEYS.name] === nodeName) {
          descendants.push(child);
        }

        // Add this child's children to queue for traversal
        if (child[KEYS.links].childrenIds) {
          queue.push(...child[KEYS.links].childrenIds);
        }
      }

      return descendants;
    },
    ancestors: (current: tNode, nodeName?: string): tNode[] => {
      if (!current) return [];

      // Lazy computation: traverse parents iteratively
      const ancestors: tNode[] = [];
      let parentId = current[KEYS.links].parentId;

      while (parentId !== null && parentId !== undefined) {
        const parent = this.nsInstance.getNodeById(parentId);
        if (!parent) break;

        // Add to ancestors if name matches (or no filter)
        if (!nodeName || nodeName === '*' || parent[KEYS.name] === nodeName) {
          ancestors.push(parent);
        }

        parentId = parent[KEYS.links].parentId;
      }

      return ancestors;
    },
    siblings: (current: tNode, nodeName?: string): tNode[] => {
      if (!current) return [];

      const parentId = current[KEYS.links].parentId;
      if (parentId === null) {
        return [];
      }

      const parentNode = this.nsInstance.getNodeById(parentId);
      if (!parentNode) {
        return [];
      }

      const childrenIds = parentNode[KEYS.links].childrenIds || [];
      const allChildren = this.nsInstance.getNodesByIds(childrenIds);
      const siblings = allChildren.filter(node => node[KEYS.id] !== current[KEYS.id]);

      return nodeName ? this.get.byName(siblings, nodeName) : siblings;
    },
    children: (current: tNode, nodeName?: string): tNode[] => {
      return current
        ? this.get.byName(this.nsInstance.getNodesByIds(current[KEYS.links].childrenIds), nodeName)
        : [];
    },
    parent: (current: tNode, nodeName?: string): tNode[] => {
      if (!current) return [];
      let parent = this.nsInstance.getNodeById(current[KEYS.links].parentId);
      if (parent[KEYS.name] === SYMBOLS.ao) {
        parent = this.nsInstance.getNodeById(parent[KEYS.links].parentId);
      }
      return parent && ((!nodeName || nodeName === '*') || nodeName === parent[KEYS.name]) ? parent : undefined;
    },
    nodeList: (byId: boolean): tNodesState['nodes']['byId'] | tNodesState['nodes']['byCaller'] => {
      return this.nsInstance.getNodeList(byId);
    }
  };

  public reconstruct = (nodes: tNode[]) => {
    const jsonInstance = new Json(this);
    return jsonInstance.reconstruct(nodes);
  }
};

export const opFunc = {
  /**
   * 
   * @param context the caller name
   * @param expectedTypes array of string of allowable types
   * @param item the interrogated stack item
   * @returns the actual value
   */
  getValueByType: (context: string, expectedTypes: string[], item: tStack) => {
    if (!expectedTypes.length) {
      throwError(context, 'Missing type argument.')
    }

    if (!item) {
      throwError(context, `Missing stack item/argument`);
    }

    if (![...expectedTypes, TYPES.nodes].includes(item.type)) {
      throwError(context, `Invalid type "${item.type}" - was expecting "${expectedTypes.join(',')}" type.`);
    }

    if (item.type === TYPES.nodes) {
      if (!item.value.length) {
        throwError(context, `Was expecting at least one node value.`);
      }
      if (!expectedTypes.includes(item.value[0][KEYS.valueType])) {
        throwError(context, `Invalid value type "${item.value[0][KEYS.valueType]}" - was expecting "${expectedTypes.join(',')}" value type.`);
      }
      return item.value[0][KEYS.value];
    } else { // number
      return item.value;
    }
  },

  validate: {
    exists: (item: tStack, context: string) => {
      if (!item) {
        throwError(context, `No item exists`);
      }
      if (item.type === TYPES.nodes && !item.value.length) {
        throwError(context, `No node items exists`);
      }
    },
    /**
     * Validate the length of the number of nodes in the value list
     * If invalid, throws an error
     * 
     * @param expectedLength 
     *  the length of the nodes' value expected
     * @param item 
     *  the stack item type in the format {type, value}
     * @param symbol? 
     *  optional symbol used to test against (>=, >, <=, <, =). 
     *  If not defined it is tested against the expectedLength
     * @param context?
     *  optional context (original caller)
     * @returns 
     *  boolean
     */
    numberOfNodeItems: (item: tStack, expectedLength: number, symbol?: string, context?: string): boolean => {
      context = context ? `${context}.validate.numberOfNodeItems` : 'validate.numberOfNodeItems';
      if (item.type !== TYPES.nodes) {
        throwError(context, `Invalid type "${item.type}" - expecting "nodes".`);
      }

      switch (symbol) {
        case '>':
          if (item.value.length <= expectedLength) {
            throwError(context, `Invalid number of elements in value. Expecting greater than ${expectedLength} elements but received ${item.value.length}.`);
          }
          break;
        case '>=':
          if (item.value.length < expectedLength) {
            throwError(context, `Invalid number of elements in value. Expecting greater than or equal to ${expectedLength} elements but received ${item.value.length}.`);
          }
          break;
        case '<':
          if (item.value.length >= expectedLength) {
            throwError(context, `Invalid number of elements in value. Expecting less than ${expectedLength} elements but received ${item.value.length}.`);
          }
          break;
        case '<=':
          if (item.value.length > expectedLength) {
            throwError(context, `Invalid number of elements in value. Expecting less than or equal to ${expectedLength} elements but received ${item.value.length}.`);
          }
          break;
        default:
          if (expectedLength !== item.value.length) {
            throwError(context, `Invalid number of elements in value. Expecting ${expectedLength} elements but received ${item.value.length}.`);
          }
      }
      return true;
    },
    areNumbers: (item: tStack, context: string) => {
      if (![TYPES.number, TYPES.nodes].includes(item.type)) {
        throwError(context, `Invalid type "${item.type}" - was expecting "number" type.`)
      }
      if (item.type === TYPES.nodes) {
        if (!item.value.every(node => node[KEYS.valueType] === TYPES.number)) {
          throwError(context, `Not all node elements are number types`);
        }
      }
    }
  }
};

export const throwError = (context, msg) => {
  throw new Error(`Error thrown in ${context}: ${msg}`);
};
