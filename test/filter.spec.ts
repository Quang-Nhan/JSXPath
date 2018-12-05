import Main from '../ts/JSXMain';


describe('[]', () => {
  let main, json, path;

  beforeEach(() => {
    main = new Main();
  });

  describe('Simple primitive Array filter', () => {
    beforeEach(() => {
      main.flush();
      json = {
        a: [
          'a',
          1,
          3,
          'c',
        ]
      };
    });

    it('Returns ', () => {
      path = '/a[position() = 1]';
      main.process(path, json);
      expect(main.getResult()).toEqual('a')
    });
  }); 

  describe('Object filter', () => {

  });

});