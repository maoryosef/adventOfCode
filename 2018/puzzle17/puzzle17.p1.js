'use strict';
const fs = require('fs');
const _ = require('lodash');

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8');

const LINE_REGEX = /([xy])=(\d+), ([xy])=(\d+)\.\.(\d+)/i;

let minX = Infinity;
let minY = Infinity;
let maxX = -Infinity;
let maxY = -Infinity;

const clayMap = _(input.split('\n'))
	.map(v => v.match(LINE_REGEX).slice(1))
	.flatMap(a => {
		const dots = [];
		const baseObj = {
			[a[0]]: parseInt(a[1])
		};

		const start = parseInt(a[3]);
		const end = parseInt(a[4]);

		for (let i = start; i <= end; i++) {
			dots.push(_.assign({}, baseObj, {[a[2]]: i}));
		}

		return dots;
	})
	.forEach(d => {
		if (d.x < minX) {
			minX = d.x;
		}

		if (d.y < minY) {
			minY = d.y;
		}

		if (d.x > maxX) {
			maxX = d.x;
		}

		if (d.y > maxY) {
			maxY = d.y;
		}
	});

const mappedClayMap = _.keyBy(clayMap, m => `${m.x},${m.y}`);

minX--;
maxX++;

const map = [];
for (let y = 0; y <= maxY; y++) {
	for (let x = minX; x < maxX; x++) {
		const offsetX = x - minX;
		if (mappedClayMap[`${x},${y}`]) {
			_.set(map, [y, offsetX], '#');
		} else {
			_.set(map, [y, offsetX], ' ');
		}
	}
}

const startPoint = {x: 500 - minX, y: 0};

map[startPoint.y][startPoint.x] = '+';

function fillRow(startX, y) {
	let x = startX;
	while (x > 0 && map[y][x] !== '#') {
		map[y][x] = '~';
		x--;
	}

	x = startX;
	while (x < map[0].length && map[y][x] !== '#') {
		map[y][x] = '~';
		x++;
	}

	return true;
}

function canFillRow(startX, y) {
	let x = startX;
	if (y + 1 > map.length || x < 0 || x > map[0].length) {
		return false;
	}

	while (x > 0 && map[y][x] !== '#' && map[y][x] !== '~') {
		if (_.get(map, [y + 1, x], ' ') === ' ' || _.get(map, [y + 1, x], ' ') === '|')  {
			return false;
		}

		x--;
	}

	x = startX;
	while (x < map[0].length && map[y][x] !== '#' && map[y][x] !== '~') {
		if (_.get(map, [y + 1, x], ' ') === ' ' || _.get(map, [y + 1, x], ' ') === '|') {
			return false;
		}

		x++;
	}

	return true;
}

function move(x, y, dir = 'd') {
	// console.log(`$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$   ${x} ${y}   $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$`);
	// console.log(map);
	if (y < 0 || y >= map.length) {
		return false;
	}

	if (x < 0 || x >= map[0].length) {
		return true;
	}

	if (map[y][x] === '#' || map[y][x] === '~') {
		return true;
	}

	if (map[y][x] !== '|') {
		map[y][x] = '|';

		let ok = move(x, y + 1, 'd');

		if (!ok || !(_.get(map, [y+1, x]) === '#' || _.get(map, [y+1, x]) === '~')) {
			return;
		}

		if (dir === 'd' || dir === 'l') {
			move(x - 1, y, 'l');
		}

		if (dir === 'd' || dir === 'r') {
			move(x + 1, y, 'r');
		}
	}

	if (canFillRow(x, y)) {
		fillRow(x, y);
	}

	return true;
}

move(startPoint.x, minY);

// console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$  END  $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');

// console.log(map);

const staleWater = _(map)
	.flattenDeep()
	.filter(d => (d === '~'))
	.value()
	.length;

const runningWater = _(map)
	.flattenDeep()
	.filter(d => (d === '|'))
	.value()
	.length;

console.log('water reached:', staleWater + runningWater);
console.log('stale water:', staleWater);

/*debug
const factor = 10;

let str = `<html><div style="display: block">${staleWater}</div><br/><svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="${map[0].length * factor}" height="${map.length * factor}" style="border: 1px solid black">`;

let blue = 0;
let grey = 0;
for (let y = 0; y < map.length; y++) {
	for (let x = 0; x < map[0].length; x++) {
		if (map[y][x] === '#') {
			str += `<rect width="${factor}" height="${factor}" x="${x * factor}" y="${y * factor}" fill="#f06"></rect>`;
		}
		if (map[y][x] === '~') {
			str += `<rect width="${factor}" height="${factor}" x="${x * factor}" y="${y * factor}" fill="blue"></rect>`;
			blue++;
		}
		if (map[y][x] === '|') {
			str += `<rect width="${factor}" height="${factor}" x="${x * factor}" y="${y * factor}" fill="grey"></rect>`;
			grey++;
		}
	}
}

str += `</svg><div>blue ${blue}, grey ${grey}, minX ${minX}, maxX ${maxX}, minY ${minY}, maxY ${maxY}></div></html>`;

console.log(str);
*/