
import { runPath } from './index';

const generateLargeJson = (depth: number, breadth: number) => {
    if (depth === 0) return 'value';
    const obj: any = {};
    for (let i = 0; i < breadth; i++) {
        obj[`key_${i}`] = generateLargeJson(depth - 1, breadth);
    }
    return obj;
};

const json = generateLargeJson(4, 10); // Adjust size as needed
console.log('JSON generated');

const start = performance.now();
for (let i = 0; i < 100; i++) {
    runPath('//key_5', { json });
}
const end = performance.now();

console.log(`Execution time: ${end - start}ms`);
