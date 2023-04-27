import { PostfixStack } from "./Stack";

describe('Class PostfixStack', () => {
  describe('cache', () => {
    let stackInstance;
    
    describe('output() Given the passed in symbol is "[",', () => {
      beforeEach(() => {
        stackInstance = new PostfixStack();
        stackInstance.output.push({type: 'number', value: 1});
        stackInstance.cache.output('[');
      });

      it('it should create a new key and save set the parentOutput to the current output stack', () => {
        expect(stackInstance.parentOutput['[1']).toEqual([
          {type: 'number', value: 1}
        ]);
      });
      
      it('it should reset the current output stack', () => {
        expect(stackInstance.output).toEqual([]);
      });

      it('it should add teh symbol to the operators stack', () => {
        expect(stackInstance.operators).toEqual(['[1']);
      });
    });

    describe('restore()', () => {

    });

    describe('merge()', () => {
      let cacheId = '[1', numberOutput, stringOuput;
      beforeEach(() => {
        numberOutput = {type: 'number', value: 1};
        stringOuput = {type: 'string', value: 'abc'};
        stackInstance = new PostfixStack();
        stackInstance.parentOutput['[1'] = [numberOutput];
        stackInstance.output = [stringOuput];
      });

      it('Merges the parent and current stack and set it as the new current stack', () => {
        stackInstance.cache.merge('[1')
        expect(stackInstance.output).toEqual([
          numberOutput, stringOuput
        ]);
      });
    });

    // TODO: unit test arguments
    describe('argument()', () => {

      it('When argument stack is empty, do nothing', () => {

      });

    });
  })
});