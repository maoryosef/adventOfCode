'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseInput(row) {
	return row.split('');
}

function checkSlope(input, sX, sY) {
	let x = 0;
	const width = input[0].length;
	let trees = 0;
	for (let y = 0; y < input.length; y += sY) {
		if (input[y][x % width] === '#') {
			trees++;
		}

		x += sX;
	}

	return trees;
}

function solve(input) {
	let trees = checkSlope(input, 1, 1);
	trees *= checkSlope(input, 3, 1);
	trees *= checkSlope(input, 5, 1);
	trees *= checkSlope(input, 7, 1);
	trees *= checkSlope(input, 1, 2);

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