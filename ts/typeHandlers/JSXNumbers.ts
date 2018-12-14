import { JSXPathHandler } from "../pathParser/JSXPathHandler";
import { ImpInstruction, ImpAction, Instruction, State, ActionParams, Action } from "../JSXInterfaces";
import { NUMBERS, PATH_HANDLER, ACTION_HANDLER, PARSED_PATH, FILTERED_CONTEXT_NUMBERS } from "../constants";
import { JSXAction } from "../JSXAction";
import { JSXRegistrar } from "../JSXRegistrar";

export class JSXNumbers implements ImpInstruction, ImpAction{
  public name = NUMBERS;
  private pathHandler: JSXPathHandler;
  private actionHandler: JSXAction;
  private parsedPath: string;

  constructor(private reg:JSXRegistrar) {}

  init() {
    [
      this.pathHandler, 
      this.actionHandler
    ] = this.reg.get([
      PATH_HANDLER, 
      ACTION_HANDLER
    ]);
  }

  private getFullNumberProperties(currentIndex: number): {value: string, endIndex: number} {
    let index = currentIndex;
    let value = '';    

    for (let findNext = true; findNext && index < this.parsedPath.length; ++index) {
      const testValue = value + this.parsedPath[index];
      if (testValue !== '-' && (this.parsedPath[index] === ' ' || isNaN(Number(testValue)))) {
        findNext = false;
        --index;
      } else {
        value = testValue;
      }
    }

    return {
      value,
      endIndex: index-1
    }
  }

  getInstruction(subPath:string, startIndex: number, instructionHandlerId:number): Instruction {
    this.parsedPath = this.reg.get([instructionHandlerId + ':' + PARSED_PATH])[0];
    const fullNumberProperties = this.getFullNumberProperties(this.pathHandler.getCurrentIndex(instructionHandlerId));
    this.pathHandler.updateCurrentIndex(fullNumberProperties.endIndex);

    return {
      type: NUMBERS,
      subPath: fullNumberProperties.value,
      startIndex,
      endIndex: fullNumberProperties.endIndex,
      link: {}
    }
  }

  getAction(params: ActionParams): Action {
    const {instruction} = params;
    return this.actionHandler.create(
      NUMBERS, 
      this.getNumbersPayload(instruction)
    );
  }

  getFilteredContextAction(params:ActionParams): Action {
    const {instruction} = params;
    return this.actionHandler.create(
      FILTERED_CONTEXT_NUMBERS, 
      this.getNumbersPayload(instruction)
    );
  }

  private getNumbersPayload(instruction) {
    return {
      id: instruction.id,
      value:  Number(instruction.subPath), 
      link: instruction.link, 
      subType: instruction.subType
    }
  }
}