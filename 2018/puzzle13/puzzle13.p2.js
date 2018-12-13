'use strict';
const fs = require('fs');
const _ = require('lodash');

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8');

const map = _(input.split('\n'))
	.map(v => v.split(''))
	.value();

let carts = [];
let cartIdx = 0;
for (let y = 0; y < map.length; y++) {
	for (let x = 0; x < map[y].length; x++) {
		const char = map[y][x];
		switch (char) {
			case '>': carts.push({idx: cartIdx++, x, y, d: 'R', t: 0}); map[y][x] = '-'; break;
			case '<': carts.push({idx: cartIdx++, x, y, d: 'L', t: 0}); map[y][x] = '-'; break;
			case '^': carts.push({idx: cartIdx++, x, y, d: 'U', t: 0}); map[y][x] = '|'; break;
			case 'v': carts.push({idx: cartIdx++, x, y, d: 'D', t: 0}); map[y][x] = '|'; break;
		}
	}
}

function getCollisions() {
	return carts.filter(({x, y, idx}) => carts.filter(c => c.idx !== idx && c.x === x && c.y === y).length);
}

function turnRight(c) {
	switch (c.d) {
		case 'R': c.d = 'D'; break;
		case 'D': c.d = 'L'; break;
		case 'L': c.d = 'U'; break;
		case 'U': c.d = 'R'; break;
	}
}

function turnLeft(c) {
	switch (c.d) {
		case 'R': c.d = 'U'; break;
		case 'D': c.d = 'R'; break;
		case 'L': c.d = 'D'; break;
		case 'U': c.d = 'L'; break;
	}
}

while (carts.length > 1) {
	carts = _.sortBy(carts, ['x', 'y']);
	carts.forEach(c => {
		if (c.d === 'R') {
			c.x += 1;
		} else if (c.d === 'L') {
			c.x -= 1;
		} else if (c.d === 'U') {
			c.y -= 1;
		} else if (c.d === 'D') {
			c.y += 1;
		}

		const nextStep = map[c.y][c.x];

		if (nextStep === '/') {
			switch(c.d) {
				case 'R': turnLeft(c); break;
				case 'L': turnLeft(c); break;
				case 'D': turnRight(c); break;
				case 'U': turnRight(c); break;
			}
		} else if (nextStep === '\\') {
			switch(c.d) {
				case 'R': turnRight(c); break;
				case 'L': turnRight(c); break;
				case 'D': turnLeft(c); break;
				case 'U': turnLeft(c); break;
			}
		} else if (nextStep === '+') {
			switch (c.t % 3) {
				case 0: turnLeft(c); break;
				case 1: break;
				case 2: turnRight(c); break;
			}

			c.t += 1;
		}
		const collisions = getCollisions();

		collisions.forEach(col => {
			carts = _.reject(carts, c => c.x === col.x && c.y === col.y);
		});
	});

}

console.log(carts);