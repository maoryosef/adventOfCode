'use strict';

const TEST_MODE=false;

const fs = require('fs');
const _ = require('lodash');

const input = fs.readFileSync(`${__dirname}/input${TEST_MODE ? '.test': ''}.txt`, 'utf-8');

const map = {};
let intersections = [];

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

let currPos = {x: 0, y: 0, s: 1};
w1.forEach(instruction => {
	currPos = addToMap(instruction, currPos, 'w1');
});

currPos = {x: 0, y: 0, s: 1};
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

		_.set(map, [pos.x, pos.y, w], pos.s++);

		const val = _.get(map, [pos.x, pos.y]);

		if (val.w1 && val.w2) {
			intersections.push(val);
		}
	}

	return pos;
}

console.log(intersections);

const res = _(intersections)
	.map(({w1, w2}) => w1 + w2)
	.min();

console.log(res);
