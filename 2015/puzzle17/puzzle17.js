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

function fillPossibilities(target, containers) {
	if (target === 0) {
		return [[]];
	}

	if (containers.length === 1 && containers[0] !== target) {
		return null;
	}

	let totalPos = [];
	const allowedContainers = containers.filter(c => c <= target);

	while (allowedContainers.length > 0) {
		const cont = allowedContainers.shift();
		const possibilities = fillPossibilities(target - cont, allowedContainers);

		if (possibilities) {
			totalPos = [
				...totalPos,
				...possibilities.map(p => [...p, cont])
			];
		}
	}

	return totalPos;
}

function solve1(input) {
	const target = input.length > 5 ? 150 : 25;

	return fillPossibilities(target, input).length;
}

function solve2(input) {
	const target = input.length > 5 ? 150 : 25;

	const possibilities = fillPossibilities(target, input);

	const minContainers = possibilities.map(p => p.length).reduce((prevVal, v) => Math.min(prevVal, v));

	return possibilities.filter(p => p.length === minContainers).length;
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