import { TYPES } from "../consts";
import { KEYS, SYMBOLS } from "../nodes/consts";
import { throwError, opFunc, nodesOps} from "../Util";
import { tFilterModeOptions, tStack } from "../types";

type tOperationFunction = () => tStack

type tOperationFunctions = {
  [operationName: string] : tOperationFunction
};

type tOperations = {
  filterMode: tOperationFunctions,
  default: tOperationFunctions
};

export class Operations {
  private props = {
    leftOperandItem: null,
    rightOperandItem: null,
    context: null,
    set: (props) => {
      this.props.leftOperandItem = props.leftOperandItem;
      this.props.rightOperandItem = props.rightOperandItem;
      this.props.context = this.getContext(props.context);
    },
    reset: () => {
      this.props.leftOperandItem = null;
      this.props.rightOperandItem = null;
      this.props.context = null;
    }
  };

  private tests = {
    isNodes: (operand: tStack) => {
      return operand.type === TYPES.nodes;
    },
    isNodeObjectType: (operand: tStack) => {
      return [SYMBOLS.array, SYMBOLS.object].includes(operand.value)
    },
    isOperatedValues: (operand: tStack) => {
      return operand.type === 'operatedValues';
    },
    startedFromRootNode: (operand: tStack) => {
      return this.tests.isNodes(operand) && !!operand.startedFromRoot;
    },
    isPositionType: (operand: tStack) => {
      return operand.type === 'position';
    },
    operatedValues: {
      allOperandsAreNodes: (operatedValues) => {
        return operatedValues.every(opv => opv.operands.every((operand) => {
          return operand.type === TYPES.nodes;
        }));
      }
    },
    position: (operationType) => {
      let leftOperandItem = this.props.leftOperandItem;
      let rightOperandItem = this.props.rightOperandItem;
      if (this.tests.isPositionType(this.props.rightOperandItem)) {
        const tmp = this.props.rightOperandItem;
        rightOperandItem = this.props.leftOperandItem;
        leftOperandItem = tmp;
        switch(operationType) {
          case '<': operationType = '>='; break;
          case '>': operationType = '<='; break;
          case '<=': operationType = '>'; break;
          case '>=': operationType = '<'; break;
        }
      }
      if (rightOperandItem.type !== 'number') {
        throwError(`Operations.processPosition[${operationType}]`, `Expected a number to test position against, instead got ${rightOperandItem.type}.`);
      }
      const operationTest = {
        '=': () => leftOperandItem.value === rightOperandItem.value,
        '!=': () => leftOperandItem.value !== rightOperandItem.value,
        '>': () => leftOperandItem.value > rightOperandItem.value,
        '>=': () => leftOperandItem.value >= rightOperandItem.value,
        '<': () => leftOperandItem.value < rightOperandItem.value,
        '<=': () => leftOperandItem.value <= rightOperandItem.value
      }
      return operationTest[operationType]() || false;
    },
    isInvalid: (operand: tStack) => {
      return operand.type === TYPES.invalid;
    },
    areEqualNodes: () => {
      return this.tests.isNodes(this.props.leftOperandItem) &&
        this.tests.isNodes(this.props.rightOperandItem) &&
        this.props.leftOperandItem.value.length === this.props.rightOperandItem.value.length &&
        this.props.leftOperandItem.value.length === 1 && // only accept 1 node
        nodesOps.tests.isEqual(this.props.leftOperandItem.value[0], this.props.rightOperandItem.value[0]);
    }
  };

  private validate = {
    operandsExists: () => {
      if (!this.props.leftOperandItem) {
        throwError(this.props.context, `Left operand is invalid`);
      }
      if (!this.props.rightOperandItem) {
        throwError(this.props.context, `Right operand is invalid`);
      }
    },
    types: (types: string[], shouldThrow: boolean = false) => {
      let message;
      if (!types.includes(this.props.leftOperandItem.type)) {
        message = `Left operand is an invalid type. Was expecting ${types.join(' or ')} type but received ${this.props.leftOperandItem.type}`;
        shouldThrow && throwError(this.props.context, message);
      }
      if (!types.includes(this.props.rightOperandItem.type)) {
        message = `Right operand is an invalid type. Was expecting ${types.join(' or ')} type but received ${this.props.rightOperandItem.type}`;
        shouldThrow && throwError(this.props.context, message);
      }
      if (message) {
        return {
          type: TYPES.invalid,
          value: message
        };
      }
    },
    nodesLength: (expectedLength: number, symbol: string) => {
      if (this.tests.isNodes(this.props.leftOperandItem)) {
        opFunc.validate.numberOfNodeItems(this.props.leftOperandItem, expectedLength, symbol, this.props.context);
      }
      if (this.tests.isNodes(this.props.rightOperandItem)) {
        opFunc.validate.numberOfNodeItems(this.props.rightOperandItem, expectedLength, symbol, this.props.context);
      }
    }
  };

