'use strict';

const TEST_MODE=false;

const fs = require('fs');
const _ = require('lodash');

const input = fs.readFileSync(`${__dirname}/input${TEST_MODE ? '.test': ''}.txt`, 'utf-8');

const map = {};
let minimumDistance = Infinity;

const wires = _(input)
	.split('\n')
	.map(row => row.split(',').map(instruction => {
		const dir = instruction.substr(0, 1);
		const count = parseInt(instruction.substr(1));

		return {
			dir,
			count
		};
	}))
	.value();

const [w1, w2] = wires;

let currPos = {x: 0, y: 0};
w1.forEach(instruction => {
	currPos = addToMap(instruction, currPos, 'w1');
});

currPos = {x: 0, y: 0};
w2.forEach(instruction => {
	currPos = addToMap(instruction, currPos, 'w2');
});

function addToMap({dir, count}, pos, w) {
	const move = {x: 0, y: 0};
	switch (dir) {
		case 'R': move.x = 1; break;
		case 'L': move.x = -1; break;
		case 'U': move.y = -1; break;
		case 'D': move.y = 1; break;
	}

	for (let i = 0; i < count; i++) {
		pos.x += move.x;
		pos.y += move.y;

		const val = _.get(map, [pos.x, pos.y]);

		const intersected = val && val !== w;

		if (intersected) {
			const dist = Math.abs(pos.x) + Math.abs(pos.y);
			if (dist < minimumDistance) {
				minimumDistance = dist;
			}
		}

		_.set(map, [pos.x, pos.y], intersected ? 'X' : w);
	}

	return pos;
}

console.log(minimumDistance);