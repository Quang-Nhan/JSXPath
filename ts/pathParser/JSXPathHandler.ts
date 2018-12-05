import { Instruction } from '../JSXInterfaces';
import { JSXRegistrar } from '../JSXRegistrar';
import { JSXAction } from '../JSXAction';
import { JSXInstruction } from './JSXInstruction';
import {
  EOF,
  ERROR,
  RIGHT_FILTER,
  RIGHT_GROUPING,
  OPERATORS,
  PARSED_PATH,
  AXES,
  DISPATCH,
  UPDATE_CURRENT_INDEX,
  ACTION_HANDLER,
  FUNCTIONS,
} from '../constants';


export class JSXPathHandler {
  private dispatch: Function;
  private actionHandler: JSXAction;
  private instructionHandlers: {[id:number]: JSXInstruction } = {};
  
  public parsedPath: string;

  constructor(private reg:JSXRegistrar) {}

  init() {
    [
      this.parsedPath, 
      this.dispatch,
      this.actionHandler
    ] = this.reg.get([
      '0:' + PARSED_PATH, 
      DISPATCH,
      ACTION_HANDLER
    ]);
  }
  
  private canExitInstructionSet(instructionType: string): boolean {
    return instructionType !== ERROR && 
      instructionType !== EOF && 
      instructionType !== RIGHT_FILTER && 
      instructionType !== RIGHT_GROUPING;
  }

  getInstructionSet(params: {path?:string, inputId?:number} = {}): Instruction[] {
    let {path, inputId} = params;
    let instructions:Instruction[] = [];
    let instruction:Instruction|Instruction[];
    let prevInstruction:Instruction;
    
    const instructionBuilder = inputId ? this.instructionHandlers[inputId] : new JSXInstruction(this.reg, path);
    this.instructionHandlers[instructionBuilder.id] = instructionBuilder;
    do {
      instruction = instructionBuilder.getNextInstruction(prevInstruction);
      if (Array.isArray(instruction)) {
        instructions = instructions.concat(instruction);
        prevInstruction = instruction[instruction.length-1];
      } else {
        instructions.push(instruction);
        prevInstruction = instruction;
      }
    } while(this.canExitInstructionSet(prevInstruction.type));

    //sort the instruction set
    
    instructions = this.sortInstructions(instructions, instructionBuilder.id);
    
    return instructions;
  }

  sortInstructions(instructions: Instruction[], inputId) {
    // Turn this into chain
    const [operatorHandler, axesHandler, functionHandler] = this.reg.get([OPERATORS, AXES, FUNCTIONS]);
    let chain = {
      instructions: [],
      axesCleanUp: (unsortedInstructions) => {
        chain.instructions = axesHandler.cleanUp(unsortedInstructions);
        return chain;
      },
      sortFunction: () => {
        chain.instructions = functionHandler.sortInstructions(chain.instructions, inputId);
        return chain;
      },
      sortOperator: () => {
        chain.instructions = operatorHandler.sortInstructions(chain.instructions, inputId);
        return chain;
      },
      value: () => {
        return chain.instructions;
      }
    }

    const test =  chain.axesCleanUp(instructions).sortFunction().sortOperator().value();
    return test;
  }


  updateCurrentIndex(index: number, subId?: number): void {
    // 0 is root/main input
    let id = subId ? subId : 0;
    this.dispatch(this.actionHandler.create(UPDATE_CURRENT_INDEX, {value: index, id}));
  }

  getPathLength(inputId:number):number {
    return this.instructionHandlers[inputId].getPathLength();
  }

  getCurrentIndex(inputId:number):number {
    return this.instructionHandlers[inputId].getCurrentIndex();
  }

  getParsedPath(inputId:number) {
    return this.instructionHandlers[inputId].getParsedPath();
  }

  flush() {
    this.instructionHandlers = {};
  }
}