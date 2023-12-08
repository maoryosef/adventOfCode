'use strict';

const _ = require('lodash');
const {BasePuzzle} = require('aoc-utils/basePuzzle');

class Puzzle___ extends BasePuzzle {
	parseRow(row) {
		parseInt(row);
	}

	parseInput(input) {
		const parsedInput = _(input)
			.split('\n')
			.map(this.parseRow)
			.value();

		return parsedInput;
	}

	testCases1 = [];
	expectedRes1 = true;
	solve1(input) {
		return input;
	}

	testCases2 = [];
	expectedRes2 = true;
	solve2(input) {
		return input;
	}
}

if (!global.TEST_MODE) {
	const inputFile = 'input.test.1.txt';
	const { join } = require('path');

	const p = new Puzzle___();

	const res = p.exec1(join(__dirname, '__TESTS__', inputFile));

	console.log(res);
}

module.exports = new Puzzle___();