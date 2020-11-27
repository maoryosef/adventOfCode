'use strict';

const fs = require('fs');
const _ = require('lodash');

const getNeighbors = pos => [
	{x: pos.x + 1, y: pos.y, p: pos},
	{x: pos.x - 1, y: pos.y, p: pos},
	{x: pos.x, y: pos.y + 1, p: pos},
	{x: pos.x, y: pos.y - 1, p: pos},
];

function backtrack(step) {
	let next = step;
	let path = [];
	do {
		path.push(next);
		next = next.p;
	} while (next);

	return path;
}

function solve(inputFilename, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	let start;

	const map = _(input)
		.split('\n')
		.map((row, idx) => {
			const entranceIdx = row.indexOf('@');

			if (entranceIdx > -1) {
				start = {x: entranceIdx, y: idx};
			}

			return row.split('');
		})
		.value();

	const goal = _(map)
		.flatten()
		.filter(c => /\w/.test(c))
		.map(c => c.toLowerCase())
		.uniq()
		.value();


	const steps = [start];
	const collectedKeys = {};
	const visited = {};

	console.log(map);
	console.log(goal);
	console.log(start);

	let step;
	while (steps.length && _.keys(collectedKeys).length < goal.length) {
		step = steps.shift();

		const item = map[step.y][step.x];

		_.set(visited, [step.y, step.x], true);

		if (/\w/.test(item)) {
			if (item.toLowerCase() === item) {
				collectedKeys[item] = true;

			} else {
				if (!collectedKeys[item.toLowerCase()]) {
					let next = step;

					do {
						_.set(visited, [next.y, next.x], false);
						next = next.p;
					} while (next);
				}
			}
		}

		const neighrbours = getNeighbors(step).filter(n => map[n.y][n.x] !== '#' && !_.get(visited, [n.y, n.x]));
		steps.push(...neighrbours);
	}

	console.log(backtrack(step).join(','));
}

solve(__dirname + '/__TESTS__/input.test.1.txt');
module.exports = {
	solve
};