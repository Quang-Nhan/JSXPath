import { JSXState } from './state/JSXState';
import {
  Instruction
} from './JSXInterfaces';
import { JSXRegistrar } from './JSXRegistrar';
import { STATE_HANDLER } from './constants';

export class JSXProcessor {
  private stateHandler: JSXState;

  constructor(private reg: JSXRegistrar) {}

  init() {
    [this.stateHandler] = this.reg.get([STATE_HANDLER]);
  }

  processInstruction() {
    const self = this;
    return (instruction: Instruction) => {
      if (instruction.hasOwnProperty('subInstructions') && instruction.subInstructions.length) {
        instruction.subInstructions.forEach(self.processInstruction);
      }
  
      const [typeHandler] = self.reg.get([instruction.type]);// self.typeMapper.getTypeHandler({type: instruction.type});
      
      if (typeHandler) {
        const action = typeHandler.getAction(instruction, self.stateHandler.getState(), self.processInstruction());
        self.stateHandler.dispatch(action);
      }
    }
  }

  process(instructions) {
    instructions.forEach(this.processInstruction());
  }
}