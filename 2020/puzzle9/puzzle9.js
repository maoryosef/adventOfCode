'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	return parseInt(row);
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

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

function solve1(input) {
	const windowSize = input.length > 25 ? 25 : 5;

	for (let i = 0; i < input.length - windowSize; i++) {
		if (!findSum(input[i + windowSize], input.slice(i, i + windowSize))) {
			return input[i + windowSize];
		}
	}

	return -1;
}

function solve2(input) {
	const target = solve1(input);

	let start = 0;
	let end = 1;
	let sum = input[start] + input[end];

	while (sum !== target && end < input.length) {
		if (sum < target) {
			end++;
			sum += input[end];
		}

		if (sum > target) {
			sum -= input[start];
			start++;
		}
	}

	if (sum === target) {
		const arraySlice = input.slice(start, end + 1);
		const minNum = Math.min(...arraySlice);
		const maxNum = Math.max(...arraySlice);

		return minNum + maxNum;
	}


	return -1;
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