import { KEYS, SYMBOLS } from "../nodes/consts";
import { opFunc, throwError } from "../Util";
import { TYPES } from "../consts";
import { tFunctions, tStack } from "../types";

export class Functions {
  private contextProperties = {
    lastIndex: null,
    firstIndex: null,
    index: null,
    current: null,
    isLast: false,
    isFirst: false,
    isFilterMode: false
  };

  private f: tFunctions = {
    abs: (arg: tStack) => {
      const value = opFunc.getValueByType(this.getContext('abs'), [TYPES.number], arg);
      return {
        type:  TYPES.number,
        value: Math.abs(value)
      };
    },
    boolean:(arg: tStack) => {
      return {
        type: TYPES.boolean,
        value: arg.type === TYPES.nodes ? !!arg.value.length : !!arg.value
      }
    },
    ceiling:(arg: tStack): tStack => {
      const value = opFunc.getValueByType(this.getContext('ceiling'), [TYPES.number], arg);
      return {
        type: TYPES.number,
        value: Math.ceil(value)
      };
    },
    choose: (testStackItem: tStack, trueItem: tStack, falseItem: tStack) => {
      return (testStackItem.type === TYPES.nodes && testStackItem.value.length || !!testStackItem.value) ? trueItem : falseItem;
    },
    concat:(...args: tStack[]) => {
      return {
        type: TYPES.string,
        value: args.map(a => {
          return this.f['string'](a).value;
        }).join('')
      };
    },
    contains: (search: tStack, searchFor: tStack) => {
      const searchString = opFunc.getValueByType(this.getContext('substring-before'), ['string'], search);
      const searchForString = opFunc.getValueByType(this.getContext('substring-before'), ['string'], searchFor);

      return {
        type: TYPES.boolean,
        value: searchString.includes(searchForString)
      }
    },
    count: (item: tStack) => {
      return {
        type: TYPES.number,
        value: item ? (item.type === TYPES.nodes ? item.value.length : 1) : 0
      }
    },
    false: () => {
      return {
        type: TYPES.boolean,
        value: false
      }
    },
    first: () => {
      return {
        type: TYPES.number,
        value: this.contextProperties.firstIndex
      }
    },
    floor:(arg: tStack): tStack => {
      const value = opFunc.getValueByType(this.getContext('floor'), [TYPES.number], arg);
      return {
        type: TYPES.number,
        value: Math.floor(value)
      };
    },
    last: () => {
      return {
        type: TYPES.number,
        value: this.contextProperties.lastIndex
      }
    },
    'local-name': (item?: tStack) => {
      return this.f.name(item);
    },
    // for now name and local-name is identical
    name: (item?: tStack) => {
      let value = '';
      if (item && item.type === TYPES.nodes && item.value.length) {
        if (item.value[0][KEYS.name] !== SYMBOLS.root) {
          value = item.value[0][KEYS.name];
        };
      } else if (this.contextProperties.current) {
        value = this.contextProperties.current[KEYS.name];
      }
      return {
        type: TYPES.string,
        value
      };
    },
    not: (item: tStack) => {
      opFunc.validate.exists(item, this.getContext('not'));
      return {
        type: TYPES.boolean,
        value: !this.f.boolean(item).value
      };
    },
    number:(arg: tStack): tStack => {
      const value = opFunc.getValueByType(this.getContext('number'), [TYPES.number, TYPES.string, TYPES.boolean], arg);
      return {
        type: TYPES.number,
        value: Number(value)
      };
    },
    round:(arg: tStack) => {
      const value = opFunc.getValueByType(this.getContext('round'), [TYPES.number], arg);
      return {
        type: TYPES.number,
        value: Math.round(value)
      };
    },
    // converts the number or node into a string
    string: (arg: tStack): tStack => {
      return {
        type: TYPES.string,
        value: String(opFunc.getValueByType(this.getContext('string'), [TYPES.string, TYPES.number, TYPES.boolean], arg))
      };
    },
    'substring-before': (search: tStack, searchFor: tStack) => {
      const searchString = opFunc.getValueByType(this.getContext('substring-before') + '(first argument)', ['string'], search);
      const searchForString = opFunc.getValueByType(this.getContext('substring-before') + '(second argument)', ['string'], searchFor);
      const startIndex = searchString.indexOf(searchForString);
      return {
        type: TYPES.string,
        value: startIndex > 0 ? searchString.substring(0, startIndex) : ''
      };
    },
    'substring-after': (search: tStack, searchFor: tStack) => {
      const searchString = opFunc.getValueByType(this.getContext('substring-after') + '(first argument)', ['string'], search);
      const searchForString = opFunc.getValueByType(this.getContext('substring-after') + '(second argument)', ['string'], searchFor);
      const startIndex = searchString.indexOf(searchForString);
      return {
        type: TYPES.string,
        value: startIndex > 0 ? searchString.substring(startIndex+searchForString.length) : ''
      };
    },
    sum: (item: tStack) => {
      opFunc.validate.areNumbers(item, this.getContext('sum'));
      return {
        type: TYPES.number,
        value: item.value.reduce((r, node) => {
          r += node[KEYS.value];
          return r;
        }, 0)
      };
    },
    true: () => {
      return {
        type: TYPES.boolean,
        value: true
      }
    }
  };

  private pr = {
    setContextProperties: (props) => {
      this.contextProperties.isFilterMode = props?.isFilterMode;
      this.contextProperties.lastIndex = props?.lastIndex;
      this.contextProperties.firstIndex = props?.firstIndex;
      this.contextProperties.current = props?.current;
      this.contextProperties.index = props?.index;
      this.contextProperties.isLast = props?.index === props?.lastIndex || false;
      this.contextProperties.isFirst = props?.index === props?.firstIndex || false;
    }
  };

  private mergedF: tFunctions;

  private prSequence: Function[];

  private mergeCustomFunction(customFunctions?: tFunctions) {
    if (!customFunctions) {
      this.mergedF = this.f;
      return;
    }

    this.mergedF = {
      ...this.f,
      ...customFunctions
    };
  };

  private getContext(operator: string): string {
    return `Functions[${operator}]`
  };

  constructor(customFunctions?: tFunctions) {
    this.mergeCustomFunction(customFunctions);
    // prerun, called each time before 
    this.prSequence = [
      this.pr.setContextProperties
    ];
  };

  public preRun(props) {
    for (const [i, f] of this.prSequence.entries()) {
      f(props);
    }
  };

  public run(fName, fArgs): tStack {
    if (!this.mergedF[fName]) {
      throwError(this.getContext(fName), `function "${fName}" does not exists`)
    }
    return this.mergedF[fName].apply(this, fArgs);
  };

  public getFunctionNames() {
    return Object.keys(this.mergedF);
  };
};
