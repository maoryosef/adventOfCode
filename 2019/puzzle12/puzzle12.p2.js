'use strict';

const TEST_MODE=false;

const fs = require('fs');
const _ = require('lodash');

const input = fs.readFileSync(`${__dirname}/input${TEST_MODE ? '.test': ''}.txt`, 'utf-8');

const moons = _(input)
	.split('\n')
	.map(r => r.replace('<', '').replace('>', '').replace(' ', '').split(','))
	.map(r => r.map(p => (p.split('='))))
	.map(r => _.fromPairs(r))
	.map(r => _.mapKeys(r, (v, k) => k.replace(' ', '')))
	.map(r => _.mapValues(r, v => parseInt(v)))
	.value();

const velocity = _.times(moons.length, () => ({x: 0, y: 0, z: 0}));

function calcVelocity(axis) {
	for (let i = 0; i < moons.length; i++) {
		for (let j = 0; j < moons.length; j++) {
			if (i === j) {
				continue;
			}

			if (moons[i][axis] > moons[j][axis]) {
				velocity[i][axis] -= 1;
			}

			if (moons[i][axis] < moons[j][axis]) {
				velocity[i][axis] += 1;
			}
		}
	}
}

function applyVelocity(axis) {
	for (let i = 0; i < moons.length; i++) {
		moons[i][axis] += velocity[i][axis];
	}
}

function getAxisArray(arr, axis) {
	return _.reduce(arr, (acc, val) => {
		return acc.concat(val[axis]);
	}, []);
}

function alignsAt(axis) {
	const snapShots = new Set();

	let snapshot;
	let runs = 0;

	snapshot = getAxisArray(moons, axis).concat(getAxisArray(velocity, axis)).join(',');
	while (!snapShots.has(snapshot)) {
		snapShots.add(snapshot);
		calcVelocity(axis);
		applyVelocity(axis);
		runs++;
		snapshot = getAxisArray(moons, axis).concat(getAxisArray(velocity, axis)).join(',');
	}

	return runs;
}


const x = alignsAt('x');
const y = alignsAt('y');
const z = alignsAt('z');

const factors = [x, y, z];
const maxFactor = Math.max(...factors);
const remaining = _.without(factors, maxFactor);

console.log(factors, maxFactor, remaining);

let res = maxFactor;

while (res % remaining[0] !== 0 || res % remaining[1] !== 0) {
	res += maxFactor;
}

console.log(res);
