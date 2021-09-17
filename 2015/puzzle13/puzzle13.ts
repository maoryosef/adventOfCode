import fs from 'fs';
import _ from 'lodash';
import * as Combinatorics from 'js-combinatorics';

function parseRow(row: string) {
	const match = row.match(/^(.*?) would (gain|lose) (\d*) happiness units by sitting next to (.+)\./);
	const [, from, lg, points, to] = match!;

	return {
		from: from.toLowerCase(),
		to: to.toLowerCase(),
		lg,
		points: +points * (lg === 'lose' ? -1 : 1)
	};
}

function parseInput(input: string) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.reduce((acc: Record<string, Record<string, number>>, v) => ({...acc, [v.from]: {...acc[v.from], [v.to]: v.points}}), {});

	return parsedInput;
}

function getScore(arrangement: string[], input: Record<string, Record<string, number>>) {
	const first = arrangement[0];
	const last = arrangement[arrangement.length -1];

	return arrangement.reduce((acc, k, i) => {
		return acc + (input[k][arrangement[i + 1]] || 0) + (input[arrangement[i + 1]] && input[arrangement[i + 1]][k] || 0);
	}, input[first][last] + input[last][first]);
}

function solve1(input: Record<string, Record<string, number>>) {
	const permutations = new Combinatorics.Permutation(Object.keys(input)).toArray();

	return Math.max(...permutations.map((arrangement: string[]) => getScore(arrangement, input)));
}

function solve2(input: Record<string, Record<string, number>>) {
	input['me'] = Object.keys(input).reduce((acc, k) => {
		input[k].me = 0;

		return {...acc, [k]: 0};
	}, {});

	const permutations = new Combinatorics.Permutation(Object.keys(input))
		.toArray()
		.map(arrangement => getScore(arrangement, input))
		.sort((a, b) => b - a);

	return permutations[0];
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