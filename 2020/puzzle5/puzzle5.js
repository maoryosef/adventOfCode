'use strict';

const fs = require('fs');
const _ = require('lodash');

const OP_CODE_MAP = {
	F: 0,
	B: 1,
	L: 0,
	R: 1
};

function parseRow(row) {
	return row.split('').map(c => OP_CODE_MAP[c]);
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

function binaryWalk(steps, base = 127) {
	let high = base;
	let low = 0;

	for (let step of steps) {
		if (step) {
			low = Math.ceil((low + high) / 2);
		} else {
			high = Math.floor((low + high) / 2);
		}
	}

	return steps[steps.length - 1] ? high : low;
}

const calcSeats = input => _(input)
	.map(boardingPass => {
		const row = binaryWalk(boardingPass.slice(0, 7));
		const col = binaryWalk(boardingPass.slice(7), 7);

		return row * 8 + col;
	})
	.sort((a, b) => a - b)
	.value();

function solve1(input) {
	return _.last(calcSeats(input));
}

function solve2(input) {
	const seats = calcSeats(input);

	for (let i = 1; i < seats.length; i++) {
		if (seats[i] !== seats[i - 1] + 1) {
			return seats[i] - 1;
		}
	}
}

function exec(inputFilename, solver, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = parseInput(input);

	return solver(parsedInput);
}

module.exports = {
	exec1: (inputFilename) => exec(inputFilename, solve1),
	exec2: (inputFilename) => exec(inputFilename, solve2)
};