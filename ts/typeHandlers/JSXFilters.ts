import { Instruction, ImpInstruction, ImpAction, Action, State, ActionParams } from "../JSXInterfaces";
import { FILTERS, LEFT_FITLER, RIGHT_FILTER, PATH_HANDLER, PARSED_PATH, HELPERS, ACTION_HANDLER, STATE_HANDLER, SET_CONTEXT } from "../constants";
import { JSXPathHandler } from "../pathParser/JSXPathHandler";
import { findMatchingCharacterIndex } from './helper';
import { filters } from "../enums/filters";
import { JSXRegistrar } from "../JSXRegistrar";
import { JSXAction } from "../JSXAction";
import { JSXState } from "../state/JSXState";


export class JSXFilters implements ImpInstruction, ImpAction {
  public name = FILTERS;
  private pathHandler: JSXPathHandler;
  private actionHandler: JSXAction;
  private helper;
  private statehandler: JSXState;

  constructor(private reg: JSXRegistrar) {}

  init() {
    [
      this.pathHandler, 
      this.actionHandler, 
      this.helper,
      this.statehandler
    ] = this.reg.get([
      PATH_HANDLER, 
      ACTION_HANDLER, 
      HELPERS,
      STATE_HANDLER
    ]);
  }

  private getFilterProperties(currentIndex:number, inputId:number): {value, endIndex} {
    const rightFilterIndex = findMatchingCharacterIndex(filters[LEFT_FITLER], filters[RIGHT_FILTER], currentIndex, this.pathHandler.getParsedPath(inputId));
    return {
      value: this.pathHandler.getParsedPath(inputId).slice(currentIndex, rightFilterIndex),
      endIndex: rightFilterIndex-1
    };
  }

  private getLeftFilterInstruction(subPath, startIndex, inputId:number): Instruction {
    return {
      type: LEFT_FITLER,
      subPath,
      startIndex,
      endIndex: this.pathHandler.getCurrentIndex(inputId),
      link: {}
    }
  }

  private getRightFilterInstruction(subPath: string, startIndex: number, inputId:number): Instruction {

    return {
      type: RIGHT_FILTER,
      subPath,
      startIndex,
      endIndex: this.pathHandler.getCurrentIndex(inputId),
      link: {}
    }
  }

  sortInstructions(instructions: Instruction[], inputId) {
    let sortedInstructions:Instruction[] = [];
    instructions.forEach(instruction => {
      if (instruction.type === FILTERS) {
        instruction.subInstructions = instruction.subInstructions.reduce((r, ins) => {
          if ([LEFT_FITLER, RIGHT_FILTER].includes(ins.type)) {
            r.push(ins)
          } else {
            if (!r[1]) {
              r[1] = [];
            }
            r[1].push(ins)
          }
          return r;
        }, [])
      } else if (instruction.args && instruction.args.length) {
        instruction.args = instruction.args.map((args) => this.sortInstructions(args, inputId));
      } else if (instruction.subInstructions) {
        instruction.subInstructions = this.sortInstructions(instruction.subInstructions, inputId);
      }
      sortedInstructions.push(instruction);
    });
    return sortedInstructions;
  }

  getInstruction(subPath, startIndex, inputId:number, prevInstruction): Instruction {
    let subInstructions = [], filterProperties;
    if (subPath === filters[LEFT_FITLER]) {
      filterProperties = this.getFilterProperties(this.pathHandler.getCurrentIndex(inputId), inputId);
      const leftFilterInstruction = this.getLeftFilterInstruction(subPath, startIndex, inputId);
      this.pathHandler.updateCurrentIndex(this.pathHandler.getCurrentIndex(inputId) + 1, inputId);
      subInstructions = [leftFilterInstruction].concat(this.pathHandler.getInstructionSet({inputId}));
    } else if (subPath === filters[RIGHT_FILTER]) {
      return this.getRightFilterInstruction(subPath, startIndex, inputId);
    }

    return {
      type: FILTERS,
      subPath: filterProperties.value,
      startIndex,
      endIndex: filterProperties.endIndex,
      subInstructions,
      link: {}
    }
  }

  private processFilterArgs(parentInstruction, instruction, processInstruction) {
    return (context) => {
      this.helper.dispatch(this.actionHandler.create(SET_CONTEXT, {
        id: parentInstruction.id,
        value: context
      }));
      const link = this.helper.createLink(parentInstruction);
      instruction.forEach(s => {
        s.link = link;
        processInstruction(true)(s);
      });
    }
  }

  getAction(params: ActionParams): Action {
    const {instruction, processInstruction} = params;
    let endAction: Action, context, state;

    instruction.subInstructions.forEach(sub => {
      if (sub.type === LEFT_FITLER) {
        sub.id = instruction.id;
        this.helper.dispatch(this.actionHandler.create(LEFT_FITLER, {
          id: sub.id, 
          link:instruction.link
        }));
        state = this.statehandler.getState();
        context = state.subStates[sub.id].nodes;
      } else if (sub.type === RIGHT_FILTER) {
        sub.id = instruction.id;
        endAction = this.actionHandler.create(RIGHT_FILTER, {id: sub.id});
      } else if (Array.isArray(sub)) {
        context.forEach(this.processFilterArgs(instruction, sub, processInstruction));
      } else {
        this.processFilterArgs(instruction, sub, processInstruction)(context);
      }
    });
    
    return endAction;
  }

  getFilteredContextAction(params:ActionParams): Action {
    return this.getAction(params);
  }
}