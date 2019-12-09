'use strict';

const TEST_MODE=false;

const fs = require('fs');
const _ = require('lodash');

const input = fs.readFileSync(`${__dirname}/input${TEST_MODE ? '.test': ''}.txt`, 'utf-8');

const codes = _(input)
	.split(',')
	.map(num => parseInt(num))
	.value();

function parseOp(op) {
	let tempOp = Math.trunc(op / 100);
	const action = op % 100;

	const args = [];
	while (tempOp) {
		args.push(tempOp % 10);
		tempOp = Math.trunc(tempOp / 10);
	}

	return {
		args,
		action
	};
}

function getArgByPosition(program, idx, argState, relativeBase) {
	switch(argState) {
		case 0: {return program[program[idx] || 0] || 0;}
		case 1: {return program[idx] || 0;}
		case 2: {return program[(program[idx] || 0) + relativeBase] || 0;}
	}
}

function getArgs(program, idx, argsState, relativeBase) {
	const [argPos1 = 0, argPos2 = 0, argPos3 = 0] = argsState;

	const arg1 = getArgByPosition(program, idx + 1, argPos1, relativeBase);
	const arg2 = getArgByPosition(program, idx + 2, argPos2, relativeBase);
	let out = program[idx + 3];
	if (argPos3 === 2) {
		out += relativeBase;
	}

	return {out, arg1, arg2};
}

function runProgram(inputArray, programSource) {
	const program = programSource.slice(0);
	let output = null;
	let inputIdx = 0;
	let opIndex = 0;
	let relativeBase = 0;
	while (program[opIndex] !== 99) {
		const {action, args} = parseOp(program[opIndex]);
		const {out, arg1, arg2} = getArgs(program, opIndex, args, relativeBase);

		let next = 1;
		switch (action) {
			case 1: program[out] = arg1 + arg2; next = 4; break;
			case 2: program[out] = arg1 * arg2; next = 4; break;
			case 3: {
				let out = program[opIndex + 1];
				if (args[0] === 2) {
					out += relativeBase;
				}

				program[out] = inputArray[inputIdx++];
				next = 2;
				break;
			}
			case 4: output = arg1; next = 2; break;
			case 5: {
				if (arg1 !== 0) {
					opIndex = arg2;
					next = 0;
				} else {
					next = 3;
				}
				break;
			}
			case 6: {
				if (arg1 === 0) {
					opIndex = arg2;
					next = 0;
				} else {
					next = 3;
				}
				break;
			}
			case 7: {
				if (arg1 < arg2) {
					program[out] = 1;
				} else {
					program[out] = 0;
				}
				next = 4;
				break;
			}
			case 8: {
				if (arg1 === arg2) {
					program[out] = 1;
				} else {
					program[out] = 0;
				}
				next = 4;
				break;
			}
			case 9: relativeBase += arg1; next = 2; break;
			default:
				throw new Error(`unexpected op, ${action}, at index, ${opIndex}`);
		}

		opIndex += next;
	}

	return output;
}

const res = runProgram([2], codes);

console.log('output:', res);