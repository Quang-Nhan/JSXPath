import { TYPES } from "../consts";
import { Nodes } from "../nodes/Nodes";
import { NodesState } from "../nodes/State";
import { Operations } from "./Operations";

describe('Class Operations', () => {
  let 
    operationsInstance,
    nodesInstance,
    leftOperandItem, 
    rightOperandItem, 
    operation,
    numberNode1,
    numberNode2,
    stringNode;

  beforeEach(() => {
    numberNode1 = [5, 2, 2, 2, "b", 2, "number", {childrenIds: [], descendantIds: [], ancestorIds: [1, 2], parentId: 2}];
    numberNode2 = [4, 3, 3, "_", "value", 3, "number", {childrenIds: [], descendantIds: [], ancestorIds: [1, 2, 3], parentId: 3}];
    stringNode = [2, 1, 1, "_", "a", "a", "string", {childrenIds: [], descendantIds: [], ancestorIds: [1], parentId: 1}];
  });

  describe('', () => {

  });

  describe('f.filterMode', () => {
    let filterOptions;
    beforeEach(() => {
      filterOptions = {
        isFilterMode: true
      };
    });

    describe('+', () => {
      beforeEach(() => {
        operationsInstance = new Operations();
        operation = '+';
      });

      it('left and right operands are nodes', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: [
            [4, 2, "_", 1, "{$v}", "string", "string", {childrenIds: [], descendantIds: [], ancestorIds: [1, 2], parentId: 2}],
            numberNode1
          ]
        };
        rightOperandItem = {
          type: TYPES.nodes,
          value: [
            numberNode2
          ]
        };

        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.operatedValues,
          value: [{
            type: TYPES.number,
            value: 5,
            operands: [
              {
                startedFromRoot: false,
                ...{ type: TYPES.nodes, value: numberNode1 }
              },
              {
                startedFromRoot: false,
                ...{ type: TYPES.nodes, value: numberNode2 }
              }
            ]
          }]
        });
      });
      
      it('left is nodes and right is number', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: [
            [4, 2, "_", 1, "{$v}", "string", "string", {childrenIds: [], descendantIds: [], ancestorIds: [1, 2], parentId: 2}],
            numberNode1
          ]
        };
        rightOperandItem = {
          type: TYPES.number,
          value: 3.1
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.operatedValues,
          value: [{
            type: TYPES.number,
            value: 5.1,
            operands: [
              {
                startedFromRoot: false,
                ...{ type: TYPES.nodes, value: numberNode1 }
              },
              {
                startedFromRoot: false,
                ...rightOperandItem
              }
            ]
          }]
        });
      });

      it('left or right are not number types, it should return an invalid type', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: [
            numberNode1
          ]
        };
        rightOperandItem = {
          type: TYPES.string,
          value: '3.1'
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.invalid,
          value: 'Right operand is an invalid type. Was expecting number or nodes or operatedValues type but received string'
        });
      });

      it('left nodes have no value, treat it as zero', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: []
        };
        rightOperandItem = {
          type: TYPES.number,
          value: 3
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.operatedValues,
          value: [{
            type: TYPES.number,
            value: 3,
            operands: [
              {
                startedFromRoot: false,
                ...{ type: TYPES.number, value: 3 }
              }
            ]
          }]
        });
      });
    });
  
    describe('-', () => {
      beforeEach(() => {
        operationsInstance = new Operations();
        operation = '-';
      });

      it('left and right operands are nodes', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: [
            [4, 2, "_", 1, "{$v}", "string", "string", {childrenIds: [], descendantIds: [], ancestorIds: [1, 2], parentId: 2}],
            numberNode1
          ]
        };
        rightOperandItem = {
          type: TYPES.nodes,
          value: [
            numberNode2
          ]
        };

        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.operatedValues,
          value: [{
            type: TYPES.number,
            value: -1,
            operands: [
              {
                startedFromRoot: false,
                ...{ type: TYPES.nodes, value: numberNode1 }
              },
              {
                startedFromRoot: false,
                ...{ type: TYPES.nodes, value: numberNode2 }
              }
            ]
          }]
        });
      });
  
      it('left is nodes and right is number', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: [
            [4, 2, "_", 1, "{$v}", "string", "string", {childrenIds: [], descendantIds: [], ancestorIds: [1, 2], parentId: 2}],
            numberNode1
          ]
        };
        rightOperandItem = {
          type: TYPES.number,
          value: 3.1
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.operatedValues,
          value: [{
            type: TYPES.number,
            value: -1.1,
            operands: [
              {
                startedFromRoot: false,
                ...{ type: TYPES.nodes, value: numberNode1 }
              },
              {
                startedFromRoot: false,
                ...rightOperandItem
              }
            ]
          }]
        });
      });

      it('left or right are not number types, it should return an invalid type', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: [
            numberNode1
          ]
        };
        rightOperandItem = {
          type: TYPES.string,
          value: '3.1'
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.invalid,
          value: 'Right operand is an invalid type. Was expecting number or nodes or operatedValues type but received string'
        });
      });

      it('left nodes have no value, treat it as zero', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: []
        };
        rightOperandItem = {
          type: TYPES.number,
          value: 3
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.operatedValues,
          value: [{
            type: TYPES.number,
            value: -3,
            operands: [
              {
                startedFromRoot: false,
                ...{ type: TYPES.number, value: 3 }
              }
            ]
          }]
        });
      });
    });
  
    describe('*', () => {
      beforeEach(() => {
        operationsInstance = new Operations();
        operation = '*';
      });

      it('left and right operands are nodes', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: [
            [4, 2, "_", 1, "{$v}", "string", "string", {childrenIds: [], descendantIds: [], ancestorIds: [1, 2], parentId: 2}],
            numberNode1
          ]
        };
        rightOperandItem = {
          type: TYPES.nodes,
          value: [
            numberNode2
          ]
        };

        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.operatedValues,
          value: [{
            type: TYPES.number,
            value: 6,
            operands: [
              {
                startedFromRoot: false,
                ...{ type: TYPES.nodes, value: numberNode1 }
              },
              {
                startedFromRoot: false,
                ...{ type: TYPES.nodes, value: numberNode2 }
              }
            ]
          }]
        });
      });
      
      it('left is nodes and right is number', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: [
            [4, 2, "_", 1, "{$v}", "string", "string", {childrenIds: [], descendantIds: [], ancestorIds: [1, 2], parentId: 2}],
            numberNode1
          ]
        };
        rightOperandItem = {
          type: TYPES.number,
          value: 3.1
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.operatedValues,
          value: [{
            type: TYPES.number,
            value: 6.2,
            operands: [
              {
                startedFromRoot: false,
                ...{ type: TYPES.nodes, value: numberNode1 }
              },
              {
                startedFromRoot: false,
                ...rightOperandItem
              }
            ]
          }]
        });
      });

      it('left or right are not number types, it should return an invalid type', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: [
            numberNode1
          ]
        };
        rightOperandItem = {
          type: TYPES.string,
          value: '3.1'
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.invalid,
          value: 'Right operand is an invalid type. Was expecting number or nodes or operatedValues type but received string'
        });
      });

      it('left nodes have no value, treat it as zero', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: []
        };
        rightOperandItem = {
          type: TYPES.number,
          value: 3
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.operatedValues,
          value: [{
            type: TYPES.number,
            value: 0,
            operands: [
              {
                startedFromRoot: false,
                ...{ type: TYPES.number, value: 3 }
              }
            ]
          }]
        });
      });
    });
  
    describe('div', () => {
      beforeEach(() => {
        operationsInstance = new Operations();
        operation = 'div';
      });

      it('left and right operands are nodes', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: [
            [4, 2, "_", 1, "{$v}", "string", "string", {childrenIds: [], descendantIds: [], ancestorIds: [1, 2], parentId: 2}],
            numberNode1
          ]
        };
        rightOperandItem = {
          type: TYPES.nodes,
          value: [
            numberNode2
          ]
        };

        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.operatedValues,
          value: [{
            type: TYPES.number,
            value: 2/3,
            operands: [
              {
                startedFromRoot: false,
                ...{ type: TYPES.nodes, value: numberNode1 }
              },
              {
                startedFromRoot: false,
                ...{ type: TYPES.nodes, value: numberNode2 }
              }
            ]
          }]
        });
      });
      
      it('left is nodes and right is number', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: [
            [4, 2, "_", 1, "{$v}", "string", "string", {childrenIds: [], descendantIds: [], ancestorIds: [1, 2], parentId: 2}],
            numberNode1
          ]
        };
        rightOperandItem = {
          type: TYPES.number,
          value: 3.1
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.operatedValues,
          value: [{
            type: TYPES.number,
            value: 2/3.1,
            operands: [
              {
                startedFromRoot: false,
                ...{ type: TYPES.nodes, value: numberNode1 }
              },
              {
                startedFromRoot: false,
                ...rightOperandItem
              }
            ]
          }]
        });
      });

      it('left or right are not number types, it should return an invalid type', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: [
            numberNode1
          ]
        };
        rightOperandItem = {
          type: TYPES.string,
          value: '3.1'
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.invalid,
          value: 'Right operand is an invalid type. Was expecting number or nodes or operatedValues type but received string'
        });
      });

      it('left nodes have no value, it should return invalid type', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: []
        };
        rightOperandItem = {
          type: TYPES.number,
          value: 3
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.invalid,
          value: 'Left operand is an invalid. It has no valid value'
        });
      });
    });
  
  
    xdescribe('mod', () => {
      beforeEach(() => {
        operationsInstance = new Operations();
        operation = 'mod';
      });

      it('left and right operands are nodes', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: [
            [4, 2, "_", 1, "{$v}", "string", "string", {childrenIds: [], descendantIds: [], ancestorIds: [1, 2], parentId: 2}],
            numberNode1
          ]
        };
        rightOperandItem = {
          type: TYPES.nodes,
          value: [
            numberNode2
          ]
        };

        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.operatedValues,
          value: [{
            type: TYPES.number,
            value: 5,
            operands: [
              {
                startedFromRoot: false,
                ...{ type: TYPES.nodes, value: numberNode1 }
              },
              {
                startedFromRoot: false,
                ...{ type: TYPES.nodes, value: numberNode2 }
              }
            ]
          }]
        });
      });
      
      it('left is nodes and right is number', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: [
            [4, 2, "_", 1, "{$v}", "string", "string", {childrenIds: [], descendantIds: [], ancestorIds: [1, 2], parentId: 2}],
            numberNode1
          ]
        };
        rightOperandItem = {
          type: TYPES.number,
          value: 3.1
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.operatedValues,
          value: [{
            type: TYPES.number,
            value: 5.1,
            operands: [
              {
                startedFromRoot: false,
                ...{ type: TYPES.nodes, value: numberNode1 }
              },
              {
                startedFromRoot: false,
                ...rightOperandItem
              }
            ]
          }]
        });
      });

      it('left or right are not number types, it should return an invalid type', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: [
            numberNode1
          ]
        };
        rightOperandItem = {
          type: TYPES.string,
          value: '3.1'
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.invalid,
          value: 'Right operand is an invalid type. Was expecting number or nodes or operatedValues type but received string'
        });
      });

      it('left nodes have no value, treat it as zero', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: []
        };
        rightOperandItem = {
          type: TYPES.number,
          value: 3
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.operatedValues,
          value: [{
            type: TYPES.number,
            value: 3,
            operands: [
              {
                startedFromRoot: false,
                ...{ type: TYPES.number, value: 3 }
              }
            ]
          }]
        });
      });
    });

    describe('=', () => {
      beforeEach(() => {
        operationsInstance = new Operations();
        operation = '=';
      });

      it('left is a position type with value matching the right number value', () => {
        leftOperandItem = {
          type: TYPES.position,
          value: 2
        };
        rightOperandItem = {
          type: TYPES.number,
          value: 2
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.boolean,
          value: true
        });
      });
      
      it('right is a position type with value not matching the left number value', () => {
        leftOperandItem = {
          type: TYPES.number,
          value: 2
        };
        rightOperandItem = {
          type: TYPES.position,
          value: 1
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.boolean,
          value: false
        });
      });

      it('left and right operands are nodes and have the same number value', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: [
            numberNode1
          ]
        };
        rightOperandItem = {
          type: TYPES.nodes,
          value: [
            numberNode1
          ]
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.boolean,
          value: true
        });
      });

      it('left and right operands are nodes and have different number value', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: [
            numberNode1
          ]
        };
        rightOperandItem = {
          type: TYPES.nodes,
          value: [
            numberNode2
          ]
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.boolean,
          value: false
        });
      });

      it('left and right operands are nodes and have different sub type', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: [
            numberNode1,
            numberNode2
          ]
        };
        rightOperandItem = {
          type: TYPES.nodes,
          value: [
            stringNode
          ]
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.boolean,
          value: false
        });
      })

      it('left and right operands are string but not the same value', () => {
        leftOperandItem = {
          type: TYPES.string,
          value: 'a'
        };
        rightOperandItem = {
          type: TYPES.string,
          value: 'b'
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.boolean,
          value: false
        });
      });

      it('left and right operands are string and is the same value', () => {
        leftOperandItem = {
          type: TYPES.string,
          value: 'a'
        };
        rightOperandItem = {
          type: TYPES.string,
          value: 'a'
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.boolean,
          value: true
        });
      });

      it('left and right operands are different types', () => {
        leftOperandItem = {
          type: TYPES.string,
          value: 'false'
        };
        rightOperandItem = {
          type: TYPES.boolean,
          value: false
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.boolean,
          value: false
        });
      });

      it('left type is invalid, it should return invalid type', () => {
        leftOperandItem = {
          type: TYPES.invalid,
          value: 'Invalid message'
        };
        rightOperandItem = {
          type: TYPES.boolean,
          value: false
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual(leftOperandItem);
      });

      it('left and right are operated values', () => {
        leftOperandItem = {
          type: TYPES.operatedValues,
          value: [{
            type: TYPES.number,
            value: 5,
            operands: [
              {
                startedFromRoot: false,
                ...{ type: TYPES.nodes, value: numberNode1 }
              },
              {
                startedFromRoot: false,
                ...{ type: TYPES.nodes, value: numberNode2 }
              }
            ]
          }]
        };
        rightOperandItem = {
          type: TYPES.operatedValues,
          value: [{
            type: TYPES.number,
            value: 5,
            operands: [
              {
                startedFromRoot: false,
                ...{ type: TYPES.nodes, value: numberNode2 }
              },
              {
                startedFromRoot: false,
                ...{ type: TYPES.nodes, value: numberNode1 }
              }
            ]
          }]
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.boolean, 
          value: true
        });
      });

      it('left and right are nodes types both have same value, it should return true', () => {
        NodesState.getInstance().reset();
        nodesInstance = new Nodes();
        const callerId = 'main';
        const json = {
          a: {
            c: 'value'
          },
          b: {
            c: 'value'
          }
        };
        nodesInstance.jsonToNodes(json, callerId);
        leftOperandItem = {
          type: TYPES.nodes,
          value: [
            [ 2, 1, 1, "_", "a", "{$o}", "object", { "ancestorIds": [ 1 ], "childrenIds": [ 3 ], "descendantIds": [ 3 ], "parentId": 1 } ]
          ]
        };
        rightOperandItem = {
          type: TYPES.nodes,
          value: [
            [ 4, 1, 1, "_", "b", "{$o}", "object", { "ancestorIds": [ 1 ], "childrenIds": [ 5 ], "descendantIds": [ 5 ], "parentId": 1 } ]
          ]
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.boolean,
          value: true
        });
      });

      it('left and right are nodes array types both have same value, it should return true', () => {
        NodesState.getInstance().reset();
        nodesInstance = new Nodes();
        const callerId = 'main';
        const json = {
          a: [
            1,
            {k: "l"},
            false
          ],
          b: [
            1,
            {k: "l"},
            false
          ]
        };
        nodesInstance.jsonToNodes(json, callerId);
        leftOperandItem = {
          type: TYPES.nodes,
          value: [
            [ 2, 1, 1, "_", "a", "{$a}", "array", { "ancestorIds": [ 1 ], "childrenIds": [ 3, 4, 6 ], "descendantIds": [ 3, 4, 6, 5 ], "parentId": 1, "siblings": [ 7 ], } ]
          ]
        };
        rightOperandItem = {
          type: TYPES.nodes,
          value: [
            [ 7, 1, 1, "_", "b", "{$a}", "array", { "ancestorIds": [ 1 ], "childrenIds": [ 8, 9, 11 ], "descendantIds": [ 8, 9, 11, 10 ], "parentId": 1, "siblings": [ 2 ] } ]
          ]
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.boolean,
          value: true
        });
      });

      it('left and right are nodes types but have different value, it should return false', () => {
        NodesState.getInstance().reset();
        nodesInstance = new Nodes();
        const callerId = 'main';
        const json = {
          a: {
            c: 'value'
          },
          b: [
            {c: 'value'}
          ]
        };
        nodesInstance.jsonToNodes(json, callerId);
        leftOperandItem = {
          type: TYPES.nodes,
          value: [
            [ 2, 1, 1, "_", "a", "{$o}", "object", { "ancestorIds": [ 1 ], "childrenIds": [ 3 ], "descendantIds": [ 3 ], "parentId": 1, } ]
          ]
        };
        rightOperandItem = {
          type: TYPES.nodes,
          value: [
            [ 4, 1, 1, "_", "b", "{$a}", "array", { "ancestorIds": [ 1 ], "childrenIds": [ 5 ], "descendantIds": [ 5 ], "parentId": 1 } ]
          ]
        };

        // expect(nodesInstance.jsonToNodes(json, callerId)).toEqual([])
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.boolean,
          value: false
        });
      });
    }); 

    describe('>', () => {
      beforeEach(() => {
        operationsInstance = new Operations();
        operation = '>';
      });

      it('left is a position type with value matching the right number value', () => {
        leftOperandItem = {
          type: TYPES.position,
          value: 2
        };
        rightOperandItem = {
          type: TYPES.number,
          value: 2
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.boolean,
          value: false
        });
      });
      
      it('right is a position type with value not matching the left number value', () => {
        leftOperandItem = {
          type: TYPES.number,
          value: 2
        };
        rightOperandItem = {
          type: TYPES.position,
          value: 1
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.boolean,
          value: true
        });
      });

      it('left and right are number nodes left have a higher value, it should return true', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: [ numberNode2 ]
        };
        rightOperandItem = {
          type: TYPES.nodes,
          value: [ numberNode1 ]
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.boolean,
          value: true
        });
      });

      it('left and right are number nodes have the same value, it should return false', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: [ numberNode2 ]
        };
        rightOperandItem = {
          type: TYPES.nodes,
          value: [ numberNode2 ]
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.boolean,
          value: false
        });
      });

      it('left and right are number nodes left have a lower value, it should return false', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: [ numberNode1 ]
        };
        rightOperandItem = {
          type: TYPES.nodes,
          value: [ numberNode2 ]
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.boolean,
          value: false
        });
      });

      it('left or right have only string nodes, it should return false', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: [ stringNode ]
        };
        rightOperandItem = {
          type: TYPES.nodes,
          value: [ stringNode ]
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.boolean,
          value: false
        });
      });

      it('left and right have different types, it should return false', () => {
        leftOperandItem = {
          type: TYPES.number,
          value: 2
        };
        rightOperandItem = {
          type: TYPES.string,
          value: '1'
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.boolean,
          value: false
        });
      });
    });

    describe('<', () => {
      beforeEach(() => {
        operationsInstance = new Operations();
        operation = '<';
      });

      it('left and right number nodes, ', () => {
        
      });
    });

    describe('>=', () => {

    });

    describe('<=', () => {

    });

    describe('and', () => {
      beforeEach(() => {
        operationsInstance = new Operations();
        operation = 'and';
      });

      it('left and right are boolean true value types, it should return true', () => {
        leftOperandItem = {
          type: TYPES.boolean,
          value: true
        };
        rightOperandItem = {
          type: TYPES.boolean,
          value: true
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.boolean,
          value: true
        });
      });

      it('left and right are boolean tyeps one has a false value, it should return false', () => {
        leftOperandItem = {
          type: TYPES.boolean,
          value: true
        };
        rightOperandItem = {
          type: TYPES.boolean,
          value: false
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.boolean,
          value: false
        });
      });

      it('left and right are nodes types both are not empty, it should return true', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: [ numberNode1 ]
        };
        rightOperandItem = {
          type: TYPES.nodes,
          value: [ stringNode ]
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.boolean,
          value: true
        });
      });

      it('left and right are nodes types but one is empty, it should return false', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: []
        };
        rightOperandItem = {
          type: TYPES.nodes,
          value: [ numberNode1 ]
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.boolean,
          value: false
        });
      });
    });

    describe('or', () => {
      beforeEach(() => {
        operationsInstance = new Operations();
        operation = 'or';
      });

      it('left and right are boolean true value types, it should return true', () => {
        leftOperandItem = {
          type: TYPES.boolean,
          value: true
        };
        rightOperandItem = {
          type: TYPES.boolean,
          value: true
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.boolean,
          value: true
        });
      });

      it('left and right are boolean tyeps one has a false value, it should return true', () => {
        leftOperandItem = {
          type: TYPES.boolean,
          value: true
        };
        rightOperandItem = {
          type: TYPES.boolean,
          value: false
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.boolean,
          value: true
        });
      });

      it('left and right are nodes types both are not empty, it should return true', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: [ numberNode1 ]
        };
        rightOperandItem = {
          type: TYPES.nodes,
          value: [ stringNode ]
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.boolean,
          value: true
        });
      });

      it('left and right are nodes types but one is empty, it should return true', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: []
        };
        rightOperandItem = {
          type: TYPES.nodes,
          value: [ numberNode1 ]
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.boolean,
          value: true
        });
      });

      it('left and right are nodes types but both are empty, it should return false', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: []
        };
        rightOperandItem = {
          type: TYPES.nodes,
          value: []
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.boolean,
          value: false
        });
      });
    });

    describe('|', () => {
      leftOperandItem = {
        type: TYPES.nodes,
        value: []
      };
      rightOperandItem = {
        type: TYPES.nodes,
        value: []
      };
    });
  });


  describe('f.default', () => {
    let filterOptions;
    beforeEach(() => {
      filterOptions = {
        isFilterMode: true
      };
    });

    describe('+', () => {
      beforeEach(() => {
        operationsInstance = new Operations();
        operation = '+';
      });

      it('left and right operands are nodes', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: [
            [4, 2, "_", 1, "{$v}", "string", "string", {childrenIds: [], descendantIds: [], ancestorIds: [1, 2], parentId: 2}],
            numberNode1
          ]
        };
        rightOperandItem = {
          type: TYPES.nodes,
          value: [
            numberNode2
          ]
        };

        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.operatedValues,
          value: [{
            type: TYPES.number,
            value: 5,
            operands: [
              {
                startedFromRoot: false,
                ...{ type: TYPES.nodes, value: numberNode1 }
              },
              {
                startedFromRoot: false,
                ...{ type: TYPES.nodes, value: numberNode2 }
              }
            ]
          }]
        });
      });
      
      it('left is nodes and right is number', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: [
            [4, 2, "_", 1, "{$v}", "string", "string", {childrenIds: [], descendantIds: [], ancestorIds: [1, 2], parentId: 2}],
            numberNode1
          ]
        };
        rightOperandItem = {
          type: TYPES.number,
          value: 3.1
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.operatedValues,
          value: [{
            type: TYPES.number,
            value: 5.1,
            operands: [
              {
                startedFromRoot: false,
                ...{ type: TYPES.nodes, value: numberNode1 }
              },
              {
                startedFromRoot: false,
                ...rightOperandItem
              }
            ]
          }]
        });
      });

      it('left or right are not number types, it should return an invalid type', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: [
            numberNode1
          ]
        };
        rightOperandItem = {
          type: TYPES.string,
          value: '3.1'
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.invalid,
          value: 'Right operand is an invalid type. Was expecting number or nodes or operatedValues type but received string'
        });
      });

      it('left nodes have no value, treat it as zero', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: []
        };
        rightOperandItem = {
          type: TYPES.number,
          value: 3
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.operatedValues,
          value: [{
            type: TYPES.number,
            value: 3,
            operands: [
              {
                startedFromRoot: false,
                ...{ type: TYPES.number, value: 3 }
              }
            ]
          }]
        });
      });
    });
  
    describe('-', () => {
      beforeEach(() => {
        operationsInstance = new Operations();
        operation = '-';
      });

      it('left and right operands are nodes', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: [
            [4, 2, "_", 1, "{$v}", "string", "string", {childrenIds: [], descendantIds: [], ancestorIds: [1, 2], parentId: 2}],
            numberNode1
          ]
        };
        rightOperandItem = {
          type: TYPES.nodes,
          value: [
            numberNode2
          ]
        };

        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.operatedValues,
          value: [{
            type: TYPES.number,
            value: -1,
            operands: [
              {
                startedFromRoot: false,
                ...{ type: TYPES.nodes, value: numberNode1 }
              },
              {
                startedFromRoot: false,
                ...{ type: TYPES.nodes, value: numberNode2 }
              }
            ]
          }]
        });
      });
  
      it('left is nodes and right is number', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: [
            [4, 2, "_", 1, "{$v}", "string", "string", {childrenIds: [], descendantIds: [], ancestorIds: [1, 2], parentId: 2}],
            numberNode1
          ]
        };
        rightOperandItem = {
          type: TYPES.number,
          value: 3.1
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.operatedValues,
          value: [{
            type: TYPES.number,
            value: -1.1,
            operands: [
              {
                startedFromRoot: false,
                ...{ type: TYPES.nodes, value: numberNode1 }
              },
              {
                startedFromRoot: false,
                ...rightOperandItem
              }
            ]
          }]
        });
      });

      it('left or right are not number types, it should return an invalid type', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: [
            numberNode1
          ]
        };
        rightOperandItem = {
          type: TYPES.string,
          value: '3.1'
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.invalid,
          value: 'Right operand is an invalid type. Was expecting number or nodes or operatedValues type but received string'
        });
      });

      it('left nodes have no value, treat it as zero', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: []
        };
        rightOperandItem = {
          type: TYPES.number,
          value: 3
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.operatedValues,
          value: [{
            type: TYPES.number,
            value: -3,
            operands: [
              {
                startedFromRoot: false,
                ...{ type: TYPES.number, value: 3 }
              }
            ]
          }]
        });
      });
    });
  
    describe('*', () => {
      beforeEach(() => {
        operationsInstance = new Operations();
        operation = '*';
      });

      it('left and right operands are nodes', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: [
            [4, 2, "_", 1, "{$v}", "string", "string", {childrenIds: [], descendantIds: [], ancestorIds: [1, 2], parentId: 2}],
            numberNode1
          ]
        };
        rightOperandItem = {
          type: TYPES.nodes,
          value: [
            numberNode2
          ]
        };

        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.operatedValues,
          value: [{
            type: TYPES.number,
            value: 6,
            operands: [
              {
                startedFromRoot: false,
                ...{ type: TYPES.nodes, value: numberNode1 }
              },
              {
                startedFromRoot: false,
                ...{ type: TYPES.nodes, value: numberNode2 }
              }
            ]
          }]
        });
      });
      
      it('left is nodes and right is number', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: [
            [4, 2, "_", 1, "{$v}", "string", "string", {childrenIds: [], descendantIds: [], ancestorIds: [1, 2], parentId: 2}],
            numberNode1
          ]
        };
        rightOperandItem = {
          type: TYPES.number,
          value: 3.1
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.operatedValues,
          value: [{
            type: TYPES.number,
            value: 6.2,
            operands: [
              {
                startedFromRoot: false,
                ...{ type: TYPES.nodes, value: numberNode1 }
              },
              {
                startedFromRoot: false,
                ...rightOperandItem
              }
            ]
          }]
        });
      });

      it('left or right are not number types, it should return an invalid type', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: [
            numberNode1
          ]
        };
        rightOperandItem = {
          type: TYPES.string,
          value: '3.1'
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.invalid,
          value: 'Right operand is an invalid type. Was expecting number or nodes or operatedValues type but received string'
        });
      });

      it('left nodes have no value, treat it as zero', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: []
        };
        rightOperandItem = {
          type: TYPES.number,
          value: 3
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.operatedValues,
          value: [{
            type: TYPES.number,
            value: 0,
            operands: [
              {
                startedFromRoot: false,
                ...{ type: TYPES.number, value: 3 }
              }
            ]
          }]
        });
      });
    });
  
    describe('div', () => {
      beforeEach(() => {
        operationsInstance = new Operations();
        operation = 'div';
      });

      it('left and right operands are nodes', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: [
            [4, 2, "_", 1, "{$v}", "string", "string", {childrenIds: [], descendantIds: [], ancestorIds: [1, 2], parentId: 2}],
            numberNode1
          ]
        };
        rightOperandItem = {
          type: TYPES.nodes,
          value: [
            numberNode2
          ]
        };

        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.operatedValues,
          value: [{
            type: TYPES.number,
            value: 2/3,
            operands: [
              {
                startedFromRoot: false,
                ...{ type: TYPES.nodes, value: numberNode1 }
              },
              {
                startedFromRoot: false,
                ...{ type: TYPES.nodes, value: numberNode2 }
              }
            ]
          }]
        });
      });
      
      it('left is nodes and right is number', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: [
            [4, 2, "_", 1, "{$v}", "string", "string", {childrenIds: [], descendantIds: [], ancestorIds: [1, 2], parentId: 2}],
            numberNode1
          ]
        };
        rightOperandItem = {
          type: TYPES.number,
          value: 3.1
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.operatedValues,
          value: [{
            type: TYPES.number,
            value: 2/3.1,
            operands: [
              {
                startedFromRoot: false,
                ...{ type: TYPES.nodes, value: numberNode1 }
              },
              {
                startedFromRoot: false,
                ...rightOperandItem
              }
            ]
          }]
        });
      });

      it('left or right are not number types, it should return an invalid type', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: [
            numberNode1
          ]
        };
        rightOperandItem = {
          type: TYPES.string,
          value: '3.1'
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.invalid,
          value: 'Right operand is an invalid type. Was expecting number or nodes or operatedValues type but received string'
        });
      });

      it('left nodes have no value, it should return invalid type', () => {
        leftOperandItem = {
          type: TYPES.nodes,
          value: []
        };
        rightOperandItem = {
          type: TYPES.number,
          value: 3
        };
        expect(operationsInstance.run(operation, leftOperandItem, rightOperandItem, filterOptions)).toEqual({
          type: TYPES.invalid,
          value: 'Left operand is an invalid. It has no valid value'
        });
      });
    });
  
  
    describe('mod', () => {
  
    });

    describe('=', () => {

    });

    describe('>', () => {

    });

    describe('<', () => {

    });

    describe('>=', () => {

    });

    describe('<=', () => {

    });

    describe('and', () => {

    });

    describe('or', () => {

    });

    describe('|', () => {

    });
  });
});
