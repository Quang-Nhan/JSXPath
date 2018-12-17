import {  ActionParams, Action } from './../JSXInterfaces';
import { AXES_ENUMS } from '../enums/axes';
import AXES_TO_NODE_GETTERS from '../map/AxesToNodeGetters.json';
import { Instruction, ImpInstruction, ImpAction } from '../JSXInterfaces';
import { JSXPathHandler } from '../pathParser/JSXPathHandler';
import { AXES, PATH_HANDLER, ACTION_HANDLER, NODES_HANDLER, FILTERED_CONTEXT_AXES } from '../constants';
import { JSXNodes } from './JSXNodes';

import { JSXAction } from '../JSXAction';
import { JSXRegistrar } from '../JSXRegistrar';

export class JSXAxes implements ImpInstruction, ImpAction {

  // variables
  static JSX_AXES: string[];
  static AXES: string[];

  public name = AXES;
  private pathHandler: JSXPathHandler;
  private actionHandler: JSXAction;
  private nodesHandler: JSXNodes;

  constructor(private reg:JSXRegistrar) {}

  init() {
    this.initStaticValues();
    [
      this.pathHandler, 
      this.actionHandler, 
      this.nodesHandler
    ] = this.reg.get([
      PATH_HANDLER, 
      ACTION_HANDLER, 
      NODES_HANDLER
    ]);
  }

  initStaticValues() {
    if (!JSXAxes.JSX_AXES) {
      JSXAxes.JSX_AXES = Object.values(AXES_ENUMS);
    }
    if (!JSXAxes.AXES) {
      JSXAxes.AXES = Object.keys(AXES_ENUMS);
    }
  }

  getMap():object {
    // do not copy over child and descendant key map
    const newAxesEnums = {};
    for (let key in AXES_ENUMS) {
      if (key !== '/' && key !== '//') {
        newAxesEnums[key] = AXES_ENUMS[key];
      }
    }
    return newAxesEnums;
  }

  getInstruction(subPath: string, startIndex: number, instructionHandlerId: number): Instruction {
    return {
      type: AXES,
      subPath,
      startIndex,
      endIndex: this.pathHandler.getCurrentIndex(instructionHandlerId),
      link: {}
    }
  }

  /**
   * Remove previous '/' instruction if current instruction is other axes tokens
   * @param instructions {Instruction[]}
   */
  cleanUp(instructions: Instruction[]): Instruction[] {
    return instructions.reduce((r, instruction, index) => {
      if (instruction.type === AXES && ['parent::', 'ancestor::', 'ancestorOrSelf::', 'descendant::', 'descendantOrSelf::'].includes(instruction.subPath) && instructions[index-1].subPath === '/') {
        r.pop();
      }
      r.push(instruction);
      return r;
    }, []);
  }

  getAction(params: ActionParams): Action {
    return this.actionHandler.create(AXES, {
      id: params.instruction.id,
      subType: params.instruction.subPath
    });
  }

  getFilteredContextAction(params:ActionParams): Action {
    return this.actionHandler.create(FILTERED_CONTEXT_AXES, {
      id: params.instruction.id,
      subType: params.instruction.subPath
    });
  }
}