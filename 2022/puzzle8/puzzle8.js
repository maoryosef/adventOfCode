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

function isVisible(forest, row, col) {
	let cRow = row - 1;
	let cCol = col - 1;
	const height = forest[row][col];
	let vLeft = true;
	let vRight = true;
	let vUp = true;
	let vDown = true;

	while (cRow >= 0) {
		if (forest[cRow][col] >= height) {
			vUp = false;
			break;
		}
		cRow--;
	}

	cRow = row + 1;
	while (cRow < forest.length) {
		if (forest[cRow][col] >= height) {
			vDown = false;
			break;
		}
		cRow++;
	}

	while (cCol >= 0) {
		if (forest[row][cCol] >= height) {
			vLeft = false;
			break;
		}
		cCol--;
	}

	cCol = col + 1;
	while (cCol < forest[row].length) {
		if (forest[row][cCol] >= height) {
			vRight = false;
			break;
		}
		cCol++;
	}

	return vLeft || vRight || vDown || vUp;
}

function getViewSides(forest, row, col) {
	let cRow = row - 1;
	let cCol = col - 1;
	const height = forest[row][col];
	let vLeft = 0;
	let vRight = 0;
	let vUp = 0;
	let vDown = 0;

	while (cRow >= 0) {
		vUp++;
		if (forest[cRow][col] >= height) {
			break;
		}
		cRow--;
	}

	cRow = row + 1;
	while (cRow < forest.length) {
		vDown++;
		if (forest[cRow][col] >= height) {
			break;
		}
		cRow++;
	}

	while (cCol >= 0) {
		vLeft++;
		if (forest[row][cCol] >= height) {
			break;
		}
		cCol--;
	}

	cCol = col + 1;
	while (cCol < forest[row].length) {
		vRight++;
		if (forest[row][cCol] >= height) {
			break;
		}
		cCol++;
	}

	return [vLeft,vRight,vDown,vUp];
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

			if (maxViewScore < viewScore) {
				maxViewScore = viewScore;
			}

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