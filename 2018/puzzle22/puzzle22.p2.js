'use strict';

const _ = require('lodash');

const EROSION = 20183;
const GEO_Y = 16807;
const GEO_X = 48271;

const DEPTH = 11820;
const target = {
	x: 7,
	y: 782
};

const cave = Array.from({length: target.y + 30}, () => Array.from({length: target.x + 30}, () => 0));
const allPoints = [];
const k = (x,y,t) => `${x},${y},${t}`;

const CELL_TOOL = [
	[1, 2],
	[1, 0],
	[2, 0],
	[2]
];

for (let y = 0; y < cave.length; y++) {
	for (let x = 0; x < cave[0].length; x++) {
		let val = 0;
		if (y === 0) {
			val = ((x * GEO_Y) + DEPTH) % EROSION;
		} else if (x === 0) {
			val = ((y * GEO_X) + DEPTH) % EROSION;
		} else if (y === target.y && x === target.x) {
			val = DEPTH % EROSION;
		} else {
			const geoIndex = cave[y - 1][x] * cave[y][x - 1];
			val = (geoIndex + DEPTH) % EROSION;
		}

		cave[y][x] = val;

		if (x === 0 && y === 0) {
			allPoints.push({x, y, t: 2, d: 0});
		} else if (x === target.x && y === target.y) {
			allPoints.push({x, y, t: 2, d: Infinity});
		} else {
			const tools = CELL_TOOL[val % 3];
			allPoints.push(...tools.map(t => ({x, y, t, d: Infinity})));
		}
	}
}

function getShortestDistance() {
	return _(allPoints)
		.filter(p => !p.visited && p.d !== Infinity)
		.sortBy('d')
		.head();
}

function isTarget(x, y) {
	return target.x === x && target.y === y;
}

function allowedToEnter(cellValue, tool) {
	return CELL_TOOL[cellValue].indexOf(tool) > -1;
}

function getNeighboorsWithDistance(x, y, t, d) {
	return _([
		{x: x + 1, y},
		{x: x - 1, y},
		{x, y: y - 1},
		{x, y: y + 1}
	])
		.filter(p => p.x >= 0 && p.y >= 0 && p.x < cave[0].length && p.y < cave.length)
		.map(({x, y}) => {
			const cv = isTarget(x, y) ? 3 : cave[y][x] % 3;
			return {x, y, cv};
		})
		.filter(({cv}) => allowedToEnter(cv, t))
		.map(({x, y, cv}) => {
			const tools = CELL_TOOL[cv];
			return tools.map(tool => ({x, y, t: tool, d: d + (t === tool ? 1 : 8)}));
		})
		.flattenDeep()
		.value();

}

const pointsMap = _.keyBy(allPoints, ({x,y,t}) => k(x,y,t));

let nextPoint = getShortestDistance();

while(nextPoint) {
	nextPoint.visited = true;
	if (nextPoint.x === target.x && nextPoint.y === target.y) {
		console.log('shortet distance:', nextPoint.d);
		break;
	}

	const neighboors = getNeighboorsWithDistance(nextPoint.x, nextPoint.y, nextPoint.t, nextPoint.d);

	neighboors.forEach(n => {
		const key = k(n.x, n.y, n.t);

		if (pointsMap[key] && pointsMap[key].d > n.d) {
			pointsMap[key].d = n.d;
			pointsMap[key].f = nextPoint;
		}
	});

	nextPoint = getShortestDistance();
}