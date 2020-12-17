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

function getAllRoutes(graph, from, to, visited = {}, currentPath = [from]) {
	const foundPaths = [];
	visited[from] = true;

	if (from === to) {
		return [[...currentPath]];
	}

	for (const route of Object.keys(graph[from])) {
		if (!visited[route]) {
			currentPath.push(route);
			foundPaths.push(...getAllRoutes(graph, route, to, {...visited}, [...currentPath]));
			currentPath.pop();
		}
	}

	visited[from] = false;

	return foundPaths;
}

function getRoutesWithDistance(input) {
	const locations = new Set();

	const graph = input.reduce((acc, edge) => {
		acc[edge.from] = {...acc[edge.from], [edge.to]: edge.d};
		acc[edge.to] = {...acc[edge.to], [edge.from]: edge.d};

		locations.add(edge.from);
		locations.add(edge.to);

		return acc;
	}, {});

	const possibleRoutes = [];
	for (const start of locations) {
		for (const end of locations) {
			if (start === end) {
				continue;
			}

			possibleRoutes.push(...getAllRoutes(graph, start, end));
		}
	}

	const validRoutes = possibleRoutes.filter(r => r.length === locations.size);

	return validRoutes.map(r => {
		let d = 0;
		for (let i = 0; i < r.length - 1; i++) {
			const from = r[i];
			const to = r[i + 1];

			d += graph[from][to];
		}

		return {
			d,
			r
		};
	});
}

function solve1(input) {
	return getRoutesWithDistance(input).sort((a, b) => a.d - b.d)[0].d;
}

function solve2(input) {
	return getRoutesWithDistance(input).sort((a, b) => b.d - a.d)[0].d;
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