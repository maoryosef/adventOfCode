'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseScanner(row) {
	const [id, ...beacons] = row.split('\n');

	return {
		id,
		beacons: beacons.map(b => b.split(',').map(x => +x))
	};
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n\n')
		.map(parseScanner)
		.value();

	return parsedInput;
}

const rotateVec = ([x, y, z], idx) => {
	return [
		[x, y, z],
		[-x, -y, z],
		[-x, -z, -y],
		[-x, y, -z],
		[x, -y, -z],
		[-y, x, z],
		[-y, -x, -z],
		[y, x, -z],
		[y, -x, z],
		[-y, z, -x],
		[y, -z, -x],
		[y, z, x],
		[-y, -z, x],
		[z, y, -x],
		[z, -y, x],
		[-z, -y, -x],
		[-z, y, x],
		[z, x, y],
		[z, -x, -y],
		[-z, -x, y],
		[-z, x, -y],
		[-x, z, y],
		[x, -z, y],
		[x, z, -y],
	][idx];
};

function normalize(s1, s2) {
	const beacons1 = s1.beacons;
	const beacons2 = s2.beacons;

	for (let i = 0; i < 24; i++) {
		const distanceBucket = new Map();
		for (const b1 of beacons1) {
			for (const b2 of beacons2) {
				const arrangement = rotateVec(b2, i);
				const pos = [b1[0] - arrangement[0], b1[1] - arrangement[1], b1[2] - arrangement[2]];
				const dKey = pos.join(',');

				const distanceCount = (distanceBucket.get(dKey) || 0) + 1;
				distanceBucket.set(dKey, distanceCount);

				if (distanceCount > 11) {
					return {
						id: s2.id,
						pos,
						beacons: s2.beacons.map(vec => {
							const [rx, ry, rz] = rotateVec(vec, i);

							return [rx + pos[0], ry + pos[1], rz + pos[2]];
						})
					};
				}
			}
		}
	}
}

function normalizeAll(scanners) {
	const normalizedScanners = [{...scanners[0], pos: [0, 0, 0]}];
	const found = {[scanners[0].id]: true};
	const checked = {};

	while (Object.keys(found).length < scanners.length) {
		for (const s1 of normalizedScanners) {
			for (const s2 of scanners) {
				if (found[s2.id] || checked[s1.id]?.[s2.id]) {
					continue;
				}

				const normalized = normalize(s1, s2);

				if (normalized) {
					found[s2.id] = true;
					normalizedScanners.push(normalized);
				} else {
					checked[s1.id] = checked[s1.id] || {};
					checked[s1.id][s2.id] = true;
				}
			}
		}
	}

	return normalizedScanners;
}

function solve1(input) {
	return new Set(normalizeAll(input).flatMap(s => s.beacons).map(b => b.join(','))).size;
}

function solve2(input) {
	const normalized = normalizeAll(input);
	let maxD = -Infinity;

	for (const s1 of normalized) {
		for (const s2 of normalized) {
			const d = Math.abs(s1.pos[0] - s2.pos[0]) + Math.abs(s1.pos[1] - s2.pos[1]) + Math.abs(s1.pos[2] - s2.pos[2]);
			maxD = Math.max(maxD, d);
		}
	}

	return maxD;
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