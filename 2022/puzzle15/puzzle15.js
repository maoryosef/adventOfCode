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

	const relevantSensors = input; /* .filter(({by}) => true); */

	let blockedPoints = 0;
	for (let i = minX * 1.1; i < maxX * 1.1; i++) {
		for (const {sx, sy, bx, by, d} of relevantSensors) {
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

function solve2(input) {
	return input;
}

function exec(inputFilename, solver, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = parseInput(input);

	return solver(parsedInput);
}

if (!global.TEST_MODE) {
	const inputFile = 'input.txt';
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