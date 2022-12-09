'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	const [dir, count] = row.split(' ');

	return [dir, +count];
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

const cMap = {
	R: [1, 0],
	L: [-1, 0],
	U: [0, -1],
	D: [0, 1]
};
const toKey = ({x, y}) => `${x},${y}`;

function getDiff(p1, p2) {
	let xDiff = p2.x - p1.x;
	let yDiff = p2.y - p1.y;
	let absXDiff = Math.abs(xDiff);
	let absYDiff = Math.abs(yDiff);

	if (absXDiff < 2 && absYDiff < 2) {
		return [0, 0];
	}

	if (absYDiff > 1) {
		yDiff /= absYDiff;
	}

	if (absXDiff > 1) {
		xDiff /= absXDiff;
	}

	return [xDiff, yDiff];
}

function solve1(input, length = 2) {
	const ropes = new Array(length).fill(0).map(() => ({x: 0, y: 0}));
	const visited = new Set(['0,0']);

	for (const [dir, count] of input) {
		const [dx, dy] = cMap[dir];

		for (let i = 0; i < count; i++) {
			ropes[0].x += dx;
			ropes[0].y += dy;

			for (let i = 1; i < ropes.length; i++) {
				const [xDiff, yDiff] = getDiff(ropes[i], ropes[i - 1]);
				if (xDiff !== 0 || yDiff !== 0) {
					ropes[i].x += xDiff;
					ropes[i].y += yDiff;

					visited.add(toKey(ropes[ropes.length - 1]));
				}
			}
		}
	}

	return visited.size;
}

function solve2(input) {
	return solve1(input, 10);
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