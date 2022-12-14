'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	return row.split(' -> ').map(range => range.split(',').map(x => +x));
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}
const toKey = ([x, y]) => `${x},${y}`;

function solve1(input, withFloor = false) {
	const cave = new Map();
	let maxY = -Infinity;
	let minX = Infinity;
	let maxX = -Infinity;

	for (const range of input) {
		let prevPoint;
		for (const point of range) {
			cave.set(toKey(point), '#');
			if (prevPoint) {
				if (prevPoint[0] === point[0]) {
					const startY = prevPoint[1] < point[1] ? prevPoint[1] : point[1];
					const endY = prevPoint[1] < point[1] ? point[1] : prevPoint[1];

					for (let i = startY; i < endY; i++) {
						cave.set(toKey([point[0], i]), '#');
					}
				} else {
					const startX = prevPoint[0] < point[0] ? prevPoint[0] : point[0];
					const endX = prevPoint[0] < point[0] ? point[0] : prevPoint[0];

					for (let i = startX; i < endX; i++) {
						cave.set(toKey([i, point[1]]), '#');
					}
				}
			}

			prevPoint = point;
			maxY = Math.max(maxY, point[1]);
			minX = Math.min(minX, point[0]);
			maxX = Math.max(maxX, point[0]);
		}
	}

	let restingSands = 0;
	const sandStartPoint = [500, 0];
	if (withFloor) {
		for (let i = minX - 150; i < maxX + 150; i++) {
			cave.set(toKey([i, maxY + 2]), '#');
		}
	}

	// eslint-disable-next-line no-constant-condition
	while (true) {
		const sand = sandStartPoint.slice(0);

		// eslint-disable-next-line no-constant-condition
		while (true) {
			const down = toKey([sand[0], sand[1] + 1]);
			const downLeft = toKey([sand[0] - 1, sand[1] + 1]);
			const downRight = toKey([sand[0] + 1, sand[1] + 1]);

			if (cave.has(down)) {
				if (!cave.has(downLeft)) {
					sand[0]--;
					sand[1]++;
				} else if (!cave.has(downRight)) {
					sand[0]++;
					sand[1]++;
				} else {
					restingSands++;
					cave.set(toKey(sand), 'o');
					if (sand[1] === 0) {
						return restingSands;
					}

					break;
				}
			} else {
				sand[1]++;
			}

			if (sand[1] > maxY + 10) {
				return restingSands;
			}
		}
	}
}

function solve2(input) {
	return solve1(input, true);
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