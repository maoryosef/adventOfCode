import fs from 'fs';
import _ from 'lodash';

function parseRow(row: string) {
	const [pathStr, distanceStr] = row.split(' = ');
	const [from, to] = pathStr.split(' to ');

	return {
		from,
		to,
		d: +distanceStr
	};
}

interface ParseInput {
	from: string;
	to: string;
	d: number;
}

function parseInput(input: string) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

function getAllRoutes(graph: Record<string, Record<string, number>>, from: string, to: string, visited: Record<string, boolean> = {}, currentPath = [0]): number[][] {
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

function getDistances(input: ParseInput[]) {
	const graph = input.reduce((acc: Record<string, Record<string, number>>, edge) => {
		acc[edge.from] = {...acc[edge.from], [edge.to]: edge.d};
		acc[edge.to] = {...acc[edge.to], [edge.from]: edge.d};

		return acc;
	}, {});

	const possibleRoutes: number[][] = [];
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

function solve1(input: ParseInput[]) {
	return getDistances(input).sort((a, b) => a - b)[0];
}

function solve2(input: ParseInput[]) {
	return getDistances(input).sort((a, b) => b - a)[0];
}

function exec(inputFilename: string, solver: Function, inputStr?: string) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = parseInput(input);

	return solver(parsedInput);
}

if (!global.TEST_MODE) {
	const inputFile = 'input.test.1.txt';
	const {join} = require('path')

	const res = exec(
		join(__dirname, '__TESTS__', inputFile),
		solve1
	);

	console.log(res);
}

export default {
	exec1: (inputFilename: string) => exec(inputFilename, solve1),
	exec2: (inputFilename: string) => exec(inputFilename, solve2)
};