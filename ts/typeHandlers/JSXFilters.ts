import { Instruction, ImpInstruction, ImpAction, Action, State, ActionParams } from "../JSXInterfaces";
import { FILTERS, LEFT_FITLER, RIGHT_FILTER, PATH_HANDLER, PARSED_PATH, HELPERS, ACTION_HANDLER, STATE_HANDLER, SET_CONTEXT } from "../constants";
import { JSXPathHandler } from "../pathParser/JSXPathHandler";
import { findMatchingCharacterIndex } from './helper';
import { filters } from "../enums/filters";
import { JSXRegistrar } from "../JSXRegistrar";
import { JSXAction } from "../JSXAction";
import { JSXState } from "../state/JSXState";


export class JSXFilters implements ImpInstruction, ImpAction {
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
      } else {
        context.forEach((node, index) => {
          this.helper.dispatch(this.actionHandler.create(SET_CONTEXT, {
            id: instruction.id,
            value: index
          }));

          sub.link = this.helper.createLink(instruction);
          processInstruction(true)(sub);
        });
      }
    });
    
    return endAction;
  }

  getDefaultAction(params: ActionParams): Action {
    return null
  }

  getFilteredContextAction(params:ActionParams): Action {
    return null;
  }
}