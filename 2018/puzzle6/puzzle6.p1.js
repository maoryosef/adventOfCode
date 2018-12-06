'use strict';
const fs = require('fs');
const _ = require('lodash');

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8');

let maxX = -Infinity;
let maxY = -Infinity;
let idx = 65;

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

locations.forEach(loc => {
	for (let i = 0; i <= maxX; i++) {
		for(let j = 0; j <= maxY; j++) {
			const dist = manhatanDistance(loc, {x: i, y: j});

			if (!map[i][j] || map[i][j].d > dist) {
				map[i][j] = {l: loc.c, d: dist};
			} else if (map[i][j].d === dist) {
				map[i][j] = {l: null, d: dist};
			}
		}
	}
});

const distances = _(map)
	.flatMapDeep()
	.reduce((acc, v) => {
		if (v.l === null) {
			return acc;
		}

		acc[v.l] = (acc[v.l] || 0) + 1;
		return acc;
	}, {});

const edgeKeys = new Set();

for (let i = 0; i < map.length; i++) {
	edgeKeys.add(map[i][0].l);
	edgeKeys.add(map[i][maxY].l);
}

for (let i = 0; i <= maxY; i++) {
	edgeKeys.add(map[0][i].l);
	edgeKeys.add(map[maxX][i].l);
}

const res = _(distances)
	.pickBy((d, key) => {
		return !edgeKeys.has(key);
	})
	.toPairs()
	.sortBy(pair => pair[1])
	.takeRight()
	.fromPairs()
	.value();

console.log(res);