'use strict';

const fs = require('fs');
const _ = require('lodash');

function parseInput(input) {
	const [estimate, bussesStr] = _(input)
		.split('\n')
		.value();

	const busses = bussesStr.split(',').map(v => parseInt(v));

	return {
		estimate: parseInt(estimate),
		busses
	};
}

function solve1({estimate, busses}) {
	const departingBusses = busses.filter(b => !isNaN(b))
		.map(b => ({id: b, departure: Math.ceil(estimate / b) * b - estimate}))
		.sort((a, b) => a.departure - b.departure);
	const firstBus = departingBusses[0];

	return firstBus.id * firstBus.departure;
}

function solve2({busses}) {
	const departingBusses = busses
		.map((id, index) => ({id, index}))
		.filter(({id}) => !isNaN(id));

	let time = 0;

	while (true) { //eslint-disable-line no-constant-condition
		let step = 1;

		if (departingBusses.every(bus => {
			if ((time + bus.index) % bus.id === 0) {
				step = step * bus.id;
				return true;
			}

			return false;
		})) {
			return time;
		}

		time += step;
	}
}

function exec(inputFilename, solver, inputStr) {
	const input = inputStr || fs.readFileSync(inputFilename, 'utf-8');

	const parsedInput = parseInput(input);

	return solver(parsedInput);
}

if (!global.TEST_MODE) {
	const inputFile = 'input.test.1.txt';
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