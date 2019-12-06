'use strict';

const TEST_MODE=false;

const fs = require('fs');
const _ = require('lodash');

const input = fs.readFileSync(`${__dirname}/input${TEST_MODE ? '.test': ''}.txt`, 'utf-8');

const orbitGraph = _(input)
	.split('\n')
	.map(orbit => orbit.split(')'))
	.reduce((acc, [from, to]) => {
		_.set(acc, to, from);
		return acc;
	}, {});

function countSteps(graph, from, to) {
	const next = graph[from];
	if (next === to) {
		return 1;
	}

	return countSteps(graph, next, to) + 1;
}

const res = _(orbitGraph)
	.mapValues((v, k) => countSteps(orbitGraph, k, 'COM'))
	.values()
	.sum();

console.log(res);