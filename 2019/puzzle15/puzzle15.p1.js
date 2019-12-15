'use strict';

const fs = require('fs');
const _ = require('lodash');
const {runProgram, parseProgram} = require('../intCodeRunner');

function solve(inputFilename) {
	const input = fs.readFileSync(inputFilename, 'utf-8');

	function generateProgramIO() {
		const visited = {};
		let solution;

		const startP = {x: 0, y: 0};

		const stepsQueue = [
			{d: 1, x: 0, y: -1, p: startP},
			{d: 2, x: 0, y: 1, p: startP},
			{d: 3, x: -1, y: 0, p: startP},
			{d: 4, x: 1, y: 0, p: startP},
		];

		let currentStep;

		function onInputRequest() {
			currentStep = stepsQueue.shift();

			while (_.get(visited, [currentStep.x, currentStep.y])) {
				currentStep = stepsQueue.shift();
			}

			_.set(visited, [currentStep.x, currentStep.y], true);

			return currentStep.d;
		}

		function backtrackSolution() {
			let next = currentStep;

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
				const north = {d: 1, x: currentStep.x, y: currentStep.y - 1, p: currentStep};
				const south = {d: 2, x: currentStep.x, y: currentStep.y + 1, p: currentStep};
				const west = {d: 3, x: currentStep.x - 1, y: currentStep.y, p: currentStep};
				const east = {d: 4, x: currentStep.x + 1, y: currentStep.y, p: currentStep};

				stepsQueue.push(north, south, east, west);
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

solve(__dirname + '/__TESTS__/input.txt');

module.exports = {
	solve
};