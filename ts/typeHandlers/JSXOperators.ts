import { JSXPathHandler } from "../JSXPathHandler";
import { ImpInstruction, ImpAction, Instruction, State, SubInstruction } from "../JSXInterfaces";
import {operators} from '../enums/operators';
import { JSXAction } from "../JSXAction";
import { precendence } from '../enums/precedence';
import { tokens } from '../tokens/operator.tokens';
import { JSXRegistrar } from "../JSXRegistrar";
import { JSXGroupings } from "./JSXGroupings";
  import { 
    OPERATORS, 
    OPERATOR_START, 
    OPERATOR_END, 
    PATH_HANDLER, 
    ACTION_HANDLER, 
    PARSED_PATH, 
    DISPATCH, 
    OPERATOR_LHS, 
    OPERATOR_RHS, 
    AXES,
    NODES,
    ROOT,
    GROUPINGS,
    PATH_LENGTH
  } from "../constants";


export class JSXOperators implements ImpInstruction, ImpAction{
  static OPERATORS: Array<string>;
  static SORTED_OPERATORS_BY_LENGTH: object = {}; // dynamically created {1: [], 2: [], ...}
  private pathHandler: JSXPathHandler;
  private precendence;
  private actionHandler: JSXAction;
  private parsedPath: string;
  private dispatch: Function;
  private groupHandler: JSXGroupings;

  constructor(private reg:JSXRegistrar) {}

  
  init() {
    // populate sortedOperatorByLength
    JSXOperators.OPERATORS = Object.values(operators);
    JSXOperators.OPERATORS.forEach(operator => {
      if (!JSXOperators.SORTED_OPERATORS_BY_LENGTH[operator.length]) {
        JSXOperators.SORTED_OPERATORS_BY_LENGTH[operator.length] = [];
      }
      JSXOperators.SORTED_OPERATORS_BY_LENGTH[operator.length].push(operator);
    });
    [this.pathHandler, this.actionHandler, this.groupHandler, this.parsedPath, this.dispatch] = this.reg.get([PATH_HANDLER, ACTION_HANDLER, GROUPINGS, PARSED_PATH, DISPATCH]);
    this.precendence = precendence;
  }
  
  private createLink(instruction): {relatedId:number, relatedType:string} {
    return {
      relatedId: instruction.id,
      relatedType: instruction.type
    }
  }
  
  private getOperatorProperties(currentIndex:number): SubInstruction {
    const [pathLength] = this.reg.get([PATH_LENGTH]);
    let subString: string;
    let endIndex = -1;
    if (currentIndex+3 < pathLength && JSXOperators.SORTED_OPERATORS_BY_LENGTH[3].includes(this.parsedPath.substring(currentIndex, currentIndex+3))) {
      endIndex = currentIndex + 3;
    } else if (currentIndex+2 < pathLength && JSXOperators.SORTED_OPERATORS_BY_LENGTH[2].includes(this.parsedPath.substring(currentIndex, currentIndex+2))) {
      endIndex = currentIndex + 2;
    } else {
      endIndex = currentIndex + 1;
    }

    subString = this.parsedPath.substring(currentIndex, endIndex);

    return {
      value: subString,
      endIndex: endIndex
    }
  }

  sortInstructions(instructions: Array<Instruction>) {
    let sortedInstructions:Array<Instruction>;
    let list1: Array<Instruction> = instructions;
    let list2: Array<Instruction> = [];
    this.precendence[OPERATORS].forEach(precendenceList => {
      while(list1.length) {
        const currentInstruction = list1.shift();
        if (currentInstruction.type === OPERATORS && precendenceList.includes(currentInstruction.subPath)) {
          currentInstruction.lhs = this.getOperandInstructions(list2, currentInstruction, true); //list2.pop();
          currentInstruction.rhs = this.getOperandInstructions(list1, currentInstruction, false);
        } 
        list2.push(currentInstruction);
      }
      list1 = list2;
      list2 = [];
    });

    sortedInstructions = list1;
    return sortedInstructions;
  }

  private getOperandInstructions(list, opInstruction, isLHS,):Instruction {
    const next = isLHS ? list.pop.bind(list) : list.shift.bind(list);
    let operands = [].concat(next());
    while(list.length && [AXES, NODES, ROOT].includes(list[isLHS ? list.length-1: 0].type)) {
      operands = isLHS ? [next()].concat(operands) : operands.concat(next());
    }

    if (operands.length > 1) {
      return this.groupHandler.createInstruction(
        operands.map((op) => op.subPath).join(''), 
        operands[0].startIndex, 
        operands[operands.length-1].endIndex, 
        [this.groupHandler.createLeftGroupingInstruction('(', operands[0].startIndex)]
          .concat(operands)
          .concat(this.groupHandler.createRightGroupingInstruction(')', operands[operands.length-1].endIndex)),
        this.createLink(opInstruction)
      );
    }

    operands[0].link = this.createLink(opInstruction);
    return operands[0];
  }

  getInstruction(subPath: string, startIndex: number): Instruction {
    // const operatorType = this.getOperatorType(startIndex);
    const operatorProperties: SubInstruction = this.getOperatorProperties(startIndex);
    this.pathHandler.updateCurrentIndex(operatorProperties.endIndex-1);
    
    return {
      type: OPERATORS,
      subPath: operatorProperties.value,
      startIndex,
      endIndex: operatorProperties.endIndex,
      link: {}
    }
  }


  getAction(instruction:Instruction, state:State, processInstruction: Function) {
    // opening action
    this.dispatch(this.actionHandler.create(OPERATOR_START, {id: instruction.id, token: instruction.subPath, subType: instruction.subType, link:instruction.link}));

    // process LHS first
    if (instruction.lhs) {
      instruction.lhs.subType = OPERATOR_LHS;
      processInstruction(instruction.lhs);
    }

    // then process RHS
    if (instruction.rhs) {
      instruction.rhs.subType = OPERATOR_RHS;
      processInstruction(instruction.rhs);
    }

    // closing action
    return this.actionHandler.create(OPERATOR_END, {id: instruction.id});
  }

  run(params: {lhs: any, rhs: any, operation: string, isFilter:boolean}) {
    const { operation, lhs, rhs, isFilter } = params;
    // TODO: checks that all params exists
    return tokens[operation](lhs, rhs, isFilter);
  }
}
