import { FUNCTION_ENUMS } from '../enums/functions';
import { JSXPathHandler } from '../JSXPathHandler';
import { Instruction, ImpInstruction, ImpAction } from '../JSXInterfaces';
import { FUNCTIONS, PATH_HANDLER, ACTION_HANDLER } from '../constants';
import { JSXAction } from '../JSXAction';
import { JSXRegistrar } from '../JSXRegistrar';

export class JSXFunctions implements ImpInstruction, ImpAction{
  static JSX_FUNCTIONS: Array<string>;
  static FUNCTIONS: Array<string>;

  private pathHandler: JSXPathHandler;
  private actionHandler: JSXAction;

  constructor(private reg:JSXRegistrar) {}

  init() {
    if (!JSXFunctions.JSX_FUNCTIONS) {
      JSXFunctions.JSX_FUNCTIONS = Object.values(FUNCTION_ENUMS);
    }
    if (!JSXFunctions.FUNCTIONS) {
      JSXFunctions.FUNCTIONS = Object.keys(FUNCTION_ENUMS);
    }
    [this.pathHandler, this.actionHandler] = this.reg.get([PATH_HANDLER, ACTION_HANDLER]);
  }

  getMap(): object {
    return FUNCTION_ENUMS;
  }

  getInstruction(subPath: string, startIndex: number): Instruction {
    return {
      type: FUNCTIONS,
      subPath,
      startIndex,
      endIndex: this.pathHandler.getCurrentIndex(),
      link: {}
    }
  }

  getAction(instruction: Instruction) {
    // TODO
    return null;
  }
}

