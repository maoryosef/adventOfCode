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

function findStartPoint(map) {
	for (let i = 0; i < map.length; i++) {
		for (let j = 0; j < map[i].length; j++) {
			if (map[i][j] === 'S') {
				return [i, j];
			}
		}
	}
}

const toKey = ([y, x]) => `${x},${y}`;

const getHeight = (map, [row, col]) => {
	switch (map[row][col]) {
		case 'S': return 'a'.charCodeAt(0);
		case 'E': return 'z'.charCodeAt(0);
		default: return map[row][col].charCodeAt(0);
	}
};

function getNeighbors(map, [row, col]) {
	const height = getHeight(map, [row, col]);

	return [[0, 1], [0, -1], [1, 0], [-1, 0]]
		.map(n => ([row + n[0], col + n[1]]))
		.filter(n => n[0] >= 0 && n[0] < map.length && n[1] >= 0 && n[1] < map[0].length)
		.filter(n => {
			const heightDiff = getHeight(map, n) - height;

			return heightDiff <= 1;
		});
}

function solve1(map, startPoint = findStartPoint(map)) {
	const visited = new Set();
	const queue = [{p: startPoint, level: 0}];

	while (queue.length > 0) {
		const curr = queue.shift();

		if (map[curr.p[0]][curr.p[1]] === 'E') {
			return curr.level;
		}

		if (visited.has(toKey(curr.p))) {
			continue;
		}

		visited.add(toKey(curr.p));

		const neighbors = getNeighbors(map, curr.p);

		queue.push(...neighbors.map(n => ({p: n, level: curr.level + 1})));
	}

	return null;
}

function solve2(map) {
	const startPoints = [];

	for (let i = 0; i < map.length; i++) {
		for (let j = 0; j < map[i].length; j++) {
			if (map[i][j] === 'S' || map[i][j] === 'a') {
				startPoints.push([i, j]);
			}
		}
	}

	return startPoints
		.map(p => solve1(map, p))
		.filter(v => !!v)
		.sort((a, b) => a - b)[0];
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