'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	return row.split('');
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

function getNeighborsOffsets(dimensions) {
	if (dimensions === 0) {
		return [[]];
	}

	const offsets = getNeighborsOffsets(dimensions - 1);

	return [
		...offsets.map(x => [-1, ...x]),
		...offsets.map(x => [0, ...x]),
		...offsets.map(x => [1, ...x]),
	];
}

function solve1(input, dimensions = 3) {
	let prevDimensions = new Map();
	let nextDimensions;
	let activeMap;

	input.forEach((row, y) => {
		row.forEach((col, x) => {
			if (col === '#') {
				const key = [x, y, ...Array(dimensions - 2).fill(0)].join(',');
				prevDimensions.set(key, true);
			}
		});
	});

	const offsets = getNeighborsOffsets(dimensions);

	for (let c = 0; c < 6; c++) {
		nextDimensions = new Map();
		activeMap = new Map();

		for (const key of prevDimensions.keys()) {
			if (prevDimensions.get(key)) {
				const coords = key.split(',').map(x => +x);
				offsets.forEach(offset => {
					const nKey = [...offset.map((v, i) => v + coords[i])].join(',');

					if (nKey !== key) {
						const v = activeMap.get(nKey) || 0;
						activeMap.set(nKey, v + 1);
					}
				});
			}
		}

		for (const key of prevDimensions.keys()) {
			const actives = activeMap.get(key);
			if (prevDimensions.get(key)) {
				nextDimensions.set(key, (actives === 2 || actives === 3));
			}
		}

		for (const [key, actives] of activeMap.entries()) {
			if (!prevDimensions.get(key) && actives === 3) {
				nextDimensions.set(key, true);
			}
		}

		prevDimensions = nextDimensions;
	}

	return [...nextDimensions.values()].filter(x => !!x).length;
}

function solve2(input) {
	return solve1(input, 4);
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