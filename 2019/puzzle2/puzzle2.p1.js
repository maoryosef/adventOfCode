'use strict';

const TEST_MODE=false;

const fs = require('fs');
const _ = require('lodash');

const input = fs.readFileSync(`${__dirname}/input${TEST_MODE ? '.test': ''}.txt`, 'utf-8');

const codes = _(input)
	.split(',')
	.map(num => parseInt(num))
	.value();

let index = 0;

codes[1] = 12;
codes[2] = 2;

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
		throw new Error('unexpected op', op, 'at index', index);
	}

	index += 4;
}

const res = codes[0];

console.log(res);