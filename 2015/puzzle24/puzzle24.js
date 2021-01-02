'use strict';

const fs = require('fs');
const {combination} = require('js-combinatorics');
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

function solve1(input, numOfPackages = 3) {
	const sum = input.reduce((sum, x) => sum + x, 0);
	const target = sum / numOfPackages;

	let groupSize = 2;
	const foundGroups = [];

	while (foundGroups.length === 0) {
		const validPackages = combination(input, groupSize).filter(p => p.reduce((acc, v) => acc + v, 0) === target);
		foundGroups.push(...validPackages);
		groupSize++;
	}

	return foundGroups
		.map(p => p.reduce((acc, v) => acc * v, 1))
		.sort((a, b) => a - b)[0];
}

function solve2(input) {
	return solve1(input, 4);
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