'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	return row.split('');
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

const L_P_MAP = {
	'(': {r: ')', v: 1},
	'[': {r: ']', v: 2},
	'{': {r: '}', v: 3},
	'<': {r: '>', v: 4},
};

const R_P_MAP = {
	')': 3,
	']': 57,
	'}': 1197,
	'>': 25137,
};

function calcRowScore(row) {
	const stack = [];

	for (let c of row) {
		if (L_P_MAP[c]) {
			stack.push(c);
		} else if (L_P_MAP[stack.pop()].r !== c) {
			return {
				valid: false,
				score: R_P_MAP[c]
			};
		}
	}

	return {
		valid: true,
		score: stack
			.reverse()
			.map(c => L_P_MAP[c].v)
			.reduce((acc, v) => 5 * acc + v)
	};
}

function solve1(input) {
	return input
		.map(calcRowScore)
		.filter(x => !x.valid)
		.reduce((acc, row) => acc + row.score, 0);
}

function solve2(input) {
	const incompleteRows = input
		.map(calcRowScore)
		.filter(x => x.valid);

	return incompleteRows
		.sort((a, b) => a.score - b.score)[(incompleteRows.length - 1) / 2].score;
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
		solve2
	);

	console.log(res);
}

module.exports = {
	exec1: (inputFilename) => exec(inputFilename, solve1),
	exec2: (inputFilename) => exec(inputFilename, solve2)
};