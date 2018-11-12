import { JSXRegistrar } from "../JSXRegistrar";
import { EOF, PATH_HANDLER, ACTION_HANDLER } from "../constants";
import { Instruction, ImpInstruction, ImpAction } from "../JSXInterfaces";
import { JSXPathHandler } from "../JSXPathHandler";
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

  getInstruction(): Instruction {
    return {
      type: EOF,
      subPath: null,
      startIndex: this.pathHandler.getCurrentIndex(),
      endIndex: this.pathHandler.getCurrentIndex(),
      link: {}
    }
  }

  getAction(instruction: Instruction) {
    return this.actionHandler.create(EOF, {})
  }
}