import { Nodes } from "./nodes/Nodes";
import { Json } from "./nodes/Json";
import { Processor } from "./evaluate/Processor";
import { Postfix } from "./path/Postfix";
import { tPathWithCallBack, tRunPathsInput } from "./types";
import { Functions } from './evaluate/Functions'
import { Variables } from "./evaluate/Variables";
import { TYPES } from "./consts";

export { nodesOps } from './Util'
export { KEYS } from './nodes/consts';
export { tStack, tPathWithCallBack, tRunPathsInput, tRunPathResult, eStackTypesObject, tNode } from './types';

/**
 * Given a list of objects containing path and callback function, 
 * for each object, run the defined path against the passed in json
 * and pass the result { path, value, error } into the callback function
 * 
 * @param paths tPathWithCallBack[]: list of objects at minimum contains 
 *    the path and callback "then" function
 * @param input tRunPathsInput: object containing the json, 
 *    and the optional custom functions and variables declarations
 */
export const runPaths = (paths: tPathWithCallBack[], {json, functions, variables}: tRunPathsInput) => {
  const caller = 'main';
  const nodesInstance = new Nodes();
  const functionInstance = new Functions(functions);
  const postfixInstance = new Postfix(caller, functionInstance);
  const nodes = nodesInstance.jsonToNodes(json, caller);
  const variablesInstance = new Variables({root: json, nodes}, variables);
  const processorInstance = new Processor(nodesInstance, variablesInstance, functionInstance);
  const toJsonInstance = new Json();
  variablesInstance.setInstances({ postfixInstance, processorInstance, toJsonInstance });
  
  paths.map((pathProp: tPathWithCallBack) => {
    if (pathProp.active === false) {
      return;
    }

    let error: string;
    let value = [];
    try {
      const postfixPath = postfixInstance.toPostfix(pathProp.path);
      processorInstance.processPostfixPath(postfixPath);
      const item = processorInstance.output.pop();
      if (item) {
        value = item.type !== TYPES.nodes ? item.value : toJsonInstance.reconstruct(item.value);
      }
    } catch (e) {
      error = `${e.message}${pathProp.scenario ? ` for the scenario:"${pathProp.scenario}"`: ` for path "${pathProp.path}"`}`;
    }
    
    pathProp.then({
      path: pathProp.path,
      description: pathProp.description,
      value,
      error
    });
  });
  processorInstance.reset();
}

/**
 * If path is a string, run it against the passed in json and return the result
 * 
 * If path is an object containing path and callback function, run the defined 
 * path against the passed in json and pass the result { path, value, error } 
 * into the callback function.
 * 
 * @param path String|tPathWithCallBack: a string path or an object at minimum contains 
 *    the path and callback "then" function
 * @param input tRunPathsInput: object containing the json, and the optional 
 *    custom functions and variables declarations
 * @returns JSON[] if path is a string
 */
export const runPath = (path: tPathWithCallBack | string, {json, functions, variables}: tRunPathsInput) => {
  const caller = 'main';
  const nodesInstance = new Nodes();
  const functionInstance = new Functions(functions);
  const postfixInstance = new Postfix(caller, functionInstance);
  const nodes = nodesInstance.jsonToNodes(json, caller);
  const variablesInstance = new Variables({root: json, nodes}, variables);
  const processorInstance = new Processor(nodesInstance, variablesInstance, functionInstance);
  const toJsonInstance = new Json();
  variablesInstance.setInstances({ postfixInstance, processorInstance, toJsonInstance });
  let error: string;
  let value = [];
  const useCallBackOption = typeof path === 'string' ? false : true;
  const pathString = useCallBackOption ? (path as tPathWithCallBack).path : path
  
  try {
    const postfixPath = postfixInstance.toPostfix(pathString as string);
    processorInstance.processPostfixPath(postfixPath);
    const item = processorInstance.output.pop();
    if (item) {
      value = item.type !== TYPES.nodes ? item.value : toJsonInstance.reconstruct(item.value);
    }
  } catch (e) {
    error = `${e.message} for path "${pathString}"`;
  }

  processorInstance.reset();
  if (useCallBackOption) {
    path = (path as tPathWithCallBack);
    path.then({
      path: path.path,
      value,
      error
    });
  } else {
    if (error) {
      throw new Error(error);
    }
    return value;
  }
};