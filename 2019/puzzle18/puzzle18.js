'use strict';

const fs = require('fs');
const _ = require('lodash');
const {Heap} = require('heap-js');

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

const isKeyOrDoor = (value) => !['#', '.'].includes(value);

function generateGraph(grid) {
	const graph = new Map();

	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[y].length; x++) {
			if (isKeyOrDoor(grid[y][x])) {
				graph.set(grid[y][x], getReachableCells(grid, {x, y}));
			}
		}
	}

	return graph;
}

const toKey = (x, y) => `${x}-${y}`;

const getNeighbors = (grid, {x, y}) =>
	[
		{x: x - 1, y},
		{x: x + 1, y},
		{x, y: y - 1},
		{x, y: y + 1},
	].filter(c => c.x >= 0 && c.x < grid[0].length && c.y >= 0 && c.y < grid.length);

function getReachableCells(grid, {x, y}) {
	const visited = new Set();
	const edges = new Map();

	const queue = [];
	queue.push({
		x,
		y,
		cost: 0
	});

	visited.add(toKey(x, y));

	while (queue.length > 0) {
		const current = queue.shift();
		for (const n of getNeighbors(grid, current)) {
			const cell = grid[n.y][n.x];
			const cellKey = toKey(n.x, n.y);
			if (cell === '#' || visited.has(cellKey)) {
				continue;
			}

			visited.add(cellKey);

			if (cell === '.') {
				queue.push({
					x: n.x,
					y: n.y,
					cost: current.cost + 1
				});
			} else {
				edges.set(cell, current.cost + 1);
			}
		}
	}

	return edges;
}

const toCacheKey = (cells, keys) => `${[...cells].sort().join('')}-${[...keys].sort().join(',')}`;

function search(graph, startCells) {
	const priorityQueue = new Heap((a, b) => {
		if (a.cost === b.cost) {
			return b.keys.size - a.keys.size;
		}

		return a.cost - b.cost;
	});

	const keyCount = [...graph.keys()].filter(k => /[a-z]/.test(k)).length;

	const distances = new Map();
	distances.set(toCacheKey(startCells, new Set()),  0);

	priorityQueue.push({
		cost: 0,
		cells: startCells,
		keys: new Set(),
	});

	const cache = new Map();

	while (priorityQueue.length) {
		const current = priorityQueue.pop();

		if (current.keys.size === keyCount) {
			return current.cost;
		}

		const bestDistance = distances.get(toCacheKey(current.cells, current.keys));

		if (bestDistance && current.cost > bestDistance) {
			continue;
		}

		for (const [cellIdx, cell] of current.cells.entries()) {
			const cacheKey = toCacheKey([cell], current.keys);
			const remainingKeys = cache.get(cacheKey) || getRemainingReachableKeys(graph, cell, current.keys);
			cache.set(cacheKey, remainingKeys);

			for (const [nextCell, cost] of remainingKeys) {
				const nextKeys = new Set(current.keys);
				nextKeys.add(nextCell);

				const nextCells = [...current.cells];
				nextCells[cellIdx] = nextCell;

				const nextCacheKey = toCacheKey(nextCells, nextKeys);
				const distanceCache = distances.get(nextCacheKey) || Infinity;

				const nextCost = current.cost + cost;

				if (nextCost < distanceCache) {
					distances.set(nextCacheKey, nextCost);

					priorityQueue.push({
						cost: nextCost,
						cells: nextCells,
						keys: nextKeys,
					});
				}
			}
		}
	}

	return Infinity;
}

function getRemainingReachableKeys(
	graph,
	startCell,
	foundKeys,
) {
	const distances = new Map();

	for (const key of graph.keys()) {
		distances.set(key, Infinity);
	}

	distances.set(startCell, 0);

	const priorityQueue = new Heap((a, b) => a.cost - b.cost);

	priorityQueue.push({
		cost: 0,
		cell: startCell,
	});

	const newKeys = new Set();

	while (priorityQueue.length) {
		const current = priorityQueue.pop();

		if (/[a-z]/.test(current.cell) && !foundKeys.has(current.cell)) {
			newKeys.add(current.cell);
			continue;
		}

		if (current.cost > distances.get(current.cell)) {
			continue;
		}

		for (const [nextCell, nextCost] of graph.get(current.cell).entries()) {
			if (/[A-Z]/.test(nextCell) && !foundKeys.has(nextCell.toLowerCase())) {
				continue;
			}

			const next = {
				cost: current.cost + nextCost,
				cell: nextCell
			};

			if (next.cost < distances.get(nextCell)) {
				distances.set(nextCell, next.cost);
				priorityQueue.push(next);
			}
		}
	}

	return [...newKeys].map(key => [key, distances.get(key)]);
}

function solve1(input) {
	const graph = generateGraph(input);

	return search(graph, ['@']);
}

function adjustInputForPuzzle2(input) {
	let entryCords;

	for (const [rowIndex, row] of input.entries()) {
		const entryIdx = row.indexOf('@');

		if (entryIdx > -1) {
			entryCords = {
				col: entryIdx,
				row: rowIndex,
			};
		}
	}

	const {row, col} = entryCords;

	input[row][col] = '#';
	input[row - 1][col] = '#';
	input[row + 1][col] = '#';
	input[row][col - 1] = '#';
	input[row][col + 1] = '#';
	input[row - 1][col - 1] = '@';
	input[row - 1][col + 1] = '$';
	input[row + 1][col - 1] = '%';
	input[row + 1][col + 1] = '&';
}

function solve2(input) {
	adjustInputForPuzzle2(input);

	const graph = generateGraph(input);

	return search(graph, ['@', '$', '%', '&']);
}

function exec(inputFilename, solver, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = parseInput(input);

	return solver(parsedInput);
}

if (!global.TEST_MODE) {
	const inputFile = 'input.test.4.txt';
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