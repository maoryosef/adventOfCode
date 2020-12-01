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

	const [n1, n2] = findSum(2020, parsedInput);

	return n1 * n2;
}

module.exports = {
	solve
};