'use strict';

const _ = require('lodash');

const parseProgram = input => _(input)
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
		case 0: {return program[idx] || 0;}
		case 1: return idx;
		case 2: {return (program[idx] || 0) + relativeBase;}
	}
}

function getArgs(program, idx, argsState, relativeBase) {
	const [argPos1 = 0, argPos2 = 0, argPos3 = 0] = argsState;

	const arg1 = getArgByPosition(program, idx + 1, argPos1, relativeBase);
	const arg2 = getArgByPosition(program, idx + 2, argPos2, relativeBase);
	const arg3 = getArgByPosition(program, idx + 3, argPos3, relativeBase);

	return {arg1, arg2, arg3};
}

function runProgram(inputArray, programSource) {
	const program = programSource.slice(0);
	let output = null;
	let inputIdx = 0;
	let opIndex = 0;
	let relativeBase = 0;
	while (program[opIndex] !== 99) {
		const {action, args} = parseOp(program[opIndex]);
		const {arg1, arg2, arg3} = getArgs(program, opIndex, args, relativeBase);

		const arg1Value = program[arg1] || 0;
		const arg2Value = program[arg2] || 0;

		let next = 1;
		switch (action) {
			case 1: program[arg3] = arg1Value + arg2Value; next = 4; break;
			case 2: program[arg3] = arg1Value * arg2Value; next = 4; break;
			case 3: {
				program[arg1] = inputArray[inputIdx++];
				next = 2;
				break;
			}
			case 4: output = arg1Value; next = 2; break;
			case 5: {
				if (arg1Value !== 0) {
					opIndex = arg2Value;
					next = 0;
				} else {
					next = 3;
				}
				break;
			}
			case 6: {
				if (arg1Value === 0) {
					opIndex = arg2Value;
					next = 0;
				} else {
					next = 3;
				}
				break;
			}
			case 7: {
				if (arg1Value < arg2Value) {
					program[arg3] = 1;
				} else {
					program[arg3] = 0;
				}
				next = 4;
				break;
			}
			case 8: {
				if (arg1Value === arg2Value) {
					program[arg3] = 1;
				} else {
					program[arg3] = 0;
				}
				next = 4;
				break;
			}
			case 9: relativeBase += arg1Value; next = 2; break;
			default:
				throw new Error(`unexpected op, ${action}, at index, ${opIndex}`);
		}

		opIndex += next;
	}

	return output;
}

module.exports = {
	parseProgram,
	runProgram
};