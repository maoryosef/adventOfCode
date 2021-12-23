'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	const [cmd, cube] = row.split(' ');

	return {
		cmd,
		cube: cube.split(',').map(r => r.split('=')[1]).map(r => r.split('..').map(x => +x))
	};
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

function solve1(input) {
	const cubes = new Set();

	input
		.filter(x => x.cube.every(r => r[0] >= -50 && r[1] <= 50))
		.forEach(({cmd, cube}) => {
			for (let x = cube[0][0]; x <= cube[0][1]; x++) {
				for (let y = cube[1][0]; y <= cube[1][1]; y++) {
					for (let z = cube[2][0]; z <= cube[2][1]; z++) {
						if (cmd === 'on') {
							cubes.add(`${x},${y},${z}`);
						} else {
							cubes.delete(`${x},${y},${z}`);
						}
					}
				}
			}
		});

	return cubes.size;
}

const breakToCubes = (c1, c2) => {
	const cubes = [];
	const [xMin1, xMax1] = c1[0];
	const [yMin1, yMax1] = c1[1];
	const [zMin1, zMax1] = c1[2];
	const [xMin2, xMax2] = c2[0];
	const [yMin2, yMax2] = c2[1];
	const [zMin2, zMax2] = c2[2];

	if (xMin1 < xMin2) {
		cubes.push([
			[xMin1, xMin2 - 1],
			[yMin1, yMax1],
			[zMin1, zMax1],
		]);
	}

	if (xMax1 > xMax2) {
		cubes.push([
			[xMax2 + 1, xMax1],
			[yMin1, yMax1],
			[zMin1, zMax1],
		]);
	}

	if (yMax1 > yMax2) {
		cubes.push([
			[xMin2, xMax2],
			[yMax2 + 1, yMax1],
			[zMin1, zMax1],
		]);
	}

	if (yMin1 < yMin2) {
		cubes.push([
			[xMin2, xMax2],
			[yMin1, yMin2 - 1],
			[zMin1, zMax1],
		]);
	}

	if (zMax1 > zMax2) {
		cubes.push([
			[xMin2, xMax2],
			[yMin2, yMax2],
			[zMax2 + 1, zMax1],
		]);
	}

	if (zMin1 < zMin2) {
		cubes.push([
			[xMin2, xMax2],
			[yMin2, yMax2],
			[zMin1, zMin2 - 1],
		]);
	}

	return cubes;
};

const getCommonAxis = (min1 = 0, max1 = 0, min2 = 0, max2 = 0) => {
	const min = Math.max(min1, min2);
	const max = Math.min(max1, max2);

	if (min <= max) {
		return [min, max];
	}

	return null;
};

function getUniqueCubes(c1, c2) {
	const [xMin1, xMax1] = c1[0];
	const [yMin1, yMax1] = c1[1];
	const [zMin1, zMax1] = c1[2];
	const [xMin2, xMax2] = c2[0];
	const [yMin2, yMax2] = c2[1];
	const [zMin2, zMax2] = c2[2];

	const commonX = getCommonAxis(xMin1, xMax1, xMin2, xMax2);
	const commonY = getCommonAxis(yMin1, yMax1, yMin2, yMax2);
	const commonZ = getCommonAxis(zMin1, zMax1, zMin2, zMax2);

	if (!commonX || !commonY || !commonZ) {
		return [c1];
	}

	const commonCube = [
		commonX,
		commonY,
		commonZ,
	];

	const brokenCubes = breakToCubes(c1, commonCube);

	return brokenCubes;
}

function solve2(input) {
	let brokenCubes = [];

	input.forEach(({ cmd, cube }) => {
		if (cmd === 'on') {
			let cubesToBreak = [cube];

			brokenCubes.forEach(c2 => {
				cubesToBreak = cubesToBreak
					.flatMap(c1 => getUniqueCubes(c1, c2));
			});

			brokenCubes.push(...cubesToBreak);
		} else {
			brokenCubes = brokenCubes
				.flatMap(c1 => getUniqueCubes(c1, cube));
		}
	});

	return brokenCubes.reduce(
		(sum, cube) =>
			sum +
			(cube[0][1] - cube[0][0] + 1) *
			(cube[1][1] - cube[1][0] + 1) *
			(cube[2][1] - cube[2][0] + 1),
		0
	);
}

function exec(inputFilename, solver, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = parseInput(input);

	return solver(parsedInput);
}

if (!global.TEST_MODE) {
	const inputFile = 'input.test.3.txt';
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