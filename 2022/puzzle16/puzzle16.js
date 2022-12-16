'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	const [, name, rate, tunnels] = row.match(/Valve (..) has flow rate=(\d+?); tunnels? leads? to valves? (.*)$/);

	return [name, +rate, tunnels.split(',').map(t => t.trim())];
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

function buildGraph(input) {
	const graph = {};

	for (const [name, rate, tunnels] of input) {
		graph[name] = {tunnels: tunnels.slice(0), rate: 0};
		if (rate > 0) {
			graph[`${name}-O`] = {tunnels: tunnels.slice(0), rate};
			graph[name].tunnels.push(`${name}-O`);
		}
	}

	return graph;
}

function getDistance(graph, from, to) {
	const queue = [{id: from, level: 0}];
	const visited = new Set();

	while (queue.length > 0) {
		const curr = queue.shift();

		if (curr.id === to) {
			return curr.level;
		}

		if (visited.has(curr.id)) {
			continue;
		}

		visited.add(curr.id);
		for (const t of graph[curr.id].tunnels) {
			queue.push({id: t, level: curr.level + 1});
		}
	}

	throw new Error('Unreachable');
}

const cache = new Map();

const toKey = (pos, valves, timeRemaining) => `${pos}:${valves.sort().join(',')}:${timeRemaining}`;

function getMaxPressure(graph, distanceMap, from, valves, timeRemaining, gained = 0) {
	let maxPressure = gained;
	const cacheKey = toKey(from, valves, timeRemaining);

	if (cache.has(cacheKey)) {
		// cache returning wrong answer
		// return cache.get(cacheKey);
	}

	for (const v of valves) {
		const gain = gained + (timeRemaining - distanceMap[from][v]) * graph[v].rate;

		const pressure = getMaxPressure(graph, distanceMap, v, _.without(valves, v), timeRemaining - distanceMap[from][v], gain);

		maxPressure = Math.max(pressure, maxPressure);
	}

	cache.set(cacheKey, maxPressure);
	return maxPressure;
}

//TODO: finish this someday
//https://excalidraw.com/#json=EFuxN7_q1O2-TFtAF5cFt,8JX_zbPM5CLzvuihft8cFQ
function solve1(input, timeBudget = 30) {
	const graph = buildGraph(input);
	const valves = Object.keys(graph).filter(k => k.includes('-O'));

	const distanceMap = {};

	for (const from of ['AA'].concat(valves)) {
		for (const to of valves) {
			if (from === to) {
				continue;
			}

			_.set(distanceMap, [from, to], getDistance(graph, from, to));
		}
	}

	return getMaxPressure(graph, distanceMap, 'AA', valves, timeBudget);
}

function solve2(input) {
	return input;
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