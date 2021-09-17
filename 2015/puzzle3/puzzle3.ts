import fs from 'fs';
import _ from 'lodash';

function parseInput(input: string) {
	const parsedInput = _(input)
		.split('')
		.value();

	return parsedInput;
}

function solve1(input: string[]) {
	const visited = new Map();
	let x = 0;
	let y = 0;

	visited.set('0,0', true);

	for (let op of input) {
		switch (op) {
			case '^': y++; break;
			case 'v': y--; break;
			case '>': x++; break;
			case '<': x--; break;
		}

		visited.set(`${x},${y}`, true);
	}

	return visited.size;
}

function solve2(input: string[]) {
	const visited = new Map();
	const walkers = [
		{x: 0, y: 0},
		{x: 0, y: 0}
	];

	visited.set('0,0', true);

	let step = 0;
	for (let op of input) {
		const walker = walkers[step++ % 2];

		switch (op) {
			case '^': walker.y++; break;
			case 'v': walker.y--; break;
			case '>': walker.x++; break;
			case '<': walker.x--; break;
		}

		visited.set(`${walker.x},${walker.y}`, true);
	}

	return visited.size;
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
		solve2
	);

	console.log(res);
}

export default {
	exec1: (inputFilename: string) => exec(inputFilename, solve1),
	exec2: (inputFilename: string) => exec(inputFilename, solve2)
};