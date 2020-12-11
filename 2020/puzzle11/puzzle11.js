'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	return row.split('');
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

const DIRECTIONS = [
	[1, 0], [-1 , 0],
	[0, -1], [0, 1],
	[1, -1], [-1, -1],
	[1, 1], [-1, 1]
];

function getAdjacent(seats, x, y) {
	return DIRECTIONS.map(([xOffset, yOffset]) => seats[y + yOffset]?.[x + xOffset]).filter(v => !!v);
}

function evolve(seats, getAdjacentStrat = getAdjacent, tollerance = 4) {
	const newSeats = seats.slice(0);
	let touched = false;
	for (let y = 0; y < seats.length; y++) {
		newSeats[y] = seats[y].slice(0);
		for (let x = 0; x < seats[0].length; x++) {
			if (seats[y][x] === '.') {
				continue;
			}

			if (seats[y][x] === 'L') {
				const occupiedSeat = getAdjacentStrat(seats, x, y).find(v => v === '#');
				if (!occupiedSeat) {
					touched = true;
					newSeats[y][x] = '#';
				}
			}

			if (seats[y][x] === '#') {
				const occupiedSeat = getAdjacentStrat(seats, x, y).filter(v => v === '#');
				if (occupiedSeat.length >= tollerance) {
					touched = true;
					newSeats[y][x] = 'L';
				}
			}
		}
	}

	return {
		touched,
		newSeats
	};
}

function countOccupied(seats) {
	return seats.flatMap(row => row.filter(v => v === '#')).length;
}

function solve1(input) {
	let seats = input;
	let isTouched = true;

	while (isTouched) {
		const {newSeats, touched} = evolve(seats);

		seats = newSeats;
		isTouched = touched;
	}

	return countOccupied(seats);
}

function lookAtOffset(seats, x, y, xOffset, yOffset) {
	do {
		x += xOffset;
		y += yOffset;

		if (seats[y]?.[x] !== '.') {
			return seats[y]?.[x];
		}
	} while (seats[y]?.[x]);
}

function getAdjacent2(seats, x, y) {
	return DIRECTIONS.map(([xOffset, yOffset]) => lookAtOffset(seats, x, y, xOffset, yOffset)).filter(v => !!v);
}

function solve2(input) {
	let seats = input;
	let isTouched = true;

	while (isTouched) {
		const {newSeats, touched} = evolve(seats, getAdjacent2, 5);

		seats = newSeats;
		isTouched = touched;
	}

	return countOccupied(seats);
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
	console.assert(res === 26, 'fail');
}

module.exports = {
	exec1: (inputFilename) => exec(inputFilename, solve1),
	exec2: (inputFilename) => exec(inputFilename, solve2)
};