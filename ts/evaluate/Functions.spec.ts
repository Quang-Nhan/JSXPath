import { TYPES } from '../consts';
import { Functions } from './Functions';

describe("Functions", () => {
  let functionInstance, args;

  describe('constructor()', () => {
    // it('When there is an invalid custom function, it throws an error', () => {

    // });

    it('When custom functions exists, merge it into the base function list', () => {
      functionInstance = new Functions({
        customFunction: () => {
          return {
            type: TYPES.string,
            value: 'this is custom function'
          }
        }
      });
      expect(functionInstance.mergedF['customFunction']).not.toBe(undefined);
    });

    it('When the custom function name already exists, override and use the custom version', () => {
      functionInstance = new Functions({
        name: () => {
          return {
            type: TYPES.string,
            value: 'overriden'
          }
        }
      });
      expect(functionInstance.mergedF.name()).toEqual({
        type: TYPES.string,
        value: 'overriden'
      });
    });
  });

  describe('run()', () => {
    beforeEach(() => {
      args = [];
      functionInstance = new Functions();
    });

    it('When an unknown function name is passed in, it should throw an error', () => {
      expect(() => functionInstance.run('Unknown', args)).toThrow('Error thrown in Functions[Unknown]: function "Unknown" does not exists');
    });
  });

  describe('getFunctionNames()', () => {
    beforeEach(() => {
      args = [];
      functionInstance = new Functions();
    });

    it('Should return a list of functions', () => {
      // fake functions 
      functionInstance.mergedF = {
        a: () => {},
        b: () => {},
        c: () => {}
      };
      expect(functionInstance.getFunctionNames()).toEqual(['a', 'b', 'c'])
    });
  });

  describe('abs()', () => {
    beforeEach(() => {
      args = [];
      functionInstance = new Functions();
    });

    it('Returns a positive number', () => {
      args.push({
        type: 'number',
        value: -2
      });

      expect(functionInstance.run('abs', args)).toEqual({
        type: 'number',
        value: 2
      });
    });

    it('Returns a positive number from a coord type', () => {
      args.push({
        type: TYPES.nodes,
        value: [
          [1, 1, 2, '_', 'a', -2, 'number', {}]
        ]
      });

      expect(functionInstance.run('abs', args)).toEqual({
        type: 'number',
        value: 2
      });
    });

    it('Returns the abs value of the first node', () => {
      args.push({
        type: TYPES.nodes,
        value: [
          [1, 1, 2, '_', 'a', -1, 'number', {}],
          [2, 1, 2, '_', 'f', 2, 'number', {}],
        ]
      });

      expect(functionInstance.run('abs', args)).toEqual({
        type: TYPES.number,
        value: 1
      });
    });

    it('Throws an error because the type is invalid', () => {
      args.push({
        type: TYPES.string,
        value: 'string'
      });

      expect(() => {functionInstance.run('abs', args)}).toThrow('Error thrown in Functions[abs]: Invalid type "string" - was expecting "number" type.');
    });

    it('Throws an error when the number of items in the coords list is 0', () => {
      args.push({
        type: TYPES.nodes,
        value: []
      });

      expect(() => {functionInstance.run('abs', args)}).toThrow('Error thrown in Functions[abs]: Was expecting at least one node value.')
    });

    it('Checks the value of coords type and throws an error if the value\'s value type is invalid', () => {
      args.push({
        type: TYPES.nodes,
        value: [
          [1, 1, 2, '_', 'a', 'string', 'string', {}]
        ]
      });

      expect(() => {functionInstance.run('abs', args)}).toThrow('Error thrown in Functions[abs]: Invalid value type "string" - was expecting "number" value type.')
    });
  });

  describe('boolean()', () => {
    beforeEach(() => {
      args = [];
      functionInstance = new Functions();
    });

    it('Returns false if value is empty string', () => {
      args.push({
        type: TYPES.string,
        value: ''
      });
      expect(functionInstance.run('boolean', args)).toEqual({
        type: 'boolean',
        value: false
      });
    });
    it('Returns true if the value is not an empty string', () => {
      args.push({
        type: TYPES.string,
        value: '1'
      });
      expect(functionInstance.run('boolean', args)).toEqual({
        type: 'boolean',
        value: true
      });
    });
    it('Returns false if value is an empty list for coords type', () => {
      args.push({
        type: TYPES.nodes,
        value: []
      });
      expect(functionInstance.run('boolean', args)).toEqual({
        type: 'boolean',
        value: false
      });
    });
  });

  describe('choose()', () => {
    let trueStackItem, falseStackItem;
    beforeEach(() => {
      args = [];
      functionInstance = new Functions();
      trueStackItem = {
        type: TYPES.number,
        value: 15
      };
      falseStackItem = {
        type: TYPES.string,
        value: 'false'
      }
    });

    it('Shold return the trueStackItem', () => {
      args.push({
        type: TYPES.boolean,
        value: true
      })
      args.push(trueStackItem);
      args.push(falseStackItem);
      expect(functionInstance.run('choose', args)).toEqual(trueStackItem);
    });

    it('Should return the falseStackItem', () => {
      args.push({
        type: TYPES.boolean,
        value: false
      });
      args.push(trueStackItem);
      args.push(falseStackItem);
      expect(functionInstance.run('choose', args)).toEqual(falseStackItem);
    });
  });

  // type test should be covered in the abs() test suite
  // just testing the actual values now
  describe('ceiling()', () => {
    beforeEach(() => {
      args = [];
      functionInstance = new Functions();
    });
    
    it('Returns type number with value of 4 when the input number type has a value of 3.1', () => {
      args.push({
        type: 'number',
        value: 3.1
      });
      expect(functionInstance.run('ceiling', args)).toEqual({
        type: 'number',
        value: 4
      });
    });

    it('Returns type number with the value of 5 when the input type is coords and has a value of 4.9', () => {
      args.push({
        type: TYPES.nodes,
        value: [
          [1, 1, 2, '_', 'a',  4.9,'number', {}]
        ]
      });

      expect(functionInstance.run('ceiling', args)).toEqual({
        type: 'number',
        value: 5
      });
    });
  });

  describe('concat()', () => {
    beforeEach(() => {
      args = [];
      functionInstance = new Functions();
    });

    it('When there is more than 1 coord in the nodes type, it should process the first node value', () => {
      args.push({
        type: TYPES.nodes,
        value: [
          [1, 1, 2, '_', 'a', 1, 'number', {}],
          [2, 1, 2, '_', 'f', 2, 'number', {}],
        ]
      });
      expect(functionInstance.run('concat', args)).toEqual({
        type: TYPES.string,
        value: '1'
      });
    });

    it('Combine two string values', () => {
      args.push({
        type: TYPES.string,
        value: 'string1'
      });
      args.push({
        type: TYPES.string,
        value: 'string2'
      });

      expect(functionInstance.run('concat', args)).toEqual({
        type: TYPES.string,
        value: 'string1string2'
      });
    });

    it('Converts a number type to string and combine it with a number value type coords', () => {
      args.push({
        type: 'number',
        value: 99
      });
      args.push({
        type: TYPES.nodes,
        value: [
          [1, 1, 2, '_', 'a', 88, 'number', {}]
        ]
      });
      expect(functionInstance.run('concat', args)).toEqual({
        type: TYPES.string,
        value: '9988'
      });
    });
  });

  describe('contains()', () => {
    beforeEach(() => {
      args = [];
      functionInstance = new Functions();
    });

    it('When the searchFor value exists in search string, it should return true', () => {
      args.push({
        type: TYPES.string,
        value: 'This is the search string'
      });
      args.push({
        type: TYPES.string,
        value: 'ch str'
      });
      expect(functionInstance.run('contains', args)).toEqual({
        type: TYPES.boolean,
        value: true
      });
    });

    it('When the searchFor value does not exists in search string, it should return false', () => {
      args.push({
        type: TYPES.string,
        value: 'This is the search string'
      });
      args.push({
        type: TYPES.string,
        VALUE: 'not exists'
      });
      expect(functionInstance.run('contains', args)).toEqual({
        type: TYPES.boolean,
        value: false
      });
    });

    it('Should work for nodes with string values', () => {
      args.push({
        type: TYPES.nodes,
        value: [
          [2, 1, 1, 0, "a", "abcde", "string"],
          [3, 1, 2, 1, "a", "fghij", "string"]
        ]
      });
      args.push({
        type: TYPES.nodes,
        value: [
          [2, 1, 1, 0, "a", "cde", "string"],
          [3, 1, 2, 1, "a", "gi", "string"]
        ]
      });
      expect(functionInstance.run('contains', args)).toEqual({
        type: TYPES.boolean,
        value: true
      });
    });
  });

  describe('count()', () => {
    beforeEach(() => {
      args = [];
      functionInstance = new Functions();
    });

    it('When there are 2 node items in the list, it should return a number typed value of 2', () => {
      args.push({
        type: TYPES.nodes,
        value: [
          [2, 1, 1, 0, "a", "abcde", "string"],
          [3, 1, 2, 1, "a", "fghij", "string"]
        ]
      });
      expect(functionInstance.run('count', args)).toEqual({
        type: TYPES.number,
        value: 2
      });
    });
  });

  describe('false()', () => {
    beforeEach(() => {
      args = [];
      functionInstance = new Functions();
    });

    it('Should return a boolean type stack item with a value of false', () => {
      expect(functionInstance.run('false', args)).toEqual({
        type: TYPES.boolean,
        value: false
      });
    });
  });

  describe('first()', () => {
    beforeEach(() => {
      args = [];
      functionInstance = new Functions();
    });

    it('When context properties\' firstIndex is set, return that value', () => {
      functionInstance.preRun({
        firstIndex: 1
      });

      expect(functionInstance.run('first', args)).toEqual({
        type: 'number',
        value: 1
      });
    });
  });

  describe('floor()', () => {
    beforeEach(() => {
      args = [];
      functionInstance = new Functions();
    })
    
    it('Returns type number with value of 4 when the input number type has a value of 4.1', () => {
      args.push({
        type: 'number',
        value: 4.1
      });
      expect(functionInstance.run('floor', args)).toEqual({
        type: 'number',
        value: 4
      });
    });

    it('Returns type number with the value of 5 when the input type is coords and has a value of 5.9', () => {
      args.push({
        type: TYPES.nodes,
        value: [
          [1, 1, 2, '_', 'a',  5.9,'number', {}]
        ]
      });

      expect(functionInstance.run('floor', args)).toEqual({
        type: 'number',
        value: 5
      });
    });
  });

  describe('last()', () => {
    beforeEach(() => {
      args = [];
      functionInstance = new Functions();
    });

    it('When context properties\' lastIndex is set, return that value', () => {
      functionInstance.preRun({
        lastIndex: 3
      });

      expect(functionInstance.run('last', args)).toEqual({
        type: 'number',
        value: 3
      });
    });
  });

  describe('local-name()', () => {
    beforeEach(() => {
      args = [];
      functionInstance = new Functions();
    });

    it('When passing in a non nodes argument, should return an empty string value type', () => {
      args.push({
        type: TYPES.boolean,
        value: false
      });
      expect(functionInstance.run('local-name', args)).toEqual({
        type: TYPES.string,
        value: ''
      });
    });

    it('When passing in a nodes argument, should return an the node name of the first node', () => {
      args.push({
        type: TYPES.nodes,
        value: [
          [2, 1, 1, "_", "a", "{$o}", "object", {childrenIds: [3], descendantIds: [3, 4], ancestorIds: [1], parentId: 1}],
          [3, 2, 2, "_", "b", "{$o}", "object", {childrenIds: [4], descendantIds: [4], ancestorIds: [1, 2], parentId: 2}],
        ]
      });
      expect(functionInstance.run('local-name', args)).toEqual({
        type: TYPES.string,
        value: 'a'
      });
    });

    it('When passing in a nodes argument and if it is a root node, should return an empty string value type', () => {
      args.push({
        type: TYPES.nodes,
        value: [
          [1, 0, "_", "_", "{$r}", "{$a}", "array", {childrenIds: [2, 3], descendantIds: [2, 3], parentId: null}]
        ]
      });
      expect(functionInstance.run('local-name', args)).toEqual({
        type: TYPES.string,
        value: ''
      });
    });

    it('When there is no argument and a context proprieties node exists, should return the context node name', () => {
      functionInstance.preRun({
        current: [3, 2, 2, "_", "b", "{$o}", "object", {childrenIds: [4], descendantIds: [4], ancestorIds: [1, 2], parentId: 2}]
      });
      expect(functionInstance.run('local-name', args)).toEqual({
        type: TYPES.string,
        value: 'b'
      });
    });
  });

  describe('name()', () => {
    beforeEach(() => {
      args = [];
      functionInstance = new Functions();
    });

    it('When passing in a non nodes argument, should return an empty string value type', () => {
      args.push({
        type: TYPES.boolean,
        value: false
      });
      expect(functionInstance.run('name', args)).toEqual({
        type: TYPES.string,
        value: ''
      });
    });

    it('When passing in a nodes argument, should return an the node name of the first node', () => {
      args.push({
        type: TYPES.nodes,
        value: [
          [2, 1, 1, "_", "a", "{$o}", "object", {childrenIds: [3], descendantIds: [3, 4], ancestorIds: [1], parentId: 1}],
          [3, 2, 2, "_", "b", "{$o}", "object", {childrenIds: [4], descendantIds: [4], ancestorIds: [1, 2], parentId: 2}],
        ]
      });
      expect(functionInstance.run('name', args)).toEqual({
        type: TYPES.string,
        value: 'a'
      });
    });

    it('When passing in a nodes argument and if it is a root node, should return an empty string value type', () => {
      args.push({
        type: TYPES.nodes,
        value: [
          [1, 0, "_", "_", "{$r}", "{$a}", "array", {childrenIds: [2, 3], descendantIds: [2, 3], parentId: null}]
        ]
      });
      expect(functionInstance.run('name', args)).toEqual({
        type: TYPES.string,
        value: ''
      });
    });

    it('When there is no argument and a context proprieties node exists, should return the context node name', () => {
      functionInstance.preRun({
        current: [3, 2, 2, "_", "b", "{$o}", "object", {childrenIds: [4], descendantIds: [4], ancestorIds: [1, 2], parentId: 2}]
      });
      expect(functionInstance.run('name', args)).toEqual({
        type: TYPES.string,
        value: 'b'
      })
    });
  });

  describe('not()', () => {
    beforeEach(() => {
      args = [];
      functionInstance = new Functions();
    });

    it('When an empty node set is passed in, it should throw an Error', () => {
      args.push({
        type: TYPES.nodes,
        value: []
      });
      expect(() => functionInstance.run('not', args)).toThrow();
    });

    it('When a node set is passed in, it should return false', () => {
      args.push({
        type: TYPES.nodes,
        value: [
          [1, 0, "_", "_", "{$r}", "{$a}", "array", {childrenIds: [2, 3], descendantIds: [2, 3], parentId: null}]
        ]
      });
      expect(functionInstance.run('not', args)).toEqual({
        type: TYPES.boolean,
        value: false
      });
    });

    it('Should return the opposite boolean value', () => {
      args.push({
        type: TYPES.boolean,
        value: false
      });
      expect(functionInstance.run('not', args)).toEqual({
        type: TYPES.boolean,
        value: true
      });
    })
  });

  describe('number()', () => {
    beforeEach(() => {
      args = [];
      functionInstance = new Functions();
    });
    it('When the passed in type is a number, it should return that number', () => {
      args.push({
        type: TYPES.number,
        value: 14.9
      })
      expect(functionInstance.run('number', args)).toEqual({
        type: TYPES.number,
        value: 14.9
      });
    });

    it('When the pased in type is a number node, it should return the item with the node\'s number value', () => {
      args.push({
        type: TYPES.nodes,
        value: [
          [4, 3, 9, '_', 'a', 14.9, 'number', {}]
        ]
      });
      expect(functionInstance.run('number', args)).toEqual({
        type: TYPES.number,
        value: 14.9
      });
    });

    it('When the passed in type is a number string, it should convert and return a number value', () => {
      args.push({
        type: TYPES.string,
        value: '14.9'
      });
      expect(functionInstance.run('number', args)).toEqual({
        type: TYPES.number,
        value: 14.9
      });
    });

    it('When the passed in type is a boolean, it should convert and return a number value', () => {
      args.push({
        type: TYPES.boolean,
        value: false
      });
      expect(functionInstance.run('number', args)).toEqual({
        type: TYPES.number,
        value: 0
      });

      args[0] = {
        type: TYPES.boolean,
        value: true
      };
      expect(functionInstance.run('number', args)).toEqual({
        type: TYPES.number,
        value: 1
      });
    });

    it('When the passed in type is not a number string, it should return NaN value', () => {
      args.push({
        type: TYPES.string,
        value: 'string'
      });
      expect(functionInstance.run('number', args)).toEqual({
        type: TYPES.number,
        value: NaN
      });
    });
  });

  describe('round()', () => {
    beforeEach(() => {
      args = [];
      functionInstance = new Functions();
    });
    
    it('Returns type number with value of 4 when the input number type has a value of 3.5', () => {
      args.push({
        type: 'number',
        value: 3.5
      });
      expect(functionInstance.run('round', args)).toEqual({
        type: 'number',
        value: 4
      });
    });

    it('Returns type number with value of 3 when the input number type has a value of 3.4', () => {
      args.push({
        type: 'number',
        value: 3.4
      });
      expect(functionInstance.run('round', args)).toEqual({
        type: 'number',
        value: 3
      });
    });

    it('Returns type number with the value of 5 when the input type is coords and has a value of 4.5', () => {
      args.push({
        type: TYPES.nodes,
        value: [
          [1, 1, 2, '_', 'a',  4.5,'number', {}]
        ]
      });

      expect(functionInstance.run('round', args)).toEqual({
        type: 'number',
        value: 5
      });
    });

    it('Returns type number with the value of 4 when the input type is coords and has a value of 4.4', () => {
      args.push({
        type: TYPES.nodes,
        value: [
          [1, 1, 2, '_', 'a',  4.4,'number', {}]
        ]
      });

      expect(functionInstance.run('round', args)).toEqual({
        type: 'number',
        value: 4
      });
    });
  });
    
  describe('string()', () => {
    beforeEach(() => {
      args = [];
      functionInstance = new Functions();
    });

    it('Converts a number type value to a string', () => {
      args.push({
        type: 'number',
        value: 999
      });
      expect(functionInstance.run('string', args)).toEqual({
        type: TYPES.string,
        value: '999'
      });
    });

    it('When it is an object type node, it should throw an error', () => {
      args.push({
        type: TYPES.nodes,
        value: [
          [2, 0, 1, '_', 'a', '{$o}', 'object', {
            descendants: [
              [3, 1, 2, '_', 'b', 1, 'number', {}],
              [4, 1, 2, '_', 'c', 2, 'number', {}]
            ]
          }]
        ]
      });
      expect(() => functionInstance.run('string', args)).toThrow('Error thrown in Functions[string]: Invalid value type "object" - was expecting "string,number,boolean" value type.');
    });
  });

  describe('substring-before()', () => {
    beforeEach(() => {
      args = [{
        type: 'string',
        value: 'This is the search string'
      }];
      functionInstance = new Functions();
    });
    
    it('When the search for value does not exists in the search string, it should return an empty string', () => {
      args.push({
        type: 'string',
        value: 'nothing'
      });
      expect(functionInstance.run('substring-before', args)).toEqual({
        type: 'string',
        value: ''
      });
    });

    it('When the search for value exists in search string, it should return the substring before the start of the search for string', () => {
      args.push({
        type: 'string',
        value: 'the'
      });
      expect(functionInstance.run('substring-before', args)).toEqual({
        type: 'string',
        value: 'This is '
      });
    });

    it('When no arguments are provided, it should throw an error', () => {
      expect(() => functionInstance.run('substring-before', [])).toThrow('Error thrown in Functions[substring-before](first argument): Missing stack item/argument');
    });

    it('When a second argument does not exists, it should throw an error', () => {
      expect(() => functionInstance.run('substring-before', args)).toThrow('Error thrown in Functions[substring-before](second argument): Missing stack item/argument');
    });
  });

  describe('substring-after()', () => {
    beforeEach(() => {
      args = [{
        type: 'string',
        value: 'This is the search string'
      }];
      functionInstance = new Functions();
    });
    
    it('When the search for value does not exists in the search string, it should return an empty string', () => {
      args.push({
        type: 'string',
        value: 'nothing'
      });
      expect(functionInstance.run('substring-after', args)).toEqual({
        type: 'string',
        value: ''
      });
    });

    it('When the search for value exists in search string, it should return the substring after the start of the search for string', () => {
      args.push({
        type: 'string',
        value: 'the'
      });
      expect(functionInstance.run('substring-after', args)).toEqual({
        type: 'string',
        value: ' search string'
      });
    });

    it('When no arguments are provided, it should throw an error', () => {
      expect(() => functionInstance.run('substring-after', [])).toThrow('Error thrown in Functions[substring-after](first argument): Missing stack item/argument');
    });

    it('When a second argument does not exists, it should throw an error', () => {
      expect(() => functionInstance.run('substring-after', args)).toThrow('Error thrown in Functions[substring-after](second argument): Missing stack item/argument');
    });
  });

  describe('true()', () => {
    beforeEach(() => {
      args = [];
      functionInstance = new Functions();
    });

    it('Should return a boolean type stack item with a value of true', () => {
      expect(functionInstance.run('true', args)).toEqual({
        type: TYPES.boolean,
        value: true
      });
    });
  });
});