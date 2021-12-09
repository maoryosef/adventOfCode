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

function getNeighbors(cave, [row, col]) {
	return [[0, 1], [0, -1], [1, 0], [-1, 0]]
		.map(d => ([row + d[0], col + d[1]]))
		.filter(d => d[0] >= 0 && d[0] < cave.length && d[1] >= 0 && d[1] < cave[0].length);
}

function solve1(input) {
	const lowPoints = [];
	for (let row = 0; row < input.length; row++) {
		for (let col = 0; col < input[0].length; col++) {
			const neighbors = getNeighbors(input, [row, col]);
			if (neighbors.every(n => input[n[0]][n[1]] > input[row][col])) {
				lowPoints.push(input[row][col]);
			}
		}
	}

	return lowPoints.reduce((acc, v) => acc + v + 1, 0);
}

function getBasin(cave, [row, col]) {
	const basin = [];

	const queue = [[row, col]];

	while (queue.length) {
		const pos = queue.shift();
		if (cave[pos[0]][pos[1]] === 9 || cave[pos[0]][pos[1]] === '-') {
			continue;
		}

		basin.push(cave[pos[0]][pos[1]]);
		cave[pos[0]][pos[1]] = '-';
		queue.push(...getNeighbors(cave, pos));
	}

	return basin;
}

function findNextAvailableRoot(cave, [row]) {
	for (let i = row; i < cave.length; i++) {
		for (let j = 0; j < cave[0].length; j++) {
			if (cave[i][j] !== '-' && cave[i][j] < 9) {
				return [i, j];
			}
		}
	}

	return null;
}

function solve2(input) {
	let lastRoot = [0, 0];
	let nextRoot;
	const basins = [];

	while ((nextRoot = findNextAvailableRoot(input, lastRoot))) {
		basins.push(getBasin(input, nextRoot));
		lastRoot = nextRoot;
	}

	return basins
		.sort((a, b) => b.length - a.length)
		.slice(0, 3)
		.reduce((acc, v) => acc * v.length, 1);
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