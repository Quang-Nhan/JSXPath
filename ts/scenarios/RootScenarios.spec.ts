import { rootScenarios } from './RootScenarios';
import { ScenarioTester } from './ScenarioTester';

describe('RootScenarios()', () => {
  const scenarioTester = new ScenarioTester(rootScenarios);
  scenarioTester.execute();
});