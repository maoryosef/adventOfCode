import fs from 'fs';
import _ from 'lodash';

function parseRow(row: string) {
	return parseInt(row);
}

function parseInput(input: string) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.head();

	return parsedInput;
}

function calculateHouse(house: number, presents = 10, limitElves?: boolean) {
	let totalPresents = 0;

	const limit = Math.ceil(house / 50);
	const houseSqrt = Math.sqrt(house);
	for (let i = 1; i <= houseSqrt; i++)  {
		if (house % i === 0) {
			const divisor = house / i;

			if (houseSqrt !== i && (!limitElves || divisor >= limit)) {
				totalPresents += divisor * presents;
			}

			if (!limitElves || i >= limit) {
				totalPresents += i * presents;
			}
		}
	}

	return totalPresents;
}

function solve1(input: number) {
	const max = input;
	let house = input / 100;

	while (calculateHouse(house) < input && house < max) {
		house++;
	}

	return house;
}

function solve2(input: number) {
	const max = input;
	let house = input / 100;

	while (calculateHouse(house, 11, true) < input && house < max) {
		house++;
	}

	return house;
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
		solve2
	);

	console.log(res);
}

export default {
	exec1: (inputFilename: string) => exec(inputFilename, solve1),
	exec2: (inputFilename: string) => exec(inputFilename, solve2)
};