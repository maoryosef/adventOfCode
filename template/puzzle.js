'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseInput(row) {
	return parseInt(row);
}

function solve(input) {
	return input;
}

function exec(inputFilename, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = _(input)
		.split('\n')
		.map(parseInput)
		.value();

	return solve(parsedInput);
}

module.exports = {
	exec
};