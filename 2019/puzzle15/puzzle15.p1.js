'use strict';

const fs = require('fs');
const _ = require('lodash');
const {runProgram, parseProgram} = require('../intCodeRunner');

const getPosKey = pos => JSON.stringify(_.pick(pos, ['x', 'y']));
const getOposite = d => {
	switch(d) {
		case 1: return 2;
		case 2: return 1;
		case 3: return 4;
		case 4: return 3;
	}
};

function findCommonAncestorPath(to, from) {
	const ancestors = new Set();

	let next = to.p;

	while (next) {
		ancestors.add(getPosKey(next));
		next = next.p;
	}

	next = from;

	const path = [];

	while (!ancestors.has(getPosKey(next))) {
		path.push(getOposite(next.d));
		next = next.p;
	}

	const ancestor = getPosKey(next);

	next = to;

	const path2 = [];
	while (getPosKey(next) !== ancestor) {
		path2.push(next.d);
		next = next.p;
	}

	return [...path, ..._.reverse(path2)];
}

function solve(inputFilename) {
	const input = fs.readFileSync(inputFilename, 'utf-8');

	function generateProgramIO() {
		const visited = {};
		let solution;

		const startP = {x: 0, y: 0};
		let currentPosition = startP;
		let ancestorPath = [];

		const stepsQueue = [
			{d: 1, x: 0, y: -1, p: startP},
			{d: 2, x: 0, y: 1, p: startP},
			{d: 3, x: -1, y: 0, p: startP},
			{d: 4, x: 1, y: 0, p: startP},
		];

		let currentStep;

		function onInputRequest() {
			if (ancestorPath.length) {
				return ancestorPath.shift();
			}

			currentStep = stepsQueue.shift();

			while (_.get(visited, [currentStep.x, currentStep.y])) {
				currentStep = stepsQueue.shift();
			}

			if (currentStep.p.x !== currentPosition.x && currentStep.y !== currentPosition.y) {
				ancestorPath = findCommonAncestorPath(currentStep, currentPosition);

				return ancestorPath.shift();
			}

			_.set(visited, [currentStep.x, currentStep.y], true);

			return currentStep.d;
		}

		function backtrackSolution() {
			let next = currentStep;

			solution = [];
			while (next) {
				solution.push(next);
				next = next.p;
			}
		}

		function onOutput(output) {
			if (output === 2) {
				backtrackSolution();
			}

			if (output === 1) {
				currentPosition = currentStep;
				const north = {d: 1, x: currentStep.x, y: currentStep.y - 1, p: currentStep};
				const south = {d: 2, x: currentStep.x, y: currentStep.y + 1, p: currentStep};
				const west = {d: 3, x: currentStep.x - 1, y: currentStep.y, p: currentStep};
				const east = {d: 4, x: currentStep.x + 1, y: currentStep.y, p: currentStep};

				stepsQueue.push(north, south, east, west);
			}
		}

		function getSteps() {
			console.log(solution);
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

console.log(solve(__dirname + '/__TESTS__/input.txt'));

module.exports = {
	solve
};