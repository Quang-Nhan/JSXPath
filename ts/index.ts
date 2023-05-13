
import { tPathWithCallBack, tRunPathsInput } from "./types";
import { RunPath } from "./RunPath";
export { nodesOps } from './Util'
export { KEYS } from './nodes/consts';
export { tStack, tPathWithCallBack, tRunPathsInput, tRunPathResult, eStackTypesObject, tNode, tNodesState } from './types';

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
export const runPaths = (paths: tPathWithCallBack[], inputs: tRunPathsInput) => {
  const runPathInstance = new RunPath(inputs);
  paths.map((pathProp: tPathWithCallBack) => {
    if (pathProp.active === false) {
      return;
    }
    runPathInstance.callbackMode(pathProp);
  });
  runPathInstance.reset();
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
export const runPath = (path: tPathWithCallBack | string, inputs: tRunPathsInput) => {
  const runPathInstance = new RunPath(inputs);
  const useCallBackOption = typeof path === 'string' ? false : true;

  if (useCallBackOption) {
    runPathInstance.callbackMode(path as tPathWithCallBack);
    runPathInstance.reset();
  } else {
    const result = runPathInstance.stringPathMode(path as string);
    runPathInstance.reset();
    return result;
  }
};
