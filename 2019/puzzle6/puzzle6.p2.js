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

function getPath(graph, node) {
	if (!graph[node]) {
		return [node];
	}

	return [...getPath(graph, graph[node]), node];
}

function findCommonAncestor(graph, node1, node2) {
	const node1Path = getPath(graph, node1);
	const node2Path = getPath(graph, node2);

	let idx = 0;

	while(node1Path[idx] === node2Path[idx]) {
		idx++;
	}

	return node1Path[idx - 1];
}

const commonAncestor = findCommonAncestor(orbitGraph, orbitGraph['YOU'], orbitGraph['SAN']);

const stepsFromNode1 = countSteps(orbitGraph, orbitGraph['YOU'], commonAncestor);
const stepsFromNode2 = countSteps(orbitGraph, orbitGraph['SAN'], commonAncestor);

console.log(stepsFromNode1 + stepsFromNode2);