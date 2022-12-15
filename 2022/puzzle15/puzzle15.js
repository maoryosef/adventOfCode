'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	const [, sx, sy, bx, by] = row.match(/Sensor at x=(-?\d+?), y=(-?\d+?): closest beacon is at x=(-?\d+?), y=(-?\d+?)$/);
	const d = Math.abs(+sx - (+bx)) + Math.abs(+sy - (+by));

	return {
		sx: +sx, sy: +sy, bx: +bx, by: +by, d
	};
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

function findBounds(sensors) {
	let minX = Infinity;
	let maxX = -Infinity;

	for (const {sx, bx} of sensors) {
		minX = Math.min(minX, sx, bx);
		maxX = Math.max(maxX, bx, sx);
	}

	return [minX, maxX];
}

function solve1(input) {
	const line = input.length > 14 ? 2000000 : 10;
	const [minX, maxX] = findBounds(input);

	let blockedPoints = 0;
	for (let i = minX * 1.1; i < maxX * 1.1; i++) {
		for (const {sx, sy, bx, by, d} of input) {
			if (line === by && i === bx) {
				break;
			}
			const d2 = Math.abs(sx - i) + Math.abs(sy - line);
			if (d2 <= d) {
				blockedPoints++;
				break;
			}
		}
	}

	return blockedPoints;
}

function mergeRanges(map, x, tY, bY) {
	map[x].push({tY, bY});

	let merges;
	do {
		const prevRange = map[x].shift();
		merges = 0;
		for (const r of map[x]) {
			if ((r.tY <= prevRange.tY && prevRange.tY <= r.bY) || (prevRange.tY <= r.tY && prevRange.bY >= r.tY) || (prevRange.tY -1 === r.bY)) {
				r.tY = Math.min(prevRange.tY, r.tY);
				r.bY = Math.max(prevRange.bY, r.bY);
				merges++;
				break;
			}
		}

		if (merges === 0) {
			map[x].push(prevRange);
		}
	} while (merges > 0);
}

function solve2(input) {
	const limit = input.length > 14 ? 4000000 : 20;
	const map = new Array(limit + 1).fill(0).map(() => []);

	for (const { sx, sy, d } of input) {
		const tY = sy - d;
		const bY = sy + d;

		for (let i = 0; i <= d; i++) {
			const lX = sx - i;
			const rX = sx + i;
			const itY = _.clamp(tY + i, 0, limit );
			const ibY = _.clamp(bY - i, 0, limit );

			if (lX >= 0 && lX <= limit) {
				mergeRanges(map, lX, itY, ibY);
			}

			if (rX >= 0 && rX <=limit) {
				mergeRanges(map, rX, itY, ibY);
			}
		}
	}

	const beaconX = map.findIndex(x => x.length > 1);
	const beaconY = map[beaconX].find(({tY}) => tY === 0).bY + 1;

	return beaconX * 4000000 + beaconY;
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