import { JSXRegistrar } from "../JSXRegistrar";
import { EOF, PATH_HANDLER, ACTION_HANDLER } from "../constants";
import { Instruction, ImpInstruction, ImpAction, ActionParams, Action } from "../JSXInterfaces";
import { JSXPathHandler } from "../pathParser/JSXPathHandler";
import { JSXAction } from "../JSXAction";

export class JSXEndOfFile implements ImpInstruction, ImpAction {
  private pathHandler: JSXPathHandler;
  private actionHandler: JSXAction;

  constructor(private reg: JSXRegistrar) {}

  init() { 
    [
      this.pathHandler, 
      this.actionHandler
    ] = this.reg.get([
      PATH_HANDLER, 
      ACTION_HANDLER
    ]);
  }

  getInstruction(instructionHandlerId): Instruction {
    return {
      type: EOF,
      subPath: null,
      startIndex: this.pathHandler.getCurrentIndex(instructionHandlerId),
      endIndex: this.pathHandler.getCurrentIndex(instructionHandlerId),
      link: {}
    }
  }

  getAction(): Action {
    return this.actionHandler.create(EOF, {})
  }

  getDefaultAction(params:ActionParams): Action {
    return null;
  }

  getFilteredContextAction(params:ActionParams): Action {
    return null;
  }
}