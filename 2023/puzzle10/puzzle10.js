'use strict';

const _ = require('lodash');
const {BasePuzzle} = require('aoc-utils/basePuzzle');
const {drawAscii} = require('aoc-utils/drawUtils');

class Puzzle10 extends BasePuzzle {
	parseRow(row) {
		return row.split('');
	}

	parseInput(input) {
		const parsedInput = _(input)
			.split('\n')
			.map(this.parseRow)
			.value();

		return parsedInput;
	}

	findStartSquare(input) {
		for (let i = 0; i < input.length; i++) {
			for (let j = 0; j < input[i].length; j++) {
				if (input[i][j] === 'S') {
					return [i, j];
				}
			}
		}
	}

	getNeighborPipes(cell, parent, input) {
		const shape = input[cell[0]][cell[1]];
		const candidates = [];

		switch (shape) {
			case '|': candidates.push([cell[0] + 1, cell[1]], [cell[0] - 1, cell[1]]); break;
			case '-': candidates.push([cell[0], cell[1] + 1], [cell[0], cell[1] - 1]); break;
			case 'L': candidates.push([cell[0] - 1, cell[1]], [cell[0], cell[1] + 1]); break;
			case 'J': candidates.push([cell[0] - 1, cell[1]], [cell[0], cell[1] - 1]); break;
			case '7': candidates.push([cell[0] + 1, cell[1]], [cell[0], cell[1] - 1]); break;
			case 'F': candidates.push([cell[0] + 1, cell[1]], [cell[0], cell[1] + 1]); break;
		}

		return candidates
			.filter(([i, j]) => !parent || i !== parent[0] || j !== parent[1])
			.filter(([i, j]) => i >= 0 && j >= 0 && i < input.length && j < input[i].length);
	}

	getLoop(input) {
		const start = this.findStartSquare(input);
		const startShape = input.length > 10 ? 'L' : 'F';
		input[start[0]][start[1]] = startShape;

		const queue = [{parent: null, cell: start, l: 0}];
		let visited = {};

		while (queue.length > 0) {
			const {parent, cell, l} = queue.shift();

			if (visited[`${cell[0]},${cell[1]}`] !== undefined) {
				continue;
			}

			visited[`${cell[0]},${cell[1]}`] = l;

			const neighbors = this.getNeighborPipes(cell, parent, input);
			queue.push(...neighbors.map(n => ({parent: cell, cell: n, l: l + 1})));
		}

		return visited;
	}

	testCases1 = [4, 8];
	expectedRes1 = 6812;
	solve1(input) {
		return Object.values(this.getLoop(input)).sort((a, b) => b - a)[0];
	}

	getNeighbors(input, [i, j], /* [pI, pJ] = [i, j] */) {
		const shape = input[i][j];
		// const prev = `${i - pI},${j - pJ}`;
		// const _dir = {'1,0': 'D', '-1,0': 'U', '0,-1': 'L', '0,1': 'R', '0,0':'L'}[prev];

		const candidates = [];

		//TODO: maybe try to also push the direction to the candidate, so will have context (and then add it the visited key)
		switch(shape) {
			case '.': candidates.push([0, 1], [1, 0], [-1, 0], [0, -1]); break;
			case '|': candidates.push([1, 0], [-1, 0]); break;
			case '-': candidates.push([0, 1], [0, -1]); break;
			case 'L': candidates.push([-1, 0], [0, 1]); break;
			case 'J': candidates.push([-1, 0], [0, -1]); break;
			case '7': candidates.push([1, 0], [0, -1]); break;
			case 'F': candidates.push([1, 0], [0, 1]); break;
		}

		return candidates.map(([oI, oJ]) => [i + oI, j + oJ]);
	}

	getPathOut(input, [i, j], prev, visited = {}) {
		// if (i === 4 && j === 0) {
		// 	debugger;
		// }
		if (i < 0 || i >= input.length || j < 0 || j >= input[i].length) {
			return true;
		}

		if (input[i][j] === ' ') {
			return [[i, j]];
		}

		if (visited[`${i},${j}`]) {
			return [];
		}

		visited[`${i},${j}`] = true;

		const neighbors = this.getNeighbors(input, [i, j], prev);

		for (const n of neighbors) {
			const pathOut = this.getPathOut(input, n, [i, j], visited);
			if (pathOut === true) {
				return [[i, j]];
			}

			if (pathOut.length > 0) {
				return [[i, j], ...pathOut];
			}
		}

		return [];
	}

	testCases2 = [undefined, undefined, 4, 8, 10, 4];
	expectedRes2 = true;
	solve2(input) {
		const inputClone = _.cloneDeep(input);
		const loop = this.getLoop(inputClone);

		for (let i = 0; i < inputClone.length; i++) {
			for (let j = 0; j < inputClone[i].length; j++) {
				if (loop[`${i},${j}`] !== undefined) {
					continue;
				}

				inputClone[i][j] = '.';
			}
		}

		for (let i = 0; i < inputClone.length; i++) {
			for (let j = 0; j < inputClone[i].length; j++) {
				// if (i === 4 && j === 4) {
				// 	debugger;
				// }
				if (inputClone[i][j] !== '.') {
					continue;
				}

				const pathOut = this.getPathOut(inputClone, [i, j]);

				for (const p of pathOut) {
					inputClone[p[0]][p[1]] = ' ';
				}
			}
		}

		console.log(drawAscii(inputClone, {
			' ': ' ',
			'.': '.',
			'|': '|',
			'-': '-',
			'L': '└',
			'J': '┘',
			'7': '┐',
			'F': '┌'
		}));

		return inputClone.map(row => row.filter(c => c === '.').join('')).join('').trim().length;
	}
}

if (!global.TEST_MODE) {
	const inputFile = 'input.test.4.txt';
	const { join } = require('path');

	const p = new Puzzle10();

	const res = p.exec2(join(__dirname, '__TESTS__', inputFile));

	console.log(res);
}

module.exports = new Puzzle10();