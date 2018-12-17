

const helper = {
  types: {
    ARRAY: 'array',
    NULL: 'null',
    NODE: 'node',
    object: 'object',
    string: 'string',
    number: 'number',
    UNDEFINED: 'undefined',
    PRIMITIVE: 'primitive',
    ARRAY_UNKNOWN: 'unknown[]',
    ARRAY_NULL: 'null[]',
    ARRAY_NODE: 'node[]',
    ARRAY_PRIMITIVE: 'primitive[]'
  },
  parseType: (value) => {
    let type;
    if (Array.isArray(value)) {
      type = helper.types.ARRAY;
    } else if (value === null) {
      type = helper.types.NULL;
    } else if (typeof value === 'object' && helper.isNode(value)) {
      type = helper.types.NODE;
    } else if (['boolean', 'number', 'string'].includes(typeof value)) {
      type = helper.types.PRIMITIVE
    } else {
      type = helper.types[typeof value];
    }

    if (type === helper.types.ARRAY && value.length === 0) {
      type = helper.types.ARRAY_UNKNOWN;
    } else if (type === helper.types.ARRAY) {
      if (typeof value[0] === null) {
        type = helper.types.ARRAY_NULL;
      } else if (typeof value[0] === 'object' && helper.isNode(value[0])) {
        type = helper.types.ARRAY_NODE
      } else if (['boolean', 'number', 'string'].includes(typeof value[0])) {
        type = helper.types.ARRAY_PRIMITIVE;
      } else {
        type += '<' + typeof value[0] + '>'; //TODO unsupported yet
      }
    }
    return type;
  },
  isNode: (value) => {
    return value.hasOwnProperty('ancestorIds') && value.hasOwnProperty('childrenIds') && value.hasOwnProperty('descendantIds');
  },
  filterNodes: (nodes, againstValue) => {
    return nodes.filter(node => node.value === againstValue);
  },
  isEqual: (val1, val2) => {
    const val1Type = helper.parseType(val1), val2Type = helper.parseType(val2);
    if (val1Type !== val2Type) {
      return false;
    }
    // types are the same
    switch(val1Type) {
      case helper.types.object:
      return Object.keys(val1).length === Object.keys(val2).length && Object.keys(val1).every(vk => helper.isEqual(val1[vk], val1[vk]));
      case helper.types.NODE:
        return helper.isEqual(val1.value, val2.value);
      case helper.types.ARRAY_NODE:
      case helper.types.ARRAY_PRIMITIVE:
        return val1.length === val2.length && val1.every(({}, i) => helper.isEqual(val1[i], val2[i]));
      case helper.types.PRIMITIVE:
        return val1 === val2;
    }
  },

  getSingleValue: (value) => {
    const type = helper.parseType(value);
    if (type === helper.types.ARRAY_NODE) {
      return value[0].value
    }
    return value;
  }
}





