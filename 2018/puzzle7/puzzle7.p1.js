'use strict';
const fs = require('fs');
const _ = require('lodash');

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8');

const LINE_REGEX = /Step ([A-Z]+) must be finished before step ([A-Z]+) can begin.$/i;

function parseLine(str) {
	const [root, affects] = str.match(LINE_REGEX).splice(1);

	return [root, affects];
}

const depGraph = _(input)
	.split('\n')
	.map(parseLine)
	.reduce((acc, [root, affects]) => {
		acc[root] = acc[root] || {pre: new Set(), affects: []};
		acc[affects] = acc[affects] || {pre: new Set(), affects: []};

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
let res = '';
while (nextItems.length) {
	const i = nextItems.sort().shift();

	const {affects} = depGraph[i];

	affects.forEach(affected => {
		depGraph[affected].pre.delete(i);
	});

	res += i;
	nextItems = nextItems.concat(getAvailableItem(depGraph));
}

console.log(res);
