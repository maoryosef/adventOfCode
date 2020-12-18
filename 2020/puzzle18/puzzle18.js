'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.value();

	return parsedInput;
}

function evaluateExpression(str) {
	let sum = 0;
	let op;
	for (let i = 0; i < str.length; i++) {
		const c = str.charAt(i);
		if (c === ' ') {
			continue;
		}

		if (c === '+' || c === '*') {
			op = c;
			continue;
		}

		if (c === ')') {
			return {sum, i};
		}

		let d;

		if (c === '(') {
			const val = evaluateExpression(str.substr(i + 1));
			d = val.sum;
			i += val.i + 1;
		} else {
			d = +c;
		}

		if (!op) {
			sum = d;
		} else {
			if (op === '+') {
				sum += d;
			} else {
				sum *= d;
			}
			op = null;
		}
	}

	return {sum, i: str.length};
}

function solve1(input) {
	return input
		.map(row => evaluateExpression(row))
		.reduce((acc, {sum}) => acc + sum, 0);
}

function evaluateExpression2(str, fromParen = true) {
	let sum = 0;
	let op;
	for (let i = 0; i < str.length; i++) {
		const c = str.charAt(i);
		if (c === ' ') {
			continue;
		}

		if (c === '+') {
			op = c;
			continue;
		}

		if (c === ')') {
			if (fromParen) {
				return {sum, i};
			}

			return {sum, i: i - 1};
		}

		let d;

		if (c === '(' || c === '*') {
			const val = evaluateExpression2(str.substr(i + 1), c === '(');
			d = val.sum;
			i += val.i + 1;
			if (c === '*') {
				op = '*';
			}
		} else {
			d = +c;
		}

		if (!op) {
			sum = d;
		} else {
			if (op === '+') {
				sum += d;
			} else {
				sum *= d;
			}
			op = null;
		}
	}

	return {sum, i: str.length};
}

function solve2(input) {
	return input
		.map(row => evaluateExpression2(row))
		.reduce((acc, { sum }) => acc + sum, 0);
}

function exec(inputFilename, solver, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = parseInput(input);

	return solver(parsedInput);
}

if (!global.TEST_MODE) {
	const inputFile = 'input.test.2.txt';
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