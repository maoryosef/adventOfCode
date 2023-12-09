'use strict';

const _ = require('lodash');
const { BasePuzzle } = require('aoc-utils/basePuzzle');

class Puzzle9 extends BasePuzzle {
	parseRow(row) {
		return row.split(/\s+/).map((x) => +x);
	}

	parseInput(input) {
		const parsedInput = _(input).split('\n').map(this.parseRow).value();

		return parsedInput;
	}

	getSeqDifferences(arr) {
		const seqs = [arr];

		while (!seqs.at(-1).every((x) => x === 0)) {
			const seq = seqs.at(-1);
			const newSeq = [];
			for (let i = 0; i < seq.length - 1; i++) {
				newSeq[i] = seq[i + 1] - seq[i];
			}

			seqs.push(newSeq);
		}

		return seqs;
	}

	findNext(seqs) {
		let val = 0;
		for (let i = seqs.length - 1; i >= 0; i--) {
			val = val + seqs[i].at(-1);
		}

		return val;
	}

	findPrev(seqs) {
		let val = 0;
		for (let i = seqs.length - 1; i >= 0; i--) {
			val = seqs[i].at(0) - val;
		}

		return val;
	}

	testCases1 = [114];
	expectedRes1 = 1834108701;
	solve1(input) {
		return _(input)
			.map(this.getSeqDifferences)
			.map(this.findNext)
			.sum();
	}

	testCases2 = [2];
	expectedRes2 = 993;
	solve2(input) {
		return _(input)
			.map(this.getSeqDifferences)
			.map(this.findPrev)
			.sum();
	}
}

if (!global.TEST_MODE) {
	const inputFile = 'input.test.1.txt';
	const { join } = require('path');

	const p = new Puzzle9();

	const res = p.exec1(join(__dirname, '__TESTS__', inputFile));

	console.log(res);
}

module.exports = new Puzzle9();
