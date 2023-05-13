import { tJSON, tNode } from "../types";
import { KEYS, SYMBOLS } from "./consts";
import { nodesOps } from "../Util";

export class Json {
  constructor() {}
  public reconstruct = (nodes: tNode[]): tJSON => {
    return nodes.map((node) => {
      if (!nodesOps.tests.exists(node[KEYS.id])) {
        return;
      } else if (node[KEYS.value] === SYMBOLS.array) {
        return this.build.array(node);
      } else if (node[KEYS.value] === SYMBOLS.object) {
        return this.build.object(node);
      } else {
        return node[KEYS.value];
      }
    });
  };

  private build = {
    array: (node: tNode) => {
      const childrenNodes = nodesOps.get.children(node);
      if (!childrenNodes.length) {
        return [];
      }
      const result = [];
      
      childrenNodes.forEach((c) => {
        if (c[KEYS.group] !== SYMBOLS.na && result[c[KEYS.arrayPosition]] === undefined) {
          result[c[KEYS.arrayPosition]] = {};
        }
        
        let value = c[KEYS.value];
        if (value === SYMBOLS.array) {
          value = this.build.array(c);
        } else if (value === SYMBOLS.object) {
          value = this.build.object(c)
        }
  
        if (this.isValidKey(c[KEYS.name])) {
          result[c[KEYS.arrayPosition]][c[KEYS.name]] = value;
        } else {
          result[c[KEYS.arrayPosition]] = value;
        }
      });
      return result;
    },
    object: (node: tNode) => {
      const childrenNodes = nodesOps.get.children(node);
      if (!childrenNodes.length) {
        return {};
      }
      const result = {};
      childrenNodes.forEach(node => {
        const value = node[KEYS.value];
        if (value === SYMBOLS.array) {
          result[node[KEYS.name]] = this.build.array(node);
        } else if (value === SYMBOLS.object) {
          result[node[KEYS.name]] = this.build.object(node);
        } else {
          result[node[KEYS.name]] = value;
        }
      });
      return result;
    },
  }

  private isValidKey = (key) => {
    return !Object.values(SYMBOLS).includes(key);
  }
};