'use strict';

const {BasePuzzle} = require('aoc-utils/basePuzzle');
const _ = require('lodash');
const { getPrimeFactors } = require('aoc-utils/mathUtils');

class Puzzle8 extends BasePuzzle {
	parseRow(row) {
		const [, k, L, R] = row.match(/^(.*?)\s+=\s+\((.*?),\s+(.*?)\)$/);

		return [k, { L, R }];
	}

	parseInput(input) {
		const [instructions, rest] = input.split('\n\n');
		const parsedInput = _(rest)
			.split('\n')
			.map(this.parseRow)
			.fromPairs()
			.value();

		return [instructions, parsedInput];
	}

	testCases1 = [2, 6];
	expectedRes1 = 11911;
	solve1([instructions, map]) {
		let currNode = 'AAA';
		let steps = 0;

		while (currNode !== 'ZZZ') {
			const step = instructions[steps % instructions.length];
			currNode = map[currNode][step];
			steps++;
		}

		return steps;
	}

	testCases2 = [undefined, undefined, 6];
	expectedRes2 = 10151663816849;
	solve2([instructions, map]) {
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
}

if (!global.TEST_MODE) {
	const inputFile = 'input.test.3.txt';
	const { join } = require('path');

	const p = new Puzzle8();

	const res = p.exec2(join(__dirname, '__TESTS__', inputFile));

	console.log(res);
}

module.exports = new Puzzle8();
