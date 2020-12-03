'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseInput(row) {
	return row.split('');
}

function solve(input) {
	let x = 0;
	const width = input[0].length;
	let trees = 0;
	for (let y = 0; y < input.length; y++) {
		if (input[y][x % width] === '#') {
			trees++;
		}

		x += 3;
	}

	return trees;
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