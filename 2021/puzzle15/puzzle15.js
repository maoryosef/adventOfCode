'use strict';

const fs = require('fs');
const _ = require('lodash');
const {Heap} = require('heap-js');

function parseRow(row) {
	return row.split('').map(x => +x);
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

const toKey = ([x, y]) => `${x},${y}`;

function getNeighbors(cave, [x, y]) {
	return [[0, 1], [0, -1], [1, 0], [-1, 0]]
		.map(d => ([x + d[0], y + d[1]]))
		.filter(d => d[1] >= 0 && d[1] < cave.length && d[0] >= 0 && d[0] < cave[0].length);
}

function searchCheapestPath(
	cave,
	start,
	end,
) {
	const distances = new Map();

	distances.set(toKey(start), 0);

	const priorityQueue = new Heap((a, b) => a.cost - b.cost);

	priorityQueue.push({
		cost: 0,
		cell: start,
	});

	while (priorityQueue.length) {
		const current = priorityQueue.pop();

		if (current.cost > distances.get(current.cell)) {
			continue;
		}

		if (current.cell[0] === end[0] && current.cell[1] === end[1]) {
			return current.cost;
		}

		for (const nextCell of getNeighbors(cave, current.cell)) {
			const next = {
				cost: current.cost + cave[nextCell[1]][nextCell[0]],
				cell: nextCell
			};

			const nextCellKey = toKey(nextCell);
			const calculatedCost = distances.get(nextCellKey) ?? Infinity;

			if (next.cost < calculatedCost) {
				distances.set(nextCellKey, next.cost);
				priorityQueue.push(next);
			}
		}
	}

	return Infinity;
}

function solve1(input) {
	return searchCheapestPath(input, [0, 0], [input[0].length - 1, input.length - 1]);
}

function expandCave(cave) {
	const rowSize = cave[0].length;
	const caveHeight = cave.length;

	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < caveHeight; j++) {
			const slice = cave[j].slice(rowSize * i, rowSize * i + rowSize).map(x => x % 9 + 1);
			cave[j].push(...slice);
		}
	}

	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < caveHeight; j++) {
			const slice = cave[caveHeight * i + j].map(x => x % 9 + 1);
			cave.push(slice);
		}
	}

	return cave;
}

function solve2(input) {
	const expandedCave = expandCave(input);
	return solve1(expandedCave);
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