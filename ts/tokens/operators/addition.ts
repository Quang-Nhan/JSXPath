import { OPERATORS, PLUS } from "../../constants";

export class Plus {
  token = '+';
  name = PLUS;
  type = OPERATORS;

  constructor() {}


  

  execute(lhs, rhs) {
    // TODO type checks
    return lhs + rhs;
  }
}