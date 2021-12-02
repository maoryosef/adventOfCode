'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	const props = row
		.split(/Sue \d+: /)[1]
		.split(', ')
		.map(x => x.split(': '))
		.reduce((obj, [k, v]) => {
			obj[k] = +v;

			return obj;
		}, {});

	return props;
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.map((aunt, idx) => ({...aunt, num: idx + 1}))
		.value();

	return parsedInput;
}

const KEYS = {
	children: 3,
	cats: 7,
	samoyeds: 2,
	pomeranians: 3,
	akitas: 0,
	vizslas: 0,
	goldfish: 5,
	trees: 3,
	cars: 2,
	perfumes: 1
};

function solve1(input) {
	return input.find(aunt => {
		let found = true;
		for (const key of Object.keys(KEYS)) {
			if (aunt[key] !== undefined) {
				if (aunt[key] !== KEYS[key]) {
					found = false;
					break;
				}
			}
		}

		return found;
	}).num;
}

function solve2(input) {
	return input.find(aunt => {
		let found = true;
		for (const key of Object.keys(KEYS)) {
			if (aunt[key] !== undefined) {
				if (['cats', 'trees'].includes(key)) {
					if (aunt[key] <= KEYS[key]) {
						found = false;
						break;
					}

					continue;
				}

				if (['pomeranians', 'goldfish'].includes(key)) {
					if (aunt[key] >= KEYS[key]) {
						found = false;
						break;
					}

					continue;
				}

				if (aunt[key] !== undefined) {
					if (aunt[key] !== KEYS[key]) {
						found = false;
						break;
					}
				}
			}
		}

		return found;
	}).num;
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