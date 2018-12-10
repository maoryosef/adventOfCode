'use strict';
const fs = require('fs');
const _ = require('lodash');

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8');

const LINE_REGEX = /position=<\s*?(-?\d+),\s*?(-?\d+)>\s*?velocity=<\s*?(-?\d+),\s*?(-?\d+)>$/i;

function parseLine(str) {
	const [x,y, vx, vy] = str.match(LINE_REGEX).splice(1).map(n => parseInt(n));

	return {
		x,
		y,
		vx,
		vy
	};
}

let points = _(input)
	.split('\n')
	.map(parseLine)
	.sortBy(['x', 'y'])
	.value();

function lineExists(expectedLine = 5) {
	let currX = points[0].x;
	let currY = points[0].y;
	let lineCount = 1;

	for (let point of points) {
		if (point.x === currX) {
			if (point.y  === currY + 1) {
				lineCount++;
			} else {
				lineCount = 1;
			}

			if (lineCount === expectedLine) {
				return true;
			}
			currY = point.y;
		} else {
			currX = point.x;
		}
	}

	return false;
}

let step = 0;
while (!lineExists(5) || step < 10003) {
	points = _(points)
		.map(({x, y, vx, vy}) => {
			return {
				x: x + vx,
				y: y + vy,
				vx,
				vy
			};
		})
		.sortBy(['x', 'y'])
		.value();
	step++;
}

console.log(step);

let minX = Infinity;
let minY = Infinity;
let maxX = -Infinity;
let maxY = -Infinity;

points.forEach(({x, y}) => {
	if (x > maxX) {
		maxX = x;
	}

	if (x < minX) {
		minX = x;
	}

	if (y > maxY) {
		maxY = y;
	}

	if (y < minY) {
		minY = y;
	}
});

const pointsMap = points.reduce((acc, val) => {
	acc[`${val.x}-${val.y}`] = true;
	return acc;
}, {});

let res = '';

for (let j = minY; j <= maxY; j++) {
	for (let i = minX; i <= maxX; i++) {
		if (pointsMap[`${i}-${j}`]) {
			res += '#';
		} else {
			res += '.';
		}
	}
	res += '\n';
}

console.log(minX, maxX, minY, maxY);
fs.writeFileSync(`${__dirname}/out1.txt`, res);