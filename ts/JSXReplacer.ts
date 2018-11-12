/**
 * A simple replace utility given a list of maps
 */
export class JSXReplacer {

  replace(path:string, mapList:Array<object>):string {
    let newPath = path;
    mapList.forEach(map => {
      newPath = this.processReplacement(newPath, map);
    });
    return newPath;
  }

  private processReplacement(path: string, map: object): string {
    let newPath = path;
    for (const term in map) {
      newPath = this.findAndReplace(newPath, term, map[term]);
    }
    return newPath;
  }

  private findAndReplace(path:string, term:string, value):string {
    return path.replace(term, value);
  }
}