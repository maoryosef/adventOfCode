'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	return row.split('').map(x => +x);
}

function getNeighbors(matrix, [row, col]) {
	return [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]]
		.map(d => ([row + d[0], col + d[1]]))
		.filter(d => d[0] >= 0 && d[0] < matrix.length && d[1] >= 0 && d[1] < matrix[0].length);
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

function doStep(matrix) {
	const toFlash = [];

	for (let row = 0; row < matrix.length; row++) {
		for (let col = 0; col < matrix[0].length; col++) {
			if (++matrix[row][col] === 10) {
				toFlash.push([row, col]);
			}
		}
	}

	for (let x = 0; x < toFlash.length; x++) {
		const cord = toFlash[x];
		const neighbors = getNeighbors(matrix, [cord[0], cord[1]]);

		neighbors.forEach(n => {
			if (++matrix[n[0]][n[1]] === 10) {
				toFlash.push([n[0], n[1]]);
			}
		});
	}

	toFlash.forEach(cord => {
		matrix[cord[0]][cord[1]] = 0;
	});

	return toFlash.length;
}

function solve1(input) {
	let flashes = 0;
	for (let i = 0; i < 100; i++) {
		flashes += doStep(input);
	}

	return flashes;
}

function sumMatrix(matrix) {
	let sum = 0;
	for (let i = 0; i < matrix.length; i++) {
		for (let j = 0; j < matrix[0].length; j++) {
			sum += matrix[i][j];
		}
	}

	return sum;
}

function solve2(input) {
	let run = 0;

	while (sumMatrix(input) !== 0) {
		doStep(input);
		run++;
	}

	return run;
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