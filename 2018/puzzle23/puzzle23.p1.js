'use strict';
const fs = require('fs');
const _ = require('lodash');

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8');

const sensors = _(input)
	.split('\n')
	.map(l => {
		const [pos, rstr] = l.split(', ');
		const [x,y,z] = pos.slice(5, -1).split(',').map(v => parseInt(v));
		const r = parseInt(rstr.split('=')[1]);
		return {x, y, z, r};
	})
	.sortBy('r')
	.reverse()
	.value();

const largest = sensors[0];
const inRange = sensors.filter(s => {
	const {x, y, z, r} = largest;
	const range = Math.abs(s.x - x) + Math.abs(s.y - y) + Math.abs(s.z - z);

	return range <= r;
});

console.log(largest, inRange);
console.log('answer is', inRange.length);