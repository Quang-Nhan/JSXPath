import { nodeScenarios } from './NodeScenarios';
import { ScenarioTester } from './ScenarioTester';

describe('NodeScenarios()', () => {
  const scenarioTester = new ScenarioTester(nodeScenarios);
  scenarioTester.execute();
});