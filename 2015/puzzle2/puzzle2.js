'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	return row.split('x').map(x => +x);
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

function solve1(input) {
	return input.reduce((acc, [l, w, h]) => {
		const f1 = l * w;
		const f2 = w * h;
		const f3 = h * l;
		const minF = Math.min(f1, f2, f3);


		return acc + (2 * f1 + 2 * f2 + 2 * f3 + minF);
	}, 0);
}

function solve2(input) {
	return input.reduce((acc, [l, w, h]) => {
		const [f1, f2] = [l, w, h].sort((a, b) => a - b);

		return acc + (2 * f1 + 2 * f2 + l * w * h);
	}, 0);
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