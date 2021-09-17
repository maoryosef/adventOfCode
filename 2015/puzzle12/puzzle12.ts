import fs from 'fs';

function parseInput(input: string) {
	const parsedInput = JSON.parse(input);

	return parsedInput;
}

type ParsedInput = number | string | number[] | string[]

function solve1(input: ParsedInput, ignoreRed = false): number {
	if (typeof input === 'number') {
		return input;
	}

	if (typeof input === 'string') {
		return 0;
	}

	if (input instanceof Array) {
		const numValues = input.map(v => solve1(v, ignoreRed));

		return numValues.reduce((acc, v) => acc + v, 0);
	}

	if (ignoreRed) {
		const values = Object.values(input);
		if (values.includes('red')) {
			return 0;
		}
	}

	const keys = Object.keys(input);
	const numValues = keys.map(k => solve1(input[k], ignoreRed));

	return numValues.reduce((acc, v) => acc + v, 0);
}

function solve2(input: ParsedInput) {
	return solve1(input, true);
}

function exec(inputFilename: string, solver: Function, inputStr?: string) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = parseInput(input);

	return solver(parsedInput);
}

if (!global.TEST_MODE) {
	const inputFile = 'input.test.3.txt';
	const {join} = require('path')

	const res = exec(
		join(__dirname, '__TESTS__', inputFile),
		solve2
	);

	console.log(res);
}

export default {
	exec1: (inputFilename: string) => exec(inputFilename, solve1),
	exec2: (inputFilename: string) => exec(inputFilename, solve2)
};