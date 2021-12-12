'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	return row.split('-');
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.reduce((graph, [from, to]) => {
			graph[from] = graph[from] || [];
			graph[to] = graph[to] || [];
			graph[from].push(to);
			graph[to].push(from);

			return graph;
		}, {});

	return parsedInput;
}

function getAllRoutes(graph, from, to, shouldMarkAsVisited, visited = {}, currentPath = [from]) {
	const foundPaths = [];

	if (shouldMarkAsVisited(from, visited)) {
		visited[from] = (visited[from] || 0) + 1;
	}

	if (from === to) {
		return [[...currentPath]];
	}

	for (const route of graph[from]) {
		if (!visited[route]) {
			foundPaths.push(...getAllRoutes(graph, route, to, shouldMarkAsVisited, {...visited}, [...currentPath, route]));
		}
	}

	visited[from] = false;

	return foundPaths;
}

function solve1(input) {
	return getAllRoutes(input, 'start', 'end', from => from === from.toLowerCase()).length;
}

function solve2(input) {
	const edges = Object.keys(input)
		.filter(x => !['start', 'end'].includes(x) && x === x.toLowerCase());

	const routes = [];
	for (const allowedTwice of edges) {
		const shouldMarkAsVisited = (from, visited) => {
			if (from !== from.toLowerCase()) {
				return false;
			}

			if (visited[from] === undefined && from === allowedTwice) {
				visited[from] = 0;
				return false;
			}

			return true;
		};

		routes.push(...getAllRoutes(input, 'start', 'end', shouldMarkAsVisited));
	}

	return new Set(routes.map(r => r.join(','))).size;
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