'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	return row.split('\n').map(r => JSON.parse(r));
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

function comparePair(left, right) {
	if (Number.isInteger(left) && Number.isInteger(right)) {
		return left - right;
	}

	if (!Number.isInteger(left) && Number.isInteger(right)) {
		return comparePair(left, [right]);
	}

	if (Number.isInteger(left) && !Number.isInteger(right)) {
		return comparePair([left], right);
	}

	for (let i = 0; i < left.length && i < right.length; i++) {
		const compare = comparePair(left[i], right[i]);

		if (compare !== 0) {
			return compare;
		}
	}

	return left.length - right.length;
}

function solve1(input) {
	return input
		.map((pair, idx) => comparePair(...pair) < 1 ? idx + 1: 0)
		.reduce((sum, v) => sum + v, 0);

}

function solve2(input) {
	const divider1 = [[2]];
	const divider2 = [[6]];
	const packets = input
		.flat()
		.concat([divider1], [divider2])
		.sort(comparePair);

	const d1Idx = packets.indexOf(divider1);
	const d2Idx = packets.indexOf(divider2);

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