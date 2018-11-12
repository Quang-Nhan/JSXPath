import { Scenario } from './JSXInterfaces';
import { JSXRegistrar } from './JSXRegistrar';
import { PARSED_PATH, GET_STATE } from './constants';

import { rootScenarios } from './scenarios/RootScenarios';
import { axesScenarios } from './Scenarios/AxesScenarios';
import { stringScenarios } from './Scenarios/StringScenarios';
import { functionScenarios } from './Scenarios/FunctionScenarios';
import { nodeScenarios } from './scenarios/NodeScenarios';
import { operatorScenarios } from './scenarios/OperatorScenarios';
import { numberScenarios } from './scenarios/NumberScenarios';
import { filterScenarios } from './scenarios/FilterScenarios';
import { groupingScenarios } from './scenarios/GroupingScenario';
import { booleanScenarios } from './scenarios/BooleanScenarios';
import { variableScenarios } from './scenarios/VariableScenarios';

export class JSXPathScenarios {
  private parsedPath: string;
  private scenarios: object;
  private getState: Function;

  constructor(private reg:JSXRegistrar) {}

  init() {
    [this.parsedPath, this.getState] = this.reg.get([PARSED_PATH, GET_STATE]);
    this.scenarios = {
      ROOT: rootScenarios,
      AXES: axesScenarios,
      FUNCTIONS: functionScenarios,
      STRINGS: stringScenarios,
      NODES: nodeScenarios,
      OPERATORS: operatorScenarios,
      NUMBERS: numberScenarios,
      FILTERS: filterScenarios,
      GROUPINGS: groupingScenarios,
      BOOLEAN: booleanScenarios,
      VARIABLES: variableScenarios
    }
  }
  private validate(subPath: string, scenarios: Array<Scenario>): boolean {
    return scenarios.some(scenario => {
      return scenario.hasOwnProperty('testScenario') && scenario.testScenario(subPath);
    });
  }

  test(subPath: string, currentIndex: number): Function {
    return scenarioType => {
      return this.scenarios.hasOwnProperty(scenarioType) && this.validate(subPath, this.scenarios[scenarioType](currentIndex, this.parsedPath, this.getState()));
    }
  }
}