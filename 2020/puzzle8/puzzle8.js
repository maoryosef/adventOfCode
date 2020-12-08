'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	const [op, value] = row.split(' ');

	return {
		op,
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
const INSTRUCTIONS = {
	nop: context => {context.op++;},
	acc: (context, value) => {
		context.acc += value;
		context.op++;
	},
	jmp: (context, value) => {
		context.op += value;
	}
};

function runProgram(program, onStepCB) {
	const context = {
		op: 0,
		acc: 0
	};

	while (context.op < program.length && onStepCB(context)) {
		const {op, value} = program[context.op];

		INSTRUCTIONS[op](context, value);
	}

	return context.acc;
}

function solve1(input) {
	const opsSet = new Set();

	const stepCB = context => {
		if (opsSet.has(context.op)) {
			return false;
		}

		opsSet.add(context.op);

		return true;
	};

	return runProgram(input, stepCB);
}

function isFinite(program) {
	const opsSet = new Set();

	const stepCB = context => {
		if (opsSet.has(context.op)) {
			throw new Error('halt');
		}

		opsSet.add(context.op);

		return true;
	};

	try {
		runProgram(program, stepCB);
	} catch (e) {
		return false;
	}

	return true;
}

function solve2(input) {
	const indices = input.reduce((acc, value, idx) => {
		if (value.op === 'jmp') {
			acc.push(idx);
		}

		return acc;
	}, []);

	const indexToSwitch = indices.find(pos =>{
		const program = input.slice(0);
		program[pos] = {op: 'nop', value: 0};

		return isFinite(program);
	});

	const program = input.slice(0);
	program[indexToSwitch] = {op: 'nop', value: 0};

	return runProgram(program, () => true);
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