'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	return parseInt(row);
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

function transform(value, subjectNumber = 7) {
	value *= subjectNumber;
	value = value % 20201227;

	return value;
}

function solve1(input) {
	const [doorPubKey, cardPubKey] = input;

	let value = 1;
	let loopSize = 0;
	while (value !== doorPubKey) {
		value = transform(value);
		loopSize++;
	}

	value = 1;
	for (let i = 0; i < loopSize; i++) {
		value = transform(value, cardPubKey);
	}

	return value;
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
	exec1: (inputFilename) => exec(inputFilename, solve1)
};