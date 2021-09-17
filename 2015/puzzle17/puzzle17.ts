import fs from 'fs';
import _ from 'lodash';

function parseRow(row: string) {
	return parseInt(row);
}

function parseInput(input: string) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

function fillPossibilities(target: number, containers: number[]): number[][] | null {
	if (target === 0) {
		return [[]];
	}

	if (containers.length === 1 && containers[0] !== target) {
		return null;
	}

	let totalPos: number[][] = [];
	const allowedContainers = containers.filter(c => c <= target);

	while (allowedContainers.length > 0) {
		const cont = allowedContainers.shift();
		const possibilities = fillPossibilities(target - cont!, allowedContainers);

		if (possibilities) {
			totalPos = [
				...totalPos,
				...possibilities.map(p => [...p, cont]) as number[][]
			];
		}
	}

	return totalPos;
}

function solve1(input: number[]) {
	const target = input.length > 5 ? 150 : 25;

	return fillPossibilities(target, input)?.length;
}

function solve2(input: number[]) {
	const target = input.length > 5 ? 150 : 25;

	const possibilities = fillPossibilities(target, input);

	const minContainers = possibilities?.map(p => p.length).reduce((prevVal, v) => Math.min(prevVal, v));

	return possibilities?.filter(p => p.length === minContainers).length;
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