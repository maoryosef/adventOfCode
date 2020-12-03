'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseInput(row) {
	return parseInt(row);
}

function solve1(input) {
	return input;
}

function solve2(input) {
	return input;
}

function exec(inputFilename, solver, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = _(input)
		.split('\n')
		.map(parseInput)
		.value();

	return solver(parsedInput);
}

module.exports = {
	exec1: (inputFilename) => exec(inputFilename, solve1),
	exec2: (inputFilename) => exec(inputFilename, solve2)
};