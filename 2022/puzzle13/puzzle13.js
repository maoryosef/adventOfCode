'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	return row.split('\n').map(r => eval(r));
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

function comparePair(left, right) {
	if (_.isNumber(left) && _.isNumber(right)) {
		return left - right;
	}

	if (_.isArray(left) && _.isNumber(right)) {
		return comparePair(left, [right]);
	}

	if (_.isNumber(left) && _.isArray(right)) {
		return comparePair([left], right);
	}

	if (_.isArray(left) && _.isArray(right)) {
		for (let i = 0; i < left.length; i++) {
			const leftVal = left[i];
			const rightVal = right[i];
			if (rightVal === undefined) {
				return 1; //left is larger in this case
			}

			const compare = comparePair(leftVal, rightVal);

			if (compare !== 0) {
				return compare;
			}
		}

		if (left.length < right.length) {
			return -1; //right is larger in this case
		}
	}

	return 0; //they are equal
}

function solve1(input) {
	let sum = 0;
	for (let i = 0; i < input.length; i++) {
		if (comparePair(input[i][0], input[i][1]) < 1) {
			sum += i + 1;
		}
	}

	return sum;
}

function solve2(input) {
	const divider1 = [[2]];
	const divider2 = [[6]];
	const packets = input.flat().concat([divider1], [divider2]);

	const sortedPackets = packets.sort(comparePair);

	const d1Idx = sortedPackets.indexOf(divider1);
	const d2Idx = sortedPackets.indexOf(divider2);

	return (d1Idx + 1) * (d2Idx + 1);
}

function exec(inputFilename, solver, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = parseInput(input);

	return solver(parsedInput);
}

if (!global.TEST_MODE) {
	const inputFile = 'input.test.1.txt';
	const {join} = require('path');

	const res = exec(
		join(__dirname, '__TESTS__', inputFile),
		solve1
	);

	console.log(res);
}

module.exports = {
	exec1: (inputFilename) => exec(inputFilename, solve1),
	exec2: (inputFilename) => exec(inputFilename, solve2)
};