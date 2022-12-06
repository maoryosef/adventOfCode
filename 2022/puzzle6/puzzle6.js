'use strict';

const fs = require('fs');

function parseInput(input) {
	return input;
}

function solve1(input, size = 4) {
	for (let i = 0; i < input.length - size; i++) {
		const matchSet = new Set(input.substr(i, size).split(''));

		if (matchSet.size === size) {
			return i + size;
		}
	}
}

function solve2(input) {
	return solve1(input, 14);
}

function exec(inputFilename, solver, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = parseInput(input);

	return solver(parsedInput);
}

if (!global.TEST_MODE) {
	const inputFile = 'input.test.1.txt';
	const {join} = require('path');

	const res = exec(
		join(__dirname, '__TESTS__', inputFile),
		solve1
	);

	console.log(res);
}

module.exports = {
	exec1: (inputFilename) => exec(inputFilename, solve1),
	exec2: (inputFilename) => exec(inputFilename, solve2)
};