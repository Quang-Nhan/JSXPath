import { filterScenarios } from './FilterScenarios';
import { ScenarioTester } from './ScenarioTester';

describe('FilterScenarios()', () => {
  const scenarioTester = new ScenarioTester(filterScenarios);
  scenarioTester.execute();
});