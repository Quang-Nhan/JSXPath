import { PostfixStack } from "./Stack";
import { OPERATOR_PRECEDENCE, OPERATORS, FILTERS, GROUPINGS, AXES } from '../consts';
import { Functions } from "../evaluate/Functions";
import { tStack } from "../types";

const operators = OPERATORS.values;
const filters = FILTERS;
const groupings = GROUPINGS;

/**
 * Class to path to post fix notation result in a stack of 
 * 
 */
export class Postfix {
  private props = {
    trimmedInput: null,
    pathIndex: null
  };
  private callerId: string;
  private stacks: PostfixStack;
  private stringQuote: string;
  private functionNames: string[];

  constructor(callerId: string, functions: Functions) {
    this.stacks = new PostfixStack();
    this.callerId = callerId;
    this.stringQuote = '';
    this.functionNames = functions.getFunctionNames();
  };

  private isHigherPrecedent(op1: string, op2: string): boolean {
    const op1Index = this.getPrecedentIndex(op1);
    const op2Index = this.getPrecedentIndex(op2);
    return op1Index < op2Index || false;
  };
  
  private getPrecedentIndex(op: string): number {
    let index = 100;
    for (let i = 0; i < OPERATOR_PRECEDENCE.length; i++) {
      if (OPERATOR_PRECEDENCE[i].includes(op)) {
        index = i;
        break;
      }
    }
    return index;
  };

  private getNextNonSpaceCharacterAndUpdateIndex() {
    let value = '';
    for (this.props.pathIndex++; this.props.pathIndex < this.props.trimmedInput.length; this.props.pathIndex++) {
      if (this.props.trimmedInput[this.props.pathIndex] !== ' ') {
        value = this.props.trimmedInput[this.props.pathIndex];
        break;
      }
    }
    return value;
  };

  private getPreviousNonSpaceCharacter() {
    let value = '';
    for (let i = this.props.pathIndex-1; i >= 0; --i) {
      if (this.props.trimmedInput[i] !== ' ') {
        value = this.props.trimmedInput[i];
        break;
      }
    }
    return value;
  }

  private throwError(msg: string) {
    throw new Error(msg);
  };

  private setType(value: any, type?: tStack["type"]): tStack {
    if (type) {
      return {type, callerId: this.callerId, value};
    }
    if (operators.includes(value)) {
      return {type: 'operator', value};
    }
    if (value[0] === '$' && value.includes('/')) {
      return { type: 'variablePath', callerId: this.callerId, value};
    }
    if (value[0] === '$') {
      return { type: 'variable', value};
    }
    if (this.stringQuote.length && value[value.length-1] === this.stringQuote) {
      this.stringQuote = '';
      return {type: 'string', value: value.substring(1, value.length-1)};
    }
    if (!Number.isNaN(Number(value))) {
      return {type: 'number', value: Number(value)};
    }
    if (['true', 'false'].includes(value)) {
      return {type: 'boolean', value: value === 'true'}
    }
    if ('null' === value) {
      return {type: 'null', value: null};
    }
    if ('undefined' === value) {
      return {type: 'undefined', value: undefined}
    }
    
    if (this.tests.isRootPathCheck(value) || this.tests.isDescendantFromRoot(value)) {
      return {type: 'rootPath', callerId: this.callerId, value};
    }
  
    return {type: 'path', callerId: this.callerId, value: value}
  };

