import { operators } from "./operators";
import { groupings } from "./groupings";
import { filters } from "./filters";

// https://msdn.microsoft.com/en-us/library/ms256074(v=vs.110).aspx
// export const precedence = [
//   [
//     groupings.LEFT_GROUPING,
//     groupings.RIGHT_GROUPING,
//   ],
//   [
//     filters.LEFT_FILTER,
//     filters.RIGHT_FILTER
//   ],
//   [
//     operators.CHILD,
//     operators.DESCENDANT_OR_SELF,
//   ],
//   [
//     operators.LESS_THAN,
//     operators.LESS_THAN_OR_EQUAL_TO,
//     operators.GREATER_THAN,
//     operators.GREATER_THAN_OR_EQUAL_TO,
//   ],
//   [
//     operators.EQUAL_TO,
//     operators.NOT_EQUAL_TO,
//   ],
//   [
//     operators.UNION
//   ],
//   [
//     operators.NOT
//   ],
//   [
//     operators.AND
//   ],
//   [
//     operators.OR
//   ]
// ]




export const precendence = {
  OPERATORS: [
    [
      operators.LESS_THAN,
      operators.LESS_THAN_OR_EQUAL_TO,
      operators.GREATER_THAN,
      operators.GREATER_THAN_OR_EQUAL_TO,
    ],
    [
      operators.EQUAL_TO,
      operators.NOT_EQUAL_TO,
    ],
    [
      operators.UNION
    ],
    [
      operators.MULTIPLY, operators.DIVIDE, operators.MOD
    ],
    [
      operators.PLUS, operators.MINUS
    ],
    [
      operators.NOT
    ],
    [
      operators.AND
    ],
    [
      operators.OR
    ]
  ]
}