export const tokens = {
  '+': (context) => (lhs, rhs, isFilter) => {
    lhs = helper.getSingleValue(lhs);
    rhs = helper.getSingleValue(rhs);

    return lhs + rhs;
  },
  '*': (context) => (lhs, rhs, isFilter) => {
    lhs = helper.getSingleValue(lhs);
    rhs = helper.getSingleValue(rhs);
    return lhs * rhs;
  },
  "<": (context) => (lhs,rhs, isFilter) => {
    let lhsType = helper.parseType(lhs), rhsType = helper.parseType(rhs);
    if (isFilter) {
      if (lhsType === helper.types.ARRAY_NODE && lhs.length === 1 && rhsType === helper.types.ARRAY_NODE && rhs.length === 1 && lhs[0].value < rhs[0].value || 
        (lhsType === helper.types.ARRAY_NODE && lhs[0].value < rhs || rhsType === helper.types.ARRAY_NODE && lhs < rhs[0].value) ||
        (lhsType === helper.types.NODE && lhs.value < rhs) ||
        (rhsType === helper.types.NODE && lhs < rhs.value) ||
        lhs < rhs
      ) {
          return context;
      }
      return;
    }
    return lhsType === helper.types.ARRAY_NODE && lhs.length === 1 && rhsType === helper.types.ARRAY_NODE && rhs.length === 1 && lhs[0].value < rhs[0].value ||
      (lhsType === helper.types.ARRAY_NODE && lhs[0].value < rhs || rhsType === helper.types.ARRAY_NODE && lhs < rhs[0].value) ||
      (lhsType === helper.types.NODE && lhs.value < rhs) ||
      (rhsType === helper.types.NODE && lhs < rhs.value) ||
      lhs < rhs;
  },
  "<=": (context) => (lhs,rhs, isFilter) => {
    let lhsType = helper.parseType(lhs), rhsType = helper.parseType(rhs);
    if (isFilter) {
      if (lhsType === helper.types.ARRAY_NODE && lhs.length === 1 && rhsType === helper.types.ARRAY_NODE && rhs.length === 1 && lhs[0].value < rhs[0].value || 
        (lhsType === helper.types.ARRAY_NODE && lhs[0].value <= rhs || rhsType === helper.types.ARRAY_NODE && lhs <= rhs[0].value) ||
        (lhsType === helper.types.NODE && lhs.value <= rhs) ||
        (rhsType === helper.types.NODE && lhs <= rhs.value) ||
        lhs <= rhs
      ) {
          return context;
      }
      return;
    }
    return lhsType === helper.types.ARRAY_NODE && lhs.length === 1 && rhsType === helper.types.ARRAY_NODE && rhs.length === 1 && lhs[0].value <= rhs[0].value ||
      (lhsType === helper.types.ARRAY_NODE && lhs[0].value <= rhs || rhsType === helper.types.ARRAY_NODE && lhs <= rhs[0].value) ||
      (lhsType === helper.types.NODE && lhs.value <= rhs) ||
      (rhsType === helper.types.NODE && lhs <= rhs.value) ||
      lhs <= rhs;
  },
  '>': (context) => (lhs, rhs, isFilter) => {
    let lhsType = helper.parseType(lhs), rhsType = helper.parseType(rhs);
    if (isFilter) {
      if (lhsType === helper.types.ARRAY_NODE && lhs.length === 1 && rhsType === helper.types.ARRAY_NODE && rhs.length === 1 && lhs[0].value > rhs[0].value || 
        (lhsType === helper.types.ARRAY_NODE && lhs[0].value > rhs || rhsType === helper.types.ARRAY_NODE && lhs > rhs[0].value) ||
        (lhsType === helper.types.NODE && rhsType === helper.types.NODE && lhs.value > rhs.value) ||
        (lhsType === helper.types.NODE && lhs.value > rhs) ||
        (rhsType === helper.types.NODE && lhs > rhs.value) ||
        lhs > rhs
      ) {
          return context;
      }
      return;
    }
    return lhsType === helper.types.ARRAY_NODE && lhs.length === 1 && rhsType === helper.types.ARRAY_NODE && rhs.length === 1 && lhs[0].value > rhs[0].value ||
      (lhsType === helper.types.ARRAY_NODE && lhs[0].value > rhs || rhsType === helper.types.ARRAY_NODE && lhs > rhs[0].value) ||
      (lhsType === helper.types.NODE && lhs.value > rhs) ||
      (rhsType === helper.types.NODE && lhs > rhs.value) ||
      lhs > rhs;
  },
  '>=': (context) => (lhs, rhs, isFilter) => {
    let lhsType = helper.parseType(lhs), rhsType = helper.parseType(rhs);
    if (isFilter) {
      if (lhsType === helper.types.ARRAY_NODE && lhs.length === 1 && rhsType === helper.types.ARRAY_NODE && rhs.length === 1 && lhs[0].value > rhs[0].value || 
        (lhsType === helper.types.ARRAY_NODE && lhs[0].value >= rhs || rhsType === helper.types.ARRAY_NODE && lhs >= rhs[0].value) ||
        (lhsType === helper.types.NODE && lhs.value >= rhs) ||
        (rhsType === helper.types.NODE && lhs >= rhs.value) ||
        lhs >= rhs
      ) {
          return context;
      }
      return;
    }
    return lhsType === helper.types.ARRAY_NODE && lhs.length === 1 && rhsType === helper.types.ARRAY_NODE && rhs.length === 1 && lhs[0].value >= rhs[0].value ||
      (lhsType === helper.types.ARRAY_NODE && lhs[0].value >= rhs || rhsType === helper.types.ARRAY_NODE && lhs >= rhs[0].value) ||
      (lhsType === helper.types.NODE && lhs.value >= rhs) ||
      (rhsType === helper.types.NODE && lhs >= rhs.value) ||
      lhs >= rhs;
  },
  '=': (context) => (lhs, rhs, isFilter) => {
    if (isFilter) {
      let lhsType = helper.parseType(lhs), rhsType = helper.parseType(rhs);
      if (lhsType === helper.types.NODE) {
        lhs = [lhs];
        lhsType = helper.types.ARRAY_NODE;
      }
      if (rhsType === helper.types.NODE) {
        rhs = [rhs];
        rhsType = helper.types.ARRAY_NODE;
      }
      
      if (lhsType === helper.types.ARRAY_NODE && rhsType === helper.types.ARRAY_NODE) {
        return lhs.filter(lhsNode => rhs.find(rhsNode => {
          return rhsNode.siblingIds.includes(lhsNode.id) && helper.isEqual(lhsNode, rhsNode);
        }));
      }
      if (
        lhsType === helper.types.ARRAY_NODE && helper.filterNodes(lhs, rhs).length || 
        rhsType === helper.types.ARRAY_NODE && helper.filterNodes(rhs, lhs).length
      ) {
        return context;
      }
    } else {
      return helper.isEqual(lhs, rhs);
    }
  },
  'div': (context) => (lhs, rhs, isFilter) => {
    const lhsType = helper.parseType(lhs);
    const rhsType = helper.parseType(rhs);
    if (lhsType === helper.types.ARRAY_NODE && lhs.length === 1 && rhsType === helper.types.ARRAY_NODE && rhs.length === 1) {
      return lhs[0].value / rhs[0].value;
    } else if (lhsType === helper.types.ARRAY_NODE) {
      return lhs[0].value / rhs;
    } else if (rhsType === helper.types.ARRAY_NODE) {
      return lhs / rhs[0].value;
    }
    return lhs/rhs;
  },
  'or': (context) => (lhs, rhs, isFilter) => {
    if (isFilter) {
      let finalList = [];
      if (lhs) {
        finalList = finalList.concat(lhs);
      }
      if (rhs) {
        finalList = finalList.concat(rhs);
      }
      return finalList.length ? finalList : null;
    }
    return lhs || rhs;
  },
  'and': (context) => (lhs, rhs, isFilter) => {
    return isFilter ? (lhs && (Array.isArray(lhs) ? lhs.length : true) && rhs && (Array.isArray(rhs) ? rhs.length : true)) : lhs && rhs;
  }
}
