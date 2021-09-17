import fs from 'fs';
import _ from 'lodash';

function parseRow(row: string) {
	const [op, v1, v2] = row.match(/(.*?) (a|b|.*)(?:, (.*))?/)!.slice(1).filter(x => x !== undefined);

	return {
		op,
		v1: isNaN(+v1) ? v1 : +v1,
		v2: isNaN(+v2) ? v2 : +v2
	};
}

function parseInput(input: string) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

const COMMANDS = {
	hlf: (state: State, v1: keyof State['reg']) => state.reg[v1] = state.reg[v1] / 2,
	tpl: (state: State, v1: keyof State['reg']) => state.reg[v1] *= 3,
	inc: (state: State, v1: keyof State['reg']) => state.reg[v1] += 1,
	jmp: (state: State, v1: number) => state.op += v1 - 1,
	jie: (state: State, v1: keyof State['reg'], v2: number) => state.op += state.reg[v1] % 2 === 0 ? v2 - 1 : 0,
	jio: (state: State, v1: keyof State['reg'], v2: number) =>	state.op += state.reg[v1] === 1 ? v2 - 1 : 0
};

interface State {
	reg: {
		a: number;
		b: number;
	},
	op: number;
}

function runProgram(program: ParsedInput[], reg = {a: 0, b: 0}) {
	const state: State = {
		reg,
		op: 0
	};

	while (state.op >= 0 && state.op < program.length) {
		const cmd = program[state.op];

		COMMANDS[cmd.op](state, cmd.v1 as never, cmd.v2);
		state.op++;
	}

	return state;
}
interface ParsedInput {
	op: keyof typeof COMMANDS;
	v1: number | keyof State['reg'];
	v2: number;
}

function solve1(input: ParsedInput[]) {
	return runProgram(input).reg.b;
}

function solve2(input: ParsedInput[]) {
	return runProgram(input, {a: 1, b: 0}).reg.b;
}

function exec(inputFilename: string, solver: Function, inputStr?: string) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = parseInput(input);

	return solver(parsedInput);
}

if (!global.TEST_MODE) {
	const inputFile = 'input.test.1.txt';
	const {join} = require('path')

	const res = exec(
		join(__dirname, '__TESTS__', inputFile),
		solve1
	);

	console.log(res);
}

export default {
	exec1: (inputFilename: string) => exec(inputFilename, solve1),
	exec2: (inputFilename: string) => exec(inputFilename, solve2)
};