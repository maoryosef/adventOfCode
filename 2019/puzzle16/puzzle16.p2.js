'use strict';

const fs = require('fs');
const _ = require('lodash');


function generateRepeatingInputs(length, pattern) {
	const inputs = [];

	for (let i = 0; i < length; i++) {
		const repeat = i + 1;
		inputs[i] = [];
		for (let j = 0; j < pattern.length; j++) {
			const p = pattern[j];

			inputs[i] = inputs[i].concat(_.times(repeat, () => p));
		}

		while (inputs[i].length < length + 1) {
			inputs[i] = inputs[i].concat(inputs[i]);
		}

		inputs[i].shift();
	}

	return inputs;
}

function solve(inputFilename) {
	const input = fs.readFileSync(inputFilename, 'utf-8');

	let signal = _(input)
		.split('')
		.map(num => parseInt(num))
		.value();

	signal = _.flatten(_.times(10000, () => signal));

	const RUNS = 100;
	const BASE_REPEATING_INPUT = [0, 1, 0, -1];

	let repeatingInputs = generateRepeatingInputs(signal.length, BASE_REPEATING_INPUT);


	for (let i = 0; i < RUNS; i++) {
		let newSignal = [];
		for (let j = 0; j < signal.length; j++) {
			newSignal[j] = 0;
			for (let k = 0; k < signal.length; k++) {
				newSignal[j] += signal[k] * repeatingInputs[j][k];
			}

			newSignal[j] = Math.abs(newSignal[j]) % 10;
		}

		signal = newSignal;
	}

	return signal.slice(0, 8).join('');
}

console.log(solve(__dirname + '/__TESTS__/input.test.1.txt'));

module.exports = {
	solve
};