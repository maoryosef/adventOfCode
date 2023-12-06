'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	return row
		.split(':')
		.map(x => x.trim())[1]
		.split(/\s+/).map(x => +x);
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

function countWins(record, distance) {
	let left = 0;
	let right = record;

	while (right - left > 1) {
		const t = Math.floor((left + right) / 2);
		if (t * (record - t) > distance) {
			right = t;
		} else {
			left = t;
		}
	}
	const leftBoundary = right;

	left = 0;
	right = record;

	while (right - left > 1) {
		const t = Math.floor((left + right) / 2);
		if (t * (record - t) > distance) {
			left = t;
		} else {
			right = t;
		}
	}
	const rightBoundary = left;

	return rightBoundary - leftBoundary + 1;
}

const testCases1 = [288];
const expectedRes1 = 1108800;
function solve1([record, distance]) {
	let total = 1;
	for (let i = 0; i < record.length; i++) {
		total *= countWins(record[i], distance[i]);
	}

	return total;
}

const testCases2 = [71503];
const expectedRes2 = 36919753;
function solve2([records, distances]) {
	return countWins(+records.join(''), +distances.join(''));
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
	exec2: (inputFilename) => exec(inputFilename, solve2),
	expectedRes1,
	expectedRes2,
	testCases1,
	testCases2
};