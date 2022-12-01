'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	return row.split('\n').map(x => parseInt(x));
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

function solve1(input) {
	return _(input)
		.map(_.sum)
		.sort((a, b) => b - a)
		.head();
}

function solve2(input) {
	return _(input)
		.map(_.sum)
		.sort((a, b) => b - a)
		.take(3)
		.sum();
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