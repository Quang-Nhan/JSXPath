import { JSXNodes } from "../typeHandlers/JSXNodes";


export const tokens = {
  '.': ({}, nodes) => {
    return nodes;
  },
  '/': (nodeHandler:JSXNodes, nodes) => {
    return nodeHandler.getChildrenNodes(nodes);
  },
  '//': (nodeHandler:JSXNodes, nodes) => {
    return nodeHandler.getDescendantNodes(nodes);
  },
  'child::': (nodeHandler:JSXNodes, nodes) => {
    return nodeHandler.getChildrenNodes(nodes);
  },
  'parent::': (nodeHandler:JSXNodes, nodes) => {
    return nodeHandler.getParentNodes(nodes);
  },
  'ancestor::': (nodeHandler:JSXNodes, nodes) => {
    return nodeHandler.getAncestorNodes(nodes);
  },
  'ancestorOrSelf::': (nodeHandler:JSXNodes, nodes) => {
    return nodeHandler.getAncestorOrSelfNodes(nodes);
  },
  'descendant::': (nodehandler:JSXNodes, nodes) => {
    return tokens['//'](nodehandler, nodes);
  },
  'descendantOrSelf::': (nodeHandler:JSXNodes, nodes) => {
    return nodeHandler.getDescendantOrSelfNodes(nodes);
  }
};