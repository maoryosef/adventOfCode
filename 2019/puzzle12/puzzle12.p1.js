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

function calcVelocity() {
	for (let i = 0; i < moons.length; i++) {
		for (let j = 0; j < moons.length; j++) {
			if (i === j) {
				continue;
			}

			if (moons[i].x > moons[j].x) {
				velocity[i].x -= 1;
			}

			if (moons[i].x < moons[j].x) {
				velocity[i].x += 1;
			}

			if (moons[i].y > moons[j].y) {
				velocity[i].y -= 1;
			}

			if (moons[i].y < moons[j].y) {
				velocity[i].y += 1;
			}

			if (moons[i].z > moons[j].z) {
				velocity[i].z -= 1;
			}

			if (moons[i].z < moons[j].z) {
				velocity[i].z += 1;
			}
		}
	}
}

function applyVelocity() {
	for (let i = 0; i < moons.length; i++) {
		moons[i].x += velocity[i].x;
		moons[i].y += velocity[i].y;
		moons[i].z += velocity[i].z;
	}
}

const RUNS = 1000;

for (let i = 0; i < RUNS; i++) {
	calcVelocity();
	applyVelocity();
}
console.log(moons);
console.log(velocity);

const energy = _.reduce(moons, (acc, val, idx) => {
	const mvel = velocity[idx];
	const moonE = Math.abs(val.x) + Math.abs(val.y) + Math.abs(val.z);
	const velE = Math.abs(mvel.x) + Math.abs(mvel.y) + Math.abs(mvel.z);
	return acc + moonE * velE;
}, 0);

console.log('energy', energy);