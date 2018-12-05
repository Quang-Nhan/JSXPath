import { Instruction, ImpInstruction, ImpAction, Action, ActionParams } from '../JSXInterfaces';
import { JSXPathHandler } from '../pathParser/JSXPathHandler';
import { VARIABLES, PATH_HANDLER, VARS, ACTION_HANDLER, NODES_HANDLER, DISPATCH, PARSED_NODES } from '../constants';
import { JSXRegistrar } from '../JSXRegistrar';
import { JSXAction } from '../JSXAction';
import { JSXNodes } from './JSXNodes';

export class JSXVariables implements ImpInstruction, ImpAction {

  // variables
  static VARIABLES: string[];
  private pathHandler: JSXPathHandler;
  private nodesHandler: JSXNodes;
  private VARIABLE_MAP: object = {};
  private actionHandler: JSXAction;
  // methods
  constructor(private reg:JSXRegistrar) {}
  
  init() {
    let dispatch;
    [
      this.pathHandler, 
      this.VARIABLE_MAP, 
      this.actionHandler, 
      this.nodesHandler,
      dispatch
    ] = this.reg.get([
      PATH_HANDLER, 
      VARS, 
      ACTION_HANDLER,
      NODES_HANDLER,
      DISPATCH
    ]);
    
    if (!JSXVariables.VARIABLES) {
      JSXVariables.VARIABLES = Object.keys(this.VARIABLE_MAP);
    }
    for (let varName in this.VARIABLE_MAP) {
      if (typeof this.VARIABLE_MAP[varName] === 'object') {
        // merges variables to nodes map
        // this.nodesHandler.buildAndDispatchNodesMap(varName, this.VARIABLE_MAP[varName]);
      }
    }
  }

  getMap(): object {
    return this.VARIABLE_MAP;
  }

  getAction(params: ActionParams): Action {
    const {instruction} = params;
    return this.actionHandler.create(VARIABLES, {
      id: instruction.id,
      value: this.VARIABLE_MAP[instruction.subPath],
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

  getInstruction(subPath: string, startIndex: number, instructionHandlerId): Instruction {
    return {
      type: VARIABLES,
      subPath,
      startIndex,
      endIndex: this.pathHandler.getCurrentIndex(instructionHandlerId),
      link: {}
    }
  }
}