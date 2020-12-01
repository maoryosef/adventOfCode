'use strict';

const fs = require('fs');
const _ = require('lodash');

function findSum(target, array) {
	const seenNums = {};

	for (const n of array) {
		const complement = target - n;

		if (seenNums[complement]) {
			return [n, complement];
		}

		seenNums[n] = true;
	}
}

function solve(inputFilename, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = _(input)
		.split('\n')
		.map(num => parseInt(num))
		.value();

	const targets = parsedInput.map(n => 2020 - n);

	for (const t of targets) {
		const sum = findSum(t, parsedInput);

		if (sum) {
			const originalN = 2020 - t;

			return sum[0] * sum[1] * originalN;
		}
	}
}

module.exports = {
	solve
};