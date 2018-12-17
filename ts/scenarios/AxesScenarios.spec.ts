import { axesScenarios } from './AxesScenarios';
import { ScenarioTester } from './ScenarioTester';

describe('AxesScenarios()', () => {
  const scenarioTester = new ScenarioTester(axesScenarios);
  scenarioTester.execute();
});