'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.value();

	return parsedInput;
}

const getNeighbors = ([x,y,z]) =>
	[[-1,0,0],[1,0,0],[0,-1,0],[0,1,0],[0,0,-1],[0,0,1]]
		.map(([dx, dy, dz]) => [x + dx, y + dy, z + dz])
		.filter(([x1, y1, z1]) => x1 > -1 && y1 > -1 && z1 > -1);

function floodCubes(cubes, startPoint, maxX, maxY, maxZ) {
	const visited = new Set();
	const queue = [startPoint];

	while (queue.length) {
		const c = queue.shift();
		const cKey = c.join(',');

		if (visited.has(cKey) || ['#','*'].includes(cubes[cKey])) {
			continue;
		}

		visited.add(cKey);

		if (cubes[cKey] === 'x' || c[0] === 0 || c[1] === 0 || c[2] === 0 || c[0] > maxX || c[1] > maxY || c[2] > maxZ) {
			for (const c1 of visited) {
				cubes[c1] = 'x';
			}

			return;
		}

		queue.push(...getNeighbors(c));
	}

	for (const c1 of visited) {
		cubes[c1] = '*';
	}
}

function solve1(input, shouldFloodAirPockets = false) {
	const cubes = {};
	let maxX = -Infinity;
	let maxY = -Infinity;
	let maxZ = -Infinity;

	for (const cube of input) {
		cubes[cube] = '#';

		const [x,y,z] = cube.split(',').map(n => +n);

		maxX = Math.max(maxX, x);
		maxY = Math.max(maxY, y);
		maxZ = Math.max(maxZ, z);
	}

	if (shouldFloodAirPockets) {
		for (let x = 0; x <= maxX; x++) {
			for (let y = 0; y <= maxY; y++) {
				for (let z = 0; z <= maxZ; z++) {
					if (cubes[`${x},${y},${z}`]) {
						continue;
					}

					floodCubes(cubes, [x,y,z], maxX, maxY, maxZ);
				}
			}
		}
	}

	const nCount = input.map(cube =>
		getNeighbors(cube.split(',').map(x => +x))
			.filter(n => ['#','*'].includes(cubes[n.join(',')]))
			.length
	);

	return input.length * 6 - _.sum(nCount);
}

function solve2(input) {
	return solve1(input, true);
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