'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	const [cmd, arg1, arg2] = row.split(' ');

	return {
		cmd,
		arg1,
		arg2: arg2 && !isNaN(+arg2) ? +arg2 : arg2
	};
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

const numOrVar = (state, arg) => _.isNumber(arg) ? arg : state.vars[arg];
const throwIfZero = val => {
	if (val === 0) {
		throw new Error('no zero allowed');
	}

	return val;
};

const throwIfLessThan = (val, num) => {
	if (val < num) {
		throw new Error(`${val} must be at least ${num}`);
	}

	return val;
};

const COMMANDS = {
	add: (state, arg1, arg2) => {state.vars[arg1] = state.vars[arg1] + numOrVar(state, arg2);},
	mul: (state, arg1, arg2) => {state.vars[arg1] = state.vars[arg1] * numOrVar(state, arg2);},
	div: (state, arg1, arg2) => {state.vars[arg1] = Math.trunc(state.vars[arg1] / throwIfZero(numOrVar(state, arg2)));},
	mod: (state, arg1, arg2) => {state.vars[arg1] = throwIfLessThan(state.vars[arg1], 0) % throwIfLessThan(numOrVar(state, arg2), 1);},
	eql: (state, arg1, arg2) => {state.vars[arg1] = +(state.vars[arg1] === numOrVar(state, arg2));},
	noop: () => {}
};

function runProgram(program, input = [9,9,9,1,9,9,9,9,9,9,9,9,9,9]) {
	const state = {
		vars: {w: 0, x: 0, y: 0, z: 0}
	};

	let inpCount = 0;
	for (let op = 0; op < program.length; op++) {
		const {cmd, arg1, arg2} = program[op];
		if (cmd === 'inp') {
			state.vars.w = input[inpCount++];
		} else {
			COMMANDS[cmd](state, arg1, arg2);
		}
	}

	return state.vars.z === 0;
}

//0. z = 15 + input[0]
//1. z = 26z + 5 + input[1]
//2. z = 26z + 6 + input[2]
//3. z = z % 26 - 14 === input[3] ? z / 26 : z - z % 26 + 7 + input[3]
//4. z = 26z + 9 + input[4]
//5. z = z % 26 - 7 === input[5] ? z / 26 : z - z % 26 + 6 + input[5]
//6. z = 26z + 14 + input[6]
//7. z = 26z + 3 + input[7]
//8. z = 26z + 1 + input[8]
//9. z = z % 26 - 7 === input[9] ? z / 26 : z - z % 26 + 3 + input[9]
//10. z = z % 26 - 8 === input[10] ? z / 26 : z - z % 26 + 4 + input[10]
//11. z = z % 26 - 7 === input[11] ? z / 26 : z - z % 26 + 6 + input[11]
//12. z = z % 26 - 5 === input[12] ? z / 26 : z - z % 26 + 7 + input[12]
//13. z = z % 26 - 10 === input[13] ? z / 26 : z - z % 26 + 1 + input[13]
const RULES = [
	{add: 15},
	{add: 5},
	{add: 6},
	{sub: -14, add: 7},
	{add: 9},
	{sub: -7, add: 6},
	{add: 14},
	{add: 3},
	{add: 1},
	{sub: -7, add: 3},
	{sub: -8, add: 4},
	{sub: -7, add: 6},
	{sub: -5, add: 7},
	{sub: -10, add: 1},
];

function calculateModelNumber(input) {
	let z = 0;
	for (let i = 0; i < input.length; i++) {
		const {add, sub} = RULES[i];
		if (sub) {
			if (z % 26 + sub === input[i]) {
				z = Math.trunc(z / 26);
			} else {
				return {
					success: false,
					idx: i,
					expected: z % 26 + sub
				};
			}
		} else {
			z = 26 * z + add + input[i];
		}
	}

	return {
		success: z === 0
	};
}

function validateAndFixInput(input) {
	let res = calculateModelNumber(input);
	while (!res.success && res.expected > 0 & res.expected < 10) {
		input[res.idx] = res.expected;
		res = calculateModelNumber(input);
	}

	return res.success;
}

function solve1(program) {
	for (let i0 = 9; i0 > 0; i0--) {
		for (let i1 = 9; i1 > 0; i1--) {
			for (let i2 = 9; i2 > 0; i2--) {
				for (let i4 = 9; i4 > 0; i4--) {
					for (let i6 = 9; i6 > 0; i6--) {
						for (let i7 = 9; i7 > 0; i7--) {
							for (let i8 = 9; i8 > 0; i8--) {
								const input = [i0,i1,i2,9,i4,9,i6,i7,i8,9,9,9,9,9];

								if (validateAndFixInput(input)) {
									if (runProgram(program, input)) {
										return parseInt(input.join(''));
									}
								}
							}
						}
					}
				}
			}
		}
	}
}

function solve2(program) {
	for (let i0 = 1; i0 < 10; i0++) {
		for (let i1 = 1; i1 < 10; i1++) {
			for (let i2 = 1; i2 < 10; i2++) {
				for (let i4 = 1; i4 < 10; i4++) {
					for (let i6 = 1; i6 < 10; i6++) {
						for (let i7 = 1; i7 < 10; i7++) {
							for (let i8 = 1; i8 < 10; i8++) {
								const input = [i0,i1,i2,9,i4,9,i6,i7,i8,9,9,9,9,9];

								if (validateAndFixInput(input)) {
									if (runProgram(program, input)) {
										return parseInt(input.join(''));
									}
								}
							}
						}
					}
				}
			}
		}
	}
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
		solve2);

	console.log(res);
}

module.exports = {
	exec1: (inputFilename) => exec(inputFilename, solve1),
	exec2: (inputFilename) => exec(inputFilename, solve2)
};