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

      it('it should initialize arguments for the cache ID to an empty array', () => {
        expect(stackInstance.arguments['[1']).toEqual([]);
      });
    });

    describe('restore()', () => {
      let cacheId;
      let numberOutput;
      let stringOutput;

      beforeEach(() => {
        numberOutput = { type: 'number', value: 1 };
        stringOutput = { type: 'string', value: 'abc' };
      });

      describe('Case 1: With `type` parameter (function call scenario)', () => {
        beforeEach(() => {
          stackInstance = new PostfixStack(); // Reset stack for each test
          stackInstance.output.push({ type: 'boolean', value: true }); // This should be in parentOutput
          cacheId = stackInstance.cache.output('('); // Simulate function call
          stackInstance.arguments[cacheId] = [[numberOutput, stringOutput]];
          // At this point, stackInstance.output should be [], and stackInstance.parentOutput[cacheId] should contain the boolean object.
          stackInstance.cache.restore(cacheId, 'function');
        });

        it('should restore the output from parentOutput', () => {
          expect(stackInstance.output[0]).toEqual({ type: 'boolean', value: true });
        });

        it('should push a new object representing the function call to the output', () => {
          expect(stackInstance.output[1]).toEqual({
            type: 'function',
            value: [[numberOutput, stringOutput]] // arguments[cacheId] is an array of arrays
          });
        });

        it('should delete the cache entry from parentOutput', () => {
          expect(stackInstance.parentOutput[cacheId]).toBeUndefined();
        });

        it('should delete the arguments entry', () => {
          // The arguments should be deleted after being used.
          expect(stackInstance.arguments[cacheId]).toBeUndefined();
        });
      });

      describe('Case 2: Without `type` parameter (predicate scenario)', () => {
        beforeEach(() => {
          stackInstance = new PostfixStack(); // Reset stack for each test
          stackInstance.output.push({ type: 'boolean', value: false }); // This should be in parentOutput
          cacheId = stackInstance.cache.output('['); // Simulate predicate
          // Now, stackInstance.output is [], and parentOutput[cacheId] has the boolean.
          stackInstance.output.push(numberOutput); // These are the predicate results
          stackInstance.output.push(stringOutput);
          stackInstance.cache.restore(cacheId);
        });

        it('should restore the output from parentOutput', () => {
          expect(stackInstance.output[0]).toEqual({ type: 'boolean', value: false });
        });

        it('should push the previous output (predicate result) to the current output', () => {
          expect(stackInstance.output[1]).toEqual([numberOutput, stringOutput]);
        });

        it('should delete the cache entry from parentOutput', () => {
          expect(stackInstance.parentOutput[cacheId]).toBeUndefined();
        });
      });
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

    describe('argument()', () => {
      let cacheId;
      let numberOutput;
      let stringOutput;

      beforeEach(() => {
        stackInstance = new PostfixStack();
        cacheId = stackInstance.cache.output('('); // Simulate a function call to get a cacheId
        numberOutput = { type: 'number', value: 1 };
        stringOutput = { type: 'string', value: 'abc' };
      });

      it('When output is empty, it should do nothing', () => {
        stackInstance.cache.argument(cacheId);
        expect(stackInstance.arguments[cacheId]).toEqual([]);
        expect(stackInstance.output).toEqual([]);
      });

      it('When output has a single item, it should push the item to arguments[cacheId] and reset output', () => {
        stackInstance.output.push(numberOutput);
        stackInstance.cache.argument(cacheId);
        expect(stackInstance.arguments[cacheId]).toEqual([numberOutput]);
        expect(stackInstance.output).toEqual([]);
      });

      it('When output has multiple items, it should push the entire output array as a single element to arguments[cacheId] and reset output', () => {
        stackInstance.output.push(numberOutput, stringOutput);
        stackInstance.cache.argument(cacheId);
        expect(stackInstance.arguments[cacheId]).toEqual([[numberOutput, stringOutput]]);
        expect(stackInstance.output).toEqual([]);
      });
    });
  });

  describe('reset()', () => {
    it('should reset all properties to their initial empty states', () => {
      const stackInstance = new PostfixStack();
      stackInstance.operators = ['+'];
      stackInstance.output = [{ type: 'number', value: 1 }];
      stackInstance.parentOutput = { '[1': [] };
      stackInstance.arguments = { '[1': [[{ type: 'number', value: 1 }]] };
      stackInstance.reset();
      expect(stackInstance.operators).toEqual([]);
      expect(stackInstance.output).toEqual([]);
      expect(stackInstance.parentOutput).toEqual({});
      expect(stackInstance.arguments).toEqual({});
    });
  });
});