'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	const [command, value] = row.split(' ');
	return {
		command,
		value: parseInt(value)
	};
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

function solve1(input) {
	let depth = 0;
	let pos = 0;

	input.forEach(({command, value}) => {
		switch (command) {
			case 'forward': pos += value; break;
			case 'down': depth += value; break;
			case 'up': depth -= value; break;
		}
	});

	return depth * pos;
}

function solve2(input) {
	let depth = 0;
	let pos = 0;
	let aim = 0;

	input.forEach(({command, value}) => {
		switch (command) {
			case 'forward': pos += value; depth += aim * value; break;
			case 'down': aim += value; break;
			case 'up': aim -= value; break;
		}
	});

	return depth * pos;
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