import fs from 'fs';

function parseInput(input: string) {
	return input.split('').map(x => +x);
}

function solve1(input: number[], iterations = 40) {
	let result = [...input];

	for (let i = 0; i < iterations; i++) {
		let prevNum: number;
		let numCount = 0;

		result = result.reduce((acc: number[], num) => {
			if (prevNum && prevNum !== num) {
				acc.push(numCount, prevNum);
				numCount = 0;
			}

			numCount++;
			prevNum = num;

			return acc;
		}, []);

		result.push(numCount, prevNum!);
	}

	return result.length;
}

function solve2(input: number[]) {
	return solve1(input, 50);
}

function exec(inputFilename: string, solver: Function, inputStr?: string) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = parseInput(input);

	return solver(parsedInput);
}

if (!global.TEST_MODE) {
	const inputFile = 'input.test.1.txt';
	const {join} = require('path')

	const res = exec(
		join(__dirname, '__TESTS__', inputFile),
		solve1
	);

	console.log(res);
}

export default {
	exec1: (inputFilename: string) => exec(inputFilename, solve1),
	exec2: (inputFilename: string) => exec(inputFilename, solve2)
};