import { ImpInstruction, ImpAction, SubInstruction, Instruction, State, ActionParams, Action } from "../JSXInterfaces";
import { JSXPathHandler } from "../pathParser/JSXPathHandler";
import { LEFT_GROUPING, RIGHT_GROUPING, GROUPINGS, PATH_HANDLER, PARSED_PATH, GENERATE_ID, ACTION_HANDLER, DISPATCH, HELPERS } from "../constants";
import { groupings } from "../enums/groupings";
import { findMatchingCharacterIndex } from "./helper";
import { JSXRegistrar } from "../JSXRegistrar";
import { JSXAction } from "../JSXAction";



export class JSXGroupings implements ImpInstruction, ImpAction {
  public name = GROUPINGS;
  private pathHandler: JSXPathHandler;
  private parsedPath: string;
  private actionHandler: JSXAction;
  private generateId: Function;
  private helper;

  constructor(private reg: JSXRegistrar) {}

  init() {
    [
      this.pathHandler, 
      this.actionHandler, 
      this.parsedPath, 
      this.helper,
      this.generateId
    ] = 
    this.reg.get([
      PATH_HANDLER, 
      ACTION_HANDLER, 
      '0:' + PARSED_PATH, 
      HELPERS,
      GENERATE_ID
    ]);
  }

  private getGroupingProperties(currentIndex:number): SubInstruction {
    const rightGroupingIndex = findMatchingCharacterIndex(groupings[LEFT_GROUPING], groupings[RIGHT_GROUPING], currentIndex, this.parsedPath);
    return {
      value: this.parsedPath.slice(currentIndex, rightGroupingIndex),
      endIndex: rightGroupingIndex-1
    }
  }

  createLeftGroupingInstruction(subPath: string, startIndex: number, instructionHandlerId: number): Instruction {
    return {
      type: LEFT_GROUPING,
      subPath,
      startIndex,
      endIndex: this.pathHandler.getCurrentIndex(instructionHandlerId),
      link: {}
    }
  }

  createRightGroupingInstruction(subPath:string, startIndex:number, instructionHandlerId:number): Instruction {
    return {
      type: RIGHT_GROUPING,
      subPath,
      startIndex,
      endIndex: this.pathHandler.getCurrentIndex(instructionHandlerId),
      link: {}
    }
  }

  getInstruction(subPath:string, startIndex:number, instructionHandlerId:number):Instruction {
    let subInstructions = [], groupingProperties;

    if (subPath === groupings[LEFT_GROUPING]) {
      groupingProperties = this.getGroupingProperties(this.pathHandler.getCurrentIndex(instructionHandlerId));
      const leftGroupingInstruction = this.createLeftGroupingInstruction(subPath, startIndex, instructionHandlerId);
      this.pathHandler.updateCurrentIndex(this.pathHandler.getCurrentIndex(instructionHandlerId) + 1);
      subInstructions = [leftGroupingInstruction].concat(this.pathHandler.getInstructionSet());
    } else if (subPath === groupings[RIGHT_GROUPING]) {
      return this.createRightGroupingInstruction(subPath, startIndex, instructionHandlerId);
    }

    return this.createInstruction(groupingProperties.value, startIndex, groupingProperties.endIndex, subInstructions, {});
  }

  createInstruction(subPath, startIndex, endIndex, subInstructions, link) {
    return {
      id: this.generateId(),
      type: GROUPINGS,
      subPath,
      startIndex,
      endIndex,
      subInstructions,
      link
    }
  }

  getAction(params: ActionParams): Action {
    const {instruction, processInstruction, isFilterContext} = params;
    let endAction;
    // process LEFT_GROUPING, then middle instructions and finally return RIGHT_GROUPING action.
    instruction.subInstructions.forEach(sub => {
      if (sub.type === LEFT_GROUPING) {
        sub.id = instruction.id;
        this.helper.dispatch(this.actionHandler.create(LEFT_GROUPING, {
          id: sub.id, 
          link:instruction.link, 
          subType: instruction.subType
        }));
      } else if (sub.type === RIGHT_GROUPING) {
        sub.id = instruction.id;
        endAction = this.actionHandler.create(RIGHT_GROUPING, {id: sub.id});
      } else {
        sub.link = this.helper.createLink(instruction);
        processInstruction(isFilterContext)(sub);
      }
    });

    return endAction;
  }


  getFilteredContextAction(params: ActionParams): Action {
    return this.getAction(params);
  }
}