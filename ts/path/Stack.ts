import { tStack, tStackMix, tStackOperator, tStackParent } from "../types";


export class PostfixStack {
  public operators: tStackOperator[];
  public output: tStackMix[];
  public parentOutput: tStackParent;
  public arguments;
  private outputIndex = 0;
  
  constructor() {
    this.operators = [];
    this.output = [];
    this.parentOutput = {};
    this.arguments = {};
  };

  public reset() {
    this.operators = [];
    this.output = [];
    this.arguments = {};
    this.parentOutput = {};
    this.outputIndex = 0;
  };

  public cache = {
    output: (symbol: string) => {
      const id = symbol + ++this.outputIndex;
      this.parentOutput[id] = this.output;
      this.output = [];
      this.operators.push(id);
      this.arguments[id] = [];
    },
    // optional type is used by functions otherwise used by predicate
    restore: (cacheId: string, type?: tStack['type']) => {
      const currentStack = this.output;
      this.output = this.parentOutput[cacheId];
      if (type) {
        this.output.push({type, value: this.arguments[cacheId]});
      } else {
        //@ts-ignore TODO
        this.output.push(currentStack)
      }
      delete this.parentOutput[cacheId];
    },
    // used by groupings
    merge: (cacheId: string) => {
      const currentStack = this.output;
      this.output = [...this.parentOutput[cacheId], ...currentStack];
      delete this.parentOutput[cacheId];
    },
    argument: (cacheId: string) => {
      if (this.output.length) {
        this.arguments[cacheId].push(this.output.length > 1 ? this.output : this.output[0]);
        this.output = [];
      }
    }
  };
}