import Main from '../ts/JSXMain';


describe('filtering []', () => {
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

    it('Returns the value of index 1', () => {
      path = '/a[position() = 1]';
      main.process(path, json);
      expect(main.getResult()).toEqual([1])
    });

    it('Returns all values whose index is greater than 1', () => {
      path = '/a[1 <= position()]';
      main.process(path, json);
      expect(main.getResult()).toEqual([3, 'c']);
    });

    it('Should successfully process multi filters.', () => {
      path = '/a[position() > 0][position() <= 1]';
      main.process(path, json);
      expect(main.getResult()).toEqual([1]);
    });
  }); 

  describe('Complex Array filter', () => {
    beforeEach(() => {
      main.flush();
      json = {
        a: [
          {
            f: [
              {
                l: 1,
                m: -12,
                n: 101
              },
              {
                l: 1,
                m: 90,
                n: -199
              },
              {
                l: 9,
                m: 90,
                n: -989
              }
            ]
          },
          {
            f: [
              {
                l: 1,
                m: -12,
                n: -100
              },
              {
                l: 1,
                m: 90,
                n: -20
              }
            ]
          }
        ]
      }
    });

    it('Filter value of f where m is equal to 90', () => {
      path = '/a/f[@m = 90]';
      main.process(path, json);
      expect(main.getResult()).toEqual([
        {
          l: 1,
          m: 90,
          n: -199
        },
        {
          l: 9,
          m: 90,
          n: -989
        },
        {
          l: 1,
          m: 90,
          n: -20
        }
      ]);
    });

    it('Filter contains operator', () => {
      path = '/a/f[@l = (@m div 10)]';
      main.process(path, json);
      expect(main.getResult()).toEqual(
        [
          {
            l: 9,
            m: 90,
            n: -989
          }
        ]
      );
    });

    it('Multi breath filter test', () => {
      path = '/a/f[@l=1][@m=90][@n<-50]';
      main.process(path, json);
      expect(main.getResult()).toEqual([
        {
          l: 1,
          m: 90,
          n: -199
        }
      ]);
    });

    it('Multi depth filter test', () => {
      path = '/a[f[@l = 9]]';
      main.process(path, json);
      expect(main.getResult()).toEqual([
        {
          f: [
            {
              l: 1,
              m: -12,
              n: 101
            },
            {
              l: 1,
              m: 90,
              n: -199
            },
            {
              l: 9,
              m: 90,
              n: -989
            }
          ]
        }
      ]);
    });
  });
});