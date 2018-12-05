import { JSXState } from './state/JSXState';
import {
  Instruction, ActionParams
} from './JSXInterfaces';
import { JSXRegistrar } from './JSXRegistrar';
import { STATE_HANDLER } from './constants';

export class JSXProcessor {
  private stateHandler: JSXState;

  constructor(private reg: JSXRegistrar) {}

  init() {
    [this.stateHandler] = this.reg.get([STATE_HANDLER]);
  }

  public processInstruction(isFilterContext?:boolean) {
    const self = this;
    return (instruction:Instruction) => {
      // if (instruction.hasOwnProperty('subInstructions') && instruction.subInstructions.length) {
      //   instruction.subInstructions.forEach(self.processInstruction(isFilterContext));
      // }
      const [typeHandler] = self.reg.get([instruction.type]);
      
      // if (typeHandler && isFilterContext) {
      //   self.stateHandler.dispatch(typeHandler.getAction({
      //     instruction, 
      //     processInstruction: self.processInstruction.bind(self),
      //     isFilterContext
      //   }));
      // }
      if (typeHandler) {
        self.stateHandler.dispatch(this.getActionMethodType(typeHandler, isFilterContext)({
          instruction, 
          processInstruction: self.processInstruction.bind(self),
          isFilterContext
        }));
      }
    }
  }

  public process(instructions) {
    instructions.forEach(this.processInstruction());
  }

  private getActionMethodType(typeHandler, isFilterContext:boolean) {
    return isFilterContext ? 
      typeHandler.getFilteredContextAction.bind(typeHandler) : 
      typeHandler.getAction.bind(typeHandler);
  }
}