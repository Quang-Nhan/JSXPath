import Main from '../ts/JSXMain';


describe('Path traversing json', () => {
  let main, json, path;

  beforeEach(() => {
    main = new Main();
  })

  beforeEach(() => {
    json = {
      a: [
        {
          h: 1,
          i: 2,
          j: {
            k: 'string'
          }
        },
        {
          h: 1,
          i: 100,
          j: {
            k: false
          }
        },
        {
          h: 99,
          i: -1
        },
        {
          h: 10,
          i: 100,
          j: {
            k: 12
          }
        }
      ],
      b: [

      ],
      c: {

      },
      d: {

      }
    }
  });

  afterEach(() => {
    main.flush();
  });

  // it('Returns all @k values from branch a', () => {
  //   path = '/a/j/@k';
  //   main.process(path, json);
  //   expect(main.getResult()).toEqual([
  //     'string', false, 12
  //   ]);
  // });

  // it('Returns the k value that has i equal to 2', () => {
  //   path = '/a[@i = 2]/j/@k';
  //   main.process(path, json);
  //   expect(main.getResult()).toEqual([
  //     'string'
  //   ]);
  // });
});