'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	const [cmd, range] = row.split(' ');

	return {
		cmd,
		range: range.split(',').map(r => r.split('=')[1]).map(r => r.split('..').map(x => +x))
	};
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

function solve1(input) {
	const cubes = new Set();

	input
		.filter(x => x.range.every(r => r[0] >= -50 && r[1] <= 50))
		.forEach(({cmd, range}) => {
			for (let x = range[0][0]; x <= range[0][1]; x++) {
				for (let y = range[1][0]; y <= range[1][1]; y++) {
					for (let z = range[2][0]; z <= range[2][1]; z++) {
						if (cmd === 'on') {
							cubes.add(`${x},${y},${z}`);
						} else {
							cubes.delete(`${x},${y},${z}`);
						}
					}
				}
			}
		});

	return cubes.size;
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
	const inputFile = 'input.test.3.txt';
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