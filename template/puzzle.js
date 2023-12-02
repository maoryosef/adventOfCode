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

const testCases1 = [];
const expectedRes1 = true;
function solve1(input) {
	return input;
}

const testCases2 = [];
const expectedRes2 = true;
function solve2(input) {
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
	exec2: (inputFilename) => exec(inputFilename, solve2),
	expectedRes1,
	expectedRes2,
	testCases1,
	testCases2
};