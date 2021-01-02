'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	const [op, v1, v2] = row.match(/(.*?) (a|b|.*)(?:, (.*))?/).slice(1).filter(x => x !== undefined);

	return {
		op,
		v1: isNaN(+v1) ? v1 : +v1,
		v2: isNaN(+v2) ? v2 : +v2
	};
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

const COMMANDS = {
	hlf: (state, v1) => state.reg[v1] = state.reg[v1] / 2,
	tpl: (state, v1) => state.reg[v1] *= 3,
	inc: (state, v1) => state.reg[v1] += 1,
	jmp: (state, v1) => state.op += v1 - 1,
	jie: (state, v1, v2) => state.op += state.reg[v1] % 2 === 0 ? v2 - 1 : 0,
	jio: (state, v1, v2) =>	state.op += state.reg[v1] === 1 ? v2 - 1 : 0
};

function runProgram(program, reg = {a: 0, b: 0}) {
	const state = {
		reg,
		op: 0
	};

	while (state.op >= 0 && state.op < program.length) {
		const cmd = program[state.op];

		COMMANDS[cmd.op](state, cmd.v1, cmd.v2);
		state.op++;
	}

	return state;
}

function solve1(input) {
	return runProgram(input).reg.b;
}

function solve2(input) {
	return runProgram(input, {a: 1, b: 0}).reg.b;
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