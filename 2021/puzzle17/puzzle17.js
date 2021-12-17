'use strict';

const fs = require('fs');

function parseInput(input) {
	const parsedInput = input.split(': ')[1];
	const [xPart, yPart] = parsedInput.split(', ');

	const [minX, maxX] = xPart.slice(2).split('..').map(v => +v);
	const [minY, maxY] = yPart.slice(2).split('..').map(v => +v);
	return {
		minX,
		maxX,
		minY,
		maxY,
	};
}

function overshoot(x, y, target) {
	return x > target.maxX || y < target.minY;
}

function targetHit(x, y, target) {
	return x >= target.minX && x <= target.maxX && y >= target.minY && y <= target.maxY;
}

function simulate(sX, sY, vX, vY, target) {
	let maxH = -Infinity;
	let cX = sX;
	let cY = sY;

	while (!overshoot(cX, cY, target)) {
		cX += vX;
		cY += vY;

		maxH = Math.max(maxH, cY);

		if (targetHit(cX, cY, target)) {
			return maxH;
		}

		if (vX > 0) {
			vX--;
		} else if (vX < 0) {
			vX++;
		}

		vY--;
	}

	return -Infinity;
}

function solve1(input) {
	let maxH = -Infinity;
	for (let i = 0; i < input.maxX; i++) {
		for (let j = 0; j < Math.abs(input.minY); j++) {
			maxH = Math.max(maxH, simulate(0,0, i, j, input));
		}
	}

	return maxH;
}

function solve2(input) {
	let count = 0;
	for (let i = 0; i <= input.maxX; i++) {
		for (let j = input.minY; j <= Math.abs(input.minY); j++) {
			if (simulate(0,0, i, j, input) > -Infinity) {
				count++;
			}
		}
	}

	return count;
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