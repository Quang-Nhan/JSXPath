import { Node, State, ActionParams, Action } from './../JSXInterfaces';
import { JSXNodes } from './JSXNodes';
import { ImpInstruction, ImpAction, Instruction } from "../JSXInterfaces";
import { JSXPathHandler } from "../pathParser/JSXPathHandler";
import { ROOT, AXES, PATH_HANDLER, ACTION_HANDLER, NODES_HANDLER } from "../constants";
import { JSXAction } from '../JSXAction';
import { JSXRegistrar } from '../JSXRegistrar';

export class JSXRoot implements ImpInstruction, ImpAction {
  private pathHandlder: JSXPathHandler;
  private nodesHandler: JSXNodes;
  private actionHandler: JSXAction;

  constructor(private reg:JSXRegistrar) {}

  init() {
    [this.pathHandlder, this.actionHandler, this.nodesHandler] = this.reg.get([PATH_HANDLER, ACTION_HANDLER, NODES_HANDLER]);
  }
  
  getInstruction(subPath: string, startIndex: number, instructionHandlerId:number): Instruction[] {
    let instructions = [
      {
        type: ROOT,
        subPath,
        startIndex,
        endIndex: this.pathHandlder.getCurrentIndex(instructionHandlerId),
        link: {}
      }
    ];
    
    if (this.pathHandlder.getPathLength(instructionHandlerId) === 1 || this.pathHandlder.parsedPath[startIndex+1] === ' ') {
      return instructions;
    } 
  
    return instructions.concat({
     type: AXES,
     subPath: '/',
     startIndex,
     endIndex: this.pathHandlder.getCurrentIndex(instructionHandlerId),
     link: {}
    });
  }

  getAction(params: ActionParams): Action {
    const {instruction} = params;
    const { id, link } = instruction;
    return this.actionHandler.create(ROOT, {id, link});
  }

  getDefaultAction(params:ActionParams): Action {
    return null;
  }

  getFilteredContextAction(params:ActionParams): Action {
    return null;
  }
}