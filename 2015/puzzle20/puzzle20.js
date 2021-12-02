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
		.head();

	return parsedInput;
}

function calculateHouse(house, presents = 10, limitElves) {
	let totalPresents = 0;

	const limit = Math.ceil(house / 50);
	const houseSqrt = Math.sqrt(house);
	for (let i = 1; i <= houseSqrt; i++)  {
		if (house % i === 0) {
			const divisor = house / i;

			if (houseSqrt !== i && (!limitElves || divisor >= limit)) {
				totalPresents += divisor * presents;
			}

			if (!limitElves || i >= limit) {
				totalPresents += i * presents;
			}
		}
	}

	return totalPresents;
}

function solve1(input) {
	const max = input;
	let house = input / 100;

	while (calculateHouse(house) < input && house < max) {
		house++;
	}

	return house;
}

function solve2(input) {
	const max = input;
	let house = input / 100;

	while (calculateHouse(house, 11, true) < input && house < max) {
		house++;
	}

	return house;
}

function exec(inputFilename, solver, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = parseInput(input);

	return solver(parsedInput);
}

if (!global.TEST_MODE) {
	const inputFile = 'input.txt';
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