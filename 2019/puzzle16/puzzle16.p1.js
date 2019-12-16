'use strict';

const fs = require('fs');
const _ = require('lodash');

function solve(inputFilename) {
	const input = fs.readFileSync(inputFilename, 'utf-8');

	let signal = _(input)
		.split('')
		.map(num => parseInt(num))
		.value();

	const RUNS = 100;
	const BASE_REPEATING_INPUT = [0, 1, 0, -1];

	for (let i = 0; i < RUNS; i++) {
		let newSignal = [];
		for (let j = 0; j < signal.length; j++) {
			newSignal[j] = 0;

			for (let k = 0; k < signal.length; k++) {
				const repeatingInputIdx = Math.floor((k + 1) / (j + 1));

				newSignal[j] += signal[k] * BASE_REPEATING_INPUT[repeatingInputIdx % 4];
			}

			newSignal[j] = Math.abs(newSignal[j]) % 10;
		}

		signal = newSignal;
	}

	return signal.slice(0, 8).join('');
}

module.exports = {
	solve
};