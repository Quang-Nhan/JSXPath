import { tStack, tStackMix, tStackOperator, tStackParent } from "../types";

/**
 * Manages the postfix conversion process, handling operator precedence,
 * and caching intermediate results during the conversion from infix to postfix notation.
 */
export class PostfixStack {
  /**
   * Stack for operators during postfix conversion.
   */
  public operators: tStackOperator[];
  /**
   * Output stack for the postfix expression.
   */
  public output: tStackMix[];
  /**
   * Stores previous output stacks for caching.
   */
  public parentOutput: tStackParent;
  /**
   * Stores arguments for functions or predicates.
   */
  public arguments: { [key: string]: any[] };
  private outputIndex = 0;
  
  /**
   * Initializes a new instance of the PostfixStack.
   */
  constructor() {
    this.operators = [];
    this.output = [];
    this.parentOutput = {};
    this.arguments = {};
  };

  /**
   * Resets all properties of the stack to their initial empty states.
   */
  public reset() {
    this.operators = [];
    this.output = [];
    this.arguments = {};
    this.parentOutput = {};
    this.outputIndex = 0;
  };

  /**
   * Provides caching mechanisms for managing the output stack during complex operations
   * like function calls, predicates, and groupings.
   */
  public cache = {
    /**
     * Caches the current output stack and resets it for a new sub-expression.
     * Used when encountering symbols like '(' or '['.
     * @param symbol The symbol triggering the cache operation (e.g., '(', '[').
     * @returns The generated cache ID.
     */
    output: (symbol: string) => {
      const id = symbol + ++this.outputIndex;
      this.parentOutput[id] = [...this.output];
      this.output = [];
      this.operators.push(id);
      this.arguments[id] = [];
      return id;
    },
    /**
     * Restores a cached output stack and processes the results of a sub-expression.
     * Used after completing a function call or predicate.
     * @param cacheId The ID of the cached stack to restore.
     * @param type Optional. The type of the sub-expression (e.g., 'function') if it's a function call.
     */
    restore: (cacheId: string, type?: tStack['type']) => {
      const currentStack = this.output;
      this.output = this.parentOutput[cacheId];
      if (type) {
        this.output.push({type, value: this.arguments[cacheId]});
        delete this.arguments[cacheId];
      } else {
        //@ts-ignore TODO
        this.output.push(currentStack)
      }
      delete this.parentOutput[cacheId];
    },
    /**
     * Merges a cached output stack with the current output stack.
     * Used by groupings (e.g., '()').
     * @param cacheId The ID of the cached stack to merge.
     */
    merge: (cacheId: string) => {
      const currentStack = this.output;
      this.output = [...this.parentOutput[cacheId], ...currentStack];
      delete this.parentOutput[cacheId];
    },
    /**
     * Stores the current output stack as an argument for a cached sub-expression.
     * Used for collecting arguments within function calls or predicates.
     * @param cacheId The ID of the cache entry to store the argument in.
     */
    argument: (cacheId: string) => {
      if (this.output.length) {
        this.arguments[cacheId].push(this.output.length > 1 ? this.output : this.output[0]);
        this.output = [];
      }
    }
  };
}