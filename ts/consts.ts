import { tConsts, eStackTypesObject } from "./types";

const operators = {
  UNION: '|',
  PLUS: '+',
  MINUS: '-',
  MOD: 'mod',
  MULTIPLY: '*',
  DIVIDE: 'div',
  LESS_THAN: '<',
  LESS_THAN_OR_EQUAL_TO: '<=',
  GREATER_THAN: '>',
  GREATER_THAN_OR_EQUAL_TO: '>=',
  EQUAL_TO: '=',
  NOT_EQUAL_TO: '!=',
  NOT: 'not(',
  AND: 'and',
  OR: 'or'
};

const operatorsByLength = {
  1: [
    operators.UNION,
    operators.PLUS,
    operators.MINUS,
    operators.MULTIPLY,
    operators.LESS_THAN,
    operators.GREATER_THAN,
    operators.EQUAL_TO,
  ],
  2: [
    operators.LESS_THAN_OR_EQUAL_TO,
    operators.GREATER_THAN_OR_EQUAL_TO,
    operators.NOT_EQUAL_TO,
    operators.OR
  ],
  3: [
    operators.AND,
    operators.DIVIDE,
    operators.AND,
  ],
  4: [
    operators.NOT
  ]
}

const Consts: tConsts = {
  AXES: [
    'ancestor::',
    'ancestor-or-self::',
    'child::',
    'sibling::',
    'descendant::',
    'descendant-or-self::',
    'parent::',
    'self::',
    '/',
    '//',
    '..'
  ],
  OPERATORS: {
    byName: operators,
    byLength: operatorsByLength,
    values: [
      '|',
      '+',
      '-',
      'mod',
      '*',
      'div',
      '<',
      '<=',
      '>',
      '>=',
      '=',
      '!=',
      'not(',
      'and',
      'or'
    ]
  },
  OPERATOR_PRECEDENCE: [
    [ '*', 'div', 'mod' ],
    [ '+', '-' ],
    [ '<', '<=', '>', '>=', ],
    [ '=', '!=', ],
    [ '|' ],
    [ 'and' ],
    [ 'or' ],
    [ 'not(' ]
  ],
  GROUPINGS: {
    LEFT_GROUPING: '(',
    RIGHT_GROUPING: ')'
  },
  FILTERS: {
    LEFT_FILTER: '[',
    RIGHT_FILTER: ']'
  },
  TYPES: eStackTypesObject
};

export = Consts