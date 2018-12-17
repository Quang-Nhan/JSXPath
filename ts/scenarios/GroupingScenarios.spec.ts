import { groupingScenarios } from './GroupingScenarios';
import { ScenarioTester } from './ScenarioTester';

describe('GroupingScenarios()', () => {
  const scenarioTester = new ScenarioTester(groupingScenarios);
  scenarioTester.execute();
});