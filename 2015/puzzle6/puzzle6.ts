import fs from 'fs';
import _ from 'lodash';

function parseRow(row: string) {
	let op;

	if (row.startsWith('turn on')) {
		op = 1;
		row = row.substr(8);
	} else if (row.startsWith('turn off')) {
		op = 0;
		row = row.substr(9);
	} else if (row.startsWith('toggle')) {
		op = -1;
		row = row.substr(7);
	}

	const range = row.split(' through ').map(p => p.split(',').map(x => +x));
	return {
		op,
		range
	};
}

function parseInput(input: string) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

interface ParsedInput {
	op?: number;
	range: number[][];
}

function solve1(input: ParsedInput[]) {
	const lights = new Map();

	for (let command of input) {
		const [sX, sY] = command.range[0];
		const [eX, eY] = command.range[1];

		for (let y = sY; y <= eY; y++) {
			for (let x = sX; x <= eX; x++) {
				const key = `${x},${y}`;
				let value = command.op;

				if (value === -1) {
					value = lights.get(key) ? 0 : 1;
				}

				lights.set(key, value);
			}
		}
	}

	return Array.from(lights.values()).filter(v => v === 1).length;
}

function solve2(input: ParsedInput[]) {
	const lights = new Map();

	for (let command of input) {
		const [sX, sY] = command.range[0];
		const [eX, eY] = command.range[1];

		for (let y = sY; y <= eY; y++) {
			for (let x = sX; x <= eX; x++) {
				const key = `${x},${y}`;
				let value = lights.get(key) || 0;

				switch (command.op) {
					case 0: value--; break;
					case 1: value++; break;
					case -1: value += 2; break;
				}

				if (value < 0) {
					value = 0;
				}

				lights.set(key, value);
			}
		}
	}

	return Array.from(lights.values()).reduce((acc, v) => acc + (v || 0), 0);
}

function exec(inputFilename: string, solver: Function, inputStr?: string) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = parseInput(input);

	return solver(parsedInput);
}

if (!global.TEST_MODE) {
	const inputFile = 'input.test.1.txt';
	const {join} = require('path')

	const res = exec(
		join(__dirname, '__TESTS__', inputFile),
		solve1
	);

	console.log(res);
}

export default {
	exec1: (inputFilename: string) => exec(inputFilename, solve1),
	exec2: (inputFilename: string) => exec(inputFilename, solve2)
};