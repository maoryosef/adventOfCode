'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	return row.split('');
}

function parseInput(input) {
	const parsedInput = _(input).split('\n').map(parseRow).value();

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
	[1, 0],
];

function findTouchingSymbols(mat, i, j) {
	return SIDES.map((s) => {
		const newI = _.clamp(i + s[0], 0, mat.length - 1);
		const newJ = _.clamp(j + s[1], 0, mat[0].length - 1);

		const c = mat[newI][newJ];

		if (c.match(/[^.\d]/)) {
			return {
				c,
				i: newI,
				j: newJ,
			};
		}
	}).filter((s) => !!s);
}

function extractSymbolsAndParts(input) {
	const symbols = {};
	let startJ = -1;
	let currNumber = 0;
	let touchingSymbols = [];

	for (let i = 0; i < input.length; i++) {
		for (let j = 0; j < input[i].length; j++) {
			const c = +input[i][j];
			if (!_.isNaN(c)) {
				if (startJ < 0) {
					startJ = j;
				}
				currNumber = currNumber * 10 + c;
				touchingSymbols = [
					...touchingSymbols,
					...findTouchingSymbols(input, i, j),
				];
			} else if (!input[i][j].match(/\d/) && startJ > -1) {
				if (touchingSymbols.length > 0) {
					touchingSymbols.forEach((ts) => {
						symbols[`${ts.i},${ts.j}`] = symbols[`${ts.i},${ts.j}`] ?? {
							c: ts.c,
							parts: {},
						};

						symbols[`${ts.i},${ts.j}`].parts[`${i},${startJ}`] = currNumber;
					});
				}

				touchingSymbols = [];
				currNumber = 0;
				startJ = -1;
			}
		}
		if (touchingSymbols.length > 0) {
			touchingSymbols.forEach((ts) => {
				symbols[`${ts.i},${ts.j}`] = symbols[`${ts.i},${ts.j}`] ?? {
					c: ts.c,
					parts: {},
				};

				symbols[`${ts.i},${ts.j}`].parts[`${i - 1},${startJ}`] = currNumber;
			});
		}

		touchingSymbols = [];
		currNumber = 0;
		startJ = -1;
	}

	return symbols;
}

const testCases1 = [4361];
const expectedRes1 = 512794;
function solve1(input) {
	return _(extractSymbolsAndParts(input))
		.values()
		.map('parts')
		.thru(p => Object.assign(...p))
		.values()
		.sum();
}

const testCases2 = [467835];
const expectedRes2 = 67779080;
function solve2(input) {
	return _(extractSymbolsAndParts(input))
		.values()
		.filter(({c}) => c === '*')
		.map('parts')
		.values()
		.map(Object.values)
		.filter(p => p.length === 2)
		.map(([p1, p2]) => p1 * p2)
		.sum();
}

function exec(inputFilename, solver, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = parseInput(input);

	return solver(parsedInput);
}

if (!global.TEST_MODE) {
	const inputFile = 'input.test.1.txt';
	const { join } = require('path');

	const res = exec(join(__dirname, '__TESTS__', inputFile), solve1);

	console.log(res);
}

module.exports = {
	exec1: (inputFilename) => exec(inputFilename, solve1),
	exec2: (inputFilename) => exec(inputFilename, solve2),
	expectedRes1,
	expectedRes2,
	testCases1,
	testCases2,
};
