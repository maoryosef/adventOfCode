'use strict';
const fs = require('fs');
const _ = require('lodash');

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8');
const WORKERS = 5;
const TIME_OFFSET = 60;

const LINE_REGEX = /Step ([A-Z]+) must be finished before step ([A-Z]+) can begin.$/i;

function parseLine(str) {
	const [root, affects] = str.match(LINE_REGEX).splice(1);

	return [root, affects];
}

function calcCounter(i) {
	return i.charCodeAt(0) - 'A'.charCodeAt(0) + 1 + TIME_OFFSET;
}

const depGraph = _(input)
	.split('\n')
	.map(parseLine)
	.reduce((acc, [root, affects]) => {
		acc[root] = acc[root] || {pre: new Set(), affects: [], counter: calcCounter(root)};
		acc[affects] = acc[affects] || {pre: new Set(), affects: [], counter: calcCounter(affects)};

		acc[root].affects.push(affects);
		acc[affects].pre.add(root);

		return acc;
	}, {});

function getAvailableItem(g) {
	return _(g)
		.pickBy(i => {
			if (i.pre.size === 0 && !i.visited) {
				i.visited = true;
				return true;
			}
		})
		.keys()
		.value();
}

let nextItems = getAvailableItem(depGraph);
let res = 0;
let workPool = new Set();

while (nextItems.length || workPool.size) {
	while (workPool.size < WORKERS && nextItems.length) {
		workPool.add(nextItems.sort().shift());
	}

	for (let i of workPool) {
		depGraph[i].counter--;

		if (!depGraph[i].counter) {
			workPool.delete(i);
			const {affects} = depGraph[i];
			affects.forEach(affected => {
				depGraph[affected].pre.delete(i);
			});
		}
	}

	res++;
	nextItems = nextItems.concat(getAvailableItem(depGraph));
}

console.log(res);
