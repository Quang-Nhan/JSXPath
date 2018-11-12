import { JSXPathHandler } from "../JSXPathHandler";
import { ImpInstruction, ImpAction, Instruction, Action } from "../JSXInterfaces";
import { STRINGS, PATH_HANDLER, ACTION_HANDLER, PARSED_PATH } from '../constants';
import { JSXAction } from "../JSXAction";
import { JSXRegistrar } from "../JSXRegistrar";


export class JSXString implements ImpInstruction, ImpAction {
  private parsedPath: string;
  private pathHandler: JSXPathHandler;
  private actionHandler: JSXAction;

  constructor(private reg:JSXRegistrar) {}

  init(pathHandler:JSXPathHandler, actionHandler:JSXAction, parsedPath:string) {
    [this.pathHandler, this.actionHandler, this.parsedPath] = this.reg.get([PATH_HANDLER, ACTION_HANDLER, PARSED_PATH]);
  }
  

  private getStringProperties(currentIndex: number): {value: string, endIndex: number} {
    const nextQuoteIndex = this.findNextQuoteIndex(this.parsedPath[currentIndex], currentIndex);
    return {
      value: this.parsedPath.slice(currentIndex, nextQuoteIndex+1),
      endIndex: nextQuoteIndex
    }
  }

  private findNextQuoteIndex(quote: string, currentIndex: number): number {
    let nextQuoteIndex = this.parsedPath.indexOf(quote, currentIndex+1);
    if (this.parsedPath[nextQuoteIndex - 1] === '\\') {
      nextQuoteIndex = this.findNextQuoteIndex(quote, nextQuoteIndex);
    }
    return nextQuoteIndex;
  }

  
  getInstruction(subPath: string, startIndex: number): Instruction {
    let stringProperties = this.getStringProperties(this.pathHandler.getCurrentIndex());
    this.pathHandler.updateCurrentIndex(stringProperties.endIndex);

    return {
      type: STRINGS,
      subPath: stringProperties.value,
      startIndex,
      endIndex: stringProperties.endIndex,
      link: {}
    }
  }

  getAction(instruction: Instruction): Action {
    return this.actionHandler.create(STRINGS, {
      id: instruction.id,
      value: instruction.subPath.replace(/\'|\"/g, ''), 
      link: instruction.link, 
      subType: instruction.subType});
  }
}