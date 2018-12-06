'use strict';
const fs = require('fs');
const _ = require('lodash');

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8');

let maxX = -Infinity;
let maxY = -Infinity;
let idx = 65;
const MAX_REGION = 10000;

const locations = _(input)
	.split('\n')
	.map(l => {
		const parts = l.split(',');
		const coords = {
			c: String.fromCharCode(idx),
			x: parseInt(parts[0]),
			y: parseInt(parts[1])
		};

		idx++;
		if (coords.x > maxX) {
			maxX = coords.x;
		}

		if (coords.y > maxY) {
			maxY = coords.y;
		}


		return coords;
	})
	.value();


function manhatanDistance(p1, p2) {
	return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

const map = new Array(maxX + 1);
for (let i = 0; i < map.length; i++) {
	map[i] = new Array(maxY + 1);
}

for (let i = 0; i <= maxX; i++) {
	for (let j = 0; j <= maxY; j++) {
		locations.forEach(loc => {
			const dist = manhatanDistance(loc, { x: i, y: j });

			if (!map[i][j]) {
				map[i][j] = 0;
			}

			map[i][j] += dist;
		});
	}
}

const res = _(map)
	.flatMapDeep()
	.reject(v => v >= MAX_REGION)
	.value()
	.length;

console.log(res);