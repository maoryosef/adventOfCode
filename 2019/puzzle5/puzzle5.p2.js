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

const INPUT = 5;
while (codes[index] !== 99) {
	const {action, args} = parseOp(codes[index]);

	let next = 1;
	if (action === 1) {
		const [argPos1, argPos2] = args;

		const arg1 = argPos1 ? codes[index + 1] : codes[codes[index + 1]];
		const arg2 = argPos2 ? codes[index + 2] : codes[codes[index + 2]];
		const out = codes[index + 3];

		codes[out] = arg1 + arg2;
		next = 4;
	} else if (action === 2) {
		const [argPos1, argPos2] = args;

		const arg1 = argPos1 ? codes[index + 1] : codes[codes[index + 1]];
		const arg2 = argPos2 ? codes[index + 2] : codes[codes[index + 2]];
		const out = codes[index + 3];

		codes[out] = arg1 * arg2;
		next = 4;
	} else if (action === 3) {
		const out = codes[index + 1];
		codes[out] = INPUT;
		next = 2;
	} else if (action === 4) {
		const [argPos1] = args;
		const out = argPos1 ? codes[index + 1] : codes[codes[index + 1]];

		console.log('output', out);
		next = 2;
	} else if (action === 5) {
		const [argPos1, argPos2] = args;
		const arg1 = argPos1 ? codes[index + 1] : codes[codes[index + 1]];
		const arg2 = argPos2 ? codes[index + 2] : codes[codes[index + 2]];

		if (arg1 !== 0) {
			index = arg2;
			next = 0;
		} else {
			next = 3;
		}
	} else if (action === 6) {
		const [argPos1, argPos2] = args;
		const arg1 = argPos1 ? codes[index + 1] : codes[codes[index + 1]];
		const arg2 = argPos2 ? codes[index + 2] : codes[codes[index + 2]];

		if (arg1 === 0) {
			index = arg2;
			next = 0;
		} else {
			next = 3;
		}
	} else if (action === 7) {
		const [argPos1, argPos2] = args;
		const arg1 = argPos1 ? codes[index + 1] : codes[codes[index + 1]];
		const arg2 = argPos2 ? codes[index + 2] : codes[codes[index + 2]];
		const out = codes[index + 3];

		if (arg1 < arg2) {
			codes[out] = 1;
		} else {
			codes[out] = 0;
		}
		next = 4;
	} else if (action === 8) {
		const [argPos1, argPos2] = args;
		const arg1 = argPos1 ? codes[index + 1] : codes[codes[index + 1]];
		const arg2 = argPos2 ? codes[index + 2] : codes[codes[index + 2]];
		const out = codes[index + 3];

		if (arg1 === arg2) {
			codes[out] = 1;
		} else {
			codes[out] = 0;
		}
		next = 4;
	} else {
		throw new Error(`unexpected op, ${action}, at index, ${index}`);
	}

	index += next;
}
