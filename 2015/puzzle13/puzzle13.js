'use strict';

const fs = require('fs');
const _ = require('lodash');
const Combinatorics = require('js-combinatorics');

function parseRow(row) {
	const match = row.match(/^(.*?) would (gain|lose) (\d*) happiness units by sitting next to (.+)\./);
	const [, from, lg, points, to] = match;

	return {
		from: from.toLowerCase(),
		to: to.toLowerCase(),
		lg,
		points: +points * (lg === 'lose' ? -1 : 1)
	};
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.reduce((acc, v) => ({...acc, [v.from]: {...acc[v.from], [v.to]: v.points}}), {});

	return parsedInput;
}

function getScore(arrangement, input) {
	const first = arrangement[0];
	const last = arrangement[arrangement.length -1];

	return arrangement.reduce((acc, k, i) => {
		return acc + (input[k][arrangement[i + 1]] || 0) + (input[arrangement[i + 1]] && input[arrangement[i + 1]][k] || 0);
	}, input[first][last] + input[last][first]);
}

function solve1(input) {
	const permutations = Combinatorics.permutation(Object.keys(input)).toArray();

	return Math.max(...permutations.map(arrangement => getScore(arrangement, input)));
}

function solve2(input) {
	input['me'] = Object.keys(input).reduce((acc, k) => {
		input[k].me = 0;

		return {...acc, [k]: 0};
	}, {});

	const permutations = Combinatorics
		.permutation(Object.keys(input))
		.toArray()
		.map(arrangement => getScore(arrangement, input))
		.sort((a, b) => b - a);

	return permutations[0];
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