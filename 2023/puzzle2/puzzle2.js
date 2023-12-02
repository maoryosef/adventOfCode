'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	const [gameIdStr, valuesStr] = row.split(': ');

	const [, gameId] = gameIdStr.split(' ').map(x => +x);
	const roundsStr = valuesStr.split('; ');
	const rounds = roundsStr
		.map(r => r.split(', ').map(x => x.split(' ')).map(([count, col]) => [col, +count]))
		.map(Object.fromEntries);

	return {
		gameId,
		rounds
	};
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

const testCases1 = [8];
const expectedRes1 = 2512;
function solve1(input) {
	const possible = input.filter(({rounds}) => rounds.every(({red = 0, green = 0, blue = 0}) => red <= 12 && green <= 13 && blue <= 14));

	return possible.reduce((sum, {gameId}) => sum + gameId, 0);
}

const testCases2 = [2286];
const expectedRes2 = 67335;
function solve2(input) {
	const minimums = input.map(({rounds}) => rounds.reduce((m, {red = -Infinity, green = -Infinity, blue = -Infinity}) => {
		m.red = Math.max(m.red, red);
		m.green = Math.max(m.green, green);
		m.blue = Math.max(m.blue, blue);

		return m;
	}, {red: -Infinity, green: -Infinity, blue: -Infinity}))
		.map(({red, green, blue}) => red * green * blue);

	return minimums.reduce((sum, v) => sum + v, 0);
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