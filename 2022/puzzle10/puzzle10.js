'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	const [cmd, val] = row.split(' ');

	return [cmd, +val];
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

const COMMANDS = {
	noop: {cycles: 1, action: () => {}},
	addx: {cycles: 2, action: (state, val) => {state.x += val;}}
};

function* runProgram(program) {
	const state = {
		cycle: 0,
		x: 1
	};

	for (const [cmd, val] of program) {
		const c = COMMANDS[cmd];

		for (let i = 0; i < c.cycles; i++) {
			state.cycle++;

			yield {...state};
		}

		c.action(state, val);
	}
}

function solve1(program) {
	let sum = 0;

	for (const {cycle, x} of runProgram(program)) {
		if (!((cycle - 20) % 40)) {
			sum += cycle * x;
		}
	}

	return sum;
}

function solve2(program) {
	const screen = new Array(240).fill('.');

	for (const state of runProgram(program)) {
		if (Math.abs(((state.cycle - 1) % 40) - state.x) <= 1 ) {
			screen[state.cycle - 1] = '#';
		}
	}

	return screen.join('');
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