import { Nodes } from "../nodes/Nodes";
import { Variables } from "./Variables";
import { NodesState } from "../nodes/State";
import { Functions } from './Functions';
import { Operations } from './Operations';
import { nodesOps } from '../Util';
import { KEYS } from "../nodes/consts";
import { TYPES } from "../consts";
import { iState, tFilterModeOptions, tStack } from "../types";


type tStackCombo = Array<tStack | tStack[]>;


export class Processor {
  private mainNodes: Nodes;
  private variablesInstance: Variables
  private operationsInstance: Operations;
  private functionsInstance: Functions;
  private nodesState: iState;
  public output: tStack[] = [];
  
  constructor(Nodes: Nodes, variables: Variables, functions: Functions) {
    this.operationsInstance = new Operations();
    this.mainNodes = Nodes;
    this.variablesInstance = variables;
    this.functionsInstance = functions;
    this.nodesState = NodesState.getInstance();
  };

  private pathStringSteps = {
    item: null,
    nodeName: null,
    init: (item: tStack) => {
      this.pathStringSteps.item = item;
    },
    resetNodeName: () => {
      this.pathStringSteps.nodeName = null;
    },
    setNodeName: (step: string, subPath: string) => {
      if (step.includes('::')) {
        const axisNode = subPath.split("::");
        step = axisNode[0];
        this.pathStringSteps.nodeName = axisNode[1];
      }
      return step;
    },
    // process each axis in an array of steps eg ['/', 'a', '//', 'b']
    // 'a' and 'b' would fall under 'default' axis
    axis: {
      '/': () => {
        const item = this.pathStringSteps.item;
        item.value = item.value.reduce((r, v) => {
          const children = nodesOps.get.children(v);
          r = [...r, ...children];
          return r;
        }, []);
      },
      '//': () => {
        const item = this.pathStringSteps.item;
        item.value = item.value.reduce((r, v) => {
          const descendants = nodesOps.get.descendants(v);
          r = [...r, ...descendants];
          return r;
        }, []);
      },
      '.': () => {
      },
      '..': () => {
        const item = this.pathStringSteps.item;
        item.value = item.value.reduce((r, v) => {
          const parent = nodesOps.get.parent(v);
          if (!r.some((rr) => rr[KEYS.id] === parent[0][KEYS.id])) {
            r = [...r, ...parent];
          }
          return r;
        }, []);
      },
      '*': () => {},
      parent: () => {
        const item = this.pathStringSteps.item;
        item.value = item.value.reduce((r, v) => {
          const parent = nodesOps.get.parent(v, this.pathStringSteps.nodeName);
          if (!r.some(node => node[KEYS.id] === parent[KEYS.id])) {
            r.push(parent);
          }
          return r;
        }, []);
        this.pathStringSteps.resetNodeName();
      },
      child: () => {
        const item = this.pathStringSteps.item;
        item.value = item.value.reduce((r, v) => {
          const children = nodesOps.get.children(v, this.pathStringSteps.nodeName);
          children.forEach(a => {
            if (!r.some(node => node[KEYS.id] === a[KEYS.id])) {
              r.push(a);
            }
          });
          return r;
        }, []);
        this.pathStringSteps.resetNodeName();
      },
      ancestor: () => {
        const item = this.pathStringSteps.item;
        item.value = item.value.reduce((r, v) => {
          const ancestors = nodesOps.get.ancestors(v, this.pathStringSteps.nodeName);
          ancestors.forEach(a => {
            if (!r.some(node => node[KEYS.id] === a[KEYS.id])) {
              r.push(a);
            }
          });
          return r;
        }, []);
        this.pathStringSteps.resetNodeName();
      },
      'ancestor-or-self': () => {
        const item = this.pathStringSteps.item;
        item.value = item.value.reduce((r, v) => {
          const ancestors = nodesOps.get.ancestors(v, this.pathStringSteps.nodeName);
          ancestors.forEach(a => {
            if (!r.some(node => node[KEYS.id] === a[KEYS.id])) {
              r.push(a);
            }
          });
        }, [item.value]);
        this.pathStringSteps.resetNodeName();
      },
      descendant: () => {
        const item = this.pathStringSteps.item;
        item.value = item.value.reduce((r, v) => {
          const descendants = nodesOps.get.descendants(v, this.pathStringSteps.nodeName);
          r = [...r, ...descendants];
          return r;
        }, []);
        this.pathStringSteps.resetNodeName();
      },
      'descendant-or-self': () => {
        const item = this.pathStringSteps.item;
        item.value = item.value.reduce((r, v) => {
          const descendants = nodesOps.get.descendants(v, this.pathStringSteps.nodeName);
          r = [...r, ...descendants];
          return r;
        }, [item.value]);
        this.pathStringSteps.resetNodeName();
      },
      self: () => {
        const item = this.pathStringSteps.item;
        const from = item.value;
        item.value = nodesOps.get.byName(item.value, this.pathStringSteps.nodeName);
        this.pathStringSteps.resetNodeName();
      },
      sibling: () => {
        const item = this.pathStringSteps.item;
        item.value = item.value.reduce((r, v) => {
          const siblings = nodesOps.get.siblings(v, this.pathStringSteps.nodeName);
          r = [...r, ...siblings];
          return r;
        }, []);
        this.pathStringSteps.resetNodeName();
      },
      default: (value) => {
        const item = this.pathStringSteps.item;
        const initialList = item.value;
        item.value = nodesOps.get.byName(initialList, value);
      }
    }
  };

