import { ImpInstruction, ImpAction, Instruction, Action, ActionParams } from "../JSXInterfaces";
import { JSXRegistrar } from "../JSXRegistrar";
import { BOOLEAN, ACTION_HANDLER } from "../constants";

export class JSXBoolean implements ImpInstruction, ImpAction {
  public name = BOOLEAN;
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

  getAction(params: ActionParams): Action {
    const {instruction} = params;
    return this.actionHandler.create(BOOLEAN, { 
      id: instruction.id,
      value: instruction.subPath === 'true' ? true : false, 
      link: instruction.link,
      subType: instruction.subType
    });
  }

  getDefaultAction(params:ActionParams): Action {
    return null;
  }

  getFilteredContextAction(params:ActionParams): Action {
    return null;
  }
}