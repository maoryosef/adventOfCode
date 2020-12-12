'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseRow(row) {
	const [op, ...value] = row.split('');

	return {
		op,
		value: parseInt(value.join(''))
	};
}

function parseInput(input) {
	const parsedInput = _(input)
		.split('\n')
		.map(parseRow)
		.value();

	return parsedInput;
}

const ROTATE_R_MAP = {
	E: 'S',
	S: 'W',
	W: 'N',
	N: 'E'
};

const ROTATE_L_MAP = {
	E: 'N',
	S: 'E',
	W: 'S',
	N: 'W'
};

const ROTATION_MAP = {
	R: ROTATE_R_MAP,
	L: ROTATE_L_MAP
};

function solve1(input) {
	const state = {face: 'E', N: 0, E: 0, S: 0, W: 0};

	for (let instruction of input) {
		if (instruction.op === 'F') {
			state[state.face] += instruction.value;
			continue;
		}

		if (ROTATION_MAP[instruction.op]) {
			const deg = instruction.value / 90;

			for (let i = 0; i < deg; i++) {
				state.face = ROTATION_MAP[instruction.op][state.face];
			}

			continue;
		}

		state[instruction.op] += instruction.value;
	}

	const x = Math.abs(state.W - state.E);
	const y = Math.abs(state.S - state.N);

	return x + y;
}

const OPPOSITE_DIR_MAP = {
	E: 'W',
	N: 'S',
	W: 'E',
	S: 'N'
};

function solve2(input) {
	const state = {N: 0, E: 0, S: 0, W: 0};
	let wayPoint = {
		E: 10,
		N: 1,
	};

	for (let instruction of input) {
		if (instruction.op === 'F') {
			Object.keys(wayPoint).forEach(k => {
				state[k] += instruction.value * wayPoint[k];
			});

			continue;
		}

		if (ROTATION_MAP[instruction.op]) {
			const deg = instruction.value / 90;

			for (let i = 0; i < deg; i++) {
				const newWayPoint = {};

				Object.keys(wayPoint).forEach(k => {
					const newKey = ROTATION_MAP[instruction.op][k];

					newWayPoint[newKey] = wayPoint[k];
				});

				wayPoint = newWayPoint;
			}

			continue;
		}

		if (!_.isUndefined(wayPoint[instruction.op])) {
			wayPoint[instruction.op] += instruction.value;
		} else {
			wayPoint[OPPOSITE_DIR_MAP[instruction.op]] -= instruction.value;
		}
	}

	const x = Math.abs(state.W - state.E);
	const y = Math.abs(state.S - state.N);

	return x + y;
}

function exec(inputFilename, solver, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = parseInput(input);

	return solver(parsedInput);
}

if (!global.TEST_MODE) {
	const inputFile = 'input.txt';
	const {join} = require('path');

	const res = exec(
		join(__dirname, '__TESTS__', inputFile),
		solve2
	);

	console.log(res);
}

module.exports = {
	exec1: (inputFilename) => exec(inputFilename, solve1),
	exec2: (inputFilename) => exec(inputFilename, solve2)
};