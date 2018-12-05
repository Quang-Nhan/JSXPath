import JSXMain from './JSXMain';
console.time('DURATION');
const json = {
    a: {
      b: 1
    },
    c: [
        {
            a: 11,
            b: -4
          },
      {
        a: 1,
        b: 2
      },
      {
        a: 3,
        b: -4
      }
    ]
  }

// const variables = {
//     $v1: 3
// }




// const path = '/c[position() = 1]';
// const path = '/c[string(@b) = "2"]'
const path = '/c[@b=-4]/@a'
const main = new JSXMain();

main.process(path, json);
console.timeEnd('DURATION');
console.log('Result: ', main.getResult());
console.log('Done')
debugger
/* /a/c/f
{
    ROOT: [
            {
            name: 'ROOT',
            id: 1,
            value : {
                a: 'abv',
                c: {
                    a: 'k',
                    f: 'f'
                }
            },
            ancestorIds: [0],
            parentId: 0
        }
    ],
    a: [
        {
            name: 'a',
            value: 'abv',
            parentId: 1,
            ancestorIds: [1]
        },
        {
            name: 'a',
        value: 'k',
            parentId: 
        },

    ],
    c: [
        {
            name: 'c',
            id: '2'
            value: {
                a: 'k',
                f: 'f'
            },
            parentId: ,
            ancestor
        }
    ],
    f : [
        {

        }
    ]
    
}

*/