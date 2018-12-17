import { operatorScenarios } from './OperatorScenarios';
import { ScenarioTester } from './ScenarioTester';

describe('OperatorScenarios()', () => {
  const scenarioTester = new ScenarioTester(operatorScenarios);
  scenarioTester.execute();
});