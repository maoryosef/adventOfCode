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

const key = (...args) => args.join(',');

function solve1(input, cycles = 6) {
	let prevDimensions = new Map();
	let nextDimensions;
	let activeMap;

	input.forEach((row, y) => {
		row.forEach((col, x) => {
			if (col === '#') {
				prevDimensions.set(key(x, y, 0), true);
			}
		});
	});

	for (let c = 0; c < cycles; c++) {
		nextDimensions = new Map();
		activeMap = new Map();
		const keys = [...prevDimensions.keys()].map(k => k.split(',').map(k => +k));
		keys.forEach(([x, y, z]) => {
			if (prevDimensions.get(key(x, y, z))) {
				for (let i = x - 1; i < x + 2; i++) {
					for (let j = y - 1; j < y + 2; j++) {
						for (let l = z - 1; l < z + 2; l++) {
							if (i === x && j === y && l === z) {
								continue;
							}

							const nKey = key(i, j, l);
							const v = activeMap.get(nKey) || 0;
							activeMap.set(nKey, v + 1);
						}
					}
				}
			}
		});

		for (let [k] of prevDimensions.entries()) {
			const v = activeMap.get(k);
			if (prevDimensions.get(k)) {
				nextDimensions.set(k, (v === 2 || v === 3));
			}
		}

		for (let [k, v] of activeMap.entries()) {
			if (!prevDimensions.get(k) && v === 3) {
				nextDimensions.set(k, true);
			}
		}

		prevDimensions = nextDimensions;
	}

	return [...nextDimensions.values()].filter(x => !!x).length;
}

function solve2(input) {
	let prevDimensions = new Map();
	let nextDimensions;
	let activeMap;

	input.forEach((row, y) => {
		row.forEach((col, x) => {
			if (col === '#') {
				prevDimensions.set(key(x, y, 0, 0), true);
			}
		});
	});

	for (let c = 0; c < 6; c++) {
		nextDimensions = new Map();
		activeMap = new Map();
		const keys = [...prevDimensions.keys()].map(k => k.split(',').map(k => +k));
		keys.forEach(([x, y, z, w]) => {
			if (prevDimensions.get(key(x, y, z, w))) {
				for (let i = x - 1; i < x + 2; i++) {
					for (let j = y - 1; j < y + 2; j++) {
						for (let l = z - 1; l < z + 2; l++) {
							for (let m = w - 1; m < w + 2; m++) {
								if (i === x && j === y && l === z && m === w) {
									continue;
								}

								const nKey = key(i, j, l, m);
								const v = activeMap.get(nKey) || 0;
								activeMap.set(nKey, v + 1);
							}
						}
					}
				}
			}
		});

		for (let [k] of prevDimensions.entries()) {
			const v = activeMap.get(k);
			if (prevDimensions.get(k)) {
				nextDimensions.set(k, (v === 2 || v === 3));
			}
		}

		for (let [k, v] of activeMap.entries()) {
			if (!prevDimensions.get(k) && v === 3) {
				nextDimensions.set(k, true);
			}
		}

		prevDimensions = nextDimensions;
	}

	return [...nextDimensions.values()].filter(x => !!x).length;
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