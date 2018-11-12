import { ImpInstruction, ImpAction, Instruction, Action } from "../JSXInterfaces";
import { JSXRegistrar } from "../JSXRegistrar";
import { BOOLEAN, ACTION_HANDLER } from "../constants";

export class JSXBoolean implements ImpInstruction, ImpAction {

  private actionHandler;
  constructor(private reg:JSXRegistrar) {}

  init() {
    [this.actionHandler] = this.reg.get([ACTION_HANDLER]);
  }

  getInstruction(subPath:string, startIndex:number): Instruction {
    return {
      type: BOOLEAN,
      subPath,
      startIndex,
      endIndex: startIndex + subPath.length,
      link: {}
    }
  }

  getAction(instruction: Instruction): Action {
    return this.actionHandler.create(BOOLEAN, { 
      value: instruction.subPath === 'true' ? true : false, 
      link: instruction.link,
      subType: instruction.subType
    });
  }
}