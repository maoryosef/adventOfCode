'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	const [, count, from, to] = row.match(/^move (\d+) from (\d+) to (\d+)$/);

	return {count: +count, from: +from, to: +to};
}

function parseState(str) {
	const state = [];
	str.split('\n').slice(0, -1).forEach(row => {
		const chars = row.split('');
		for (let i = 1; i < chars.length; i += 4) {
			const idx = (i - 1) / 4;
			state[idx] = state[idx] ?? [];

			if (chars[i] !== ' ') {
				state[idx].unshift(chars[i]);
			}
		}
	});

	return state;
}

function parseInput(input) {
	const [stateStr, commandsStr] = _(input)
		.split('\n\n')
		.value();

	const state = parseState(stateStr);
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
	commands.forEach(({count, from, to}) =>
		state[to - 1].push(...state[from - 1].splice(state[from - 1].length - count, count))
	);

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