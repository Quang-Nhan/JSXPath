import { Variables } from "./Variables";

describe('Class Variables', () => {
  let variablesInstance, variables, rootProps;
  beforeEach(() => {
    variables = {
      variableName: {a: { b: 'c' }}
    };
    rootProps = {
      root: [1, 2],
      nodes: [
        [],
        []
      ]
    }
  });

  describe('constructor()', () => {
    it('When no argument is passed in, it should set variables to an empty object', () => {
      variablesInstance = new Variables(rootProps);
      expect(variablesInstance.variables).toEqual({});
    });

    it('When argument is passed in, it should set variables and cache the passed in value', () => {
      variablesInstance = new Variables(rootProps, variables);
      expect(variablesInstance.variables).toEqual(variables);
      expect(variablesInstance.cache).toEqual({
        root: {
          isPath: false,
          name: 'root',
          nodes: rootProps.nodes,
          value: rootProps.root
        },
        variableName: {
          isPath: false,
          name: 'variableName',
          value: {a: { b: 'c' }},
          nodes: null
        }
      });
    });
  });

  describe('getVariableRootNode()', () => {
    beforeEach(() => {
      variablesInstance = new Variables(rootProps, variables);
    });

    it('When the given variable name does not eixsts, it should throw an error', () => {
      const variable = '$b';
      expect(() => variablesInstance.getVariableRootNode(variable)).toThrow(`[Variables.getVariableRootNode] variable ${variable} is not defined`);
    });

    it('When the given variable name is valid, it should return the root node', () => {
      expect(variablesInstance.getVariableRootNode('variableName')).toEqual([
        [1, 0, "_", "_", "{$r}", "{$o}", "object", { childrenIds: [ 2 ], descendantIds: [ 2, 3 ], parentId: null, ancestorIds: [], siblings: [] }]
      ]);
    });
  });
});