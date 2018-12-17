import { stringScenarios } from './StringScenarios';
import { ScenarioTester } from './ScenarioTester';

describe('StringScenarios()', () => {
  const scenarioTester = new ScenarioTester(stringScenarios);
  scenarioTester.execute();
});