  private keep = {
    _numberNodes: (operand: tStack) => {
      if (this.tests.isNodes(operand)) {
        return {
          type: operand.type,
          value: operand.value.filter(li => li[KEYS.valueType] === 'number')
        }
      }
      return operand;
    },
    numberNodes: () => {
      this.props.leftOperandItem = this.keep._numberNodes(this.props.leftOperandItem);
      this.props.rightOperandItem = this.keep._numberNodes(this.props.rightOperandItem);
    },
    _numberOperatedValues: (operand: tStack) => {
      if (this.tests.isOperatedValues(operand)) {
        return {
          type: operand.type,
          value: operand.value.filter(li => !isNaN(li.value))
        };
      }
      return operand
    },
    numberOperatedValues: () => {
      this.props.leftOperandItem = this.keep._numberOperatedValues(this.props.leftOperandItem);
      this.props.rightOperandItem = this.keep._numberOperatedValues(this.props.rightOperandItem);
    },
    notFromRootNodes: (operandList) => {
      return operandList.operands.filter(op => {
        return !this.tests.startedFromRootNode(op);
      });
    }
  };

  private convert = {
    _toOperatedValues: (operand: tStack) => {
      if (this.tests.isNodes(operand)) {
        const leftStartedFromRoot = this.tests.startedFromRootNode(operand);
        return {
          type: 'operatedValues',
          value: operand.value.map(li => {
            return {
              operands: [{ startedFromRoot: leftStartedFromRoot, type: TYPES.nodes, value: li  }],
              value: li[KEYS.value],
              type: li[KEYS.valueType]
            }
          })
        }
      } else if (!this.tests.isOperatedValues(operand)) {
        return {
          type: 'operatedValues',
          value: [
            {
              operands: [{startedFromRoot: false, type: operand.type, value: operand.value}],
              value: operand.value,
              type: operand.type
            }
          ]
        }
      }
      return operand;
    },
    toOperatedValues: () => {
      this.props.leftOperandItem = this.convert._toOperatedValues(this.props.leftOperandItem);
      this.props.rightOperandItem =this.convert._toOperatedValues(this.props.rightOperandItem);
    }
  }

  private getContext(operator: string): string {
    return `Operations[${operator}]`;
  };

