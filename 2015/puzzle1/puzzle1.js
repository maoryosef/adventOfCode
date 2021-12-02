'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseInput(input) {
	const parsedInput = _(input)
		.split('')
		.value();

	return parsedInput;
}

function solve1(input) {
	return input.reduce((acc, val) => acc + (val === '(' ? 1 : -1), 0);
}

function solve2(input) {
	let floor = 0;
	for (let i = 0; i < input.length; i++) {
		const c = input[i];
		if (c === '(') {
			floor++;
		} else {
			floor--;
		}

		if (floor < 0) {
			return i + 1;
		}
	}

	return input;
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