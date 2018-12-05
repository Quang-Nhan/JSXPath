import { Instruction } from "../JSXInterfaces";
import { JSXTypeMapper } from "../typeHandlers/JSXTypeMapper";
import { JSXAction } from "../JSXAction";
import { 
  ACTION_HANDLER,
  CURRENT_INDEX,
  DISPATCH,
  EOF,
  ERROR, 
  GENERATE_ID, 
  INCREMENT_CURRENT_INDEX, 
  INPUT_ADDED, 
  PARSED_PATH,
  PATH_LENGTH, 
  RIGHT_FILTER, 
  RIGHT_GROUPING, 
  TYPE_MAPPER,
} from "../constants";

export class JSXInstruction {
  private generateId: Function;
  private dispatch: Function;
  private typeMapper: JSXTypeMapper;
  private actionHandler: JSXAction
  public id: number = 0;
  
  constructor(
    private reg,
    parsedPath
  ) {
    [
      this.generateId,
      this.typeMapper,
      this.dispatch,
      this.actionHandler
    ] = this.reg.get([
      GENERATE_ID,
      TYPE_MAPPER,
      DISPATCH,
      ACTION_HANDLER
    ]);
    
    if (parsedPath) {
      this.id = this.generateId();
      this.dispatch(this.actionHandler.create(INPUT_ADDED, {
        id: this.id,
        value: {
          parsedPath,
          pathLength: parsedPath.length,
          currentIndex: 0
        }
      }));
    }
  }

  getNextInstruction(prevInstruction?: Instruction): Instruction|Instruction[] {
    if (this.getCurrentIndex() === this.getPathLength()) {
      return this.getEndInstruction();
    }

    let startIndex: number = this.getCurrentIndex();
    let instruction: Instruction|Instruction[] = null;
    let subString: string;
    
    do {
      subString = this.reg.get([this.id + ':' + PARSED_PATH])[0].slice(startIndex, this.getCurrentIndex()+1).trim();
      if (subString.length) {
        instruction = this.decorateInstruction(this.getInstruction(subString, startIndex, prevInstruction));
      } else {// is white space so increment startindex
        ++startIndex;
      }

      // increment if not sub instructions
      if (!instruction || this.canIncrementCurrentIndex(Array.isArray(instruction) ? instruction[instruction.length-1].type : instruction.type)) {
        this.dispatch(this.actionHandler.create(INCREMENT_CURRENT_INDEX, {id: this.id}));
      }
    } while(!instruction && this.getCurrentIndex() < this.getPathLength());
    
    if (!instruction) { // create error instruction because parsed path ended abruptly 
      instruction = this.reg.get([ERROR])[0].createErrorInstruction(subString, startIndex, this.id, prevInstruction);
    }

    return instruction;
  }

  getCurrentIndex():number {
    return this.reg.get([this.id + ':' + CURRENT_INDEX])[0];
  }

  getPathLength():number {
    return this.reg.get([this.id + ':' + PATH_LENGTH])[0];
  }

  getParsedPath():string {
    return this.reg.get([this.id + ':' + PARSED_PATH])[0]
  }


  private decorateInstruction(instruction:Instruction): Instruction|Instruction[] {
    if (!instruction) {
      return;
    }
    return Array.isArray(instruction) ? 
    instruction.map(i => Object.assign({}, i, {id: this.generateId()})) : 
      Object.assign({}, instruction, {
        id: this.generateId()
      });
  }

  private getInstruction(subPath:string, startIndex:number, prevInstruction?:Instruction): Instruction {
    const typeHandler = this.typeMapper.getTypeHandler({subPath, prevInstruction, handlerId: this.id});
    return typeHandler && typeHandler.getInstruction(subPath, startIndex, this.id, prevInstruction);
  }

  private getEndInstruction(): Instruction {
    const [eofHandler] = this.reg.get([EOF]);
    return eofHandler.getInstruction(this.id);
  }

  private canIncrementCurrentIndex(instructionType: string): boolean {
    return instructionType !== RIGHT_FILTER && instructionType !== RIGHT_GROUPING;
  }
}