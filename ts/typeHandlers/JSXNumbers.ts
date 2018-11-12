import { JSXPathHandler } from "../JSXPathHandler";
import { ImpInstruction, ImpAction, Instruction, State } from "../JSXInterfaces";
import { NUMBERS, PATH_HANDLER, ACTION_HANDLER, PARSED_PATH } from "../constants";
import { JSXAction } from "../JSXAction";
import { JSXRegistrar } from "../JSXRegistrar";

export class JSXNumbers implements ImpInstruction, ImpAction{
  private pathHandler: JSXPathHandler;
  private actionHandler: JSXAction;
  private parsedPath: string;

  constructor(private reg:JSXRegistrar) {}

  init() {
    [this.pathHandler, this.actionHandler, this.parsedPath] = this.reg.get([PATH_HANDLER, ACTION_HANDLER, PARSED_PATH]);
  }

  private getFullNumberProperties(currentIndex: number): {value: string, endIndex: number} {
    let index = currentIndex;
    let value = '';    

    for (let findNext = true; findNext && index < this.parsedPath.length; ++index) {
      const testValue = value + this.parsedPath[index];
      if (this.parsedPath[index] === ' ' || isNaN(Number(testValue))) {
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

  getInstruction(subPath:string, startIndex: number): Instruction {
    const fullNumberProperties = this.getFullNumberProperties(this.pathHandler.getCurrentIndex());
    this.pathHandler.updateCurrentIndex(fullNumberProperties.endIndex);

    return {
      type: NUMBERS,
      subPath: fullNumberProperties.value,
      startIndex,
      endIndex: fullNumberProperties.endIndex,
      link: {}
    }
  }

  getAction(instruction:Instruction, state:State) {
    return this.actionHandler.create(NUMBERS, {
      id: instruction.id,
      value:  Number(instruction.subPath), 
      link: instruction.link, 
      subType: instruction.subType
    });
  }
}