  private tests = {
    isWhiteSpace: (chars: string) => chars === ' ' && !this.tests.isWithinStringQuote(),
    isQuote: (chars: string) => chars === '"' || chars === `'`,
    isComma: (chars: string) =>  chars === ',',//  -2
    isNegativeNumber: (chars: string) => chars === '-' && 
      !isNaN(Number(this.props.trimmedInput[this.props.pathIndex+1])) && 
      (this.props.pathIndex === 0 || operators.includes(this.getPreviousNonSpaceCharacter()) || ['(', '['].includes(this.getPreviousNonSpaceCharacter())),
    isPartialOperationCharacter: (chars: string) => operators.includes(chars + this.props.trimmedInput[this.props.pathIndex+1]),
    isLeftFilter: (chars: string) => filters.LEFT_FILTER === chars,
    isRightFilter: (chars: string) => filters.RIGHT_FILTER === chars,
    isFilter: (chars: string) => this.tests.isLeftFilter(chars) || this.tests.isRightFilter(chars),
    isLeftGrouping: (chars: string) => groupings.LEFT_GROUPING === chars,
    isRightGrouping: (chars: string) => groupings.RIGHT_GROUPING === chars,
    isGrouping: (chars: string) => this.tests.isLeftGrouping(chars) || this.tests.isRightGrouping(chars),
    isPosition: (chars: string) => chars === 'position(',
    isFunctionName: (chars: string) => chars.length > 1 && 
      this.functionNames.includes(chars.substring(0, chars.length-1)) && 
      chars[chars.length-1] === '(',
    isOperator: (chars: string) => !this.tests.isWithinStringQuote() && operators.includes(chars) && (
      this.props.trimmedInput[this.props.pathIndex+1] === ' ' ||
      !operators.includes(chars + this.props.trimmedInput[this.props.pathIndex+1])
    ),
    isLastCharacter: () => this.props.pathIndex === this.props.trimmedInput.length-1,
    isPartialFunctionName: (chars) => chars.length && this.functionNames.some(f => f.startsWith(chars)),
    isStringValue: (chars) => chars.length > 1 && (chars[0] === '"' && chars[chars.length-1] === '"' || chars[0] === `'` && chars[chars.length-1] === `'`),
    isRootPathCheck: (chars) => chars[0] === '/' && chars[1] !== '/' && (
      chars.length-1 === this.props.pathIndex || 
      // previous character before the start of chars input
      ([' ', '[', '(', ...OPERATORS.byLength['1']].includes(this.props.trimmedInput[this.props.pathIndex-chars.length]))
    ),
    isDescendantFromRoot: (chars) => chars[0] === '/' && chars[1] === '/' && !this.tests.isWithinFilter() && (
      chars.length-1 === this.props.pathIndex || 
      // previous character before the start of chars input
      ([' ', ...OPERATORS.byLength['1']].includes(this.props.trimmedInput[this.props.pathIndex-chars.length])) ||
      // is an argument of a function
      Object.keys(this.stacks.arguments).length
    ),
    isWithinFilter: () => {
      const prePath = this.props.trimmedInput.substring(0, this.props.pathIndex);
      const lastRightFilterIndex = prePath.lastIndexOf(']');
      const lastLeftFilterIndex = prePath.lastIndexOf('[');
      
      return lastLeftFilterIndex > lastRightFilterIndex;
    },
    isWithinStringQuote: () => this.stringQuote.length
  };
  
  private postProcessFilterPaths(filterStack) {
    // add current axes to path
    filterStack.forEach((item, i) => {
      if (item.type === 'path' && item.value[0] !== '.' && !Array.isArray(filterStack[i-1]) &&
        !Object.keys(AXES).some((axes) => item.value.substring(0, axes.length) === axes)
      ) {
        item.value = './' + item.value;
      } else if (item.type === 'arguments') {
        this.postProcessFilterPaths(item.value);
      } else if (Array.isArray(item)) {
        this.postProcessFilterPaths(item);
      }
    });
  };

  private reset() {
    this.stacks.reset();
    this.stringQuote = '';
    this.props = {
      trimmedInput: null,
      pathIndex: null
    };
  }

