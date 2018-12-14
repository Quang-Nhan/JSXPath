import { JSXPathHandler } from './pathParser/JSXPathHandler';
import { JSXProcessor } from './JSXProcessor';
import { Instruction } from './JSXInterfaces';
import { JSXState } from './state/JSXState';
import { JSXRegistrar } from './JSXRegistrar';
import { FLUSH, PATH_HANDLER, PROCESSOR, STATE_HANDLER } from './constants';


export default class JSXMain {
  private pathHandler: JSXPathHandler;
  private processor: JSXProcessor;
  private stateHandler: JSXState;
  private instructions: Instruction[];
  private reg: JSXRegistrar;
    
  constructor() {
    this.reg = new JSXRegistrar();
    [this.pathHandler, this.processor, this.stateHandler] = this.reg.get([PATH_HANDLER, PROCESSOR, STATE_HANDLER]);
  }

  process(path, json, variables = {}) {
    this.reg.setInputData({json, path, variables});
    this.instructions = this.pathHandler.getInstructionSet();
    // debugger;
    this.processor.process(this.instructions);
  }

  getResult() {
    return this.stateHandler.getState().values;
  }

  flush(options) {
    if (!options) {
      this.stateHandler.dispatch({
        type: FLUSH,
        payload: {}
      });
    }
  }
}