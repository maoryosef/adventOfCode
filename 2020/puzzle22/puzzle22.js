'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	return row.split('\n').slice(1).map(x => +x);
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

function playGame(deck1, deck2, recursive) {
	const seenMap = new Set();

	while (deck1.length > 0 && deck2.length > 0) {
		if (seenMap.has(deck1.concat(['-']).concat(deck2).join(','))) {
			return [[1], []];
		}

		seenMap.add(deck1.concat(['-']).concat(deck2).join(','));

		const card1 = deck1.shift();
		const card2 = deck2.shift();

		if (recursive && card1 <= deck1.length && card2 <= deck2.length) {
			const res = playGame(deck1.slice(0, card1), deck2.slice(0, card2));

			if (res[0].length > 0) {
				deck1.push(card1, card2);
			} else {
				deck2.push(card2, card1);
			}

			continue;
		}

		if (card1 > card2) {
			deck1.push(card1, card2);
		} else {
			deck2.push(card2, card1);
		}
	}

	return [deck1, deck2];
}

function solve1(input) {
	const res = playGame(...input);

	return res.flat().reverse().reduce((acc, v, i) => acc + v * (i + 1), 0);
}

function solve2(input) {
	const res = playGame(...input, true);

	return res.flat().reverse().reduce((acc, v, i) => acc + v * (i + 1), 0);
}

function exec(inputFilename, solver, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = parseInput(input);

	return solver(parsedInput);
}

if (!global.TEST_MODE) {
	const inputFile = 'input.txt';
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