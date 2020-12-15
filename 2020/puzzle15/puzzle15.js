'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseInput(input) {
	const parsedInput = _(input)
		.split(',')
		.map(n => parseInt(n))
		.value();

	return parsedInput;
}

function solve1(input, turns = 2020) {
	const mem = new Map();
	let turn = 1;

	input.forEach(num => mem.set(num, turn++));

	let nextNum = 0;

	while (turn < turns) {
		if (mem.get(nextNum)) {
			const numToUpdate = nextNum;
			nextNum = turn - mem.get(nextNum);
			mem.set(numToUpdate, turn);
		} else {
			mem.set(nextNum, turn);
			nextNum = 0;
		}

		turn++;
	}

	return nextNum;
}

function solve2(input) {
	return solve1(input, 30000000);
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