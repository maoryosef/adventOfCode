'use strict';

const fs = require('fs');

function parseRules(rules) {
	return Object.fromEntries(rules.split('\n').map(r => r.split(' -> ')));
}

function parseInput(input) {
	const [pattern, rules] = input
		.split('\n\n');

	return {
		pattern,
		rules: parseRules(rules)
	};
}

function addCounts(target, counts) {
	for (const element in counts) {
		target[element] = (target[element] || 0) + counts[element];
	}
}

function countChars(c1, c2, rules, gen, cache = {}) {
	if (gen === 0) {
		return { [c2]: 1 };
	}

	const pair = `${c1}${c2}`;
	const cacheKey = `${pair}:${gen}`;

	if (cache[cacheKey]) {
		return cache[cacheKey];
	}

	const middleChar = rules[pair];

	cache[cacheKey] = cache[cacheKey] || {};

	addCounts(cache[cacheKey], countChars(c1, middleChar, rules, gen - 1, cache));
	addCounts(cache[cacheKey], countChars(middleChar, c2, rules, gen - 1, cache));

	return cache[cacheKey];
}

function solve1({pattern, rules}, runs = 10) {
	const counts = { [pattern[0]]: 1 };
	for (let i = 0; i < pattern.length - 1; i++) {
		const c1 = pattern[i];
		const c2 = pattern[i + 1];

		addCounts(counts, countChars(c1, c2, rules, runs));
	}

	const occurrences = Object.values(counts).sort((a, b) => a - b);

	return occurrences[occurrences.length - 1] - occurrences[0];
}

function solve2(input) {
	return solve1(input, 40);
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