  private processPathString(pathString) {
    let steps = [];
    let subPath = '';

    for (let i = 0; i < pathString.length; i++) {
      subPath += pathString[i];
      if (subPath.includes('::') && steps[steps.length-1] === '/') {
        steps.pop();
      }

      if (subPath !== '/' && pathString[i + 1] === '/') {
        steps.push(subPath);
        subPath = '';
      } else if (
        subPath === '/' && pathString[i + 1] !== '/' ||
        subPath === '//'
      ) {
        steps.push(subPath);
        subPath = '';
      } else if (i === pathString.length - 1) {
        steps.push(subPath);
      }
    }

    this.pathStringSteps.init(this.output.pop());
    while (steps.length) {
      let step = steps.shift();
      step = this.pathStringSteps.setNodeName(step, subPath);
      
      if (step.length && typeof this.pathStringSteps.axis[step] === 'function') {
        this.pathStringSteps.axis[step]();
      } else {
        this.pathStringSteps.axis['default'](step);
      }
    }
    this.output.push(this.pathStringSteps.item);
  };

  private clonePath(originalPath: tStack[]) {
    return originalPath.map(path => {
      if (Array.isArray(path)) {
        return this.clonePath(path);
      } else {
        let value = path.value;
        return {
          type: path.type,
          value: Array.isArray(value) ? path.value.map(v =>  Array.isArray(v) ? [...v] : v ) : value
        }
      }
    });
  };

  private tests = {
    isPositiveFilteredResult: (item: tStack) => {
      switch (item.type) {
        case TYPES.nodes:
          return !!item.value.length;
        case TYPES.boolean:
          return !!item.value;
        case TYPES.invalid:
          return false;
        default: debugger; /* TODO: handle other types */
      }
    },
    isPositionCheck: (paths: tStack[]) => {
      return Array.isArray(paths) && (
        (paths.length === 1 && paths[0].type === TYPES.number) || 
        (paths.length === 2 && paths[1].type === TYPES.function && ['last', 'first'].includes(paths[1].value))
      )
    }
  };

  private postFixPathTypes = {
    rootPath: (path: tStack, { isFilterMode }: tFilterModeOptions) => {
      this.output.push({
        type: TYPES.nodes,
        value: nodesOps.get.root(this.nodesState.getNodes(path.callerId)),
        startedFromRoot: !!isFilterMode
      });
      this.processPathString(path.value);
    },
    path: (path: tStack, { isFilterMode, current }: tFilterModeOptions) => {
      if (isFilterMode && current && path.value[0] !== '/') {
        this.output.push({
          type: TYPES.nodes,
          value: [current]
        });
      }
      // expects pop to pull out nodes type
      this.processPathString(path.value);
    },
    string: (path: tStack) => {
      this.output.push(path);
    },
    number: (path: tStack) => {
      this.output.push(path);
    },
    boolean: (path: tStack) => {
      this.output.push(path);
    },
    variablePath: (path: tStack) => {
        const variableName = path.value.substring(0, path.value.indexOf('/'));
        this.output.push({
          type: TYPES.nodes,
          value: this.variablesInstance.getVariableRootNode(variableName)
        });
        this.processPathString(path.value.replace(variableName, ''));
    },
    variable: (path: tStack) => {
        this.output.push({
          type: TYPES.nodes,
          value: this.variablesInstance.getVariableRootNode(path.value)
        });
        this.processPathString('.');
    },
    position: (path: tStack, { index }: tFilterModeOptions) => {
      this.output.push({
        type: path.type,
        value: index
      });
    },
    function: (path: tStack, filterProps: tFilterModeOptions) => {
      const args = this.output.pop();
      this.functionsInstance.preRun(filterProps);
      this.output.push(
        this.functionsInstance.run(path.value, args.value)
      );
    },
    arguments: (path: tStack, filterOptions: tFilterModeOptions) => {
      this.output.push({
        type: TYPES.arguments,
        value: path.value.map(arg => {
          this.processPostfixPath(Array.isArray(arg) ? arg : [arg], filterOptions);
          return this.output.pop();
        })
      });
    },
    operator: (path: tStack, filterOptions: tFilterModeOptions) => {
      const rightOperandItem = this.output.pop();
      const leftOperandItem = this.output.pop();
      const result = this.operationsInstance.run(path.value, leftOperandItem, rightOperandItem, filterOptions);
      this.output.push(result);
    }
  };
  
  public processPostfixPath(paths: tStackCombo, filterProps?: tFilterModeOptions) {
    let path: tStack | tStack[];
    while (paths.length) {
      path = paths.shift();
      if (Array.isArray(path)) { // this triggers filter mode (xpath predicate)
        let isPositionCheck = false;
        const context = this.output.pop();
        const updatedNodes = context.value.filter((nodes, index) => {
          // clone the path
          const localPath = this.clonePath(path as tStack[]);
          if (isPositionCheck || this.tests.isPositionCheck(localPath)) {
            isPositionCheck = true;
            localPath.push({
              type: 'position',
              value: ''
            });
            localPath.push({
              type: 'operator',
              value: '='
            });
          }
          const localFilterProps = {
            isFilterMode: true,
            current: nodes,
            index: index+1,
            firstIndex: 1,
            lastIndex: context.value.length
          };

          this.processPostfixPath(localPath, localFilterProps);
          return this.tests.isPositiveFilteredResult(this.output.pop());
        });

        this.output.push({
          type: TYPES.nodes,
          value: updatedNodes
        });
      } else {
        this.postFixPathTypes[path.type](path, {...filterProps});
      }
    }
  };

  public reset() {
    this.output = [];
    this.nodesState.reset();
  }
}
