'use strict';

const TEST_MODE=false;

const fs = require('fs');
const _ = require('lodash');

const input = fs.readFileSync(`${__dirname}/input${TEST_MODE ? '.test': ''}.txt`, 'utf-8');

const opCodes = _(input)
	.split(',')
	.map(num => parseInt(num))
	.value();

function runProgram(codes, input1, input2) {
	codes[1] = input1;
	codes[2] = input2;

	let index = 0;

	while (codes[index] !== 99) {
		const op = codes[index];
		const arg1 = codes[index + 1];
		const arg2 = codes[index + 2];
		const out = codes[index + 3];

		if (op === 1) {
			codes[out] = codes[arg1] + codes[arg2];
		} else if (op === 2) {
			codes[out] = codes[arg1] * codes[arg2];
		} else {
			console.error(`unexpected op ${op} at index ${index}`);
		}

		index += 4;
	}

	return codes[0];
}

let input1 = 1;
let input2 = 1;

while (runProgram(opCodes.slice(0), input1, input2) != 19690720) {
	input2++;

	if (input2 >= opCodes.length) {
		input2 = 1;
		input1++;
	}

	if (input1 >= opCodes.length) {
		break;
	}
}

console.log(input1, input2);
console.log(100 * input1 + input2);