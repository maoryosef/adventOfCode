'use strict';

const TEST_MODE=false;

const fs = require('fs');
const _ = require('lodash');

const input = fs.readFileSync(`${__dirname}/input${TEST_MODE ? '.test': ''}.txt`, 'utf-8');

const map = _(input)
	.split('\n')
	.map(row => row.split(''))
	.value();


const height = map.length;
const width = map[0].length;

const astroids = [];

for (let y = 0; y < height; y++) {
	for (let x = 0; x < width; x++) {
		if (map[y][x] === '#') {
			astroids.push({x, y});
		}
	}
}

function calcIntersections(astroid, allAstroids) {
	const knownSlopes = new Set();
	let intersections = 0;
	allAstroids.forEach(a => {
		if (_.isEqual(a, astroid)) {
			return;
		}

		const slope = (a.y - astroid.y) / (a.x - astroid.x);
		const dir = a.x > astroid.x ? 'R' : 'L';

		const slopeWithDir = `${slope}-${dir}`;

		if (!knownSlopes.has(slopeWithDir)) {
			knownSlopes.add(slopeWithDir);
			intersections++;
		}

	});

	return intersections;
}

const intersectionsMap = _(astroids)
	.mapKeys(a => `${a.x},${a.y}`)
	.mapValues(a => calcIntersections(a, astroids))
	.value();

console.log(intersectionsMap);

const res = _(intersectionsMap)
	.values()
	.sort()
	.last();

console.log(res);