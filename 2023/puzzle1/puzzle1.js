'use strict';

const fs = require('fs');
const _ = require('lodash');

const digits = {
	zero: 0,
	one: 1,
	two: 2,
	three: 3,
	four: 4,
	five: 5,
	six: 6,
	seven: 7,
	eight: 8,
	nine: 9,
	'0': 0,
	'1': 1,
	'2': 2,
	'3': 3,
	'4': 4,
	'5': 5,
	'6': 6,
	'7': 7,
	'8': 8,
	'9': 9,
};

function replaceDigits(str) {
	const values = [];
	for (const [k,v] of Object.entries(digits)) {
		const matches = [...str.matchAll(k)];
		matches.forEach(m => {
			values.push([m.index, v]);
		});
	}

	return values
		.sort(([i1], [i2]) => i1 - i2)
		.map(([,v]) => v)
		.join('');
}

function parseRow(row) {
	return row
		.split('')
		.map(x => +x)
		.filter(x => !isNaN(x));
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.value();

	return parsedInput;
}

function solve1(input) {
	return input
		.map(parseRow)
		.map(arr => arr[0] * 10 + arr.pop())
		.reduce((acc, val) => acc + val, 0);
}

function solve2(input) {
	return input
		.map(replaceDigits)
		.map(parseRow)
		.map(arr => arr[0] * 10 + arr.pop())
		.reduce((acc, val) => acc + val, 0);
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