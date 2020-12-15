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

const VOWELS = _.keyBy('aeiou');
const DISALLOWED = _.keyBy(['ab', 'cd', 'pq', 'xy']);

function isValid(strArr) {
	let prev;
	let vowelsCount = 0;
	let foundDouble = false;

	for (let c of strArr) {
		if (DISALLOWED[prev + c]) {
			return false;
		}

		if (c === prev) {
			foundDouble = true;
		}

		if (VOWELS[c]) {
			vowelsCount++;
		}

		prev = c;
	}

	return vowelsCount > 2 && foundDouble;
}

function solve1(input) {
	return input.filter(isValid).length;
}

function isValid2(strArr) {
	const pairs = new Map();

	let foundPair = false;
	let foundRepeat = false;

	for (let [i, c] of strArr.entries()) {
		const pair = `${c}${strArr[i + 1]}`;

		if (pairs.has(pair)) {
			const lastSeenIdx = pairs.get(pair);

			if (i - lastSeenIdx > 1) {
				foundPair = true;
			}
		} else {
			pairs.set(pair, i);
		}

		if (c === strArr[i - 2]) {
			foundRepeat = true;
		}

	}

	return foundPair && foundRepeat;
}

function solve2(input) {
	return input.filter(isValid2).length;
}

function exec(inputFilename, solver, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = parseInput(input);

	return solver(parsedInput);
}

if (!global.TEST_MODE) {
	const inputFile = 'input.test.2.txt';
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