'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	return row.split('\n').map(v => v.split(''));
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

function solve1(input) {
	return input.map(v => _.uniq(_.flatten(v))).reduce((acc, val) => acc + val.length, 0);
}

function solve2(input) {
	return input.map(v => _.intersection(...v)).reduce((acc, val) => acc + val.length, 0);
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