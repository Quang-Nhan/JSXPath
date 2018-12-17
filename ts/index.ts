import JSXMain from './JSXMain';
console.time('DURATION');
const json = {
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
            m: -18,
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

// const variables = {
//     $v1: 3
// }
    

const path = '/a/f[@l=9]/@m[. < 0]' 

const main = new JSXMain();

main.process(path, json);
console.timeEnd('DURATION');
console.log('Result: ', main.getResult());
console.log('Done')
debugger
