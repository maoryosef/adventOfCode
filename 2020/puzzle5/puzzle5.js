'use strict';

const fs = require('fs');
const _ = require('lodash');

const OP_CODE_MAP = {
	F: 0,
	B: 1,
	L: 0,
	R: 1
};

function parseRow(row) {
	return parseInt(row.split('').map(c => OP_CODE_MAP[c]).join(''), 2);
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.sort((a, b) => a - b)
		.value();

	return parsedInput;
}

function solve1(input) {
	return input[input.length - 1];
}

function solve2(input) {
	return input.find((s, i) => s + 1 !== input[i + 1]) + 1;
}

function exec(inputFilename, solver, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = parseInput(input);

	return solver(parsedInput);
}

module.exports = {
	exec1: (inputFilename) => exec(inputFilename, solve1),
	exec2: (inputFilename) => exec(inputFilename, solve2)
};