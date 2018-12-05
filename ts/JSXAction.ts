import {
  Action,
  ActionHistory,
  Node
} from './JSXInterfaces';
import { JSXRegistrar } from './JSXRegistrar';

export class JSXAction {

  constructor(private reg:JSXRegistrar) {
  }

  init() {

  }

  create(type:string, data: {nodes?:Node[], value?:any, id?:number, link?:object, token?:string, subType?:string, contextIndex?:number}): Action {
    const actionPayload = {
      type,
      payload: data
    };
    return actionPayload;
  }
}