'use strict';

const fs = require('fs');
const _ = require('lodash');
const {gol} = require('aoc-utils');

function parseRow(row) {
	return row.split('').map(x => x === '.' ? false : true);
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

function getGetNeighborsFunc(gridSize) {
	return k => {
		const [x, y] = k.split(',').map(x => +x);

		return [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]]
			.map(([oX, oY]) => [x + oX, y + oY])
			.filter(([nX, nY]) => nX >= 0 && nY >= 0 && nX <= gridSize - 1 && nY <= gridSize - 1)
			.map(([nX, nY]) => `${nX},${nY}`);
	};
}

function solve1(input) {
	let grid = new Map();

	const runs = input.length > 6 ? 100 : 4;

	for (let y = 0; y < input.length; y++) {
		for (let x = 0; x < input[0].length; x++) {
			if (input[y][x]) {
				grid.set(`${x},${y}`, true);
			}
		}
	}

	for (let i = 0; i < runs; i++) {
		grid = gol.gameOfLife(
			grid,
			getGetNeighborsFunc(input.length),
			(current, active) => (current && active === 2) || active === 3
		);
	}

	return [...grid.values()].filter(x => x).length;
}

function solve2(input) {
	let grid = new Map();

	const runs = input.length > 6 ? 100 : 5;

	for (let y = 0; y < input.length; y++) {
		for (let x = 0; x < input[0].length; x++) {
			if (input[y][x]) {
				grid.set(`${x},${y}`, true);
			}
		}
	}

	const edges = {
		'0,0': true,
		[`0,${input.length - 1}`]: true,
		[`${input.length - 1},0`]: true,
		[`${input.length - 1},${input.length - 1}`]: true,
	};

	Object.keys(edges).forEach(k => grid.set(k, true));

	for (let i = 0; i < runs; i++) {
		grid = gol.gameOfLife(
			grid,
			getGetNeighborsFunc(input.length),
			(current, active, key) => edges[key] || (current && active === 2) || active === 3
		);
	}

	return [...grid.values()].filter(x => x).length;
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