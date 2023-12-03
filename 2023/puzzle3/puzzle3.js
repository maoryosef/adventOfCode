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

const SIDES = [
	[-1, 0],
	[-1, 1],
	[-1, -1],
	[0, 1],
	[0, -1],
	[1, 1],
	[1, -1],
	[1, 0]
];

function isAdjacent(number, gear) {
	return SIDES.some(s => {
		const newI = _.clamp(gear.i + s[0], 0, Infinity);
		const newJ = _.clamp(gear.j + s[1], 0, Infinity);

		return newI === number.i && newJ >= number.s && newJ <= number.e;
	});
}

function isTouchingSymbol(mat, i, j, symbolExp = /[^.\d]/) {
	return SIDES.some(s => {
		const newI = _.clamp(i + s[0], 0, mat.length - 1);
		const newJ = _.clamp(j + s[1], 0, mat[0].length - 1);

		return mat[newI][newJ].match(symbolExp);
	});
}

const testCases1 = [4361];
const expectedRes1 = 512794;
function solve1(input) {
	const parts = [];
	let currNumber = 0;
	let isAdjacent = false;
	for (let i = 0; i < input.length; i++) {
		for (let j = 0; j < input[i].length; j++) {
			const c = +input[i][j];
			if (!_.isNaN(c)) {
				currNumber = currNumber * 10 + c;
				if (isTouchingSymbol(input, i, j)) {
					isAdjacent = true;
				}
			} else if (!input[i][j].match(/\d/)) {
				if (isAdjacent) {
					parts.push(currNumber);
				}

				isAdjacent = false;
				currNumber = 0;
			}
		}
		if (isAdjacent) {
			parts.push(currNumber);
		}

		isAdjacent = false;
		currNumber = 0;
	}

	return parts.reduce((sum, v) => sum + v, 0);
}

const testCases2 = [467835];
const expectedRes2 = 67779080;
function solve2(input) {
	const gears = [];
	const numbers = [];
	let currNumber = 0;
	let startX = -1;
	for (let i = 0; i < input.length; i++) {
		for (let j = 0; j < input[i].length; j++) {
			const c = +input[i][j];
			if (!_.isNaN(c)) {
				if (startX < 0) {
					startX = j;
				}
				currNumber = currNumber * 10 + c;
			} else if (!input[i][j].match(/\d/) && startX > -1) {
				numbers.push({
					n: currNumber,
					s: startX,
					e: j - 1,
					i
				});

				currNumber = 0;
				startX = -1;
			}

			if (input[i][j] === '*') {
				gears.push({
					i, j
				});
			}
		}
		if (startX > -1) {
			numbers.push({
				n: currNumber,
				s: startX,
				e: input[i].length - 1,
				i: i - 1
			});

			currNumber = 0;
			startX = -1;
		}
	}

	let sum = 0;
	for (const g of gears) {
		const aParts = numbers.filter(n => isAdjacent(n, g));

		if (aParts.length === 2) {
			sum += aParts[0].n * aParts[1].n;
		}
	}

	return sum;
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
	exec2: (inputFilename) => exec(inputFilename, solve2),
	expectedRes1,
	expectedRes2,
	testCases1,
	testCases2
};