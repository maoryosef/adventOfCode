'use strict';
const fs = require('fs');
const _ = require('lodash');
const progress = require('cli-progress');

const bar1 = new progress.Bar({
	barCompleteChar: '\u2588',
	barIncompleteChar: '\u2591',
	hideCursor: true
}, progress.Presets.legacy);

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8');

const acresMap = _(input)
	.split('\n')
	.map(a => a.split(''))
	.value();

const acres = new Map();
const gk = ({x, y}) => `${x},${y}`;

for (let y = 0; y < acresMap.length; y++) {
	for (let x = 0; x < acresMap[0].length; x++) {
		acres.set(gk({x,y}), {x, y, preVal: acresMap[y][x], value: acresMap[y][x]});
	}
}

function getNeighboors({x, y}) {
	return [
		{x: x + 1, y},
		{x: x + 1, y: y + 1},
		{x, y: y + 1},
		{x: x - 1, y: y + 1},
		{x: x - 1, y},
		{x: x - 1, y: y - 1},
		{x, y: y - 1},
		{x: x + 1, y: y - 1},
	];
}

function reCalc() {
	for (let [, value] of acres) {
		const n = getNeighboors(value);
		const counts = _(n)
			.map(k => acres.get(gk(k)))
			.compact()
			.map(v => v.preVal)
			.reduce((acc, val) => {
				acc[val]++;

				return acc;
			}, {'|': 0, '.': 0, '#': 0});

		value.preVal = value.value;

		switch(value.value) {
			case '.': if (counts['|'] > 2) {value.value = '|';} break;
			case '|': if (counts['#'] > 2) {value.value = '#';} break;
			case '#': if (counts['|'] > 0 && counts['#'] > 0) {value.value = '#';} else {value.value = '.';} break;
		}
	}

	for (let [, value] of acres) {
		value.preVal = value.value;
	}
}


const RUNS = 10;

bar1.start(RUNS, 0);

for (let i = 0; i < RUNS; i++) {
	reCalc();

	if (i % 100 === 0) {
		bar1.update(i);
	}
}

bar1.update(RUNS);
bar1.stop();

const res = _([...acres.values()])
	.map(v => v.value)
	.reduce((acc, val) => {
		acc[val]++;

		return acc;
	}, {'|': 0, '.': 0, '#': 0});

console.log(res, res['#'] * res['|']);
