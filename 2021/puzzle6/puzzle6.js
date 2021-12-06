'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseInput(input) {
	const parsedInput = _(input)
		.split(',')
		.map(x => parseInt(x))
		.value();

	return parsedInput;
}

const cache = new Map();

function fishbonacci(spawnTimer, days) {
	const cacheKey = `${spawnTimer},${days}`;

	if (cache.has(cacheKey)) {
		return cache.get(cacheKey);
	}

	let res;

	if (days < 1) {
		res = 1;
	} else if (spawnTimer === 0) {
		res = fishbonacci(6, days - 1) + fishbonacci(8, days - 1);
	} else {
		res = fishbonacci(0, days - spawnTimer);
	}

	cache.set(cacheKey, res);

	return res;
}

function solve1(input, days = 80) {
	const groupedInput = _.groupBy(input);

	return Object.keys(groupedInput).reduce((acc, f) => {
		const fishCount = fishbonacci(f, days);

		acc += fishCount * groupedInput[f].length;

		return acc;
	}, 0);
}

function solve2(input) {
	return solve1(input, 256);
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