'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	return row.split(',').map(range => range.split('-').map(n => parseInt(n)));
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

function solve1(input) {
	return input
		.filter(([r1, r2]) => {
			if (r1[0] > r2[0]) {
				const t = r1;
				r1 = r2;
				r2 = t;
			}

			if (r1[0] === r2[0]) {
				return r1[1] >= r2[1] || r2[1] > r1[1];
			}

			return r1[0] <= r2[0] && r1[1] >= r2[1];
		})
		.length;
}

function solve2(input) {
	return input.filter(([r1, r2]) => {
		if (r1[0] > r2[0]) {
			const t = r1;
			r1 = r2;
			r2 = t;
		}

		if (r1[0] === r2[0]) {
			return true;
		}

		return r1[0] <= r2[0] && r1[1] >= r2[0];
	}).length;
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
		solve2
	);

	console.log(res);
}

module.exports = {
	exec1: (inputFilename) => exec(inputFilename, solve1),
	exec2: (inputFilename) => exec(inputFilename, solve2)
};