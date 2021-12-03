'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.value();

	return parsedInput;
}

function getBitCountAtPosition(numbers, pos) {
	let bitCount = 0;
	numbers.forEach(row => {
		if (row[pos] === '1') {
			bitCount++;
		}
	});

	return [numbers.length - bitCount, bitCount];
}

function solve1(input) {
	let gamma = '';
	let epsilon = '';

	for (let i = 0; i < input[0].length; i++) {
		const [zeros, ones] = getBitCountAtPosition(input, i);

		if (ones > zeros) {
			gamma += '1';
			epsilon += '0';
		} else {
			gamma += '0';
			epsilon += '1';
		}
	}

	gamma = parseInt(gamma, 2);
	epsilon = parseInt(epsilon, 2);

	return gamma * epsilon;
}

function reduceNumbersList(numbers, predicate) {
	while (numbers.length > 1) {
		for (let i = 0; i < numbers[0].length; i++) {
			const [zeros, ones] = getBitCountAtPosition(numbers, i);

			numbers = numbers.filter(num => predicate(num[i], zeros, ones));
			if (numbers.length === 1) {
				break;
			}
		}
	}

	return numbers[0];
}

function solve2(input) {
	let oxyRating = reduceNumbersList(input, (n, zeros, ones) => n === (ones >= zeros ? '1' : '0'));
	let co2Rating = reduceNumbersList(input, (n, zeros, ones) => n === (ones >= zeros ? '0' : '1'));

	return parseInt(oxyRating, 2) * parseInt(co2Rating, 2);
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