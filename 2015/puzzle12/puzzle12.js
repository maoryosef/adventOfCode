'use strict';

const fs = require('fs');

function parseInput(input) {
	const parsedInput = JSON.parse(input);

	return parsedInput;
}

function solve1(input, ignoreRed = false) {
	if (typeof input === 'number') {
		return input;
	}

	if (typeof input === 'string') {
		return 0;
	}

	if (input instanceof Array) {
		const numValus = input.map(v => solve1(v, ignoreRed));

		return numValus.reduce((acc, v) => acc + v, 0);
	}

	if (ignoreRed) {
		const values = Object.values(input);
		if (values.includes('red')) {
			return 0;
		}
	}

	const keys = Object.keys(input);
	const numValus = keys.map(k => solve1(input[k], ignoreRed));

	return numValus.reduce((acc, v) => acc + v, 0);
}

function solve2(input) {
	return solve1(input, true);
}

function exec(inputFilename, solver, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = parseInput(input);

	return solver(parsedInput);
}

if (!global.TEST_MODE) {
	const inputFile = 'input.test.3.txt';
	const {join} = require('path');

	const res = exec(
		join(__dirname, '__TESTS__', inputFile),
		solve2
	);

	console.log(res);
}

module.exports = {
	exec1: (inputFilename) => exec(inputFilename, solve1),
	exec2: (inputFilename) => exec(inputFilename, solve2)
};