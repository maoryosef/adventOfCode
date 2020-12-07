'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	const [bag, content] = row.replace(/ bags?\.?/g, '').split(' contain ');

	if (content === 'no other') {
		return {
			[bag]: null
		};
	}

	const parsedContent = content
		.split(',')
		.map(c => {
			const [, count, innerBag] = c.trim()
				.match(/^(\d+) (.*)$/i);

			return [...Array(parseInt(count))].map(() => innerBag);
		});

	return {
		[bag]: _.flatten(parsedContent)
	};
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return _.assign(...parsedInput);
}

function searchTree(tree, root, target = 'shiny gold', visited = {}) {
	if (visited[root]) {
		return false;
	}

	visited[root] = true;

	if (!tree[root]) {
		return false;
	}

	if (_.includes(tree[root], target)) {
		return true;
	}

	return tree[root].some(v => searchTree(tree, v, target, visited));
}

function solve1(input) {
	const solution = _(input)
		.mapValues((v, k) => searchTree(input, k))
		.reduce((acc, v) => acc + v, 0);

	return solution;
}

function countBags(tree, root) {
	if (!tree[root]) {
		return [0];
	}

	return tree[root].map(v => _.sum([...countBags(tree, v), 1]));
}

function solve2(input) {
	return _.sum([...countBags(input, 'shiny gold')]);
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