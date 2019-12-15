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
	{ d: 1, x: pos.x, y: pos.y - 1, p: pos }, //N
	{ d: 2, x: pos.x, y: pos.y + 1, p: pos }, //S
	{ d: 3, x: pos.x - 1, y: pos.y, p: pos }, //W
	{ d: 4, x: pos.x + 1, y: pos.y, p: pos }  //E
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
		const visited = {};
		_.set(visited, [0, 0], true);
		let solution;

		const startPos = {x: 0, y: 0};
		let ancestorPath = [];

		const stepsQueue = getNeighbors(startPos);
		let currentPos = startPos;
		let nextPos;

		function onInputRequest() {
			if (ancestorPath.length) {
				nextPos = ancestorPath.shift();
			} else {
				nextPos = stepsQueue.shift();

				while (_.get(visited, [nextPos.x, nextPos.y])) {
					nextPos = stepsQueue.shift();
				}

				if (nextPos.p.x !== currentPos.x || nextPos.p.y !== currentPos.y) {
					ancestorPath = findCommonAncestorPath(currentPos, nextPos);

					nextPos = ancestorPath.shift();
				}
			}

			_.set(visited, [nextPos.x, nextPos.y], true);

			return nextPos.d;
		}

		function backtrackSolution() {
			let next = nextPos;

			solution = [];
			while (next.p) {
				solution.push(next);
				next = next.p;
			}
		}

		function onOutput(output) {
			if (output === 2) {
				backtrackSolution();
			}

			if (output === 1) {
				currentPos = nextPos;
				const neighbors = getNeighbors(nextPos)
					.filter(n => !_.get(visited, [n.x, n.y]));

				stepsQueue.push(...neighbors);
			}
		}

		function getSteps() {
			return solution.length;
		}

		function shouldBreak() {
			return solution && solution.length > 0;
		}

		return {
			onInputRequest,
			onOutput,
			getSteps,
			shouldBreak
		};
	}

	const program = parseProgram(input);

	const {onInputRequest, onOutput, getSteps, shouldBreak} = generateProgramIO();

	runProgram([], program, {
		onInputRequest,
		onOutput,
		shouldBreak
	});

	return getSteps();
}

module.exports = {
	solve
};