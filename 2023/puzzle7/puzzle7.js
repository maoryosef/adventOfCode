'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	const [cards, bid] = row.split(/\s/);

	return [cards, +bid];
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

function groupCards(cards) {
	return cards.split('').reduce((acc, c) => {
		acc[c] = acc[c] ?? 0;
		acc[c]++;

		return acc;
	}, {});
}

function calcStrength(cardsCount) {
	switch (cardsCount.length) {
		case 1: return 7; // 5 of a kind
		case 2: return cardsCount[0] === 4 ? 6 : 5; //4 of a kind | full house
		case 3: return cardsCount[0] === 3 ? 4 : 3; //3 of a kind | 2 pairs
		case 4: return 2; //pair
		case 5: return 1; //high card
	}
}

function getHandStrength(cards) {
	const cardCounts = Object.values(groupCards(cards)).sort((a, b) => b - a);
	return calcStrength(cardCounts);
}

function getHandStrengthWithJoker(cards) {
	const {J, ...rest} = groupCards(cards);

	const cardCounts = Object.values(rest).sort((a, b) => b - a);
	cardCounts[0] += J || 0;

	return calcStrength(cardCounts);
}

function getCompareCardFn(cardsValue, strengthCalculator) {
	return  ([c1], [c2]) => {
		const c1S = strengthCalculator(c1);
		const c2S = strengthCalculator(c2);

		if (c1S !== c2S) {
			return c1S - c2S;
		}

		for (let i = 0; i < c1.length; i++) {
			if (c1[i] !== c2[i]) {
				const c1V = cardsValue[c1[i]] ?? c1[i];
				const c2V = cardsValue[c2[i]] ?? c2[i];

				return (+c1V) - (+c2V);
			}
		}

		return 0;
	};
}

const testCases1 = [6440];
const expectedRes1 = 248113761;
function solve1(input) {
	const CARD_VALUE = {
		T: 10,
		J: 11,
		Q: 12,
		K: 13,
		A: 14
	};

	return _(input)
		.sort(getCompareCardFn(CARD_VALUE, getHandStrength))
		.map(([, bid], i) => bid * (i + 1))
		.sum();
}

const testCases2 = [5905];
const expectedRes2 = 246285222;
function solve2(input) {
	const CARD_VALUE = {
		T: 10,
		Q: 12,
		K: 13,
		A: 14,
		J: 1,
	};

	return _(input)
		.sort(getCompareCardFn(CARD_VALUE, getHandStrengthWithJoker))
		.map(([, bid], i) => bid * (i + 1))
		.sum();
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
		solve2
	);

	console.log(res);
}

module.exports = {
	exec1: (inputFilename) => exec(inputFilename, solve1),
	exec2: (inputFilename) => exec(inputFilename, solve2),
	expectedRes1,
	expectedRes2,
	testCases1,
	testCases2
};