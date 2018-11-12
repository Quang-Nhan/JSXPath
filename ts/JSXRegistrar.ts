import { JSXAxes } from "./typeHandlers/JSXAxes";
import { JSXPathHandler } from "./JSXPathHandler";
import { JSXFilters } from "./typeHandlers/JSXFilters";
import { JSXFunctions } from "./typeHandlers/JSXFunctions";
import { JSXGroupings } from "./typeHandlers/JSXGroupings";
import { JSXNodes } from "./typeHandlers/JSXNodes";
import { JSXNumbers } from "./typeHandlers/JSXNumbers";
import { JSXOperators } from "./typeHandlers/JSXOperators";
import { JSXRoot } from "./typeHandlers/JSXRoot";
import { JSXString } from "./typeHandlers/JSXString";
import { JSXVariables } from "./typeHandlers/JSXVariables";
import { JSXAction } from "./JSXAction";
import { JSXReplacer } from "./JSXReplacer";

import { precendence } from "./enums/precedence";
import { JSXTypeMapper } from "./typeHandlers/JSXTypeMapper";
import { JSXState } from "./state/JSXState";
import { JSXProcessor } from "./JSXProcessor";
import { JSXPathScenarios } from "./JSXPathScenarios";
import { RegistrarCache } from './JSXInterfaces';
import { INPUT_ADDED } from "./constants";
import { JSXEndOfFile } from "./typeHandlers/JSXEndOfFile";
import { generateId, createLink } from "./typeHandlers/helper";
import { JSXErrors } from "./typeHandlers/JSXErrors";
import { JSXBoolean } from "./typeHandlers/JSXBooleans";




export class JSXRegistrar {
  private cache: RegistrarCache;
  private replacer: JSXReplacer = new JSXReplacer();
  static instance;

  constructor() {
    if (!JSXRegistrar.instance) {
      this.cache = {
        typeHandlers: {
          AXES: new JSXAxes(this),
          FILTERS: new JSXFilters(this),
          FUNCTIONS: new JSXFunctions(this),
          GROUPINGS: new JSXGroupings(this),
          NODES: new JSXNodes(this),
          NUMBERS: new JSXNumbers(this),
          OPERATORS: new JSXOperators(this),
          ROOT: new JSXRoot(this),
          STRINGS: new JSXString(this),
          VARIABLES: new JSXVariables(this),
          EOF: new JSXEndOfFile(this),
          ERROR: new JSXErrors(this),
          BOOLEAN: new JSXBoolean(this)
        },
        coreHandlers: {
          pathHandler: new JSXPathHandler(this),
          pathScenarios: new JSXPathScenarios(this),
          actionHandler: new JSXAction(this),
          processor: new JSXProcessor(this),
          typeMapper: new JSXTypeMapper(this)
        },
        stateHandler: new JSXState(this),
        helpers: {
          dispatch: null,
          generateId,
          createLink,
          getState: null
        },
        enums: {
          precedence: precendence
        }
      };
      this.cache.helpers.dispatch = this.cache.stateHandler.dispatch.bind(this.cache.stateHandler);
      this.cache.helpers.getState = this.cache.stateHandler.getState.bind(this.cache.stateHandler);
      JSXRegistrar.instance = this;
    }
    return JSXRegistrar.instance;
  }
  
  setInputData(data: {json?: any, path: string, variables?: object}) {
    const parsedPath = this.replacer.replace(data.path, [
      this.cache.typeHandlers.AXES.getMap(),
      this.cache.typeHandlers.FUNCTIONS.getMap()
    ]);
    const extraData = {
      id: Math.random() % 1000,
      parsedPath,
      currentIndex: 0,
      pathLength: parsedPath.length,
      variables: data.variables
    };
    this.cache.stateHandler.init();
    this.cache.stateHandler.dispatch(this.cache.coreHandlers.actionHandler.create(INPUT_ADDED, {value: Object.assign({}, data, extraData)}))
    for (let handler in this.cache.typeHandlers) {
      this.cache.typeHandlers[handler].init();
    }
    for (let core in this.cache.coreHandlers) {
      this.cache.coreHandlers[core].init();
    }
  }

  get(names: Array<string>):Array<any> {
    const self = this;
    return names.map(name => {
      if (self.cache.hasOwnProperty(name)) {
        return self.cache[name];
      } else if (self.cache.typeHandlers.hasOwnProperty(name)) {
        return self.cache.typeHandlers[name];
      } else if (self.cache.coreHandlers.hasOwnProperty(name)) {
        return self.cache.coreHandlers[name];
      } else if (self.cache.enums.hasOwnProperty(name)) {
        return self.cache.enums[name];
      } else if (self.cache.helpers.hasOwnProperty(name)) {
        return self.cache.helpers[name];
      } else {
        const inputValue = this.cache.stateHandler.getState().inputs;
        if (inputValue && inputValue.hasOwnProperty(name)) {
          return inputValue[name];
        } else {
          throw new Error('Handlers does not exists: ' + name);
        }
      }
    });
  }
}