  private f: tOperations = {
    filterMode: {
      '+': () => {
        const invalidType = this.validate.types(['number', TYPES.nodes, 'operatedValues']);
        if (invalidType) {
          return invalidType;
        };

        this.keep.numberNodes();
        this.keep.numberOperatedValues();
        this.convert.toOperatedValues();
        const type = 'operatedValues';
  
        let operand1 = this.props.leftOperandItem;
        let operand2 = this.props.rightOperandItem;

        if (!operand1.value.length && operand2.value.length) {
          const tmp = operand1;
          operand1 = operand2;
          operand2 = tmp;
        }

        const value = operand1.value.reduce((r, lov) => {
          if (!operand2.value.length) {
            r.push({
              operands: [...lov.operands],
              value: lov.value,
              type: TYPES.number
            });
          }
          operand2.value.forEach(rov => {
            r.push({
              operands: [...lov.operands, ...rov.operands],
              value: lov.value + rov.value,
              type: TYPES.number
            });
          });
          return r;
        }, []);
        
        return {
          type: type,
          value: value
        };
      },
      '-': () => {
        const invalidType = this.validate.types(['number', TYPES.nodes, 'operatedValues']);
        if (invalidType) {
          return invalidType;
        };

        this.keep.numberNodes();
        this.keep.numberOperatedValues();
        this.convert.toOperatedValues();
        const type = 'operatedValues';

        let value;
        if (!this.props.leftOperandItem.value.length && this.props.rightOperandItem.value.length) {
          value = this.props.rightOperandItem.value.reduce((r, rov) => {
            r.push({
              operands: [...rov.operands],
              value: 0 - rov.value,
              type: TYPES.number
            });
            return r;
          }, []);
        } else if (this.props.leftOperandItem.value.length) {
          value = this.props.leftOperandItem.value.reduce((r, lov) => {
            if (!this.props.rightOperandItem.value.length) {
              r.push({
                operands: [...lov.operands],
                value: lov.value,
                type: TYPES.number
              });
            }
            this.props.rightOperandItem.value.forEach(rov => {
              r.push({
                operands: [...lov.operands, ...rov.operands],
                value: lov.value - rov.value,
                type: TYPES.number
              });
            });
            return r;
          }, []);
        }
        
        return {
          type: type,
          value: value
        };
      },
      '*': () => {
        const invalidType = this.validate.types(['number', TYPES.nodes, 'operatedValues']);
        if (invalidType) {
          return invalidType;
        };

        this.keep.numberNodes();
        this.keep.numberOperatedValues();
        this.convert.toOperatedValues();
        const type = 'operatedValues';
  
        let operand1 = this.props.leftOperandItem;
        let operand2 = this.props.rightOperandItem;

        if (!operand1.value.length && operand2.value.length) {
          const tmp = operand1;
          operand1 = operand2;
          operand2 = tmp;
        }

        const value = operand1.value.reduce((r, lov) => {
          if (!operand2.value.length) {
            r.push({
              operands: [...lov.operands],
              value: 0,
              type: TYPES.number
            });
          }
          operand2.value.forEach(rov => {
            r.push({
              operands: [...lov.operands, ...rov.operands],
              value: lov.value * rov.value,
              type: TYPES.number
            });
          });
          return r;
        }, []);
        
        return {
          type: type,
          value: value
        };
      },
      'div': () => {
        const invalidType = this.validate.types(['number', TYPES.nodes, 'operatedValues']);
        if (invalidType) {
          return invalidType;
        };

        this.keep.numberNodes();
        this.keep.numberOperatedValues();
        this.convert.toOperatedValues();
        let type = TYPES.operatedValues;
        let value;

        if (!this.props.leftOperandItem.value.length) {
          type = TYPES.invalid;
          value = 'Left operand is an invalid. It has no valid value';
        } else if (this.props.leftOperandItem.value.length) {
          value = this.props.leftOperandItem.value.reduce((r, lov) => {
            if (!this.props.rightOperandItem.value.length) {
              r.push({
                operands: [...lov.operands],
                value: 0,
                type: TYPES.number
              });
            }
            this.props.rightOperandItem.value.forEach(rov => {
              r.push({
                operands: [...lov.operands, ...rov.operands],
                value: lov.value / rov.value,
                type: TYPES.number
              });
            });
            return r;
          }, []);
        }
        
        return {
          type: type,
          value: value
        };
      },
      'mod': () => {
        const invalidType = this.validate.types(['number', TYPES.nodes, 'operatedValues']);
        if (invalidType) {
          return invalidType;
        };

        this.keep.numberNodes();
        this.keep.numberOperatedValues();
        this.convert.toOperatedValues();
        const type = 'operatedValues';

        let value;
        if (!this.props.leftOperandItem.value.length && this.props.rightOperandItem.value.length) {
          value = this.props.rightOperandItem.value.reduce((r, rov) => {
            r.push({
              operands: [...rov.operands],
              value: 0 % rov.value,
              type: TYPES.number
            });
            return r;
          }, []);
        } else if (this.props.leftOperandItem.value.length) {
          value = this.props.leftOperandItem.value.reduce((r, lov) => {
            if (!this.props.rightOperandItem.value.length) {
              r.push({
                operands: [...lov.operands],
                value: lov.value,
                type: TYPES.number
              });
            }
            this.props.rightOperandItem.value.forEach(rov => {
              r.push({
                operands: [...lov.operands, ...rov.operands],
                value: lov.value % rov.value,
                type: TYPES.number
              });
            });
            return r;
          }, []);
        }
        
        return {
          type: type,
          value: value
        };
      },
      '=': (): tStack => {
        if (this.tests.isInvalid(this.props.leftOperandItem)) {
          return this.props.leftOperandItem;
        };

        if (this.tests.isInvalid(this.props.rightOperandItem)) {
          return this.props.rightOperandItem;
        }
        
        // TODO type = variable and
        let type = TYPES.boolean;
        let value = false;
        
        if (this.tests.isPositionType(this.props.leftOperandItem) || this.tests.isPositionType(this.props.rightOperandItem)) {
          value = this.tests.position('=');
        } else if (this.tests.areEqualNodes()) { 
          value = true;
        } else {
          this.convert.toOperatedValues();
          value = this.props.leftOperandItem.value.some(lo => {
            return this.props.rightOperandItem.value.some(ro => {
              return lo.type === ro.type && lo.value === ro.value
            });
          });
        }
        
        return {
          type: type,
          value: value
        }
      },
      '>': () => {
        if (this.tests.isInvalid(this.props.leftOperandItem)) {
          return this.props.leftOperandItem;
        };

        if (this.tests.isInvalid(this.props.rightOperandItem)) {
          return this.props.rightOperandItem;
        }
        
        let type = TYPES.boolean;
        let value = false;
        
        this.keep.numberNodes();

        if (this.tests.isPositionType(this.props.leftOperandItem) || this.tests.isPositionType(this.props.rightOperandItem)) {
          value = this.tests.position('>');
        } else {
          this.convert.toOperatedValues();
          this.keep.numberOperatedValues();

          value = this.props.leftOperandItem.value.some(lo => {
            return this.props.rightOperandItem.value.some(ro => {
              return lo.type === ro.type && lo.value > ro.value;
            });
          });
        }
        
        return {
          type: type,
          value: value
        };
      },
      '<': () => {
        if (this.tests.isInvalid(this.props.leftOperandItem)) {
          return this.props.leftOperandItem;
        };

        if (this.tests.isInvalid(this.props.rightOperandItem)) {
          return this.props.rightOperandItem;
        }
        
        let type = TYPES.boolean;
        let value = false;
        
        this.keep.numberNodes();

        if (this.tests.isPositionType(this.props.leftOperandItem) || this.tests.isPositionType(this.props.rightOperandItem)) {
          value = this.tests.position('>');
        } else {
          this.convert.toOperatedValues();
          this.keep.numberOperatedValues();

          value = this.props.leftOperandItem.value.some(lo => {
            return this.props.rightOperandItem.value.some(ro => {
              return lo.type === ro.type && lo.value < ro.value;
            });
          });
        }
        
        return {
          type: type,
          value: value
        };
      },
      '>=': () => {
        if (this.tests.isInvalid(this.props.leftOperandItem)) {
          return this.props.leftOperandItem;
        };

        if (this.tests.isInvalid(this.props.rightOperandItem)) {
          return this.props.rightOperandItem;
        }
        
        let type = TYPES.boolean;
        let value = false;
        
        this.keep.numberNodes();

        if (this.tests.isPositionType(this.props.leftOperandItem) || this.tests.isPositionType(this.props.rightOperandItem)) {
          value = this.tests.position('>');
        } else {
          this.convert.toOperatedValues();
          this.keep.numberOperatedValues();

          value = this.props.leftOperandItem.value.some(lo => {
            return this.props.rightOperandItem.value.some(ro => {
              return lo.type === ro.type && lo.value >= ro.value;
            });
          });
        }
        
        return {
          type: type,
          value: value
        };
      },
      '<=': () => {
        if (this.tests.isInvalid(this.props.leftOperandItem)) {
          return this.props.leftOperandItem;
        };

        if (this.tests.isInvalid(this.props.rightOperandItem)) {
          return this.props.rightOperandItem;
        }
        
        let type = TYPES.boolean;
        let value = false;
        
        this.keep.numberNodes();

        if (this.tests.isPositionType(this.props.leftOperandItem) || this.tests.isPositionType(this.props.rightOperandItem)) {
          value = this.tests.position('>');
        } else {
          this.convert.toOperatedValues();
          this.keep.numberOperatedValues();

          value = this.props.leftOperandItem.value.some(lo => {
            return this.props.rightOperandItem.value.some(ro => {
              return lo.type === ro.type && lo.value <= ro.value;
            });
          });
        }
        
        return {
          type: type,
          value: value
        };
      },
      'and': () => {
        if (this.tests.isInvalid(this.props.leftOperandItem)) {
          return this.props.leftOperandItem;
        };

        if (this.tests.isInvalid(this.props.rightOperandItem)) {
          return this.props.rightOperandItem;
        }
        
        const lbool = Array.isArray(this.props.leftOperandItem.value) ? !!this.props.leftOperandItem.value.length : !!this.props.leftOperandItem.value;
        const rbool = Array.isArray(this.props.rightOperandItem.value) ? !!this.props.rightOperandItem.value.length : !!this.props.rightOperandItem.value;
        
        return {
          type: TYPES.boolean,
          value: lbool && rbool
        }
      },
      'or': () => {
        if (this.tests.isInvalid(this.props.leftOperandItem)) {
          return this.props.leftOperandItem;
        };

        if (this.tests.isInvalid(this.props.rightOperandItem)) {
          return this.props.rightOperandItem;
        }

        const lbool = Array.isArray(this.props.leftOperandItem.value) ? !!this.props.leftOperandItem.value.length : !!this.props.leftOperandItem.value;
        const rbool = Array.isArray(this.props.rightOperandItem.value) ? !!this.props.rightOperandItem.value.length : !!this.props.rightOperandItem.value;
        
        return {
          type: TYPES.boolean,
          value: lbool || rbool
        }
      },
      '|': () => {
        if (this.tests.isInvalid(this.props.leftOperandItem)) {
          return this.props.leftOperandItem;
        };

        if (this.tests.isInvalid(this.props.rightOperandItem)) {
          return this.props.rightOperandItem;
        }

        const invalidType = this.validate.types([ TYPES.nodes ]);
        if (invalidType) {
          return invalidType;
        }

        return {
          type: TYPES.nodes,
          value: [...this.props.leftOperandItem.value, ...this.props.rightOperandItem.value.filter(rv => {
            return !this.props.leftOperandItem.value.some(lv => lv[KEYS.id] === rv[KEYS.id]);
          })]
        };
      }
    },
    default: {
      '+': () => {
        const leftValue = opFunc.getValueByType(this.getContext('+'), [TYPES.number], this.props.leftOperandItem);
        const rightValue = opFunc.getValueByType(this.getContext('+'), [TYPES.number], this.props.rightOperandItem);
        return {
          type: TYPES.number,
          value: leftValue + rightValue
        }
      },
      '-': () => {
        const leftValue = opFunc.getValueByType(this.getContext('-'), [TYPES.number], this.props.leftOperandItem);
        const rightValue = opFunc.getValueByType(this.getContext('-'), [TYPES.number], this.props.rightOperandItem);        
        return {
          type: TYPES.number,
          value: leftValue - rightValue
        }
      },
      '*': () => {
        const leftValue = opFunc.getValueByType(this.getContext('*'), [TYPES.number], this.props.leftOperandItem);
        const rightValue = opFunc.getValueByType(this.getContext('*'), [TYPES.number], this.props.rightOperandItem);
        return {
          type: TYPES.number,
          value: leftValue * rightValue
        }
      },
      'div': () => {
        const leftValue = opFunc.getValueByType(this.getContext('div'), [TYPES.number], this.props.leftOperandItem);
        const rightValue = opFunc.getValueByType(this.getContext('div'), [TYPES.number], this.props.rightOperandItem);
        return {
          type: TYPES.number,
          value: leftValue / rightValue
        }
      },
      'mod': () => {
        const leftValue = opFunc.getValueByType(this.getContext('mod'), [TYPES.number], this.props.leftOperandItem);
        const rightValue = opFunc.getValueByType(this.getContext('mod'), [TYPES.number], this.props.rightOperandItem);
        return {
          type: TYPES.number,
          value: leftValue % rightValue
        }
      },
      '=': (): tStack => {
        return this.f.filterMode['=']();
      },
      '>': () => {
        return this.f.filterMode['>']();
      },
      '<': () => {
        return this.f.filterMode['<']();
      },
      '>=': () => {
        return this.f.filterMode['>=']();
      },
      '<=': () => {
        return this.f.filterMode['<=']();
      },
      'and': () => {
        return this.f.filterMode['and']();
      },
      'or': () => {
        return this.f.filterMode['or']();
      },
      '|': () => {
        return this.f.filterMode['|']();
      }
    }
  };

  constructor() {}

  public run(opName, leftOperandItem: tStack, rightOperandItem: tStack, {isFilterMode}: tFilterModeOptions) {
    this.props.set({ leftOperandItem, rightOperandItem, context: opName });
    const mode = isFilterMode ? 'filterMode': 'default';

    if (!this.f[mode]) {
      throwError(this.getContext('run'), `No operation "${opName}" exists.`);
    }
    return this.f[mode][opName]();
  }
}