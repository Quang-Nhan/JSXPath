import { Instruction, ImpInstruction, ImpAction, Action, State } from "../JSXInterfaces";
import { FILTERS, LEFT_FITLER, RIGHT_FILTER, PATH_HANDLER, PARSED_PATH, HELPERS, ACTION_HANDLER } from "../constants";
import { JSXPathHandler } from "../JSXPathHandler";
import { findMatchingCharacterIndex } from './helper';
import { filters } from "../enums/filters";
import { JSXRegistrar } from "../JSXRegistrar";
import { JSXAction } from "../JSXAction";


export class JSXFilters implements ImpInstruction, ImpAction {
  private pathHandler: JSXPathHandler;
  private parsedPath: string;
  private actionHandler: JSXAction;
  private helper;

  constructor(private reg: JSXRegistrar) {}

  init() {
    [this.pathHandler, this.parsedPath, this.actionHandler, this.helper] = this.reg.get([PATH_HANDLER, PARSED_PATH, ACTION_HANDLER, HELPERS]);
  }

  private getFilterProperties(currentIndex:number): {value, endIndex} {
    const rightFilterIndex = findMatchingCharacterIndex(filters[LEFT_FITLER], filters[RIGHT_FILTER], currentIndex, this.parsedPath);
    return {
      value: this.parsedPath.slice(currentIndex, rightFilterIndex),
      endIndex: rightFilterIndex-1
    };
  }

  private getLeftFilterInstruction(subPath, startIndex): Instruction {
    return {
      type: LEFT_FITLER,
      subPath,
      startIndex,
      endIndex: this.pathHandler.getCurrentIndex(),
      link: {}
    }
  }

  private getRightFilterInstruction(subPath: string, startIndex: number): Instruction {

    return {
      type: RIGHT_FILTER,
      subPath,
      startIndex,
      endIndex: this.pathHandler.getCurrentIndex(),
      link: {}
    }
  }

  getInstruction(subPath, startIndex, prevInstruction): Instruction {
    let subInstructions = [], filterProperties;
    
    if (subPath === filters[LEFT_FITLER]) {
      filterProperties = this.getFilterProperties(this.pathHandler.getCurrentIndex());
      const leftFilterInstruction = this.getLeftFilterInstruction(subPath, startIndex);
      this.pathHandler.updateCurrentIndex(this.pathHandler.getCurrentIndex() + 1);
      subInstructions = [leftFilterInstruction].concat(this.pathHandler.getInstructionSet());
    } else if (subPath === filters[RIGHT_FILTER]) {
      return this.getRightFilterInstruction(subPath, startIndex);
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

  getAction(instruction:Instruction, state:State, processInstruction:Function): Action {
    let endAction: Action;
    instruction.subInstructions.forEach(sub => {
      if (sub.type === LEFT_FITLER) {
        sub.id = instruction.id;
        this.helper.dispatch(this.actionHandler.create(LEFT_FITLER, {id: sub.id, link:instruction.link}))
      } else if (sub.type === RIGHT_FILTER) {
        sub.id = instruction.id;
        endAction = this.actionHandler.create(RIGHT_FILTER, {id: sub.id});
      } else {
        sub.link = this.helper.createLink(instruction);
        processInstruction(sub);
      }
    });
    
    return endAction;
  }
}