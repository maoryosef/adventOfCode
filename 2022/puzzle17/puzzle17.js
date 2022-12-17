'use strict';

const fs = require('fs');

function parseInput(input) {
	return input.split('');
}

const SHAPES = [[[1,1,1,1]], [[0,1,0],[1,1,1],[0,1,0]], [[0,0,1], [0,0,1], [1,1,1]], [[1],[1],[1],[1]], [[1,1],[1,1]]];

const toKey = (x, y) => `${x},${y}`;

function canMove(chamber, shape, pos) {
	const width = shape[0].length;
	const height = shape.length;

	if (pos[0] < 0 || pos[0] + width > 7) {
		return false;
	}

	for (let y = height - 1; y >= 0; y--) {
		for (let x = 0; x < shape[y].length; x++) {
			if (shape[y][x] === 0) {
				continue;
			}

			const chamberY = pos[1] + (height - y - 1);
			if (chamber[toKey(pos[0] + x, chamberY)]) {
				return false;
			}
		}
	}

	return true;
}

function markChamber(chamber, shape, pos) {
	const height = shape.length;

	for (let y = height - 1; y >= 0; y--) {
		for (let x = 0; x < shape[y].length; x++) {
			if (shape[y][x] === 0) {
				continue;
			}

			const chamberY = pos[1] + (height - y - 1);
			chamber[toKey(pos[0] + x, chamberY)] = 1;
		}
	}
}

const toShapeCacheKey = (shape, startJet, endX, drop) => `${shape},${startJet},${endX},${drop}`;

function findPattern(input, limit, requiredPatternRepeats = 1) {
	let stoppedRocks = 0;
	let highestRock = 0;
	let prevHighestRock = 0;
	let patternFound = false;
	let firstFound = null;
	let heightOnPatternStart = 0;
	let rocksSinceFirst = 0;

	const pattern = [];
	const chamber = {};
	const shapeCache = {};

	for (let i = 0; i < 7; i++) {
		chamber[toKey(i, -1)] = 1;
	}

	let jetCount = 0;
	while (!patternFound) {
		const shapeIdx = stoppedRocks % SHAPES.length;
		const shape = SHAPES[shapeIdx];

		const pos = [2, highestRock + 3];

		let stopped = false;

		let unitsDropped = 0;
		const startJetIdx = jetCount % input.length;
		while (!stopped) {
			const jetIdx = jetCount % input.length;
			const jet = input[jetIdx];
			const nextX = pos[0] + (jet === '>' ? 1 : -1);
			if (canMove(chamber, shape, [nextX, pos[1]])) {
				pos[0] = nextX;
			}

			if (canMove(chamber, shape, [pos[0], pos[1] - 1])) {
				pos[1]--;
				unitsDropped++;
			} else {
				markChamber(chamber, shape, pos);

				const cacheKey = toShapeCacheKey(shapeIdx, startJetIdx, pos[0], unitsDropped);

				if (shapeCache[cacheKey]) {
					if (cacheKey === firstFound && !requiredPatternRepeats) {
						return {rocksSinceFirst, heightOnPatternStart, pattern};
					}

					if (!firstFound || cacheKey === firstFound) {
						firstFound = cacheKey;
						heightOnPatternStart = prevHighestRock;
						rocksSinceFirst = stoppedRocks;
						requiredPatternRepeats--;
					}

					if (!requiredPatternRepeats) {
						pattern.push({k: cacheKey, diff: highestRock - heightOnPatternStart});
					}
				}

				shapeCache[cacheKey] = true;
				stopped = true;
				stoppedRocks++;

				const height = shape.length;
				prevHighestRock = highestRock;
				highestRock = Math.max(highestRock, pos[1] + height);

				if (stoppedRocks === limit) {
					return {rocksSinceFirst, heightOnPatternStart, pattern, heightOnLimit: highestRock};
				}
			}
			jetCount++;
		}
	}

	return highestRock;
}

function solve1(input, rocks = 2022) {
	const { rocksSinceFirst, heightOnPatternStart, pattern, heightOnLimit } = findPattern(input, rocks, input.length > 40 ? 2 : 1);

	if (heightOnLimit) {
		return heightOnLimit;
	}

	const startPoint = rocks - rocksSinceFirst;
	const factor = Math.floor(startPoint / pattern.length);
	const heightDiff = pattern[pattern.length - 1].diff;
	const remainder = startPoint % pattern.length;

	return heightOnPatternStart + factor * heightDiff + pattern[remainder].diff;
}

function solve2(input) {
	return solve1(input, 1000000000000);
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