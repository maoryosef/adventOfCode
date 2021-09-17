import fs from 'fs';
import {Combination} from 'js-combinatorics';
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

function solve1(input: number[], numOfPackages = 3) {
	const sum = input.reduce((sum, x) => sum + x, 0);
	const target = sum / numOfPackages;

	let groupSize = 2;
	const foundGroups = [];

	while (foundGroups.length === 0) {
		const validPackages = Combination.of(input, groupSize).toArray().filter((p: number[]) => p.reduce((acc, v) => acc + v, 0) === target);
		foundGroups.push(...validPackages);
		groupSize++;
	}

	return foundGroups
		.map((p: number[]) => p.reduce((acc, v) => acc * v, 1))
		.sort((a, b) => a - b)[0];
}

function solve2(input: number[]) {
	return solve1(input, 4);
}

function exec(inputFilename: string, solver: Function, inputStr?: string) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = parseInput(input);

	return solver(parsedInput);
}

if (!global.TEST_MODE) {
	const inputFile = 'input.txt';
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