'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.value();

	return parsedInput;
}

function findCommonComponent(compArrays) {
	const [common] = _.intersection(...compArrays.map(a => a.split('')));

	return common;
}

function toOrdValue(char) {
	const code = char.charCodeAt(0);

	return code - (code > 90 ? 96 : 38);
}

function toCompartments(row) {
	const sliceLength = row.length / 2;

	return [row.slice(0, sliceLength), row.slice(sliceLength)];
}

function solve1(input) {
	return _(input)
		.map(toCompartments)
		.map(findCommonComponent)
		.map(toOrdValue)
		.sum();
}

function solve2(input) {
	return _(input)
		.chunk(3)
		.map(findCommonComponent)
		.map(toOrdValue)
		.sum();
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