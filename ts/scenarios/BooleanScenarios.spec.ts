import { booleanScenarios } from './BooleanScenarios';
import { ScenarioTester } from './ScenarioTester';

describe('BooleanScenarios()', () => {
  const scenarioTester = new ScenarioTester(booleanScenarios);
  scenarioTester.execute();
});