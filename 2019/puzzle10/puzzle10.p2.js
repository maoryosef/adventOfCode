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

function calcSlopes(astroid, allAstroids) {
	const slopes = [];
	allAstroids.forEach(a => {
		if (_.isEqual(a, astroid)) {
			return;
		}

		const slope = (a.y - astroid.y) / (a.x - astroid.x);
		let angle = Math.atan2(a.y - astroid.y, a.x - astroid.x) * 180 / Math.PI + 90;
		if (angle < 0) {
			angle += 360;
		}

		const distance = Math.sqrt(Math.pow(a.x - astroid.x, 2) + Math.pow(a.y - astroid.y, 2));

		slopes.push({a, slope, distance, angle});
	});

	return slopes.sort((a, b) => {
		if (a.angle !== b.angle) {
			return a.angle - b.angle;
		}

		if (a.distance !== b.distance) {
			return a.distance - b.distance;
		}

		return b.a.x - a.a.x;
	});
}

function shootAstroids(astroid, allAstroids) {
	const livingAstroids = _.reject(allAstroids, astroid);
	const slopes = calcSlopes(astroid, livingAstroids);
	const killedAstroids = new Set();
	let lastSlope = null;

	let killed;
	do {
		killed = 0;
		slopes.forEach(s => {
			if (killedAstroids.has(s.a)) {
				return;
			}

			if (lastSlope === s.slope) {
				return;
			}

			lastSlope = s.slope;
			killedAstroids.add(s.a);
			killed++;
			if (killedAstroids.size === 200) {
				console.log('killed', s.a);
			}
		});
	} while (killedAstroids.size < 200 && killed > 0);
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

console.log('astroid position', astroidPosition);

shootAstroids(astroidPosition, astroids);



