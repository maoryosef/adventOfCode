'use strict';

const TEST_MODE=true;

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

function calcSlopes(astroid, allAstroids) {
	const slopes = [];
	allAstroids.forEach(a => {
		if (_.isEqual(a, astroid)) {
			return;
		}

		const slope = (a.y - astroid.y) / (a.x - astroid.x);
		const distance = Math.sqrt(Math.pow(a.x - astroid.x, 2) + Math.pow(a.y - astroid.y, 2));

		slopes.push({a, slope, distance});
	});

	return _.sortBy(slopes, ['slope', 'distance']);
}

function shootAstroids(astroid, allAstroids) {
	const livingAstroids = _.reject(allAstroids, astroid);
	const slopes = calcSlopes(astroid, livingAstroids)
	const killedAstroids = new Set();
	let lastSlope = null;

	while (killedAstroids.size < 200) {
		slopes.forEach(s => {
			if (killedAstroids.has(s.a)) {
				return;
			}

			if (lastSlope === s.slope) {
				return;
			}

			lastSlope = s.slope;
			killedAstroids.add(s.a);
			console.log(killedAstroids.size, s.a);
			if (killedAstroids.size === 200) {
				console.log('killed', s.a);
			}
		});
	}
}

const intersectionsMap = _(astroids)
	.mapKeys(a => `${a.x},${a.y}`)
	.mapValues(a => calcIntersections(a, astroids))
	.value();

const res = _(intersectionsMap)
	.values()
	.sort()
	.last();

console.log(res);

const astroidPosition = _(intersectionsMap)
	.pickBy(v => v === res)
	.keys()
	.map(k => ({x: parseInt(k.split(',')[0]), y: parseInt(k.split(',')[1])}))
	.head();

console.log(astroidPosition);

shootAstroids(astroidPosition, astroids);



