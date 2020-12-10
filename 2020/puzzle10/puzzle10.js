'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	return parseInt(row);
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.sort((a, b) => a - b)
		.value();

	return parsedInput;
}

function solve1(input) {
	const adapters = [0, ...input, input[input.length - 1] + 3];

	const diffMap = adapters.map((v, i) => {
		if (i + 1 < adapters.length) {
			return adapters[i + 1] - v;
		}

		return 0;
	});

	const diff1 = diffMap.filter(v => v === 1);
	const diff3 = diffMap.filter(v => v === 3);

	return diff1.length  *  diff3.length;
}

function getNextIndices(adapters, v, idx) {
	const indices = [];

	while (++idx < adapters.length && adapters[idx] - v < 4) {
		indices.push(idx);
	}

	return indices;
}

function countMoves(tree, node, calcCache = {}) {
	const paths = tree[node];

	if (paths.length === 0) {
		return 1;
	}

	if (calcCache[node]) {
		return calcCache[node];
	}

	const res = _.sum(paths.map(v => countMoves(tree, v, calcCache)));

	calcCache[node] = res;

	return res;
}

function solve2(input) {
	const adapters = [0, ...input, input[input.length - 1] + 3];

	const diffMap = _.assign(...adapters.map((v, i) => ({
		[i]: getNextIndices(adapters, v, i)
	})));

	return countMoves(diffMap, 0);
}

function exec(inputFilename, solver, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = parseInput(input);

	return solver(parsedInput);
}

module.exports = {
	exec1: (inputFilename) => exec(inputFilename, solve1),
	exec2: (inputFilename) => exec(inputFilename, solve2)
};