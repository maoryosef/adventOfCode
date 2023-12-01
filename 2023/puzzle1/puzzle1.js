'use strict';

const fs = require('fs');
const _ = require('lodash');

const DIGITS = {
	one: 1,
	two: 2,
	three: 3,
	four: 4,
	five: 5,
	six: 6,
	seven: 7,
	eight: 8,
	nine: 9,
};

function parseRow(row) {
	return [...row.matchAll(/\d/g)]
		.map(x => +x);
}

function parseRowWithDigitNames(row) {
	return [...row.matchAll(new RegExp(`(?=(${Object.keys(DIGITS).join('|')}|\\d))`, 'gi'))]
		.map(x => DIGITS[x[1]] || +x[1]);
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.value();

	return parsedInput;
}

function solve(input, parser) {
	return input
		.map(parser)
		.map(arr => arr[0] * 10 + arr.pop())
		.reduce((acc, val) => acc + val, 0);
}

function solve1(input) {
	return solve(input, parseRow);
}

function solve2(input) {
	return solve(input, parseRowWithDigitNames);
}

function exec(inputFilename, solver, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = parseInput(input);

	return solver(parsedInput);
}

if (!global.TEST_MODE) {
	const inputFile = 'input.test.2.txt';
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