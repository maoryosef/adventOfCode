'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	return row.split(' ');
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

const gameMatrix = {
	A: {score: 1, C: 0, A: 3, B: 6, X: 'C', Y: 'A', Z: 'B'},
	B: {score: 2, C: 6, A: 0, B: 3, X: 'A', Y: 'B', Z: 'C'},
	C: {score: 3, C: 3, A: 6, B: 0, X: 'B', Y: 'C', Z: 'A'},
};

const convertionMap = {
	X: 'A',
	Y: 'B',
	Z: 'C'
};

function solve1(input) {
	return _(input)
		.map(([elfShape, p2]) => {
			const p2shape = convertionMap[p2];

			return gameMatrix[p2shape].score + gameMatrix[elfShape][p2shape];
		})
		.sum();
}

function solve2(input) {
	return _(input)
		.map(([elfShape, p2]) => {
			const elfMove = gameMatrix[elfShape];
			const p2shape = elfMove[p2];

			return gameMatrix[p2shape].score + elfMove[p2shape];
		})
		.sum();
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
		solve2
	);

	console.log(res);
}

module.exports = {
	exec1: (inputFilename) => exec(inputFilename, solve1),
	exec2: (inputFilename) => exec(inputFilename, solve2)
};