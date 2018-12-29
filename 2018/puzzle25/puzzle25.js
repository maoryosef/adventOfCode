'use strict';
const fs = require('fs');
const _ = require('lodash');

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8');

const points = _(input)
	.split('\n')
	.map(line => {
		const [x,y,z,t] = line.split(',').map(v => parseInt(v));
		return {x,y,z,t};
	})
	.value();

function getDist(p1, p2) {
	return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y) + Math.abs(p1.z - p2.z) + Math.abs(p1.t - p2.t);
}

let constelationsCount = 0;
while (points.length > 0) {
	const point = points.shift();

	const constelation = [point];

	let chainedPoints = [];

	do {
		constelation.push(...chainedPoints);
		chainedPoints = _.remove(points, p => constelation.filter(op => getDist(p, op) <= 3).length > 0);
	} while (chainedPoints.length > 0);

	constelationsCount++;
}

console.log('num of constelations', constelationsCount);