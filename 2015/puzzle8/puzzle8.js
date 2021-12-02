'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	return row;
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

function getInMemory(str) {
	const chars = str.split('');
	const charsToCount = [];
	let prev;

	for (let i = 0; i < chars.length; i++) {
		const c = chars[i];

		if (c === '"' && prev === '\\') {
			charsToCount.pop();
			charsToCount.push('"');
			prev = '';
			continue;
		}

		if (c === '\\' && prev === '\\') {
			prev = '';
			continue;
		}

		if (c === '"') {
			continue;
		}

		if (c === 'x' && prev === '\\') {
			charsToCount.pop();
			charsToCount.push('$');
			i += 2;
			prev = c;
			continue;
		}

		prev = c;
		charsToCount.push(c);
	}

	return charsToCount.length;
}

function solve1(input) {
	const numOfChars = input.reduce((acc, r) => acc + r.length, 0);
	const numOfCharsInMemory = input.reduce((acc, r) => acc + getInMemory(r), 0);
	return numOfChars - numOfCharsInMemory;
}

function getEncoded(str) {
	const chars = str.split('');
	const charsToCount = ['"'];

	for (let i = 0; i < chars.length; i++) {
		const c = chars[i];

		if (c === '"' || c === '\\') {
			charsToCount.push('\\');
		}

		charsToCount.push(c);
	}

	return [...charsToCount, '"'].length;
}

function solve2(input) {
	const numOfCharsEncoded = input.reduce((acc, r) => acc + getEncoded(r), 0);
	const numOfChars = input.reduce((acc, r) => acc + r.length, 0);
	return numOfCharsEncoded - numOfChars;
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