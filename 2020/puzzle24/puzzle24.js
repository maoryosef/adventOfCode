'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	return row.match(/((?:s|n)(?:e|w))|(e|w)/g);
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

function move(cX, cY, dir) {
	switch (dir) {
		case 'e': cX++; break;
		case 'w': cX--; break;
		case 'se': cY++; cX += Math.abs(cY) % 2; break;
		case 'sw': cX -= Math.abs(cY) % 2; cY++; break;
		case 'ne': cY--; cX += Math.abs(cY) % 2; break;
		case 'nw': cX -= Math.abs(cY) % 2; cY--; break;
	}

	return [cX, cY];
}

function flipTiles(grid, sX, sY, instructions) {
	let cX = sX;
	let cY = sY;

	for (const inst of instructions) {
		const [nx, ny] = move(cX, cY, inst);
		cX = nx;
		cY = ny;
	}

	const key = `${cX},${cY}`;
	const tile = !grid.get(key);

	grid.set(key, tile);
}

function solve1(input) {
	const grid = new Map();
	for (const row of input) {
		flipTiles(grid, 0, 0, row);
	}

	return [...grid.values()].filter(x => x).length;
}

function getNeighbors(key) {
	const [x, y] = key.split(',').map(x => +x);

	return ['e', 'w', 'se', 'sw', 'ne', 'nw'].map(dir => move(x, y, dir)).map(([nx, ny]) => `${nx},${ny}`);
}

function solve2(input) {
	const grid = new Map();

	for (const row of input) {
		flipTiles(grid, 0, 0, row);
	}

	let currGrid = grid;
	for (let i = 0; i < 100; i++) {
		const tilesToAdd = [];
		for (const tile of currGrid.keys()) {
			const neighbors = getNeighbors(tile);
			neighbors.forEach(n => {
				if (!currGrid.has(n)) {
					tilesToAdd.push(n);
				}
			});
		}

		tilesToAdd.forEach(t => currGrid.set(t, false));
		const nextGrid = new Map();

		for (const [tile, value] of currGrid) {
			const neighbors = getNeighbors(tile);
			const blacks = neighbors.map(n => currGrid.get(n)).filter(x => x).length;

			nextGrid.set(tile, (value && blacks === 1) || blacks === 2);
		}

		currGrid = nextGrid;
	}

	return [...currGrid.values()].filter(x => x).length;
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