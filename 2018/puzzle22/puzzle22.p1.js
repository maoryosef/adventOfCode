'use strict';

const _ = require('lodash');

const DEPTH = 11820;
const EROSION = 20183;
const GEO_Y = 16807;
const GEO_X = 48271;

const target = {
	x: 7,
	y: 782
};

const cave = Array.from({length: target.y + 1}, () => Array.from({length: target.x + 1}, () => 0));

for (let y = 0; y <= target.y; y++) {
	for (let x = 0; x <= target.x; x++) {
		let val = 0;
		if (y === 0) {
			val = ((x * GEO_Y) + DEPTH) % EROSION;
		} else if (x === 0) {
			val = ((y * GEO_X) + DEPTH) % EROSION;
		} else if (y === target.y && x === target.x) {
			val = DEPTH % EROSION;
		} else {
			const geoIndex = cave[y - 1][x] * cave[y][x - 1];
			val = (geoIndex + DEPTH) % EROSION;
		}

		cave[y][x] = val;
	}
}

const risk = _(cave)
	.flatMapDeep(arr => arr.map(v => v % 3))
	.reduce((acc, v) => acc + v);

console.log(risk);