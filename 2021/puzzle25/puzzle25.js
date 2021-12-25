'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	return row.split('');
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

function solve1(input) {
	let steps = 0;
	let currMap = input;

	let moved = 0;
	do {
		moved = 0;
		let nextMap = currMap.slice(0);
		for (let row = 0; row < currMap.length; row++) {
			nextMap[row] = currMap[row].slice(0);
			for (let col = 0; col < currMap[row].length; col++) {
				if (currMap[row][col] === '>') {
					const nextCol = (col + 1) % currMap[row].length;
					if (currMap[row][nextCol] === '.') {
						moved++;
						nextMap[row][col] = '.';
						nextMap[row][nextCol] = '>';
					}
				}
			}
		}

		for (let row = 0; row < currMap.length; row++) {
			for (let col = 0; col < currMap[row].length; col++) {
				if (currMap[row][col] === 'v') {
					const nextRow = (row + 1) % nextMap.length;
					if (nextMap[nextRow][col] === '.' && currMap[nextRow][col] !== 'v') {
						moved++;
						nextMap[row][col] = '.';
						nextMap[nextRow][col] = 'v';
					}
				}
			}
		}
		currMap = nextMap;
		steps++;
	} while (moved > 0);

	return steps;
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
};