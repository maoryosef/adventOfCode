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

function runProgram(inputArray, programSource) {
	const program = programSource.slice(0);
	let output = null;
	let inputIdx = 0;
	let opIndex = 0;
	while (program[opIndex] !== 99) {
		const {action, args} = parseOp(program[opIndex]);

		let next = 1;
		if (action === 1) {
			const [argPos1, argPos2] = args;

			const arg1 = argPos1 ? program[opIndex + 1] : program[program[opIndex + 1]];
			const arg2 = argPos2 ? program[opIndex + 2] : program[program[opIndex + 2]];
			const out = program[opIndex + 3];

			program[out] = arg1 + arg2;
			next = 4;
		} else if (action === 2) {
			const [argPos1, argPos2] = args;

			const arg1 = argPos1 ? program[opIndex + 1] : program[program[opIndex + 1]];
			const arg2 = argPos2 ? program[opIndex + 2] : program[program[opIndex + 2]];
			const out = program[opIndex + 3];

			program[out] = arg1 * arg2;
			next = 4;
		} else if (action === 3) {
			const out = program[opIndex + 1];
			program[out] = inputArray[inputIdx++];
			next = 2;
		} else if (action === 4) {
			const [argPos1] = args;
			const out = argPos1 ? program[opIndex + 1] : program[program[opIndex + 1]];

			output = out;
			next = 2;
		} else if (action === 5) {
			const [argPos1, argPos2] = args;
			const arg1 = argPos1 ? program[opIndex + 1] : program[program[opIndex + 1]];
			const arg2 = argPos2 ? program[opIndex + 2] : program[program[opIndex + 2]];

			if (arg1 !== 0) {
				opIndex = arg2;
				next = 0;
			} else {
				next = 3;
			}
		} else if (action === 6) {
			const [argPos1, argPos2] = args;
			const arg1 = argPos1 ? program[opIndex + 1] : program[program[opIndex + 1]];
			const arg2 = argPos2 ? program[opIndex + 2] : program[program[opIndex + 2]];

			if (arg1 === 0) {
				opIndex = arg2;
				next = 0;
			} else {
				next = 3;
			}
		} else if (action === 7) {
			const [argPos1, argPos2] = args;
			const arg1 = argPos1 ? program[opIndex + 1] : program[program[opIndex + 1]];
			const arg2 = argPos2 ? program[opIndex + 2] : program[program[opIndex + 2]];
			const out = program[opIndex + 3];

			if (arg1 < arg2) {
				program[out] = 1;
			} else {
				program[out] = 0;
			}
			next = 4;
		} else if (action === 8) {
			const [argPos1, argPos2] = args;
			const arg1 = argPos1 ? program[opIndex + 1] : program[program[opIndex + 1]];
			const arg2 = argPos2 ? program[opIndex + 2] : program[program[opIndex + 2]];
			const out = program[opIndex + 3];

			if (arg1 === arg2) {
				program[out] = 1;
			} else {
				program[out] = 0;
			}
			next = 4;
		} else {
			throw new Error(`unexpected op, ${action}, at index, ${opIndex}`);
		}

		opIndex += next;
	}

	return output;
}

const BASE=5;
function incInput(inputArray) {
	let carry = 0;
	let idx = inputArray.length - 1;

	inputArray[idx]++;

	while (idx > -1) {
		inputArray[idx] += carry;

		if (inputArray[idx] === BASE) {
			carry = 1;
			inputArray[idx] = 0;
		} else {
			carry = 0;
		}

		idx--;
	}
}

const inputArray = [0, 0, 0, 0, 0];
let largestOutput = -Infinity;
do {
	incInput(inputArray);

	const inputSet = new Set(inputArray);
	if (inputSet.size !== 5) {
		continue;
	}

	// console.log('input', inputArray.join(','));
	const output = inputArray.reduce((acc, val) => runProgram([val, acc], codes), 0);
	// console.log('ouput', output);
	if (output > largestOutput) {
		largestOutput = output;
	}
} while (inputArray.join('') !== '00000');

console.log(largestOutput);