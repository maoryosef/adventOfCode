'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseBoard(board) {
	return board.split('\n').map(row => row.trim().split(/\s+/).map(n => parseInt(n)));
}

function parseInput(input) {
	const [sequence, ...boards] = _(input)
		.split('\n\n')
		.value();


	return {
		sequence: sequence.split(',').map(n => parseInt(n)),
		boards: boards.map(b => parseBoard(b))
	};
}

function findInBoard(board, num) {
	for (let row = 0; row < board.length; row++) {
		for (let col = 0; col < board[0].length; col++) {
			if (board[row][col] === num) {
				return [row, col];
			}
		}
	}

	return [-1, -1];
}

function simulateBoard(board, sequence) {
	const rowsCounter = {};
	const colsCounter = {};

	for (let i = 0; i < sequence.length; i++) {
		const num = sequence[i];
		const [row, col] = findInBoard(board, num);

		if (col === -1) {
			continue;
		}

		rowsCounter[row] = (rowsCounter[row] || 0) + 1;
		colsCounter[col] = (colsCounter[col] || 0) + 1;

		if (rowsCounter[row] === board.length || colsCounter[col] === board[0].length) {
			return {
				index: i,
				board
			};
		}
	}

	return {
		index: -1
	};
}

function sumRemains(board, sequence) {
	const sequenceSet = new Set(sequence);
	let sum = 0;
	for (let row = 0; row < board.length; row++) {
		for (let col = 0; col < board[0].length; col++) {
			if (sequenceSet.has(board[row][col])) {
				continue;
			}

			sum += board[row][col];
		}
	}

	return sum;
}

function solve(sequence, boards, predicate) {
	const {index, board} = boards.map(b => simulateBoard( b, sequence)).sort(predicate)[0];

	return sequence[index] * sumRemains(board, sequence.slice(0, index + 1));
}

function solve1({sequence, boards}) {
	return solve(sequence, boards, (a, b) => a.index - b.index);
}

function solve2({sequence, boards}) {
	return solve(sequence, boards, (a, b) => b.index - a.index);
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
		solve1
	);

	console.log(res);
}

module.exports = {
	exec1: (inputFilename) => exec(inputFilename, solve1),
	exec2: (inputFilename) => exec(inputFilename, solve2)
};