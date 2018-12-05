import { FUNCTION_ENUMS } from '../enums/functions';
import { JSXPathHandler } from '../pathParser/JSXPathHandler';
import { Instruction, ImpInstruction, ImpAction, Action, CacheHelpers, State, ActionParams } from '../JSXInterfaces';
import { FUNCTIONS, PATH_HANDLER, ACTION_HANDLER, LEFT_GROUPING, RIGHT_GROUPING, PARSED_PATH, EOF, HELPERS, FUNCTION_START, FUNCTION_ARGUMENT, FUNCTION_END, ARG_START, GENERATE_ID, ARG_END, OPERATORS, STRINGS } from '../constants';
import { JSXAction } from '../JSXAction';
import { JSXRegistrar } from '../JSXRegistrar';
import { findMatchingCharacterIndex } from './helper';
import { groupings } from '../enums/groupings';
import { tokens } from '../tokens/function.tokens';

export class JSXFunctions implements ImpInstruction, ImpAction{
  static JSX_FUNCTIONS: string[];
  static FUNCTIONS: string[];

  private pathHandler: JSXPathHandler;
  private actionHandler: JSXAction;
  private parsedPath: string;
  private helper: CacheHelpers;

  constructor(private reg:JSXRegistrar) {}

  init() {
    if (!JSXFunctions.JSX_FUNCTIONS) {
      JSXFunctions.JSX_FUNCTIONS = Object.values(FUNCTION_ENUMS);
    }
    if (!JSXFunctions.FUNCTIONS) {
      JSXFunctions.FUNCTIONS = Object.keys(FUNCTION_ENUMS);
    }
    [
      this.pathHandler, 
      this.actionHandler,
      this.helper
    ] = this.reg.get([
      PATH_HANDLER, 
      ACTION_HANDLER,
      HELPERS
    ]);
  }

  getMap(): object {
    return FUNCTION_ENUMS;
  }

  sortInstructions(instructions:Instruction[], inputId:number): Instruction[] {
    if (instructions.findIndex(this.isPositionInstruction) === -1) {
      return [].concat(instructions);
    }
    const sortedInstructions: Instruction[] = [];
    
    let skipInstructionCheck:number = 0;
    instructions.forEach((instruction, i) => {
      if (skipInstructionCheck > 0) {
        --skipInstructionCheck;
      } else {
        if (!this.isPositionInstruction) {
        } else if (instructions[i-1] && this.isOperatorInstruction(instructions[i-1])) {
          const convertedOperator:Instruction[] = [Object.assign({}, sortedInstructions.pop(), {
            type: STRINGS
          })];
          instruction.args = instruction.args.concat([convertedOperator]);
          instruction.args = instruction.args.concat([[sortedInstructions.pop()]]);
          instruction.args = instruction.args.concat([[<Instruction>{
            type: STRINGS,
            subPath: 'lhs',
            startIndex: -1,
            endIndex: -1
          }]]);
        } else if (instructions[i+1] && this.isOperatorInstruction(instructions[i+1])) {
          skipInstructionCheck = 2;
          const convertedOperator:Instruction[] = [Object.assign({}, instructions[i+1], {
            type: STRINGS
          })];
          instruction.args = instruction.args.concat([convertedOperator]);
          instruction.args = instruction.args.concat([[instructions[i+2]]]);
          instruction.args = instruction.args.concat([[<Instruction>{
            type: STRINGS,
            subPath: 'rhs',
            startIndex: -1,
            endIndex: -1
          }]]);
        }
        sortedInstructions.push(instruction);
      }
    });

    return sortedInstructions;
  }

  private isPositionInstruction(instruction:Instruction) {
    return instruction.type === FUNCTIONS && instruction.subPath === '#position('
  }

  private isOperatorInstruction(instruction:Instruction) {
    return instruction.type === OPERATORS;
  }

  private getFunctionProperties(currentIndex) {
    const closingIndex = findMatchingCharacterIndex(
      groupings[LEFT_GROUPING], 
      groupings[RIGHT_GROUPING], 
      currentIndex, 
      this.parsedPath
    );
    return {
      value: this.parsedPath.substring(currentIndex+1, closingIndex-1),
      endIndex: closingIndex-1
    };
  }

  /**
   * Extracts the arguments separated by commas of a path
   * @param subPath {string} the path to extract arguments from
   * @return {string[]}
   */
  private getArguments(subPath:string) {
    const args = [];
    const counts = {
      parentheses: 0,
      braces: 0,
      squareBrackets: 0
    };
    const bracketMap = {
      '{': () => ++counts.braces,
      '}': () => --counts.braces,
      '[': () => ++counts.squareBrackets,
      ']': () => --counts.squareBrackets,
      '(': () => ++counts.parentheses,
      ')': () => --counts.parentheses
    };

    if (!subPath || subPath === '') {
      return args;
    }
    
    let lastArgumentPosition = 0;

    for (let i = 0; i < subPath.length; ++i) {
      if(Object.keys(bracketMap).includes(subPath[i])) {
        bracketMap[subPath[i]]();
      }
      if (subPath[i] === ',' && counts.parentheses === 0 && counts.braces === 0 && counts.squareBrackets === 0) {
        args.push(subPath.substring(lastArgumentPosition, i).trim());
        lastArgumentPosition = i+1;
      }
    }

    args.push(subPath.substring(lastArgumentPosition, subPath.length).trim());
    return args;
  }

  getInstruction(subPath: string, startIndex: number, inputId:number): Instruction {
    this.parsedPath = this.reg.get([inputId + ':' + PARSED_PATH])[0];
    const currentIndex = this.pathHandler.getCurrentIndex(inputId)
    const functionProperties = this.getFunctionProperties(currentIndex);
    let args = this.getArguments(this.parsedPath.substring(currentIndex+1, functionProperties.endIndex));
    
    args = args.map((arg) => this.pathHandler.getInstructionSet({path: arg})
      .filter(instruction => instruction.type !== EOF));
    this.pathHandler.updateCurrentIndex(functionProperties.endIndex, inputId);
    return {
      type: FUNCTIONS,
      subPath,
      startIndex,
      endIndex: functionProperties.endIndex,
      args,
      link: {}
    }
  }

  getAction(params:ActionParams): Action {
    const {instruction, processInstruction, isFilterContext} = params;
    const { id, subType, subPath, link, args } = instruction;

    this.helper.dispatch(this.actionHandler.create(FUNCTION_START, {
      id,
      subType,
      link,
      token: subPath.replace(/\#|\(/g, '')
    }));

    args.forEach(subs => {
      const link = this.helper.createLink(instruction);
      const id = this.helper.generateId();
      this.helper.dispatch(this.actionHandler.create(ARG_START, {
        id,
        link
      }));
      subs.forEach(sub => {
        sub.link = {
          relatedId: id,
          relatedType: FUNCTION_ARGUMENT
        };
        processInstruction(isFilterContext)(sub);
      });
      this.helper.dispatch(this.actionHandler.create(ARG_END, {
        id,
        link
      }));
    });

    return this.actionHandler.create(FUNCTION_END, {
      id,
      link
    });
  }

  getDefaultAction(params:ActionParams): Action {
    return null;
  }

  getFilteredContextAction(params:ActionParams): Action {
    return null;
  }

  run(context) {
    return (params: {args:[], method:string}) => {
      const { args, method } = params;
      return tokens[method](context).apply(this, args);
    }
  } 
}
