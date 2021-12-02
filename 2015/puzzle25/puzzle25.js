'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	return row.match(/Enter the code at row (.*?), column (.*?)\./).slice(1).map(x => +x - 1);
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.head();

	return parsedInput;
}

function solve1([row, col]) {
	let cRow = 0;
	let cCol = 0;
	let prevVal = 20151125;
	while (cCol !== col || cRow !== row) {
		const nextVal = prevVal * 252533 % 33554393;

		if (cRow === 0) {
			cRow = cCol + 1;
			cCol = 0;
		} else {
			cCol++;
			cRow--;
		}

		prevVal = nextVal;
	}

	return prevVal;
}

function solve2(input) {
	return input;
}

function exec(inputFilename, solver, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = parseInput(input);

	return solver(parsedInput);
}

if (!global.TEST_MODE) {
	const inputFile = 'input.txt';
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