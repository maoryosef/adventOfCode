'use strict';
const fs = require('fs');
const _ = require('lodash');

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8');

const LINE_REG_EX = /#(\d*) @ (\d*?),(\d*?): (\d*?)x(\d*?)$/i;

function parseLine(str) {
	const [id, x, y, width, height] = str.match(LINE_REG_EX).slice(1).map(n => parseInt(n));

	return {
		id,
		x,
		y,
		width,
		height
	};
}

const fabric = {};

const overlaps = {};

function drawOnFabric({id, x, y, width, height}) {
	overlaps[id] = false;
	for (let i = x; i < x + width; i++) {
		for (let j = y; j < y + height; j++) {
			if (_.get(fabric, [i, j])) {
				overlaps[id] = true;
				overlaps[_.get(fabric, [i, j])] = true;
				_.set(fabric, [i, j], 'X');
			} else {
				_.set(fabric, [i, j], id);
			}
		}
	}
}

_(input)
	.split('\n')
	.map(parseLine)
	.forEach(drawOnFabric);

console.log(_.pickBy(overlaps, v => !v));