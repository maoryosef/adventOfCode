'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	return parseInt(row.split(':')[1]);
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}
const sumSeries = (n, m) => (m - n + 1) * (m + n) / 2;

function sumDices(diceFace) {
	if (diceFace + 2 <= 100) {
		return sumSeries(diceFace, diceFace + 2);
	}

	switch (diceFace) {
		case 99: return 200;
		case 100: return 103;
		default: throw new Error('what else??');
	}
}

function solve1([p1Pos, p2Pos]) {
	let p1Score = 0;
	let p2Score = 0;
	let diceRolls = 0;
	let diceFace = 1;
	let turn = 0;

	while (p1Score < 1000 && p2Score < 1000) {
		const steps = sumDices(diceFace);

		diceFace = (diceFace + 3) % 100 || 100;
		diceRolls += 3;
		if (turn % 2 === 0) {
			p1Pos = (p1Pos + steps) % 10 || 10;
			p1Score += p1Pos;
		} else {
			p2Pos = (p2Pos + steps) % 10 || 10;
			p2Score += p2Pos;
		}

		turn++;
	}

	return diceRolls * Math.min(p1Score, p2Score);
}

const gamesCache = {};
const ROLLS_COUNT = {
	3: 1,
	4: 3,
	5: 6,
	6: 7,
	7: 6,
	8: 3,
	9: 1
};

function playDirac(p1Pos, p2Pos, p1Score, p2Score, turn) {
	if (p1Score >= 21) {
		return [1, 0];
	}

	if (p2Score >= 21) {
		return [0, 1];
	}

	const key = `${p1Pos},${p2Pos},${p1Score},${p2Score},${turn % 2}`;

	if (gamesCache[key]) {
		return gamesCache[key];
	}

	let p1Wins = 0;
	let p2Wins = 0;

	for (let diceValue = 3; diceValue <= 9; diceValue++) {
		let p1NextPos = p1Pos;
		let p2NextPos = p2Pos;
		let p1NextScore = p1Score;
		let p2NextScore = p2Score;
		if (turn % 2 === 0) {
			p1NextPos = (p1Pos + diceValue) % 10 || 10;
			p1NextScore += p1NextPos;
		} else {
			p2NextPos = (p2Pos + diceValue) % 10 || 10;
			p2NextScore += p2NextPos;
		}

		const [p1AdditionalWins, p2AdditionalWins] = playDirac(p1NextPos, p2NextPos, p1NextScore, p2NextScore, turn + 1);
		p1Wins += p1AdditionalWins * ROLLS_COUNT[diceValue];
		p2Wins += p2AdditionalWins * ROLLS_COUNT[diceValue];
	}

	gamesCache[key] = [p1Wins, p2Wins];

	return gamesCache[key];
}

function solve2([p1Pos, p2Pos]) {
	const winCount = playDirac(p1Pos, p2Pos, 0, 0, 0);

	return Math.max(...winCount);
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
	exec2: (inputFilename) => exec(inputFilename, solve2)
};