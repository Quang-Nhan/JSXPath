import { Instruction } from './JSXInterfaces';
import { JSXTypeMapper } from './typeHandlers/JSXTypeMapper';
import {
  EOF,
  ERROR,
  RIGHT_FILTER,
  RIGHT_GROUPING,
  OPERATORS,
  TYPE_MAPPER,
  PARSED_PATH,
  GENERATE_ID,
  AXES,
  DISPATCH,
  INCREMENT_CURRENT_INDEX,
  PATH_LENGTH,
  CURRENT_INDEX,
  UPDATE_CURRENT_INDEX,
  ACTION_HANDLER
} from './constants';
import { JSXRegistrar } from './JSXRegistrar';
import { JSXErrors } from './typeHandlers/JSXErrors';
import { JSXAction } from './JSXAction';


export class JSXPathHandler {
  private typeMapper: JSXTypeMapper;
  private generateId: Function;
  private errorHandler: JSXErrors;
  private dispatch: Function;
  private actionHandler: JSXAction;
  
  public parsedPath: string;

  constructor(private reg:JSXRegistrar) {}

  init() {
    [
      this.typeMapper, 
      this.parsedPath, 
      this.generateId, 
      this.errorHandler, 
      this.dispatch,
      this.actionHandler
    ] = this.reg.get([
      TYPE_MAPPER, 
      PARSED_PATH, 
      GENERATE_ID, 
      ERROR, 
      DISPATCH,
      ACTION_HANDLER
    ]);
  }
  
  private getInstruction(subPath:string, startIndex:number, prevInstruction?:Instruction): Instruction {
    const typeHandler = this.typeMapper.getTypeHandler({subPath, prevInstruction});
    return typeHandler && typeHandler.getInstruction(subPath, startIndex, prevInstruction);
  }

  private getEndInstruction(): Instruction {
    const [eofHandler] = this.reg.get([EOF]);
    return eofHandler.getInstruction();
  }

  private canExitInstructionSet(instructionType: string): boolean {
    return instructionType !== ERROR && 
      instructionType !== EOF && 
      instructionType !== RIGHT_FILTER && 
      instructionType !== RIGHT_GROUPING;
  }

  private canIncrementCurrentIndex(instructionType: string): boolean {
    return instructionType !== RIGHT_FILTER && instructionType !== RIGHT_GROUPING;
  }

  private decorateInstruction(instruction:Instruction): Instruction|Array<Instruction> {
    if (!instruction) {
      return;
    }
    return Array.isArray(instruction) ? 
    instruction.map(i => Object.assign({}, i, {id: this.generateId()})) : 
      Object.assign({}, instruction, {
        id: this.generateId()
      });
  }

  getInstructionSet(): Array<Instruction> {
    let instructions: Array<Instruction> = [];
    let instruction: Instruction|Array<Instruction>;
    let prevInstruction:Instruction;
    
    do {
      instruction = this.getNextInstruction(prevInstruction);
      if (Array.isArray(instruction)) {
        instructions = instructions.concat(instruction);
        prevInstruction = instruction[instruction.length-1];
      } else {
        instructions.push(instruction);
        prevInstruction = instruction;
      }
    } while(this.canExitInstructionSet(prevInstruction.type));

    //sort the instruction set
    const [operatorHandler, axesHandler] = this.reg.get([OPERATORS, AXES])
    instructions = operatorHandler.sortInstructions(axesHandler.cleanUp(instructions));
    
    return instructions;
  }

  getNextInstruction(prevInstruction?: Instruction): Instruction|Array<Instruction> {
    if (this.getCurrentIndex() === this.getPathLength()) {
      return this.getEndInstruction();
    }

    let startIndex: number = this.getCurrentIndex();
    let instruction: Instruction|Array<Instruction> = null;
    let subString: string;
    
    do {

      subString = this.parsedPath.slice(startIndex, this.getCurrentIndex()+1).trim();
      if (subString.length) {
        instruction = this.decorateInstruction(this.getInstruction(subString, startIndex, prevInstruction));
      } else {// is white space so increment startindex
        ++startIndex;
      }

      // increment if not sub instructions
      if (!instruction || this.canIncrementCurrentIndex(Array.isArray(instruction) ? instruction[instruction.length-1].type : instruction.type)) {
        this.dispatch(this.actionHandler.create(INCREMENT_CURRENT_INDEX, {}));
      }
    } while(!instruction && this.getCurrentIndex() < this.getPathLength());
    
    if (!instruction) { // create error instruction because parsed path ended abruptly 
      instruction = this.errorHandler.createErrorInstruction(subString, startIndex, prevInstruction);
    }

    return instruction;
  }

  updateCurrentIndex(index: number): void {
    this.dispatch(this.actionHandler.create(UPDATE_CURRENT_INDEX, {value: index}));
  }

  getPathLength() {
    return this.reg.get([PATH_LENGTH])[0];
  }

  getCurrentIndex() {
    return this.reg.get([CURRENT_INDEX])[0];
  }
}