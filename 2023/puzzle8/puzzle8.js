'use strict';

const fs = require('fs');
const _ = require('lodash');
const {getPrimeFactors} = require('aoc-utils').mathUtils;

function parseRow(row) {
	const [, k, L, R] = row.match(/^(.*?)\s+=\s+\((.*?),\s+(.*?)\)$/);

	return [k, { L, R }];
}

function parseInput(input) {
	const [instructions, rest] = input.split('\n\n');
	const parsedInput = _(rest).split('\n').map(parseRow).fromPairs().value();

	return [instructions, parsedInput];
}

const testCases1 = [2, 6];
const expectedRes1 = 11911;
function solve1([instructions, map]) {
	let currNode = 'AAA';
	let steps = 0;

	while (currNode !== 'ZZZ') {
		const step = instructions[steps % instructions.length];
		currNode = map[currNode][step];
		steps++;
	}

	return steps;
}

const testCases2 = [undefined, undefined, 6];
const expectedRes2 = 10151663816849;
function solve2([instructions, map]) {
	const currNodes = Object.keys(map).filter((k) => k.at(-1) === 'A');
	const stepsToZ = new Array(currNodes.length).fill(undefined);
	let steps = 0;

	while (!stepsToZ.every((s) => !!s)) {
		const step = instructions[steps++ % instructions.length];
		for (let i = 0; i < currNodes.length; i++) {
			if (stepsToZ[i]) {
				continue;
			}

			currNodes[i] = map[currNodes[i]][step];
			if (currNodes[i].at(-1) === 'Z') {
				stepsToZ[i] = steps;
			}
		}
	}

	const uniqueFactors = stepsToZ
		.map((s) => getPrimeFactors(s))
		.map((f) => _(f).groupBy().mapValues('length').entries())
		.reduce((acc, factors) => {
			factors.forEach(([factor, exp]) => {
				if (!acc[factor] || acc[factor] < exp) {
					acc[factor] = exp;
				}
			});

			return acc;
		}, {});

	return _(uniqueFactors)
		.map((k, v) => k * v)
		.reduce((prod, v) => prod * v, 1);
}

function exec(inputFilename, solver, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = parseInput(input);

	return solver(parsedInput);
}

if (!global.TEST_MODE) {
	const inputFile = 'input.test.3.txt';
	const { join } = require('path');

	const res = exec(join(__dirname, '__TESTS__', inputFile), solve2);

	console.log(res);
}

module.exports = {
	exec1: (inputFilename) => exec(inputFilename, solve1),
	exec2: (inputFilename) => exec(inputFilename, solve2),
	expectedRes1,
	expectedRes2,
	testCases1,
	testCases2,
};
