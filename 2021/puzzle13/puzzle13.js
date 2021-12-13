'use strict';

const fs = require('fs');
const {drawAscii} = require('aoc-utils').drawUtils;

function parsePoints(points) {
	return points.split('\n').map(p => p.split(',').map(x => +x));
}

function parseFolds(folds) {
	return folds.split('\n')
		.map(f => f.slice('fold along'.length + 1).split('='))
		.map(f => ({axis: f[0], v: +f[1]}));
}

function parseInput(input) {
	const [points, folds] = input.split('\n\n');

	return {
		points: parsePoints(points),
		folds: parseFolds(folds),
	};
}

function solve1(input) {
	const graph = {};

	const fold = input.folds[0];

	const axisIdx = fold.axis === 'x' ? 0 : 1;

	input.points.forEach(p => {
		const newP = {...p};
		if (p[axisIdx] > fold.v) {
			newP[axisIdx] = fold.v * 2 - p[axisIdx];

			if (newP[axisIdx] < 0) {
				throw new Error('what to do?');
			}
		}

		graph[`${newP[0]},${newP[1]}`] = '#';
	});

	return Object.entries(graph).length;
}

function solve2(input) {

	let points = input.points;

	for (const fold of input.folds) {
		const graph = {};
		const axisIdx = fold.axis === 'x' ? 0 : 1;

		points.forEach(p => {
			const newP = [...p];
			if (p[axisIdx] > fold.v) {
				newP[axisIdx] = fold.v * 2 - p[axisIdx];

				if (newP[axisIdx] < 0) {
					throw new Error('what to do ' + newP[axisIdx]);
				}
			}

			graph[`${newP[0]},${newP[1]}`] = newP;
		});

		points = Object.values(graph);
	}

	let minX = Infinity;
	let minY = Infinity;

	let maxX = -Infinity;
	let maxY = -Infinity;

	points.map(([x,y]) => {
		if (x < minX) {
			minX = x;
		}

		if (y < minY) {
			minY = y;
		}

		if (x > maxX) {
			maxX = x;
		}

		if (y > maxY) {
			maxY = y;
		}
	});

	const width = 1 + maxX - minX;
	const height = 1 + maxY - minY;

	const image = new Array(height);

	for (let y = 0; y < height; y++) {
		image[y] = new Array(width);

		for (let x = 0; x < width; x++) {
			image[y][x] = 0;
		}
	}

	points.forEach(([x,y]) => {
		image[y - minY][x - minX] = 1;
	});

	return drawAscii(image, {0: ' ', 1: '#'}, 2);
}

function exec(inputFilename, solver, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = parseInput(input);

	return solver(parsedInput);
}

if (!global.TEST_MODE) {
	const inputFile = 'input.txt';
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