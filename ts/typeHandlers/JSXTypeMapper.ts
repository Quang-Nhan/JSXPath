import { TYPE_HANDLERS, PARSED_PATH, PATH_HANDLER, INITIAL_PATH, PATH_SCENARIOS } from './../constants';
import { Instruction } from './../JSXInterfaces';
import { JSXPathHandler } from './../JSXPathHandler';
import { JSXPathScenarios } from '../JSXPathScenarios';
import InstructionMap from '../map/InstructionMap.json';
import { JSXRegistrar } from '../JSXRegistrar';
export class JSXTypeMapper {
  private initialPath: string;
  private PathScenarios: JSXPathScenarios;
  private TYPE_MAP: object = {};
  private ALL_TYPES: Array<string>;
  private INSTRUCTION_MAP: object = InstructionMap;
  private parsedPath: string;
  private pathHandler: JSXPathHandler;

  constructor(private reg:JSXRegistrar) {}

  init() {
    [this.TYPE_MAP, this.parsedPath, this.pathHandler, this.PathScenarios, this.initialPath] = this.reg.get(
      [TYPE_HANDLERS, PARSED_PATH, PATH_HANDLER, PATH_SCENARIOS, INITIAL_PATH]
    );
    this.ALL_TYPES = Object.keys(this.TYPE_MAP);
  }

  private getType(chars: string, prevInstruction?: Instruction): string {
    const nextTypeChecks = prevInstruction && this.INSTRUCTION_MAP.hasOwnProperty(prevInstruction.type) ? this.INSTRUCTION_MAP[prevInstruction.type]['$next'] : [];
    if (nextTypeChecks.length) {
      const type = nextTypeChecks.find(this.isMatchedType(chars))
      // if (!type) {
      //   throw new Error('Was expecting ' + chars + ' to be one of ' + nextTypeChecks.join(', '));
      // }
      return type;
    }
    return this.ALL_TYPES.find(this.isMatchedType(chars));
  }

  private isMatchedType(chars: string) {
    return (type: string) => this.PathScenarios.test(chars, this.pathHandler.getCurrentIndex())(type);
  }

  getTypeHandler(props: {subPath?:string, prevInstruction?:Instruction, type?:string}) {
    let {subPath, prevInstruction, type} = props;
    if (!type) {
      type = this.getType(subPath, prevInstruction);
    }
    return type && this.TYPE_MAP[type];
  }

  getPaths(): {parsedPath, initialPath} {
    return {
      parsedPath: this.parsedPath,
      initialPath: this.initialPath
    }
  }
}