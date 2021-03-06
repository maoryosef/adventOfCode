'use strict';

const fs = require('fs');
const _ = require('lodash');
const {runProgram, parseProgram} = require('../intCodeRunner');

const getPosKey = pos => JSON.stringify(_.pick(pos, ['x', 'y']));

const getDirection = (from, to) => {
	switch(true) {
		case from.x < to.x: return 4;
		case from.x > to.x: return 3;
		case from.y > to.y: return 1;
		case from.y < to.y: return 2;
	}
};

const getNeighbors = pos => [
	{ d: 1, x: pos.x, y: pos.y - 1, p: pos, level: (pos.level || 0) + 1 }, //N
	{ d: 2, x: pos.x, y: pos.y + 1, p: pos, level: (pos.level || 0) + 1 }, //S
	{ d: 3, x: pos.x - 1, y: pos.y, p: pos, level: (pos.level || 0) + 1 }, //W
	{ d: 4, x: pos.x + 1, y: pos.y, p: pos, level: (pos.level || 0) + 1 }  //E
];

function findCommonAncestorPath(from, to) {
	const ancestors = new Set();

	let next = to.p;

	while (next) {
		ancestors.add(getPosKey(next));
		next = next.p;
	}

	next = from;

	const pathToAncestor = [];

	while (!ancestors.has(getPosKey(next))) {
		pathToAncestor.push({...next.p, d: getDirection(next, next.p)});
		next = next.p;
	}

	const ancestor = getPosKey(next);

	next = to;

	const pathToTarget = [];
	while (getPosKey(next) !== ancestor) {
		pathToTarget.push(next);
		next = next.p;
	}

	return pathToAncestor.concat(_.reverse(pathToTarget));
}

function solve(inputFilename) {
	const input = fs.readFileSync(inputFilename, 'utf-8');

	function generateProgramIO() {
		const startPos = {x: 0, y: 0};
		const map = {};
		map[getPosKey(startPos)] = 1;

		let ancestorPath = [];

		const stepsQueue = getNeighbors(startPos);
		let currentPos = startPos;
		let nextPos;
		let oxygenLocation;

		function onInputRequest() {
			if (ancestorPath.length) {
				nextPos = ancestorPath.shift();
			} else {
				nextPos = stepsQueue.shift();

				while (map[getPosKey(nextPos)] >= 0) {
					nextPos = stepsQueue.shift();
				}

				if (!nextPos) {
					return;
				}

				if (nextPos.p.x !== currentPos.x || nextPos.p.y !== currentPos.y) {
					ancestorPath = findCommonAncestorPath(currentPos, nextPos);

					nextPos = ancestorPath.shift();
				}
			}

			return nextPos.d;
		}

		function onOutput(output) {
			map[getPosKey(nextPos)] = output;

			if (output === 2) {
				oxygenLocation = nextPos;
				currentPos = nextPos;
			}

			if (output === 1) {
				currentPos = nextPos;
				const neighbors = _.reject(getNeighbors(nextPos), n => map[getPosKey(n)] >= 0);

				stepsQueue.push(...neighbors);
			}
		}

		function getMap() {
			return map;
		}

		function getOxygenPos() {
			return _.pick(oxygenLocation, ['x', 'y']);
		}

		function shouldBreak() {
			return !stepsQueue;
		}

		return {
			onInputRequest,
			onOutput,
			getMap,
			getOxygenPos,
			shouldBreak
		};
	}

	const program = parseProgram(input);

	const {onInputRequest, onOutput, getMap, getOxygenPos, shouldBreak} = generateProgramIO();

	runProgram([], program, {
		onInputRequest,
		onOutput,
		shouldBreak
	});

	const map = getMap();
	const oPos = getOxygenPos();

	const queue = [{...oPos, level: 0}];
	const visited = {};

	let maxLevel = -Infinity;

	while (queue.length) {
		const next = queue.shift();
		const k = getPosKey(next);

		visited[k] = true;

		if (!map[k]) {
			continue;
		}

		maxLevel = Math.max(next.level, maxLevel);

		const neighbors = _.reject(getNeighbors(next), n => visited[getPosKey(n)]);

		queue.push(...neighbors);
	}

	return maxLevel;
}

module.exports = {
	solve
};