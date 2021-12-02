'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	const [pathStr, distanceStr] = row.split(' = ');
	const [from, to] = pathStr.split(' to ');

	return {
		from,
		to,
		d: +distanceStr
	};
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

function getAllRoutes(graph, from, to, visited = {}, currentPath = [0]) {
	const foundPaths = [];
	visited[from] = true;

	if (from === to) {
		return [[...currentPath]];
	}

	for (const route of Object.keys(graph[from])) {
		if (!visited[route]) {
			foundPaths.push(...getAllRoutes(graph, route, to, {...visited}, [...currentPath, graph[from][route]]));
		}
	}

	visited[from] = false;

	return foundPaths;
}

function getDistances(input) {
	const graph = input.reduce((acc, edge) => {
		acc[edge.from] = {...acc[edge.from], [edge.to]: edge.d};
		acc[edge.to] = {...acc[edge.to], [edge.from]: edge.d};

		return acc;
	}, {});

	const possibleRoutes = [];
	for (const start of Object.keys(graph)) {
		for (const end of Object.keys(graph)) {
			if (start === end) {
				continue;
			}

			possibleRoutes.push(...getAllRoutes(graph, start, end));
		}
	}

	return possibleRoutes
		.filter((r) => r.length === Object.keys(graph).length)
		.map((r) => r.reduce((acc, v) => acc + v, 0));
}

function solve1(input) {
	return getDistances(input).sort((a, b) => a - b)[0];
}

function solve2(input) {
	return getDistances(input).sort((a, b) => b - a)[0];
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