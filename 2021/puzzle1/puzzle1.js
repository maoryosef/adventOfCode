'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	return parseInt(row);
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

function solve1(input) {
	let increases = 0;
	for (let i = 1; i < input.length; i++) {
		if (input[i - 1] < input[i]) {
			increases++;
		}
	}

	return increases;
}

function solve2(input) {
	let increases = 0;
	for (let i = 3; i < input.length; i++) {
		const sum1 = input[i - 3] + input[i - 2] + input[i - 1];
		const sum2 = input[i - 2] + input[i - 1] + input[i];

		if (sum1 < sum2) {
			increases++;
		}
	}

	return increases;
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