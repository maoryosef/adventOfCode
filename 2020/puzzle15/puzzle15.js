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

	input.forEach((num, idx) => mem.set(num, idx + 1));

	let nextNum = 0;
	let prevNum;

	for (let turn = input.length + 1; turn < turns; turn++) {
		prevNum = nextNum;
		nextNum = mem.has(nextNum) ? turn - mem.get(nextNum) : 0;
		mem.set(prevNum, turn);
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
		solve1
	);

	console.log(res);
}

module.exports = {
	exec1: (inputFilename) => exec(inputFilename, solve1),
	exec2: (inputFilename) => exec(inputFilename, solve2)
};