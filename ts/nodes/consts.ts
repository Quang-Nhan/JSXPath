type tNodesConst = {
  SYMBOLS: {
    root: string,
    array: string,
    object: string,
    value: string,
    ao: string,
    na: string
  },
  KEYS: {
    id: number,
    depth: number,
    group: number,
    arrayPosition: number,
    name: number,
    value: number,
    valueType: number,
    links: number
  }
}

const nodesConst: tNodesConst = {
  SYMBOLS: {
    root: '{$r}',
    array: '{$a}',
    object: '{$o}',
    value: '{$v}',
    ao: '{$ao}',
    na: '_'
  },
  KEYS: {
    id: 0,
    depth: 1,
    group: 2,
    arrayPosition: 3,
    name: 4,
    value: 5,
    valueType: 6,
    links: 7
  }
};

export = nodesConst;