import { JSXRegistrar } from "../JSXRegistrar";
import { Instruction, Action } from "../JSXInterfaces";
import { ERROR, PATH_HANDLER, AXES, ACTION_HANDLER } from "../constants";
import { JSXPathHandler } from "../JSXPathHandler";
import InstructionMap from '../map/InstructionMap.json';
import { JSXAction } from "../JSXAction";

export class JSXErrors {
  private pathHandler: JSXPathHandler;
  private actionHandler: JSXAction;
  constructor(private reg:JSXRegistrar) {}

  init() {
    [this.pathHandler, this.actionHandler] = this.reg.get([PATH_HANDLER, ACTION_HANDLER]);
  }

  createErrorInstruction(subPath:string, startIndex:number, prevInstruction:Instruction): Instruction {
  
    const message = prevInstruction.type && InstructionMap.hasOwnProperty(prevInstruction.type) ?
      'Could not understand the sub path ' + subPath + '. Was expecting ' + InstructionMap[prevInstruction.type]['$next'] :
      'Could not understand the path. Please review!';
    
      return {
      type: ERROR,
      errorMessage: message,
      subPath,
      startIndex,
      endIndex: this.pathHandler.getCurrentIndex(),
      link: {}
    };
  }

  getAction(instruction:Instruction): Action {
    return this.actionHandler.create(ERROR, {value: instruction.errorMessage});
  }
}