  public toPostfix(inputPath: string) {
    if (typeof inputPath !== 'string') {
      this.throwError('invalid type');
    }
    if (!inputPath.length) {
      this.throwError('path is empty');
    }
  
    this.props.trimmedInput = inputPath.trim();
    let subPath = '';
    
    for (this.props.pathIndex = 0; this.props.pathIndex < this.props.trimmedInput.length; this.props.pathIndex++) {
      if (this.tests.isWhiteSpace(this.props.trimmedInput[this.props.pathIndex])) {
        if (!this.stacks.output.length && operators.includes(subPath)) {
          this.throwError('Expected an operand at the beginning of path expression');
        }
        if (subPath.length) {
          this.stacks.output.push(this.setType(subPath));
          subPath = '';
        }
      } else {
        subPath += this.props.trimmedInput[this.props.pathIndex];
        if (operators.includes(subPath) && this.props.pathIndex === this.props.trimmedInput.length-1) {
          this.throwError('Expected an operand at the end of path expression');
        }
        
        if (this.tests.isQuote(subPath)) {
          this.stringQuote = subPath;
        }

        if (this.tests.isComma(subPath)) {
          let done = false;
          // cover scenario there is an operator path
          // as part of an argument
          let operator;
          do {
            operator = this.stacks.operators[this.stacks.operators.length-1];
            if (!this.stacks.parentOutput[operator]) {
              this.stacks.output.push(
                this.setType(this.stacks.operators.pop(), 'operator')
              );
            } else {
              done = true;
            }
          } while(!done);

          this.stacks.cache.argument(operator);
          subPath = '';
        } else if (this.tests.isNegativeNumber(subPath) || this.tests.isPartialOperationCharacter(subPath)) { // a -12, a +-12, a-12
          // cover negative number scenario and
          // scenarios where the current subPath and 
          // next character produces an operator subPath
  
          // do nothing, just check next characters
        } else if (this.tests.isLeftFilter(subPath)) {
          this.stacks.cache.output(subPath);
          subPath = '';
        } else if (this.tests.isRightFilter(subPath)) {
          let valid = false;
          do {
            let operator = this.stacks.operators.pop();
            if (operator[0] !== '[') {
              this.stacks.output.push(this.setType(operator, 'operator'))
            } else if (this.stacks.parentOutput[operator]) {
              this.postProcessFilterPaths(this.stacks.output);
              this.stacks.cache.restore(operator);
              valid = true;
            }
          } while(valid === false && this.stacks.operators.length);
          subPath = '';
        } else if (this.tests.isLeftGrouping(subPath)) {
          this.stacks.cache.output(subPath);
          subPath = '';
        } else if (this.tests.isRightGrouping(subPath)) { // could be grouping or closing function tag
          const errorMsg =`UneExpected right parenthesis at index ${this.props.pathIndex}`;
          if (!this.stacks.operators.length) {
            this.throwError(errorMsg);
          }
          let valid = false;
          
          do {
            let operator = this.stacks.operators.pop();
            if (operator[0] === groupings.LEFT_GROUPING) {
              this.stacks.cache.merge(operator);
              valid = true;
            } else if (operator.includes(groupings.LEFT_GROUPING)) {
              this.stacks.cache.argument(operator);
              this.stacks.cache.restore(operator, 'arguments');
              this.stacks.output.push(this.setType(operator.substring(0, operator.indexOf('(')), 'function'));
              valid = true;
            } else {
              this.stacks.output.push(this.setType(operator, 'operator'));
            }
          } while(valid === false && this.stacks.operators.length);
          
          if (!valid) {
            this.throwError(errorMsg);
          }
          subPath = '';
        } else if (this.tests.isPosition(subPath)) {
          const nextNonSpaceChar = this.getNextNonSpaceCharacterAndUpdateIndex();
          if (nextNonSpaceChar !== ')') {
            this.throwError(`${subPath.substring(0, subPath.length-1)} should not contain any arguments`);
          }
          this.stacks.output.push({
            type: 'position',
            value: subPath+')'
          });
          subPath = '';
        } else if (this.tests.isFunctionName(subPath)) { // function
          // TODO throw error if function name does not exists
          this.stacks.cache.output(subPath);
          subPath = '';
        } else if (
          subPath.length && !this.tests.isWithinStringQuote() && operators.includes(this.props.trimmedInput[this.props.pathIndex+1]) && 
          subPath !== '-' &&
          !['ancestor', 'ancestor-or', 'descendant', 'descendant-or', 'following', 'preceding'].some((str) => subPath.substring(subPath.length-str.length) === str) &&
          !AXES.some((axes) => subPath.substring(subPath.length-axes.length) === axes) &&
          !this.tests.isPartialFunctionName(subPath+this.props.trimmedInput[this.props.pathIndex+1])
        ) {
          // scenario where there's no spaces 
          // between operand and operator eg "a+ b"
          this.stacks.output.push(this.setType(subPath));
          subPath = '';
        } else if (this.tests.isOperator(subPath)) {
          if (this.stacks.operators.length) {
            if (this.isHigherPrecedent(this.stacks.operators[this.stacks.operators.length - 1], subPath)) {
              this.stacks.output.push(this.setType(this.stacks.operators.pop(), 'operator'));
            }
          }
          this.stacks.operators.push(subPath);
          subPath = '';
        } else if (this.tests.isStringValue(subPath)) {
          this.stacks.output.push(this.setType(subPath));
          subPath = '';
        
        } else if (subPath.length && (
          !this.tests.isFunctionName(subPath+this.props.trimmedInput[this.props.pathIndex+1]) && 
          !this.tests.isPosition(subPath+this.props.trimmedInput[this.props.pathIndex+1]) &&
          !this.tests.isStringValue(subPath +this.props.trimmedInput[this.props.pathIndex+1]) &&
          this.tests.isGrouping(this.props.trimmedInput[this.props.pathIndex+1]) || 
          this.tests.isFilter(this.props.trimmedInput[this.props.pathIndex+1])  ||
          this.tests.isWhiteSpace(this.props.trimmedInput[this.props.pathIndex+1]) ||
          this.tests.isComma(this.props.trimmedInput[this.props.pathIndex+1])
        )) {
          this.stacks.output.push(this.setType(subPath));
          subPath = '';
        }
        
        if (this.tests.isLastCharacter()) {
          if (subPath.length) {
            this.stacks.output.push(this.setType(subPath));
          }
          while(this.stacks.operators.length) {
            this.stacks.output.push(this.setType(this.stacks.operators.pop(), 'operator'));
          }
        }
      }
    }
    const result = this.stacks.output as Array<tStack|tStack[]>;
    this.reset();
    return result;
  };
};
