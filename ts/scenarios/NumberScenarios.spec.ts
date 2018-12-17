import { numberScenarios } from './NumberScenarios';
import { ScenarioTester } from './ScenarioTester';

describe('NumberScenarios()', () => {
  const scenarioTester = new ScenarioTester(numberScenarios);
  scenarioTester.execute();
});