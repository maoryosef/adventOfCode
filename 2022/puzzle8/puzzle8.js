'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	return row.split('').map(x => +x);
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

function checkLine(forest, row, col, rowFactor, colFactor) {
	const height = forest[row][col];

	row += rowFactor;
	col += colFactor;
	let count = 0;
	while (row >= 0 && row < forest.length && col >= 0 && col < forest[row].length) {
		count++;
		if (forest[row][col] >= height) {
			return {count, visible: false};
		}

		row += rowFactor;
		col += colFactor;
	}

	return {count, visible: true};
}

function isVisible(forest, row, col) {
	return [
		[-1, 0],
		[1, 0],
		[0, -1],
		[0, 1],
	].some(([fRow, fCol]) => checkLine(forest, row, col, fRow, fCol).visible);
}

function getViewSides(forest, row, col) {
	return [
		checkLine(forest, row, col, 0, -1).count,
		checkLine(forest, row, col, 0, 1).count,
		checkLine(forest, row, col, -1, 0).count,
		checkLine(forest, row, col, 1, 0).count
	];
}

function solve1(input) {
	let visible = 0;
	for (let i = 1; i < input.length - 1; i++) {
		for (let j = 1; j < input[i].length -1; j++) {
			if (isVisible(input, i, j)) {
				visible++;
			}
		}
	}

	const edges = input.length * 2 + (input[0].length - 2) * 2;

	return edges + visible;
}

function solve2(input) {
	let maxViewScore = -Infinity;
	for (let i = 1; i < input.length - 1; i++) {
		for (let j = 1; j < input[i].length -1; j++) {
			const viewingSides = getViewSides(input, i, j);
			const viewScore = viewingSides[0] * viewingSides[1] * viewingSides[2] * viewingSides[3];

			maxViewScore = Math.max(maxViewScore, viewScore);
		}
	}

	return maxViewScore;
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
	exec2: (inputFilename) => exec(inputFilename, solve2)
};