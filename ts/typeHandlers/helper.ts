import { Instruction } from "../JSXInterfaces";

export const findMatchingCharacterIndex = (leftChar: string, rightChar: string, currentIndex: number, parsedPath: string) => {
  let index = currentIndex + 1;
  let crement = 1;

  for (; index < parsedPath.length && crement !== 0; ++index) {
    if (parsedPath[index] === leftChar) {
      ++crement;
    } else if (parsedPath[index] === rightChar) {
      --crement;
    }
  }
  return crement === 0 ? index : -1;
}


export const createLink = (instruction: Instruction) => { return { relatedId: instruction.id, relatedType: instruction.type }; }
export const generateId = () => Math.floor(Math.random()*(99999 - 10001) + 10000);