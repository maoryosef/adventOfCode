'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	const [c1, c2] = row.split(' -> ');

	return [c1.split(',').map(x => parseInt(x)), c2.split(',').map(x => parseInt(x))];
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

function plotLines(lines) {
	const map = new Map();

	lines.forEach(([c1, c2]) => {
		let [x1, y1] = c1;
		let [x2, y2] = c2;

		const xSlope = x2 - x1;
		const ySlope = y2 - y1;
		const length = Math.abs(xSlope) || Math.abs(ySlope);
		const xFactor = xSlope && xSlope / Math.abs(xSlope);
		const yFactor = ySlope && ySlope / Math.abs(ySlope);

		for (let i = 0; i <= length; i++) {
			const x = x1 + i * xFactor;
			const y = y1 + i * yFactor;
			const val = map.get(`${x},${y}`) || 0;
			map.set(`${x},${y}`, val + 1);
		}
	});

	return [...map.values()].filter(x => x > 1).length;
}

function solve1(input) {
	const straightLines = input.filter(([c1, c2]) => {
		const [x1, y1] = c1;
		const [x2, y2] = c2;

		return x1 === x2 || y1 === y2;
	});

	return plotLines(straightLines);
}

function solve2(input) {
	return plotLines(input);
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