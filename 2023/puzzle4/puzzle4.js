'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	const [, values] = row.split(': ');
	const [rolled, picked] = values.split(' | ').map(a => a.split(' ').filter(x => !!x).map(x => +x));
	return [rolled, picked];
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

const testCases1 = [13];
const expectedRes1 = 21213;
function solve1(input) {
	return _(input)
		.map(([rolled, picked]) => _.intersection(rolled, picked).length)
		.map(x => x && Math.pow(2, x - 1))
		.sum();
}

const testCases2 = [30];
const expectedRes2 = 8549735;
function solve2(input) {
	const cards = input.map(([rolled, picked], i) => ({
		id: i,
		count: _.intersection(picked, rolled).length,
		instances: 1
	}));

	for (const c of cards) {
		for (let i = 0; i < c.count; i++) {
			if (cards[c.id + i + 1]) {
				cards[c.id + i + 1].instances += c.instances;
			}
		}
	}

	return _(cards)
		.map('instances')
		.sum();
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
	exec2: (inputFilename) => exec(inputFilename, solve2),
	expectedRes1,
	expectedRes2,
	testCases1,
	testCases2
};