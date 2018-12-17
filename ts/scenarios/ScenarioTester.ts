import { Scenario } from '../JSXInterfaces';
import { JSXOperators } from '../typeHandlers/JSXOperators';
import { JSXFunctions } from '../typeHandlers/JSXFunctions';
import { JSXAxes } from '../typeHandlers/JSXAxes';

export class ScenarioTester {
  private scenarioLength: number;
  private testScenarios;
  constructor(private scenarioHandler){
    let handlers: any[] = [
      new JSXOperators(undefined),
      new JSXFunctions(undefined),
      new JSXAxes(undefined)
    ]
    handlers.forEach(handler => {
      handler.initStaticValues();
    });
    const scenarios = this.scenarioHandler();
    this.testScenarios = scenarios.map((scenario, index) => {
      return {
        index,
        scenarioDescription: scenario.description,
        testCases: scenario.testCases
      }
    });
  }

  execute() {
    this.testScenarios.forEach(testScenario => {
      describe(testScenario.scenarioDescription, () => {
        testScenario.testCases.forEach(testCase => {
          const {currentIndex, parsedPath, state, chars} = testCase.inputs;
          const scenarios = this.scenarioHandler(currentIndex, parsedPath, state);
          it(testCase.description, () => {
            expect(scenarios[testScenario.index].testScenario(chars)).toEqual(testCase.expectedResult);
          })
        });
      });
    });
  }
}