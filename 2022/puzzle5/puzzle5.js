'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	//move 1 from 2 to 1
	const REGEX = /^move (\d+) from (\d+) to (\d+)$/;

	const [, count, from, to] = row.match(REGEX);

	return {count: +count, from: +from, to: +to};
}

function parseInput(input) {
	const [stateStr, commandsStr] = _(input)
		.split('\n\n')
		.value();

	const state = stateStr.split('\n').map(r => r.split(','));
	const commands = commandsStr.split('\n').map(parseRow);

	return [state, commands];
}

function solve1([state, commands]) {
	commands.forEach(({count, from, to}) => {
		for (let i = 0; i < count; i++) {
			const crate = state[from - 1].pop();
			state[to - 1].push(crate);
		}
	});

	return state.map(col => col[col.length - 1]).join('');
}

function solve2([state, commands]) {
	commands.forEach(({count, from, to}) => {
		const crates = [];
		for (let i = 0; i < count; i++) {
			crates.push(state[from - 1].pop());
		}

		state[to - 1].push(...crates.reverse());
	});

	return state.map(col => col[col.length - 1]).join('');
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