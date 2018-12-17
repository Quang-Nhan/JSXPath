import { functionScenarios } from './FunctionScenarios';
import { ScenarioTester } from './ScenarioTester';

describe('FunctionScenarios()', () => {
  const scenarioTester = new ScenarioTester(functionScenarios);
  scenarioTester.execute();
});