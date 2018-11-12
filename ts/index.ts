import JSXMain from './JSXMain';
console.time('DURATION');
const json = {
    a: 'abv',
    c: {
        a: 'k',
        f: {
            a: {
                k: 100,
                a: 200
            }
        }
    },
    m: 1,
    f: 2,
    n: [1, 2],
    d: [
        {
            a: 1,
            b: 2
        },
        {
            a: 3,
            b: 9
        }
    ],
    k: [
        1,
        2
    ]
}

const variables = {
    $v1: 3
}

// const json = {
//     a: [
//       {
//         b: 1,
//         c: 2,
//         e: {
//           a: 1
//         },
//         f: {
//           a: 1
//         }
//       },
//       {
//         b: 'b',
//         c: 9
//       },
//       {
//         b: 'b',
//         d: 13
//       },
//       {
//         d: 13,
//         c: 13
//       },
//       {
//         c: 13,
//         d: -1
//       }
//     ]
//   }


const path = '/a';
const main = new JSXMain();

main.process(path, json);
console.timeEnd('DURATION');
console.log('Result: ', main.getResult());


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